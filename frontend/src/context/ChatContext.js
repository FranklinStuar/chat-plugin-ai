import React from 'react'
import axios from 'axios';


const ChatContext = React.createContext()

const ChatProvider = (props) => {

  const sendData = async () => {
    try {
      const response = await axios.post('https://tusitio.com/wp-admin/admin-ajax.php', {
        action: 'myplugin_process_request',
        data: {
          'status-chat': 'init'
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  


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
  //default messages with config about chat
  const defaultMessages = [
    { role: "system", content: "Your name is 'Automatic chat'" },
    { role: "system", content: "You speak english and spanish" },
    { role: "system", content: "You are a helpful assistant." },
    { role: "system", content: "You are speaking with parents about information about how to learn better their kids" },
    { role: "system", content: "You should introduce yourself with your name" },
  ]
  const [listMessages, setListMessages] = React.useState(defaultMessages)
  const [newMessage, setNewMessage] = React.useState("")
  const [chatStatus, setChatStatus] = React.useState(false)


  // OPEN AI
  /**
   * 
   * @param {*} apiKey Api OpenAI
   * @param {*} length Max Tokens, used to do tests
   * @param {*} listMessages List of all messages similar to defaultMessages with all conversation
   * @returns text of response
   */
  async function sendChatGPTRequest(apiKey, length, listMessages) {
    // config openAI to interact with it
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey,
    });
    const openai = new OpenAIApi(configuration);
    console.log("init",{listMessages})
    // send data to openAI and return data about its API
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // It can be a custom model. We will use a custom model trained with all our info
      messages: listMessages,  // All conversation
      max_tokens:length,  // tokens, delete it when the chat is active
    });
    /**
      return message on array similar to defaultMessages
      completion.data.choices[0].message = {role: "assistant", content:"response limited on tokens length"}
    */
    return completion.data.choices[0].message
  }
  
  // Test to send and return info on openAI
  async function handleSendMessage() {
    const apiKey = process.env.REACT_APP_OPENAI_KEY;
    const length = 50;
    return await sendChatGPTRequest(apiKey, length, listMessages);
  }
  
  async function sendResponse() {
    const response = await handleSendMessage()
    // save response on list of messages
    setListMessages((prevMessages) => [...prevMessages, response]);
  }
  const sendMessage = (e) =>{
    e.preventDefault();
    
    let text = e.target.value // get text from input, is a variable because it be validated to prevent danger content
    const message = {
      role: "user",
      content: text,
    }
    // save response on list of messages and clear input of chat
    setListMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("")
    //openAI
    sendResponse()
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
