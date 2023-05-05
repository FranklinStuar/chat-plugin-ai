import React from 'react';

const Message = ({typeMessage="", avatar, content, name}) => {
  
  
  return (
    <div className={"conversation-chat "+typeMessage}>
      <div>
        <div className="avatar-chat" target={"_blank"}>
          <img width={48} height={48} src={process.env.REACT_APP_PLUGIN_PATH + "/"+avatar} alt={name + " - avatar"} />
        </div>
      </div>
      <div className="content-conversation"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
      ></div>
    </div>
  );
}

export default Message;