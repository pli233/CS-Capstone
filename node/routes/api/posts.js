const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const Cat = require('../../models/Cat');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');
const config = require('config');
const uuid = require('uuid');

const multer = require('multer');
const upload = multer();
const { uploadFileToS3 } = require('../../utils/s3File');

// @route  POST api/posts
// @desc  Upload a post
// @access Private
router.post(
  '/',
  auth,
  upload.fields([{ name: 'pictures', maxCount: 4 }]),
  check('text', 'Text is required').not().isEmpty(),
  check('title', 'Title is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const profile = await Profile.findOne({
        user: req.user.id,
      });
      if (!profile) {
        return res.status(400).json({ msg: 'Create a profile before making a post' });
      }
      const cat = await Cat.findById(req.body.cat);
      if (!cat) {
        return res.status(404).json({ error: 'Cat not found' });
      }
      const { title, text, ...rest } = req.body;

      const newPostField = {
        title,
        text,
        ...rest,
      };
      const pictures = [];
      const post_uuid = uuid.v4();
      if (req.files && req.files['pictures']) {
        const picturePromises = req.files['pictures'].map(async (file) => {
          let key =
            'public/user/' +
            user._id.toString() +
            '/post/' +
            post_uuid +
            '/' +
            uuid.v4() +
            file.originalname;
          await uploadFileToS3(key, file.buffer);
          pictures.push({ picture: key });
        });
        await Promise.all(picturePromises);
      }
      const newPost = new Post(newPostField);
      newPost.user = user._id;
      newPost.profile = profile._id;
      newPost.uuid = post_uuid;
      newPost.avatar = user.avatar;
      newPost.name = profile.name;
      newPost.pictures = pictures;
      newPost.cover = pictures[0].picture;
      await newPost.populate('cat', ['name', 'avatar']);
      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },
);

// @route  GET api/posts
// @desc   Get all post
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const { pageSize = 10, pageNum = 1, title } = req.query;
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
      draft: false,
    };
    if (title) {
      queryObj.title = { $regex: new RegExp(title, 'i') };
    }
    const totalPosts = await Post.countDocuments(queryObj);
    const totalPages = Math.ceil(totalPosts / pageOptions.perPage);
    const posts = await Post.find(queryObj)
      .sort({
        created: -1,
      })
      .skip((pageOptions.page - 1) * pageOptions.perPage)
      .limit(pageOptions.perPage)
      .populate('profile', ['name'])
      .populate('cat', ['name', 'avatar']);
    return res.status(200).json({ posts, totalPosts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  GET api/posts/:post_id
// @desc   Get post
// @access Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const posts = await Post.findOne({
      _id: req.params.post_id,
      deleted: false,
      visible: true,
      draft: false,
    })
      .sort({
        created: -1,
      })
      .populate('profile', ['name'])
      .populate('cat', ['name', 'avatar']);
    if (!posts) {
      return res.status(404).json({ msg: 'Posts not found' });
    }
    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  GET api/posts/user/:user_id
// @desc   Get all posts for a user
// @access Private
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const { pageSize = 4, pageNum = 1, title } = req.query;
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
      user: req.params.user_id,
      visible: true,
      deleted: false,
      draft: false,
    };
    if (title) {
      queryObj.title = { $regex: new RegExp(title, 'i') };
    }
    const totalPosts = await Post.countDocuments(queryObj);
    const totalPages = Math.ceil(totalPosts / pageOptions.perPage);
    const posts = await Post.find(queryObj)
      .sort({
        created: -1,
      })
      .skip((pageOptions.page - 1) * pageOptions.perPage)
      .limit(pageOptions.perPage)
      .populate('profile', ['name'])
      .populate('cat', ['name', 'avatar']);
    return res.status(200).json({ posts, totalPosts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  DELETE api/posts/:post_id
// @desc   Delete post
// @access Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post || post.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    post.deleted = true;
    await post.save();
    return res.json({ msg: 'Post removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  POST api/posts/like/:post_id
// @desc    Like a post
// @access Private
router.post('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({
      user: req.user.id,
    });
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  POST api/posts/unlike/:post_id
// @desc    unlike a post
// @access Private
router.post('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet liked' });
    }
    const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  POST api/posts/comment/:post_id
// @desc  Comment on a post
// @access Private
router.post(
  '/comment/:post_id',
  auth,
  upload.single('picture'),
  check('text', 'Text is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const profile = await Profile.findOne({
        user: req.user.id,
      });
      if (!profile) {
        return res.status(400).json({ msg: 'Create a profile before making a comment' });
      }
      let picture_url = null;
      if (req.file) {
        const isFileValid = checkFileExtension(req.file);
        if (!isFileValid) {
          return res.status(400).json({ msg: 'Invalid file type' });
        }
        const fileName = req.file.originalname;
        let key =
          'public/user/' + user._id.toString() + '/post/' + post.uuid + '/' + uuid.v4() + fileName;
        await uploadFileToS3(key, req.file.buffer);
        picture_url = key;
      }
      if (!req.body.root) {
        const newCommnet = new Comment({
          name: profile.name,
          avatar: user.avatar,
          user: user.id,
          text: req.body.text,
          post: req.params.post_id,
        });
        if (picture_url) {
          newCommnet.picture = picture_url;
        }
        const comment = await newCommnet.save();
        return res.json(comment);
      }
      const rootComment = await Comment.findById(req.body.root);
      if (!rootComment) {
        return res.status(404).json({ error: 'Root comment not found' });
      }
      if (!req.body.reply) {
        return res.status(502).json({ error: 'Bad request' });
      }
      let replyComment;
      if (req.body.root === req.body.reply) {
        replyComment = rootComment;
      } else {
        const subCommnet = rootComment.subcomments.find(
          (comment) => comment._id.toString() === req.body.reply,
        );
        if (!subCommnet) {
          return res.status(404).json({ error: 'Replied comment not found' });
        }
        replyComment = subCommnet;
      }
      const newCommnet = {
        name: profile.name,
        avatar: user.avatar,
        user: user.id,
        text: req.body.text,
        reply: req.body.reply,
        replyTo: replyComment.user,
        replyToName: req.body.replyToName,
        post: req.params.post_id,
        root: req.body.root,
      };
      rootComment.subcomments.push(newCommnet);
      await rootComment.save();
      return res.json(rootComment);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },
);

// @route  DELETE api/posts/comment/:post_id/:comment_id
// @desc  Delete a post
// @access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const rootId = req.query.root;
    if (!rootId) {
      const rootComment = await Comment.findById(req.params.comment_id);
      if (!rootComment || rootComment.user.toString() !== req.user.id) {
        return res.status(406).json({ error: 'Comment not found' });
      }
      await Comment.deleteOne({
        _id: req.params.comment_id,
      });
      return res.json({ msg: 'Comment removed' });
    }
    const rootComment = await Comment.findById(rootId);
    if (!rootComment) {
      return res.status(404).json({ error: 'Root comment not found' });
    }

    const subCommnet = rootComment.subcomments.find(
      (comment) => comment._id.toString() === req.params.comment_id,
    );
    if (!subCommnet || rootComment.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    const removeIndex = rootComment.subcomments
      .map((commnet) => commnet.id.toString())
      .indexOf(req.params.comment_id);
    rootComment.subcomments.splice(removeIndex, 1);
    await rootComment.save();
    return res.json(rootComment);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  GET api/posts/comment/:post_id
// @desc  Get all the comments from a post
// @access Private
router.get('/comment/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    const { pageSize = 10, pageNum = 1 } = req.query;
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
    const comments = await Comment.find({
      post: req.params.post_id,
      deleted: false,
      visible: true,
    })
      .sort({
        date: -1,
      })
      .skip((pageOptions.page - 1) * pageOptions.perPage)
      .limit(pageOptions.perPage);
    const totalComments = comments.length;
    // const totalPages = Math.ceil(totalPosts / pageOptions.perPage);
    return res.status(200).json({ comments, totalComments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  POST api/posts/comment/like/:comment_id
// @desc  like a comment
// @access Private
router.get('/comment/:comment_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!req.body.root) {
      const comment = await Comment.findById(req.params.comment_id);
      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }
      if (comment.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({ msg: 'Post has already liked' });
      }
      comment.likes.unshift({
        user: req.user.id,
      });
      await comment.save();
      return res.json({ msg: 'Comment liked' });
    }
    const rootComment = await Comment.findById(req.params.comment_id);
    if (!rootComment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    const subCommnet = rootComment.subcomments.find(
      (commnet) => commnet._id.toString() === req.params.comment_id,
    );
    if (!subCommnet) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    subCommnet.likes.unshift({
      user: req.user.id,
    });
    await rootComment.save();
    return res.json({ msg: 'Comment liked' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  POST api/posts/comment/like/:comment_id
// @desc  like a comment
// @access Private
router.post('/comment/like/:comment_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const rootId = req.query.root;
    if (!rootId) {
      const comment = await Comment.findById(req.params.comment_id);
      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }
      if (comment.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({ msg: 'Post has already liked' });
      }
      comment.likes.unshift({
        user: req.user.id,
      });
      await comment.save();
      return res.json(comment);
    }
    const rootComment = await Comment.findById(rootId);
    if (!rootComment) {
      return res.status(404).json({ msg: 'Root comment not found' });
    }
    const subCommnet = rootComment.subcomments.find(
      (commnet) => commnet._id.toString() === req.params.comment_id,
    );
    if (!subCommnet) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (subCommnet.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post has already liked' });
    }
    subCommnet.likes.unshift({
      user: req.user.id,
    });
    await rootComment.save();
    return res.json(rootComment);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route  POST api/posts/comment/unlike/:comment_id
// @desc  unlike a comment
// @access Private
router.post('/comment/unlike/:comment_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const rootId = req.query.root;
    if (!rootId) {
      const comment = await Comment.findById(req.params.comment_id);
      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }
      if (comment.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({ msg: 'Post has not yet liked' });
      }

      const removeIndex = comment.subcomments
        .map((like) => like.user.toString())
        .indexOf(req.user.id);
      comment.likes.splice(removeIndex, 1);
      await comment.save();
      return res.json(comment);
    }
    const rootComment = await Comment.findById(rootId);
    if (!rootComment) {
      return res.status(404).json({ msg: 'Root Comment not found' });
    }
    const subCommnet = rootComment.subcomments.find(
      (commnet) => commnet._id.toString() === req.params.comment_id,
    );
    if (!subCommnet) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (subCommnet.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet liked' });
    }
    const removeIndex = subCommnet.likes.map((like) => like.user.toString()).indexOf(req.user.id);
    subCommnet.likes.splice(removeIndex, 1);
    await rootComment.save();
    return res.json(rootComment);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
