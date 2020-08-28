const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check} = require('express-validator');

const Message = require('../../models/Message');
const Dialog = require('../../models/Dialog');
const User = require('../../models/User');


// @route    GET api/dialogs
// @desc     Get all dialogs
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const dialogs = await Dialog.find({participants: {$in: req.user.id}})
      .sort({date: -1})
      .populate('participants', ['avatar', 'online', 'fullName', 'date'])

    Promise.all(dialogs.map(async dialog => {
      const messages = await Message.find({dialog: dialog._id}).populate('user', ['avatar', 'fullName']);
      const lastReadMessage = [...messages].reverse().find(m => m.isRead.includes(req.user.id))

      if (dialog.participants.length === 2) {
        // private dialog 2 people
        const amICreator = dialog.owner.equals(req.user.id)

        return {
          _id: dialog._id,
          user: {
            _id: amICreator ? dialog.participants[1]._id : dialog.participants[0]._id,
            avatar: amICreator ? dialog.participants[1].avatar : dialog.participants[0].avatar,
            online: amICreator ? dialog.participants[1].online : dialog.participants[0].online,
            fullName: amICreator ? dialog.participants[1].fullName : dialog.participants[0].fullName,
            date: amICreator ? dialog.participants[1].date : dialog.participants[0].date
          },
          messages,
          lastMessage: messages.length > 0 ? messages[messages.length - 1] : null,
          lastReadMessage
        }
      } else {
        // public for few people
        return {
          _id: dialog._id,
          participants: dialog.participants,
          avatar: dialog.avatar,
          name: dialog.name,
          messages,
          lastMessage: messages[messages.length - 1],
          lastReadMessage
        }
      }
    })).then(data => {
      res.json(data);
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/dialogs
// @desc     Get all messages
// @access   Private
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({room: req.params.id})
      .populate('user', ['avatar', 'fullName'])

    res.json(messages);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/dialogs
// @desc     Create a dialog
// @access   Private
router.post('/', [
    auth,
    [
      check('participants', 'Text is required').isArray(),
      check('message', 'Message should be string, max length 32').isString().isLength({min: 1, max: 4096}),
      check('name', 'Name max length 32').isString().isLength({min: 1, max: 32}),
    ]
  ], async (req, res) => {
    try {
      const participants = [...req.body.participants, req.user.id]

      if (participants.length === 2) {
        // private 2 people
        let dialog = await Dialog.findOne({participants}) || await Dialog.findOne({participants: participants.reverse()})
        const owner = await User.findById(req.user.id).select(['avatar', 'online', 'fullName', 'date'])
        const user2 = await User.findById(participants[1]).select(['avatar', 'online', 'fullName', 'date']);

        if (!dialog) {
          const newDialog = new Dialog({
            owner: req.user.id,
            participants
          })
          dialog = await newDialog.save()


          let messages = [];

          if (req.body.message) {
            const newMessage = new Message({
              user: owner,
              dialog: dialog._id, // room
              text: req.body.message
            })
            await newMessage.save()
            messages.push(newMessage)
          }

          const resultOwnerDialog = {
            _id: dialog._id,
            user: {
              _id: user2._id,
              avatar: user2.avatar,
              online: user2.online,
              fullName: user2.fullName,
              date: user2.date
            },
            messages
          }

          const resultOEnemyDialog = {
            _id: dialog._id,
            user: {
              _id: owner._id,
              avatar: owner.avatar,
              online: owner.online,
              fullName: owner.fullName,
              date: owner.date
            },
            messages
          }

          res.json({resultCode: 0, owner: resultOwnerDialog, enemy: resultOEnemyDialog});
        } else {
          res.json({resultCode: 0, data: dialog});
        }
      } else {
        // many
        const newDialog = new Dialog({
          owner: req.user.id,
          participants,
          name: req.body.name
        })

        await newDialog.save()

        res.json({resultCode: 0, data: {...newDialog._doc, messages: []}});
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/dialogs/:id/message
// @desc     Create a message
// @access   Private
router.post('/:id/message', [
    auth,
    [
      check('text', 'Text is required').isString().isLength({min: 1, max: 4096}),
    ]
  ], async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select(['avatar', 'fullName']);
      const {name, avatar, participants} = await Dialog.findById(req.params.id);

      const newMessage = new Message({
        user: user,
        dialog: req.params.id,
        text: req.body.text
      });
      await newMessage.save()

      const resultMessage = {
        isRead: newMessage.isRead,
        _id: newMessage._id,
        user: newMessage.user,
        dialog: newMessage.dialog,
        text: newMessage.text,
        date: newMessage.date,
        name,
        avatar,
        participants
      }

      res.json({resultCode: 0, data: resultMessage});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/dialogs/:dialogRoomId
// @desc     Delete dialog
// @access   Private
router.delete('/:dialogRoomId', auth, async (req, res) => {
  try {
    await Dialog.findOneAndRemove({_id: req.params.dialogRoomId})

    res.json({resultCode: 0})
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/dialogs/:dialogRoomId/:messageId
// @desc     Delete message
// @access   Private
router.delete('/:dialogRoomId/:messageId', auth, async (req, res) => {
  try {
    await Message.findOneAndRemove({_id: req.params.messageId})

    res.json({resultCode: 0})
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/dialogs/:dialogRoomId/:messageId
// @desc     Set message read flag / edit message
// @access   Private

router.put('/:dialogRoomId/:messageId', [
  auth,
  [
    check('text', 'Text is required').isString().isLength({min: 1, max: 4096}),
  ]
], async (req, res) => {
  try {
    const {text} = req.body

    if (text) {
      await Message.findByIdAndUpdate(req.params.messageId, {$set: {text, isEdited: true}})
    } else {
      await Message.findByIdAndUpdate(req.params.messageId, {$push: {isRead: req.user.id}})
    }

    res.json({resultCode: 0})
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error');
  }
})


module.exports = router;
