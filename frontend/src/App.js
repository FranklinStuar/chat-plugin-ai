import React from 'react';
import {Button} from "./components/Button"
import {Container} from "./components/Container"
import { ChatProvider } from './context/ChatContext';



function App() {
  return (
    <ChatProvider>
      <React.Fragment>
        <Container/>
        <Button/>
      </React.Fragment>
    </ChatProvider>
  );
}

export default App;
