import React, {useEffect} from 'react'
import Header from '../components/Header'
import Form from '../components/Form'
import Message from '../components/Message'
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const {chatStatus, listMessages, authors, loading} = React.useContext(ChatContext);
  let classChatContainer = 'container-chat'

  if(chatStatus)
    classChatContainer += ' active';

  let messages = listMessages.filter(message => message.role !== 'system').map(message => {
    const author = authors.find((author) => author.type === message.role);
      return {
        content:message.content,
        avatar: author.avatar,
        name: author.name,
        type: message.role === 'user' ? "chat-user" : "",
      }
  })

  const authorSystem = authors.find((author) => author.type === "assistant");


  return (
    <div className={classChatContainer}>
      <Header/>
        <div className="body-chat">

          {messages.map((item, index) => (
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
        </div>

      <Form/>
    </div>
  );
}

export default Chat;
