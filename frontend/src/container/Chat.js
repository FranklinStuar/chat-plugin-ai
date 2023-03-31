import React from 'react'
import Header from '../components/Header'
import Form from '../components/Form'
import Message from '../components/Message'
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const {chatStatus, listMessages, authors, loading, errorLading} = React.useContext(ChatContext);
  let classChatContainer = 'container-chat'

  if(chatStatus)
    classChatContainer += ' active';
  const filterMessages = () => {
    return listMessages.filter(message => message.role !== 'system').map(message => {
      const author = authors.find((author) => {
        return author.type === message.role
      });
      return {
        content:message.content,
        avatar: author.avatar,
        name: author.name,
        type: message.role === 'user' ? "chat-user" : "",
      }
    })
  }
  let messages = []
  messages = filterMessages()

  const authorSystem = authors.find((author) => author.type === "assistant");


  return (
    <div className={classChatContainer}>
      <Header/>
        <div className="body-chat">

          {messages && messages.map((item, index) => (
            <Message
              key={index}
              typeMessage={item.type}
              avatar={item.avatar}
              content={item.content}
              name={item.name}
            />
          ))}
          { (loading) &&
            (
              <Message
              key={"loading-conversation"}
              typeMessage=""
              avatar={authorSystem.avatar}
              content={". . ."}
              name={authorSystem.name}
              />
            )
          }
          { (errorLading) &&
            (
              <Message
              key={"loading-conversation"}
              typeMessage="error"
              avatar={authorSystem.avatar}
              content={"There was an error in my connection with the server. Please repeat to me your question"}
              name={authorSystem.name}
              />
            )
          }
        </div>

      <Form/>
    </div>
  );
}

export default Chat;
