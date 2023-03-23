import React from 'react'
import {Header} from './../Header'
import {Form} from './../Form'
import {Conversation} from './../Conversation'
import { ChatContext } from '../../context/ChatContext';

const Container = () => {
  const {chatStatus, listMessages, authors} = React.useContext(ChatContext);
  let classChatContainer = 'container-chat'

  if(chatStatus)
    classChatContainer += ' active';
  
  const messages = listMessages.filter(message => message.role !== 'system').map(message => {
    const author = authors.find((author) => author.type === message.role);
      return {
        content:message.content,
        avatar: author.avatar,
        name: author.name,
        type: message.role === 'user' ? "chat-user" : "",
      }
  })

  return (
    <div className={classChatContainer}>
      <Header/>
        <div className="body-chat">
          {messages.map((message, index) => (
            <Conversation
              key={index}
              typeConversation={message.type}
              avatar={message.avatar}
              content={message.content}
              name={message.name}
            />
          ))}
        </div>
        
      <Form/>
    </div>
  );
}

export {Container};