import React from 'react';

const Message = ({typeMessage="", avatar, content, name}) => {
  function urlToLink() {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.replace(urlRegex, '<a target="_blank" href="$1">$1</a>');
  }
  
  return (
    <div className={"conversation-chat "+typeMessage}>
      <div>
        <div className="avatar-chat" target={"_blank"}>
          <img width={48} height={48} src={process.env.REACT_APP_PLUGIN_PATH + "/"+avatar} alt={name + " - avatar"} />
        </div>
      </div>
      <div className="content-conversation"
      dangerouslySetInnerHTML={{
        __html: urlToLink(),
      }}
      ></div>
    </div>
  );
}

export default Message;