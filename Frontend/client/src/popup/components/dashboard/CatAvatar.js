import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Modal, Slider, message} from 'antd';
import AvatarEditor from 'react-avatar-editor';
import {uploadCatAvatar} from '../../actions/cat';

const CatAvatar = ({cat, uploadCatAvatar}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(100);
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    await handleSave();
    setSelectedFile(null);
    setIsModalOpen(false);
    messageApi.open({
      type: 'success',
      content: 'Avatar updated',
    });
  };
  const handleCancel = () => {
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  // const handleFileSelect = (e) => {
  //   setSelectedFile(URL.createObjectURL(e.target.files[0]));

  // };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 300 * 1024) {
        e.target.value = null;
        messageApi.open({
          type: 'error',
          content: 'File size should not be larger than 300kb',
        });
      } else {
        setSelectedFile(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  function handleEditorRef(ref) {
    setEditor(ref);
  }

  const handleSave = async () => {
    if (!editor) {
      return;
    }
    const canvas = editor.getImage();
    // const dataUrl = canvas.toDataURL();
    // console.log(dataUrl);
    // await uploadAvatar(dataUrl);
    canvas.toBlob((blob) => {

      const file = new File([blob], 'edited-image.jpg', {type: 'image/jpeg'});

      uploadCatAvatar(file, cat._id);
    }, 'image/jpeg');
  };

  return (
    <Fragment>
      {contextHolder}
      <div className="element-pointer"
        onClick={showModal}>
        {cat.avatar ? (
          <img className='round-img-xs'
            src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + cat.avatar}
            alt=""
          />
        ) : (
          <img className='round-img-xs'
            src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + 'public/user/avatar/cat-default-avatar.png'} alt='' />
        )}
      </div>
      <Modal
        title="Change avatar"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedFile ? (
          <div>
            <AvatarEditor
              ref={handleEditorRef}
              image={selectedFile}
              width={250}
              height={250}
              border={50}
              scale={scale / 100}
            />
            <Slider
              defaultValue={100}
              min={100}
              max={150}
              onChange={setScale}
            />
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handleFileSelect} />
        )}
      </Modal>
    </Fragment>
  );
};

CatAvatar.propTypes = {
  cat: PropTypes.object.isRequired,
  uploadCatAvatar: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => ({
//   user: state.user, // Assuming that user data is stored in Redux state
// });

export default connect(null, {uploadCatAvatar})(CatAvatar);
