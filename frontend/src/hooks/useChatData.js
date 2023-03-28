import React, {useEffect,useState} from 'react'
import axios from 'axios';

const sendData = async (status="init",messages=[]) => {
  try {
    const response = await axios.post("/wp-json/chatai-fp/v1/conversation", {
      data: {
        'status-chat': status,
        messages
      }},
    {
      headers: {
        'Content-Type': 'application/json'
    }});
    if(response.data.success && response.data.success === false)
      console.error(response.data.message);
    else{
      console.log("response.data",response.data)
      return await response.data
    }
  } catch (error) {
    console.error(error);
  }
  return []
}

const goToLastMessage = () =>{
  const element = document.querySelector(".body-chat");
  const lastItem = document.querySelector(".body-chat .conversation-chat:last-child");
  element.scrollTop = element.scrollHeight - (lastItem?.scrollHeight || 0);
}

const useChatData = () => {
  const [errorLading, setErrorLoading] = useState(true)
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
            console.error(response.data.message);
            setListMessages([])
          }
          else{
            console.log("response.data",response.data)
            const responseList = await response.data
            setListMessages(responseList)
          }
        } catch (error) {
          setListMessages([])
          setErrorLoading(error)
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
    let ignore = false
    if(!ignore){
      if(listMessages.length && listMessages[listMessages.length -1].role === "user"){
        console.log("ingresa")
        const sendMessage = async () => {
          setLoading(true)
          try {
            const response = await axios.post("/wp-json/chatai-fp/v1/conversation", {
              data: {
                'status-chat': "continue",
                messages:listMessages
              }},
            {
              headers: {
                'Content-Type': 'application/json'
            }});
            if(!response.data.success && !response.success){
              console.log("response.data",response.data)
              const responseList = await response.data
              setListMessages(responseList)
            }else{
              console.log("error",response)

            }
          } catch (error) {
            setErrorLoading(error)
          }
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