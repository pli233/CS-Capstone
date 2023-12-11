const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer();
const axios = require('axios');


// @route  POST api/posts/comment/:post_id
// @desc  Comment on a post
// @access public
router.post('/content', upload.none(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const content = req.body.content;
  if (!content) {
    return res.status(400).json({ error: 'Missing parameter' });
  }
  try {
    const response = await axios.post(
      ' http://pli233.com:8080/chat',
      {
        content: content,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log(response.data);
    res.json({ content: 'Your doctor notes: ' + response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
