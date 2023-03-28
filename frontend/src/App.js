import React from 'react';
import Button from "./components/Button"
import Chat from "./container/Chat"
import Layout from "./container/Layout"
import { ChatProvider } from './context/ChatContext';



function App() {
  return (
    <ChatProvider>
      <Layout>
        <Chat/>
        <Button/>
      </Layout>
    </ChatProvider>
  );
}

export default App;