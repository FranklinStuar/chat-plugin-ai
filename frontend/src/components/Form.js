import React, {useRef} from 'react'
import { ChatContext } from '../context/ChatContext';

const Form = () => {
  const {sendMessage} = React.useContext(ChatContext);
	const inputMessage = useRef("")
  const handleSendMessage = (e) => {
    e.preventDefault();
    let message = inputMessage.current.value;
    message = message.trim()
    if(message){
      sendMessage(message)
      inputMessage.current.value=""
    }
  }

  return (
    <div className='form-chat'>
      <textarea 
        name="text-chat" 
        id="text-chat" 
        placeholder='Type a message'
        onKeyDown={(e)=> e.key === 'Enter' && handleSendMessage(e)}
        ref={inputMessage}
      ></textarea>
    </div>
  );
}

export default Form;