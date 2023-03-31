import React from 'react'
import useChatData from '../hooks/useChatData'


const ChatContext = React.createContext()

const ChatProvider = ({children}) => {

  const authors = [
    {
      type:"assistant",
      name:"Automatic Chat",
      avatar:"img/chat.png",
    },
    {
      type:"error",
      name:"Error Message",
      avatar:"img/chat.png",
    },
    {
      type:"user",
      name:"User",
      avatar:"img/user.png",
    }
  ]
  const [chatStatus, setChatStatus] = React.useState(true)
  const { loading, listMessages, newUserMessage, errorLading } = useChatData()
  const [error, setError] = React.useState(false)

  const sendMessage = (content) =>{
    newUserMessage(content)
  }


  // CONFIG
  const closeChat = () =>{
    setChatStatus(false)
  }
  const toggleChat = () =>{
    setChatStatus(!chatStatus)
  }

  return (
    <ChatContext.Provider
      value={{
        authors,
        loading, error, setError, errorLading,
        listMessages,
        sendMessage,
        chatStatus, closeChat, toggleChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}


export {ChatContext, ChatProvider}
