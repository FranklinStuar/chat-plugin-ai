import React from 'react';

const Conversation = ({typeConversation="", avatar, content, name}) => {
  return (
    <div className={"conversation-chat "+typeConversation}>
      <div>
        <div className="avatar-chat" target={"_blank"}>
          <img width={48} height={48} src={avatar} alt={name + " - avatar"} />
        </div>
      </div>
      <div className="content-conversation">
        {content}
      </div>
    </div>
  );
}

export {Conversation};