import React from 'react'
import {GetDataOpenAI} from "./GetDataOpenAI"


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
  const [newMessage, setNewMessage] = React.useState("")
  const [chatStatus, setChatStatus] = React.useState(false)
  const {
    item: listMessages,
    saveItem: saveListMessages,
    loading,
    error,
  } = GetDataOpenAI()
  console.log({listMessages})

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
    
    let message = e.target.value 
    saveListMessages(message)
    // save response on list of messages and clear input of chat
    setNewMessage("")
    //openAI
    console.log({listMessages})
  }


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
        loading, error,
        listMessages,
        newMessage, setNewMessage, writeMessage, sendMessage,
        chatStatus, setChatStatus, openChat, closeChat, toggleChat
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}


export {ChatContext, ChatProvider}
