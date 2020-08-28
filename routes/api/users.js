const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');
const config = require('config');
const {check, validationResult} = require('express-validator');

const Users = require('../../models/User');
const Profile = require('../../models/Profile');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({min: 6})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {fullName, email, password} = req.body;

    try {
      let user = await Users.findOne({email});

      if (user) {
        return res
          .status(400)
          .json({errors: [{msg: 'Users already exists'}]});
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        {forceHttps: true}
      );

      user = new Users({
        email,
        fullName,
        password,
        avatar
      });


      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      const userProfile = new Profile({user: user.id})

      await user.save();
      await userProfile.save()

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: '5 days'},
        (err, token) => {
          if (err) throw err;
          res.json({resultCode: 0, data: token});
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    PUT api/users/online
// @desc     Change user isOnline
// @access   Private
router.put(
  '/online', [
    auth,
    [
      check('isOnline', 'isOnline is boolean').isBoolean(),
    ]
  ], async (req, res) => {
    try {
      await Users.findByIdAndUpdate(req.user.id, {online: req.body.isOnline, date: Date.now()})
      res.json({resultCode: 0})
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


module.exports = router;
