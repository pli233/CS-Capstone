const checkFileExtension = (uploadedFile) => {
  if (!uploadedFile) {
    return false;
  }

  const {originalname, mimetype} = uploadedFile;

  return mimetype.startsWith('image/');
};

module.exports = {
  checkFileExtension
};
