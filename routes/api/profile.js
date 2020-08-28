const express = require('express');
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

const router = express.Router();

// @route    GET api/profile/me
// @desc     Get current user profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['avatar', 'fullName']);

    if (!profile) {
      return res.status(400).json({msg: 'There is no profile for this user'});
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Update user profile
// @access   Private
router.post(
  '/', [auth,
    [
      check('fullName', 'Full name is required, max length 32').not().isEmpty().isString().isLength({max: 32}),
      check('aboutMe', 'Should be string value, max length 300').isString().isLength({max: 300}),
      check('lookingForAJob', 'Should be boolean value').isBoolean(),
      check('lookingForAJobDescription', 'Should be string value').isString().isLength({max: 300}),
      check('contacts.instagram', 'Should be string URL value').isString().isLength({max: 100}),
      check('contacts.youtube', 'Should be string URL value').isString().isLength({max: 100}),
      check('contacts.twitter', 'Should be string URL value').isString().isLength({max: 100}),
      check('contacts.facebook', 'Should be string URL value').isString().isLength({max: 100}),
      check('contacts.linkedin', 'Should be string URL value').isString().isLength({max: 100}),
    ]
  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {
      fullName,
      aboutMe,
      lookingForAJob,
      lookingForAJobDescription,
      contacts
    } = req.body;

    // Build social object and add to profileFields
    const profileFields = {
      aboutMe: aboutMe.trim(),
      lookingForAJob: lookingForAJob,
      lookingForAJobDescription: lookingForAJobDescription.trim(),
      contacts: contacts ? contacts : {}
    };

    try {
      // Using upsert option (creates new doc if no match is found):
      if (fullName) {
        await User.findOneAndUpdate(
          {_id: req.user.id},
          {$set: {fullName}},
          {new: true, upsert: true}
        )
      }

      await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: profileFields},
        {new: true, upsert: true}
      );
      res.json({resultCode: 0, messages: []});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    GET api/profile/user/:user_id
// @desc     Get profile by id
// @access   Public
router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  async ({params: {user_id}}, res) => {
    try {
      const profile = await Profile.findOne({
        user: user_id
      }).populate('user', ['fullName', 'avatar', 'following', 'online', 'date']);

      if (!profile) return res.status(400).json({msg: 'Profile not found'});

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({msg: 'Server error'});
    }
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({user: req.user.id});
    // Remove profile
    await Profile.findOneAndRemove({user: req.user.id});
    // Remove user
    await User.findOneAndRemove({_id: req.user.id});

    res.json({msg: 'User deleted'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/status
// @desc     Add profile status
// @access   Private
router.put(
  '/status', [
    auth,
    [
      check('status', 'Status length should be max 32').not().isEmpty().isString().isLength({max: 32}),
    ]
  ], async (req, res) => {
    const {status} = req.body;

    try {
      const user = await User.findOne({_id: req.user.id});

      user.status = status

      await user.save();

      res.json({resultCode: 0});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile/status:id
// @desc     Get profile's status
// @access   Private
router.get(
  '/status/:id', async (req, res) => {

    try {
      const user = await User.findOne({_id: req.params.id});

      res.json(user.status);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/profile/photo
// @desc     Change profile avatar
// @access   Private
router.put(
  '/avatar', [
    auth,
    [
      check('url', 'url length should be max 100').not().isEmpty().isString().isLength({max: 100}).isURL(),
    ]
  ], async (req, res) => {
    try {
      const user = await User.findOne({_id: req.user.id});

      user.avatar = req.body.url

      await user.save();

      res.json({data: {avatar: req.body.url}, resultCode: 0});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
