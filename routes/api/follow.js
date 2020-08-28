const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route    POST api/follow:id
// @desc     Follow user
// @access   Private
router.post('/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select(['fullName', 'avatar', 'following'])
    const isFollowing = user.following.find(following => {
      return following._id.equals(req.params.id)
    })

    if (!isFollowing) {
      const user = await User.findOne({_id: req.params.id}).select(['fullName', 'avatar', 'status'])

      await User.findByIdAndUpdate(req.user.id, {$push: {following: user}})
      await User.findByIdAndUpdate(req.params.id, {$push: {followers: req.user.id}})

      res.json({data: user, resultCode: 0, messages: []});
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

// @route    DELETE api/follow:id
// @desc     Unfollow user
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select(['fullName', 'avatar', 'following'])

    const isFollowing = user.following.find(following => {
      return following._id.equals(req.params.id)
    })

    if (isFollowing) {
      const {_id} = await User.findOne({_id: req.params.id})
      await User.findByIdAndUpdate(req.user.id, {$pull: {following: {_id}}})
      await User.findByIdAndUpdate(req.params.id, {$pull: {followers: req.user.id}})
    }
    res.json({data: {_id: req.params.id}, resultCode: 0, messages: []});

  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
