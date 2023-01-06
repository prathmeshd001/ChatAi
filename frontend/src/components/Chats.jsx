import React from "react";
import Chatstripe from "./Chatstripe";

const Chats = ({ chatStripes }) => {
  return (
    <div id="chat_container">
      {chatStripes.map((chatStripe, index) => {
        return <Chatstripe chatStripe={chatStripe} key={index} />;
      })}
    </div>
  );
};

export default Chats;
