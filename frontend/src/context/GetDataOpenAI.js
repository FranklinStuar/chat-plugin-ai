import React from 'react';
import axios from 'axios';

let initApp = true;

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
      return await response.data
    }
  } catch (error) {
    console.error(error);
  }
  return null
}

async function GetDataOpenAI() {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [item, setItem] = React.useState([]);


  const firstData = async () =>{
    const response = await sendData()
    console.log("response",response)
    await setItem(response);
    console.log({item})
    setLoading(false);
    initApp = false;
  }
  
  React.useEffect(() => {
    console.log("into useEffect")
    if(initApp){
      firstData()
    }
  });
  const saveItem = async (content) => {
    try {
      setLoading(true);
      const newMessage = {
        role:'user',
        content
      }
      let tempListMessages = [...item, newMessage]
      setItem(tempListMessages);

      const getMessage = await sendData();
      tempListMessages = await [...item, getMessage]
      setItem(tempListMessages);
      
      setLoading(false);
    } catch(error) {
      setError(error);
    }
  };

  return {
    item,
    saveItem,
    loading,
    error,
  };
}

export { GetDataOpenAI };