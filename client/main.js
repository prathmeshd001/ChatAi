import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.getElementById("chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") element.textContent = "";
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNum = Math.random();
  const hexaDecimalString = randomNum.toString(16);

  return `id-${timestamp}-${hexaDecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}">
        <div class="chat">
            <div class="profile">
                <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}"/>
            </div>
            <div class="message" id="${uniqueId}">${value}</div>
        </div>
    </div>
    `;
}

// initial message
function initialMessage() {
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(
    true,
    "Hi there, ask me anything related to programming",
    uniqueId
  );

  chatContainer.scrollTop = chatContainer.scrollHeight;

  // const messageDiv = document.getElementById(uniqueId);

  // loader(messageDiv);
}
initialMessage();

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  //user chat
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  //bot chat
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from server
  const responce = await fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (responce.ok) {
    const data = await responce.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const err = await responce.text();

    messageDiv.innerHTML = "Ops!! Something went wrong";

    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
