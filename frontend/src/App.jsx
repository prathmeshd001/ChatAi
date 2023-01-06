import { useRef, useState } from "react";
import "./App.css";
import send from "./assets/send.svg";
import Chats from "./components/Chats";

function App() {
  const [chatStripes, setchatStripes] = useState([
    {
      isAi: true,
      value: "Hi there, ask me anything related to programming",
    },
  ]);
  const userChat = useRef("");
  // const [userChat, setUserChat] = useState("");

  // const handleChange = (e) => {
  //   setUserChat(e.target.value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //user chat
    setchatStripes((oldData) => {
      return [...oldData, { isAi: false, value: userChat.current.value }];
    });

    //bot chat
    setchatStripes((oldData) => {
      return [...oldData, { isAi: true, value: "" }];
    });
    const usersQuestion = userChat.current.value;

    userChat.current.value = "";
    try {
      const responce = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: usersQuestion,
        }),
      });

      if (responce.ok) {
        const data = await responce.json();
        const parsedData = data.bot.trim();

        setchatStripes((oldData) => {
          return oldData.map((chat, index) => {
            if (index === oldData.length - 1) {
              return { ...chat, value: parsedData };
            }
            return chat;
          });
        });
      }
    } catch (error) {
      setchatStripes((oldData) => {
        return oldData.map((chat, index) => {
          if (index === oldData.length - 1) {
            return { ...chat, value: "Opps!! Something went wrong" };
          }
          return chat;
        });
      });
    }
  };

  return (
    <div id="app">
      <Chats chatStripes={chatStripes} />
      <form>
        <textarea
          name="prompt"
          rows="1"
          cols="1"
          placeholder="Ask ChatAi..."
          ref={userChat}
        ></textarea>
        <button onClick={handleSubmit}>
          <img src={send} />
        </button>
      </form>
    </div>
  );
}

export default App;
