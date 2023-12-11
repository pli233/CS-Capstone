import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FaRegTrashAlt } from 'react-icons/fa';
import { addLike, removeLike, deletePost } from '../../actions/post';
import formatDate from '../../utils/formatDate';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  search,
  setRoute,
  handleSetMessages,
  post: { _id, text, aiResponse, name, avatar, user, likes, comments, date },
}) => {
  const shouldDisplay =
    search === '' ||
    text.toLowerCase().includes(search.toLowerCase()) ||
    aiResponse.toLowerCase().includes(search.toLowerCase());
  const handlePostClick = () => {
    setRoute('chat');
    const messages = [
      { text: text, type: 'user' },
      { text: aiResponse, type: 'bot' },
    ];
    handleSetMessages(messages);
  };
  return (
    shouldDisplay && (
      <div className=" bg-white p my-1">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p
            onClick={handlePostClick}
            className=" hover-text-primary"
            style={{
              maxWidth: '80%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {aiResponse}
          </p>

          {!auth.loading && user === auth.user._id && (
            <div onClick={() => deletePost(_id)} className="icon-box">
              <FaRegTrashAlt />
            </div>
          )}
        </div>
      </div>
    )
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  setRoute: PropTypes.func.isRequired,
  handleSetMessages: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);
