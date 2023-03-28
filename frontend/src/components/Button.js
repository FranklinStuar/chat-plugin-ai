import React from 'react'
import { ChatContext } from '../context/ChatContext';

const Button = () => {
  const {toggleChat} = React.useContext(ChatContext);
  return (
    <div className='button-chat' onClick={toggleChat}>
      <img width={64} height={64} src={process.env.REACT_APP_PLUGIN_PATH + "/img/chat.png"} alt="Automatic Chat - Logo" />
    </div>
  );
}

export default Button;