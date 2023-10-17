import { useEffect, useState } from 'react';

const Flash = ({
  message,
  duration = 3000,
  className = 'alert alert-success',
}) => {
  // double not !! forces true or false values from undefined, etc
  const [visible, setVisible] = useState(!!message);

  //hide the message after 'duration'
  useEffect(() => {
    let timeout;
    if (message && duration) {
      setVisible(true);
      timeout = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
    return () => clearTimeout(timeout);
  }, [message, duration]);

  if (!visible) return null;
  return <div className={className}>{message}</div>;
};

export default Flash;
