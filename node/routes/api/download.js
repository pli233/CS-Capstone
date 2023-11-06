const express = require('express');
const router = express.Router();
const {downloadFileFromS3} = require('../../utils/s3File')

// @route  POST api/posts/comment/:post_id
// @desc  Comment on a post
// @access public
router.get('/*', async (req, res) => {
  const key = req.params[0];
  if (!key) {
    return res.status(400).json({error: 'Missing parameter'});
  }
  try {
    const fileContent = await downloadFileFromS3(key);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    res.send(fileContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Server Error'});
  }
});

module.exports = router;