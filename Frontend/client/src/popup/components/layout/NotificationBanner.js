import React from 'react';

const NotificationBanner = ({message}) => {
  return (
    <div className="notification-banner">
      <p>{message}</p>
    </div>
  );
};

export default NotificationBanner;
