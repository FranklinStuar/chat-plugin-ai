import React, {useRef,useEffect,useContext} from 'react'
import { ChatContext } from '../context/ChatContext';
import autosize from 'autosize';



const Form = () => {
  const {sendMessage} = useContext(ChatContext);
  
	const inputMessage = useRef("")
  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && !(e.shiftKey && e.key === 'Enter')) {
      e.preventDefault();
      let message = inputMessage.current.value;
      message = message.trim()
      if(message){
        sendMessage(message)
        inputMessage.current.value=""
      }
    }
  }

  useEffect(() => {
    if (inputMessage.current) {
      autosize(inputMessage.current);
    }
  }, []);

  return (
    <div className='form-chat'>
      <textarea 
        name="text-chat" 
        id="text-chat" 
        placeholder='Type a message'
        onKeyDown={handleSendMessage}
        ref={inputMessage}
      ></textarea>
    </div>
  );
}

export default Form;