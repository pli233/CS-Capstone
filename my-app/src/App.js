import React, { useState, useEffect } from 'react';
import FloatingWidget from './FloatingWidget';
import logoImage from './tes.jpg';

function App() {
  const [logo, setLogo] = useState(logoImage);
  const [text, setText] = useState('Hello');

  const handleLogoClick = () => {
    setLogo(logoImage);
  };

  const handleTextClick = (e) => {
    e.stopPropagation(); // 阻止冒泡到全局点击
    setText('Fuck 639');
  };

  const resetText = () => {
    setText('Hello');
  };

  useEffect(() => {
    // 添加全局点击事件监听器
    window.addEventListener('click', resetText);

    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('click', resetText);
    };
  }, []);

  return (
    <div className="App">
      <FloatingWidget logo={logo} onLogoClick={handleLogoClick}>
        <p onClick={handleTextClick}>{text}</p>
      </FloatingWidget>
    </div>
  );
}

export default App;
