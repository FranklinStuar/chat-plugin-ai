import React from 'react'
import { ChatContext } from '../../context/ChatContext';

const Button = () => {
  const {openChat} = React.useContext(ChatContext);

  return (
    <div className='button-chat' onClick={openChat}>
      <img width={64} height={64} src="./img/chat.png" alt="Automatic Chat - Logo" />
    </div>
  );
}

export {Button};