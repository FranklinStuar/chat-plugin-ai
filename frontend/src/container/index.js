import React, {useEffect} from 'react'
import {Header} from '../components/Header'
import {Form} from '../components/Form'
import {Conversation} from '../components/Conversation'
import { ChatContext } from '../context/ChatContext';

const Container = () => {
  const {chatStatus, listMessages, authors, loading} = React.useContext(ChatContext);
  let classChatContainer = 'container-chat'

  if(chatStatus)
    classChatContainer += ' active';
  let messages = [];
  if(Array.isArray(listMessages))
    messages = listMessages.filter(message => message.role !== 'system').map(message => {
      const author = authors.find((author) => author.type === message.role);
        return {
          content:message.content,
          avatar: author.avatar,
          name: author.name,
          type: message.role === 'user' ? "chat-user" : "",
        }
    })

  const authorSystem = authors.find((author) => author.type === "assistant");

  useEffect(() => {
    const element = document.querySelector(".body-chat");
    const lastItem = document.querySelector(".body-chat .conversation-chat:last-child");
    element.scrollTop = element.scrollHeight - (lastItem?.scrollHeight || 0);
  }, [messages])

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
          { (loading) &&
            (
              <Conversation
              key={"loading-conversation"}
              typeConversation=""
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

export {Container};
