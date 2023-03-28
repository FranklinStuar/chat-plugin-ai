import React, {useEffect} from 'react'


const ChatContext = React.createContext()

const ChatProvider = ({children}) => {

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
  const [chatStatus, setChatStatus] = React.useState(false)
  const [listMessages, setListMessages] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  
  const sendMessage = (content) =>{
    const message = {
      role:"user",
      content
    }
    const element = document.querySelector(".body-chat");
    const lastItem = document.querySelector(".body-chat .conversation-chat:last-child");
    element.scrollTop = element.scrollHeight - (lastItem?.scrollHeight || 0);
    setListMessages([...listMessages, message])
    setLoading(true)
    setTimeout(() => {
      const response = {
        role:"assistant",
        content: "Thanks"
      }
      setListMessages([...listMessages, response])
      setLoading(false)
    }, 3000);
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
        loading, error, setError,
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
