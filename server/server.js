import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "hi",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const responce = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: responce.data.choices[0].text,
    });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
});

app.listen(3000, () => {
  console.log("server running on port http://localhost:3000");
});
