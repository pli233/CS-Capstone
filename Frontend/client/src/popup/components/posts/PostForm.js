import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addPost} from '../../actions/post';
import {Button, Modal, message, Image} from 'antd';
import {getMyCats} from '../../actions/cat';
import Spinner from '../layout/Spinner';

const PostForm = ({addPost, getMyCats, cat: {mycats}}) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isUploadPictures, setisUploadPictures] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [cat, setCat] = useState('');
  useEffect(() => {
    getMyCats();
  }, [getMyCats]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setUploading(true);
    const created = await handleSubmit();
    if (!created) {
      messageApi.open({
        type: 'error',
        content: 'Post uploaded failed',
      });
      setUploading(false);
      return;
    }
    setIsModalOpen(false);
    setText('');
    setTitle('');
    setFileObjects([]);
    setUploading(false);
    messageApi.open({
      type: 'success',
      content: 'Post uploaded',
    });
  };
  const handleCancel = () => {
    setUploading(false);
    setIsModalOpen(false);
  };

  const handleFileSelect = (e) => {
    const newSelectedFiles = Array.from(e.target.files);
    const currentFileCount = fileObjects.length;
    const maxFileCount = 4;

    if (currentFileCount + newSelectedFiles.length > maxFileCount) {
      messageApi.open({
        type: 'error',
        content: 'Only 4 pictures allowed',
      });
      return;
    }
    const newFileObjects = [
      ...fileObjects,
      ...newSelectedFiles.map((file) => ({
        file,
        id: Math.random(),
      })),
    ];

    setFileObjects(newFileObjects);
  };

  const onSelectCat = (e) => {
    setCat(e.target.value);
  }

  const removeFile = (id) => {
    const updatedFileObjects = fileObjects.filter((fileObj) => fileObj.id !== id);
    setFileObjects(updatedFileObjects);
  };

  const handleSubmit = async () => {

    const formData = new FormData();
    for (let i = 0; i < fileObjects.length; i++) {
      formData.append("pictures", fileObjects[i].file);
    }
    formData.append("title", title);
    formData.append("text", text);

    if (cat !== '') {
      formData.append('cat', cat);
    }

    try {
      const created = await addPost(formData);
      return created;
    } catch (error) {
      console.error("Error uploading post:", error);
      return false;
    }
  };

  return (
    <Fragment>
      {contextHolder}
      <div className='my-1'>
        <Button
          className='btn-white'
          shape="square"
          size='large'
          icon={<i className="fa-solid fa-plus"></i>}
          onClick={showModal}
        >
          Post
        </Button>
      </div>
      <Modal
        title='Create a post'
        okText='Submit'
        okType='danger'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        {uploading ? <Spinner /> : <div className='post-form'>
          <div className='bg-primary p'>
            <h3>Say Something...</h3>
          </div>
          <form
            className='form my-1'
          >
            <div className="form-group">
              <input
                type="text"
                placeholder="Title*"
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
              />
              <small className="form-text">
                Title of your post
              </small>
            </div>
            {mycats &&
              <div className="form-group">
                <select name="status" value={cat} onChange={onSelectCat}>
                  <option>* Select Your Cat for the post</option>
                  {mycats.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>))}
                </select>
                <small className="form-text">
                  Your cat
                </small>
              </div>}
            <textarea
              name='text'
              cols='30'
              rows='5'
              placeholder='Create a post'
              value={text}
              onChange={e => setText(e.target.value)}
              required
            />
            <small className="form-text">
              *text is required
            </small>
            <div className='icon-options'>
              <div className='icon-box item-option'
                onClick={() => {
                  setisUploadPictures(!isUploadPictures)
                }}>
                <i className="fa-regular fa-image" style={{color: "#236995", }}></i>
              </div>
              <div className='icon-box item-option'
                onClick={() => {

                }}>
                <i className="fa-solid fa-video" style={{color: "#236995", }}></i>
              </div>
            </div>

            <small className="form-text m-1">
              *Pictures are required. Currently video is not available only support image size smaller than 1MB. Apolopgy for inconvenience.
            </small>
            {isUploadPictures && <input type="file" name="pictures" accept="image/*" onChange={handleFileSelect} />}
            <div className='pictures form-group'>
              {fileObjects.map((fileObj) => (
                <div key={fileObj.id} className='picture-item'>
                  <Image
                    width={50}
                    src={URL.createObjectURL(fileObj.file)}
                  />
                  <div className='icon-box item-option'
                    onClick={() => {
                      removeFile(fileObj.id)
                    }}>
                    <i className="fa-regular fa-circle-xmark" style={{color: "#f50000", }} />
                  </div>
                  {/* <button onClick={() => removeFile(fileObj.id)}>Remove</button> */}
                </div>
              ))}
            </div>
          </form>
        </div>}
      </Modal>


    </Fragment>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  getMyCats: PropTypes.func.isRequired,
  cat: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  cat: state.cat,
});

export default connect(
  mapStateToProps,
  {addPost, getMyCats}
)(PostForm);
