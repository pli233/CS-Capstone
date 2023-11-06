import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Modal, Slider, message} from 'antd';
import AvatarEditor from 'react-avatar-editor';
import {uploadAvatar} from '../../actions/profile';

const Avatar = ({user, uploadAvatar}) => {
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
      if (file.size > 500 * 1024) {
        e.target.value = null;
        messageApi.open({
          type: 'error',
          content: 'File size should not be larger than 500kb',
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

      uploadAvatar(file);
    }, 'image/jpeg');
  };

  return (
    <Fragment>
      {contextHolder}
      <div
        className="avatar-container"
        onClick={(e) => {
          showModal();
        }}
      >
        <div className="avatar">
          {user.avatar ? (
            <img
              src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + user.avatar}
              alt=""
            />
          ) : (
            <img src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + 'public/user/avatar/default-avatar.jpeg'} alt='' />
          )}
        </div>
      </div>
      <Modal
        title="Change headshot"
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

Avatar.propTypes = {
  user: PropTypes.object.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => ({
//   user: state.user, // Assuming that user data is stored in Redux state
// });

export default connect(null, {uploadAvatar})(Avatar);
