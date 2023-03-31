import React, {useEffect,useState} from 'react'
import axios from 'axios';

const goToLastMessage = () =>{
  const element = document.querySelector(".body-chat");
  const lastItem = document.querySelector(".body-chat .conversation-chat:last-child");
  element.scrollTop = element.scrollHeight - (lastItem?.scrollHeight || 0);
}

const useChatData = () => {
  const [errorLading, setErrorLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listMessages, setListMessages] = useState([])
  

  // firstMessage
  useEffect(() => {
    let ignore = false
    const firstMessage = async () => {
      if(!ignore){
        try {
          const response = await axios.post("/wp-json/chatai-fp/v1/conversation", {
            data: {
              'status-chat': "init",
            }},
          {
            headers: {
              'Content-Type': 'application/json'
          }});
          if(response.data.success && response.data.success === false){
            setListMessages([])
          }
          else{
            const responseList = await response.data
            setListMessages(responseList)
          }
        } catch (error) {
          setListMessages([])
          setErrorLoading(error)
          console.log(error)
        }
        setLoading(false)
      }
    }
    firstMessage()
    return () =>{ ignore = true }
  },[]);


  // Continue Messages

  useEffect(() => {
    goToLastMessage()
    setErrorLoading(false)
    let ignore = false
    if(!ignore){
      if(listMessages.length && listMessages[listMessages.length -1].role === "user"){
        const filteredMessages = listMessages.filter(message => message.role !== 'error')
        const sendMessage = async () => {
          setLoading(true)
          try {
            const response = await axios.post("/wp-json/chatai-fp/v1/conversation", {
              data: {
                'status-chat': "continue",
                messages:filteredMessages
              }},
            {
              headers: {
                'Content-Type': 'application/json'
            }});
            if(!response.data.success && !response.success){
              const responseList = await response.data
              setListMessages(responseList)
            }
          } catch (error) {
            setErrorLoading(true)
          }
          goToLastMessage()
          setLoading(false)
        }
        sendMessage()
      }
    }
    return () =>{ ignore = true }
  },[listMessages]);


  const newUserMessage = (content) => {
    const message = {
      role:"user",
      content
    }
    setListMessages([...listMessages, message])
  }


  return  {
    loading,
    errorLading,
    listMessages,
    newUserMessage
  };
}

export default useChatData;