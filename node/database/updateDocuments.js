const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const Post = require('../models/Post');

const config = require('config');
const db = config.get('mongoURI');

mongoose.connect(db);

mongoose.connection.on('connected', () => {
  console.log('Mongoose 已连接到数据库');

  // 使用 updateMany 更新所有文档
  Profile.updateMany({}, { $set: { name: '' } })
    .then((result) => {
      console.log('更新成功，影响文档数:', result.nModified);
    })
    .catch((err) => {
      console.error('更新文档时出错:', err);
    })
    .finally(() => {
      // 关闭数据库连接
      mongoose.connection.close(() => {
        console.log('Mongoose 默认连接已关闭，应用程序终止');
        process.exit(0);
      });
    });
});

async function convertLikesToArrayToObject() {
  try {
    const posts = await Post.find();

    for (const post of posts) {
      const likesObject = {};

      // 将现有的点赞信息从数组转换为对象
      for (const like of post.likes) {
        likesObject[like.user.toString()] = true;
      }

      // 更新帖子的 likesObject 字段
      post.likesObject = likesObject;

      // 保存帖子
      await post.save();
    }

    console.log('Conversion completed.');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

convertLikesToArrayToObject();
