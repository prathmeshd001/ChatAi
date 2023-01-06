import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const Chatstripe = ({ chatStripe }) => {
  const [lodingElement, setLodingElement] = useState("");

  useEffect(() => {
    let interval;
    if (chatStripe.value === "") {
      interval = setInterval(() => {
        if (lodingElement === "....") setLodingElement("");
        setLodingElement((old) => old + ".");
      }, 300);
    }

    return () => {
      setLodingElement("");
      clearInterval(interval);
    };
  }, [chatStripe]);

  function fillMessage() {
    if (!chatStripe.isAi) return chatStripe.value;

    return (
      <Typewriter
        options={{
          delay: 30,
        }}
        onInit={(typewriter) => {
          typewriter.typeString(chatStripe.value).start();
        }}
      />
    );
  }

  return (
    <div className={`wrapper ${chatStripe.isAi && "ai"}`}>
      <div className="chat">
        <div className="profile">
          <img
            src={`${chatStripe.isAi ? bot : user}`}
            alt={`${chatStripe.isAi ? bot : user}`}
          />
        </div>
        <div className="message">
          {chatStripe.value === "" ? lodingElement : fillMessage()}
        </div>
      </div>
    </div>
  );
};

export default Chatstripe;
