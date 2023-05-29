import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const ChatBox = () => {
  const [inp, setInp] = useState("");
  const [chat, setChat] = useState([
    {
      id: 0,
      message: "",
      response: "",
    },
  ]);

  const configuration = new Configuration({
    apiKey: process.env.VITE_Open_AI_Key,
  });

  const openai = new OpenAIApi(configuration);

  const handleSubmit = async () => {
    if (!inp) return;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: inp,
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    const id = chat[chat.length - 1].id + 1;
    const text = response.data.choices.map((a) => a.text);

    let addMess = {
      id,
      message: inp,
      response: text[0],
    };

    setInp("");
    setChat([...chat, addMess]);
  };

  const keyDown = (e) => {
    if (e.keyCode === 13 && e.shiftKey) {
      setInp(inp + "\n");
      e.preventDefault();
    } else if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="container center">
        <div className="chatbox">
          <div className="topbar center">
            <div className="name">Chat Gpt</div>
          </div>
          <div className="chat-container">
            {chat
              .filter((arr) => arr.id > 0)
              .map((arr) => {
                return (
                  <>
                    <div className="wrap" key={arr.id}>
                      <div className="message">{arr.message}</div>
                      <div className="response">{arr.response}</div>
                    </div>
                  </>
                );
              })}
          </div>
          <div className="inp-container">
            <form className="center" onSubmit={keyDown}>
              <textarea
                type="text"
                placeholder="Message..."
                value={inp}
                onChange={(e) => setInp(e.target.value)}
                onKeyDown={keyDown}
                name="Input"
              ></textarea>
              <button className="send">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
