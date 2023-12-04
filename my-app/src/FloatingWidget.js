import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './FloatingWidget.css';

function FloatingWidget({ logo, onLogoClick, children }) {
  const [isDragging, setIsDragging] = useState(false);

  const onStart = () => {
    setIsDragging(true);
  };

  const onStop = () => {
    setIsDragging(false);
  };

  const handleClick = (e) => {
    if (isDragging) {
      e.stopPropagation();
      return;
    }
    onLogoClick();
  };

  return (
    <Draggable onStart={onStart} onStop={onStop}>
      <div className="floating-widget" onClick={handleClick}>
        <img src={logo} alt="logo" />
        <div className="content">
          {children}
        </div>
      </div>
    </Draggable>
  );
}

export default FloatingWidget;
