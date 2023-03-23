import React from 'react';
import {Button} from "./components/Button"
import {Container} from "./components/Container"
import { ChatProvider } from './context/ChatContext';



function App() {
  return (
    <ChatProvider>
      <React.Fragment>
        <div className="chat-pg">
          <Container/>
          <Button/>
        </div>
      </React.Fragment>
    </ChatProvider>
  );
}

export default App;