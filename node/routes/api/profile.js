const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');
const config = require('config');

// @route  GET api/profile/home
// @desc   Get my profile home
// @access Private
router.get('/home', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['username', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for the user' });
    }
    if (profile.deleted == true) {
      return res.status(400).json({ msg: 'Profile is deleted' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'System Error' });
  }
});

// @route  POST api/profile
// @desc   Post my profile home
// @access Private

router.post(
  '/',
  auth,
  check('status', 'Status is require').not().isEmpty(),
  check('name', 'Name is require').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the request
    const {
      // website,
      // skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;
    // Build socialFields object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    // // normalize social fields to ensure valid url
    // for (const [key, value] of Object.entries(socialFields)) {
    //     if (value && value.length > 0)
    //         socialFields[key] = normalize(value, { forceHttps: true });
    // }

    // build a profile
    const profileFields = {
      user: req.user.id,
      ...rest,
    };
    // set other fields
    profileFields.social = socialFields;
    profileFields.uuid = uuid.v4(10);
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  },
);

// @route  GET api/profile/user/:user_id
// @desc   Get specific profile home
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for the user' });
    }
    if (profile.deleted == true) {
      return res.status(400).json({ msg: 'There is no profile for the user' });
    }
    if (profile.visible == false) {
      return res.status(400).json({ msg: 'The profile is hidden' });
    }
    res.json(profile);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'There is no profile for the user' });
    }
    res.status(500).json({ msg: 'System Error' });
  }
});

// @route  GET api/profile/all
// @desc   Get all profile home
// @access Public
router.get('/all', async (req, res) => {
  try {
    const { pageSize = 10, pageNum = 1, name } = req.query;
    const pageOptions = {
      page: parseInt(pageNum),
      perPage: parseInt(pageSize),
    };
    if (pageOptions.page < 1) {
      pageOptions.page = 1;
    }

    if (pageOptions.perPage < 1) {
      pageOptions.perPage = 10;
    }
    const queryObj = {
      visible: true,
      deleted: false,
    };
    if (name) {
      queryObj.name = { $regex: new RegExp(name, 'i') };
    }
    const totalProfile = await Profile.countDocuments(queryObj);
    const totalPages = Math.ceil(totalProfile / pageOptions.perPage);
    const profile = await Profile.find(queryObj)
      .sort({
        created: -1,
      })
      .populate('user', ['name', 'avatar'])
      .skip((pageOptions.page - 1) * pageOptions.perPage)
      .limit(pageOptions.perPage);
    return res.status(200).json({ profile, totalProfile });
  } catch (err) {
    res.status(500).json({ msg: 'System Error' });
  }
});

// @route  DELETE api/profile/
// @desc   delete my profile
// @access private
router.delete('/', auth, async (req, res) => {
  try {
    // const profile = await Profile.findOne({
    //     user: req.user.id
    // });
    // const user = await User.findById(req.user.id);
    // profile.deleted = true;
    // user.active = false;
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      // Post.deleteMany({ user: req.user.id }),
      Profile.findOneAndRemove({ user: req.user.id }),
      User.findOneAndRemove({ _id: req.user.id }),
    ]);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'System Error' });
  }
});

// @route  POST api/profile/cats
// @desc   Upload more cat info
// @access Private
router.post(
  '/cats',
  auth,
  [
    check('name', 'Name is require').not().isEmpty(),
    check('birthday', 'Birthday is require').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, birthday, avatar, breed, ...rest } = req.body;

    const newCat = {
      name,
      birthday,
      avatar,
      breed,
      ...rest,
    };

    newCat.uuid = uuid.v4(10);
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.cats.unshift(newCat);
      profile.updated = Date.now();
      await profile.save();
      res.json(profile);
    } catch (err) {
      // console.log(err)
      res.status(500).json({ msg: 'System Error' });
    }
  },
);

// @route  POST api/profile/cats/:cat_id
// @desc   Update cat info
// @access Private
router.post(
  '/cats/:cat_id',
  auth,
  [
    check('name', 'Name is require').not().isEmpty(),
    check('birthday', 'Birthday is require').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, birthday, avatar, breed, ...rest } = req.body;

    const newCat = {
      name,
      birthday,
      avatar,
      breed,
      ...rest,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      // const cat = profile.cats.find({
      //     id: req.params.cat_id
      // });
      // const cat = profile.cats.id(req.params.cat_id);
      const cat = profile.cats.find((cat) => cat._id.toString() === req.params.cat_id);
      if (!cat) {
        return res.status(404).json({ error: 'Cat not found' });
      }
      for (const key in newCat) {
        if (newCat.hasOwnProperty(key)) {
          cat[key] = newCat[key];
        }
      }
      cat.updated = Date.now();
      profile.updated = Date.now();
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'System Error' });
    }
  },
);

// @route  DELETE api/profile/cats/:cat_id
// @desc   delete my cat
// @access private
router.delete('/cats/:cat_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.cats.map((item) => item.id).indexOf(req.params.cat_id);
    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Cat Not Found' });
    }
    profile.cats.splice(removeIndex, 1);
    profile.updated = Date.now();
    await profile.save();
    res.json({ msg: 'Cat deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'System Error' });
  }
});

module.exports = router;
