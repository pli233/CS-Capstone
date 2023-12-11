// src/ChatBox.js
import React, { useState, useRef } from 'react';
import { FaComments } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navbar from '../layout/Navbar';
import Draggable from 'react-draggable';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Logout from '../auth/Logout';
import { addPost } from '../../actions/post';
import MessageBubble from './MessageBubble';
import Loading from './Loading';
import ScreenshotTool from './ScreenshotTool';
import './ChatBox.css';
import '../../App.css';

const ChatBox = ({ auth: { isAuthenticated }, logout, addPost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [router, setRouter] = useState('login');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const bodyContainerRef = useRef(null);
  // ...其他代码

  const setRoute = (route) => {
    console.log(route);
    setRouter(route);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearImagePreview = () => {
    setImagePreview(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // 检查是否是回车键且没有按住Shift键
      e.preventDefault(); // 阻止默认的回车键行为，例如插入换行符
      handleSendMessage(); // 调用发送消息的函数
    }
  };

  const handlePaste = async (e) => {
    // 检查粘贴的数据中是否包含图片
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();

        // 读取图片文件作为base64
        const reader = new FileReader();
        reader.onload = function (event) {
          // 设置base64编码的图片数据用于预览
          console.log(event.target.result);
          setImagePreview(event.target.result);
        };
        reader.readAsDataURL(blob);

        // 阻止默认的粘贴行为
        e.preventDefault();
        break;
      }
    }
  };

  const scrollToBottom = () => {
    if (bodyContainerRef.current) {
      bodyContainerRef.current.scrollTop = bodyContainerRef.current.scrollHeight;
    }
  };
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Simulate chat bot response (replace with actual chat bot integration)
    simulateChatBotResponse(newMessage);
  };

  const simulateChatBotResponse = async (userMessage) => {
    // Simulate chat bot response for demonstration purposes
    const userRequest = `${userMessage}`;
    const imageUrl = imagePreview ? imagePreview : null;
    if (imageUrl) {
      setMessages((prevMessages) => [...prevMessages, { imgUrl: imageUrl, type: 'user' }]);
    }
    setImagePreview(null);
    setNewMessage('');
    // 更新消息状态，同时添加用户请求和机器人响应
    setMessages((prevMessages) => [...prevMessages, { text: userRequest, type: 'user' }]);
    setLoading(true);
    scrollToBottom();
    const post = await addPost({ text: userMessage, imageUrl });
    setLoading(false);
    console.log(post);
    const botResponse = post.aiResponse;
    setMessages((prevMessages) => [...prevMessages, { text: botResponse, type: 'bot' }]);
    scrollToBottom();
  };

  return (
    <>
      {isOpen && (
        <div className="chat-bot">
          <div className="header">
            <FaComments />
            <span>Easy Doctor ChatBot</span>
            <button className="close-button" onClick={toggleChat}>
              &times;
            </button>
          </div>
          <div ref={bodyContainerRef} className="body-container">
            {router === 'chat' && isAuthenticated && (
              <>
                {messages.map((msg, index) => (
                  <MessageBubble
                    id={`MessageBubble-${index}`}
                    key={index}
                    text={msg.text}
                    imgUrl={msg.imgUrl}
                    isOutgoing={msg.type === 'user'}
                  />
                ))}
                {loading && (
                  <MessageBubble id={'MessageBubble-loading'} isOutgoing={false} isLoading={true} />
                )}
              </>
            )}
            {router === 'login' && (
              <>
                <Login setRoute={setRoute} />
              </>
            )}
            {router === 'register' && (
              <>
                <Register setRoute={setRoute} />
              </>
            )}
            {router === 'profile' && (
              <>
                <Logout setRoute={setRoute} />
              </>
            )}
          </div>

          {imagePreview && (
            <div className="images-container">
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button onClick={clearImagePreview} className="close-preview">
                  ×
                </button>
              </div>
            </div>
          )}
          {router === 'chat' && isAuthenticated && (
            <>
              <div className="input-container">
                <textarea
                  className="input-container-textarea"
                  type="text"
                  placeholder="Type your message or copy a picture..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                />
                <Button disabled={loading} className="margin-left" onClick={handleSendMessage}>
                  Send
                </Button>

                {/* <ScreenshotTool /> */}
              </div>
            </>
          )}
          <Navbar setRoute={setRoute} />
        </div>
      )}
      <Draggable>
        <div className="toggle-button App-logo" onClick={toggleChat}>
          <FaUserDoctor />
        </div>
      </Draggable>
      {/* <div className="toggle-button App-logo" onClick={toggleChat}>
        <FaUserDoctor />
      </div> */}
    </>
  );
};
ChatBox.propTypes = {
  auth: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addPost })(ChatBox);
