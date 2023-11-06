const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const uuid = require('uuid');

const bcrypt = require('bcryptjs');
const config = require('config');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const multer = require('multer');
const upload = multer();

const {uploadFileToS3} = require('../../utils/s3File')
const {checkFileExtension} = require('../../utils/checkFileType')


// @route  POST api/users
// @desc   Register
// @access Public
router.post('/',
  check('username', "Must include a name")
    .not()
    .isEmpty(),
  check('email', 'Email is require').isEmail(),
  // password must be at least 5 chars long
  check('password', 'Password must be longer than 5').isLength({min: 6}),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {username, email, password} = req.body;
    // if user exists
    try {
      let user = await User.findOne({email});
      if (user) {
        return res.status(400).json({errors: [{msg: "User already exist"}]});
      }

      const avatar = "public/user/avatar/default-avatar.jpeg"
      user = new User({
        username,
        email,
        password,
        avatar
      });
      // set uuid
      user.uuid = uuid.v4(10);
      //set visible and not deleted
      // user.visible = true;
      // user.active = true;
      // encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      user.save();
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


// @route  POST api/users/avatar
// @desc   post avatar
// @access Private
router.post('/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({error: 'User not found'});
      }
      const isFileValid = checkFileExtension(req.file);
      if (!isFileValid) {
        return res.status(400).json({msg: 'Invalid file type'});
      }
      const fileName = req.file.originalname;
      const key = 'public/user/' + user._id.toString() + '/avatar/' + uuid.v4() + fileName;
      const avatar = req.file;
      const body = avatar.buffer;
      const s3Url = await uploadFileToS3(key, body);
      user.avatar = key;
      await user.save();
      return res.json({url: key});
    } catch (err) {
      console.log(err);
      return res.status(500).json({error: 'Server Error'});
    }
  });

// @route  POST api/users/update
// @desc   Register
// @access Private
// router.post('/update', auth,
//     check('username', "Must include a name")
//     .not()
//     .isEmpty(),
//     check('email', 'Email is require').isEmail(),
//     // password must be at least 5 chars long
//     async(req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const { username, email, avatar } = req.body;
//         // if user exists
//         try {
//             let user = await User.findOne({ email });
//             if (!user) {
//                 return res.status(404).json({ errors: [{ msg: "User Not Found" }] });
//             }

//             user = new User({
//                 username,
//                 email,
//                 password,
//                 avatar
//             });
//             // set uuid
//             user.uuid = uuid.v4(10);
//             //set visible and not deleted
//             // user.visible = true;
//             // user.active = true;
//             // encrypt password
//             const salt = await bcrypt.genSalt(10);

//             user.password = await bcrypt.hash(password, salt);
//             user.save();
//             // return jwt
//             const payload = {
//                 user: {
//                     id: user.id
//                 }
//             }
//             jwt.sign(payload, config.get('jwtSecret'), {
//                     expiresIn: 360000,
//                 },
//                 (err, token) => {
//                     if (err) throw err;
//                     res.json({ token });
//                 });
//         } catch (err) {

//         }



//     });

module.exports = router;