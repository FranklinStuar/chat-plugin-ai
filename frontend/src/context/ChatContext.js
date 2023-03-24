import React from 'react'
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
      console.log("data",response.data)
      return response.data
    }
  } catch (error) {
    console.error(error);
  }
  return null
}

const ChatContext = React.createContext()

const ChatProvider = (props) => {

  const authors = [
    {
      type:"assistant",
      name:"Automatic Chat",
      avatar:"img/chat.png",
    },
    {
      type:"user",
      name:"User",
      avatar:"img/user.png",
    }
  ]
  const [listMessages, setListMessages] = React.useState([])
  const [newMessage, setNewMessage] = React.useState("")
  const [chatStatus, setChatStatus] = React.useState(false)
  const [loading, setLoading] = React.useState(false)


  // OPEN AI
  /**
   * 
   * @param {*} apiKey Api OpenAI
   * @param {*} length Max Tokens, used to do tests
   * @param {*} listMessages List of all messages similar to defaultMessages with all conversation
   * @returns text of response
   */
  
  const sendMessage = async (e) =>{
    e.preventDefault();
    
    let text = e.target.value // get text from input, is a variable because it be validated to prevent danger content
    const message = {
      role: "user",
      content: text,
    }
    // save response on list of messages and clear input of chat
    await setListMessages(prevListMessages => [...prevListMessages, message]);
    setNewMessage("")
    //openAI
    console.log({listMessages})
    fetchData("continue", listMessages)
  }

  async function fetchData(status="init",messages=[]) {
    setLoading(true)
    const response = await sendData(status, messages)
    if(response){
      if(status === "init")
        setListMessages(response);
      else
        await setListMessages(prevListMessages => [...prevListMessages, response]);
    }
    setLoading(false)
  }

  React.useEffect(()=>{
    fetchData() },[]);

  // CONFIG
  const openChat = () =>{
    setChatStatus(true)
  }
  const closeChat = () =>{
    setChatStatus(false)
  }
  const toggleChat = () =>{
    setChatStatus(!chatStatus)
  }

  const writeMessage = (text) =>{
    setNewMessage(text)
  }

  return (
    <ChatContext.Provider
      value={{
        authors,
        loading,
        listMessages, setListMessages,
        newMessage, setNewMessage, writeMessage, sendMessage,
        chatStatus, setChatStatus, openChat, closeChat, toggleChat
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}


export {ChatContext, ChatProvider}
