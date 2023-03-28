import React from 'react';

const Conversation = ({typeConversation="", avatar, content, name}) => {
  console.log(process.env.REACT_APP_PLUGIN_PATH)
  return (
    <div className={"conversation-chat "+typeConversation}>
      <div>
        <div className="avatar-chat" target={"_blank"}>
          <img width={48} height={48} src={process.env.REACT_APP_PLUGIN_PATH + "/"+avatar} alt={name + " - avatar"} />
        </div>
      </div>
      <div className="content-conversation">
        {content}
      </div>
    </div>
  );
}

export {Conversation};