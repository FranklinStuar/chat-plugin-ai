import React from 'react'
import { ChatContext } from '../../context/ChatContext';

const Form = () => {
  const {newMessage, writeMessage, sendMessage} = React.useContext(ChatContext);
  return (
    <div className='form-chat'>
      <textarea 
        name="text-chat" 
        id="text-chat" 
        placeholder='Type a message'
        value={newMessage}
        onChange={(e)=> writeMessage(e.target.value)}
        onKeyDown={(e)=> e.key === 'Enter' && sendMessage(e)}
        
      ></textarea>
    </div>
  );
}

export {Form};