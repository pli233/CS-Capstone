const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Cat = require('../../models/Cat');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const uuid = require('uuid');
const config = require('config');

const multer = require('multer');
const upload = multer();

const {uploadFileToS3} = require('../../utils/s3File')
const {checkFileExtension} = require('../../utils/checkFileType')

// @route  POST api/cats
// @desc   Post my cat
// @access Private
router.post('/',
  auth,
  check('status', 'Status is require').not().isEmpty(),
  check('name', 'Name is require').not().isEmpty(),
  check('birthday', 'Birthday is require').not().isEmpty(),
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
      const {
        name,
        birthday,
        avatar,
        breed,
        ...rest
      } = req.body;

      const newCat = {
        name,
        birthday,
        avatar,
        breed,
        ...rest
      };
      const cat = new Cat(newCat);
      cat.user = user.id;
      cat.uuid = uuid.v4();
      cat.avatar = 'public/user/avatar/cat-default-avatar.png';
      cat.save();
      return res.json(cat);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  });

// @route  GET api/cats/user/:user_id
// @desc   Get specific cats for a user
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const cats = await Cat.find({
      user: req.params.user_id,
      visible: true,
      deleted: false
    }).populate('user', ['name', 'avatar']);

    if (!cats) {
      return res.status(400).json({msg: "There is no cat for the user"});
    }
    res.json(cats);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({msg: "There is no cat for the user"});
    }
    res.status(500).json({msg: "System Error"});
  }
});

// @route  GET api/cats/mycats
// @desc   Get specific cats for a user
// @access Public
router.get('/mycats', auth, async (req, res) => {
  try {
    const cats = await Cat.find({
      user: req.user.id,
      visible: true,
      deleted: false
    });
    if (!cats) {
      return res.status(400).json({msg: "There is no cat for the user"});
    }
    res.json(cats);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({msg: "There is no cat for the user"});
    }
    res.status(500).json({msg: "System Error"});
  }
});



// @route  GET api/cats/all
// @desc   Get all cats home
// @access Public
router.get('/all', async (req, res) => {
  try {
    let cats = await Cat.find({
      visible: true,
      deleted: false
    }).sort({totalViews: -1});
    if (!req.user) {
      cats = cats.slice(0, 10);
    }
    res.json(cats);
  } catch (err) {
    console.log(err);
    res.status(500).json({msg: "System Error"});
  }
});

// @route  GET api/cats/home/:cat_id
// @desc   Get all cats home
// @access Public
router.get('/home/:cat_id', auth, async (req, res) => {
  try {
    let cat = await Cat.findOne({
      _id: req.params.cat_id,
      visible: true,
      deleted: false
    });
    if (!cat) {
      return res.status(404).json({msg: "There is no cat "});
    }
    res.json(cat);
  } catch (err) {
    console.log(err);
    res.status(500).json({msg: "System Error"});
  }
});

// @route  DELETE api/cats/:cat_id
// @desc   delete my cat
// @access private
router.delete('/:cat_id', auth, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.cat_id);
    if (!cat || cat.user.toString() !== req.user.id) {
      return res.status(404).json({msg: "Cat not found"});
    }
    cat.deleted = true;
    await cat.save();
    res.json({msg: "Cat deleted"});
  } catch (err) {
    console.log(err);
    res.status(500).json({msg: "System Error"});
  }
});

// @route  POST api/cats/:cat_id
// @desc   Update cat info
// @access Private
router.post('/:cat_id',
  auth, [
  check('name', 'Name is require').not().isEmpty(),
  check('status', 'Status is require').not().isEmpty(),
  check('birthday', 'Birthday is require').not().isEmpty()
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {
      name,
      birthday,
      breed,
      ...rest
    } = req.body;

    const newCat = {
      name,
      birthday,
      breed,
      ...rest
    };

    try {
      const cat = await Cat.findOne({
        user: req.user.id,
        _id: req.params.cat_id,
        deleted: false
      });
      if (!cat || cat.user.toString() !== req.user.id) {
        return res.status(404).json({error: 'Cat not found'});
      }
      for (const key in req.body) {
        if (cat.schema.paths[key]) {
          cat[key] = req.body[key];
        } else {
          console.log(`Ignoring unknown key: ${key}`);
        }
      }
      cat.updated = Date.now();
      await cat.save();
      return res.json(cat);
    } catch (err) {
      console.log(err)
      res.status(500).json({msg: "System Error"});
    }
  });


// @route  POST api/cats/avatar/:cat_id
// @desc   post avatar
// @access Private
router.post('/avatar/:cat_id',
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
      const cat = await Cat.findById(req.params.cat_id);
      if (!cat || cat.user.toString() !== req.user.id) {
        return res.status(404).json({error: 'Cat not found'});
      }
      const isFileValid = checkFileExtension(req.file);
      if (!isFileValid) {
        return res.status(400).json({msg: 'Invalid file type'});
      }
      const fileName = req.file.originalname;
      const key = 'public/user/' + user._id.toString() + '/cat/avatar/' + uuid.v4() + fileName;
      const avatar = req.file;
      const body = avatar.buffer;
      const s3Url = await uploadFileToS3(key, body);
      cat.avatar = key;
      await cat.save();
      return res.json({url: key});
    } catch (err) {
      console.log(err);
      return res.status(500).json({error: 'Server Error'});
    }
  });


module.exports = router;