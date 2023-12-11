// MessageBubble.js
import React from 'react';
import Loading from './Loading';
const MessageBubble = ({ id, text, isOutgoing, isLoading, imgUrl }) => {
  const bubbleClass = isOutgoing ? 'message-bubble outgoing' : 'message-bubble incoming';
  const containerClass = isOutgoing
    ? 'message-container outgoing-container'
    : 'message-container incoming-container';

  return (
    <div id={id} className={containerClass}>
      {!imgUrl && <div className={bubbleClass}>{isLoading ? <Loading /> : text}</div>}
      {imgUrl && (
        <div className={bubbleClass}>
          <div className="image-preview-container">
            <img src={imgUrl} alt="Preview" className="image-preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
