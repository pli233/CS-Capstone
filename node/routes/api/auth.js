const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const config = require('config');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route  GET api/auth
// @desc   Test route
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({msg: "server error"});
  }
});

// @route  POST api/auth
// @desc   Authentiate user
// @access Public
router.post('/',
  check('email', 'Email is require').isEmail(),
  // password must be at least 5 chars long
  check('password', 'Password required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    // if user exists
    try {
      let user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({msg: "Invalid Credentials"});
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({msg: "Invalid Credentials"});
      }

      // return jwt
      const payload = {
        user: {
          id: user.id
        }
      }
      jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 360000,
      },
        (err, token) => {
          if (err) throw err;
          res.json({token});
        });
    } catch (err) {

    }



  });

module.exports = router;