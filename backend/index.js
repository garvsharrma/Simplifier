require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
const multer = require('multer'); // For handling image uploads
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const notesRouter = require('./routes/notes');
const imageProcessorRouter = require('./routes/ImageProcessor');
const chatBotRouter = require('./routes/chatbot');
const referencesRouter = require('./routes/references');

const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", systemInstruction: "you are an educational chatbot - tuned by Garv Sharma not Google, be concise but informative, use a friendly tone, use emojis, use bullet points, in case of image recognition, do whatever you are asked to\n", });
const readline  = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where uploaded files will be placed
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// API Endpoint for processing user input
app.post('/api/process-image', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const prompt = req.body.prompt;

    if (!file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'No prompt provided.' });
    }
// Convert the image file to base64 for embedding
const image = {
  inlineData: {
    data: fs.readFileSync(file.path).toString('base64'),
    mimeType: file.mimetype,
  },
};

// Generate content
const result = await model.generateContent([prompt, image]);
   
     res.json({ reply: result.response.text() });

  } catch (error) {
    console.error('Error during processing:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// INTERACTIVE CHAT (CHATBOT)
const chat = model.startChat({
  history: [],                          // initially empty history
  generationConfig: {
    maxOutputTokens: 300,
    temperature: 1, 
    top_p: 1, 
  },
});

// API Endpoint TO HANDLE AI CHATBOT
app.post('/api/chat', async (req, res) => {
  console.log(req.body);

  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const botMessage = await response.text();

    res.status(200).json({ reply: botMessage });
  } catch (error) {
    console.error('Error during chatbot response:', error);
    res.status(500).json({ error: 'An error occurred while processing the message.' });
  }
});


// Sapling AI Detection Logic
const detectAIContent = async (prompt) => {
  const saplingClient = new sapling.Client({ apiKey: process.env.SAPLING_API_KEY });

  const response = await saplingClient.detectAIContent({
    prompt,
  });

  return response.data; // Adjust based on Sapling's response structure
};

// API Route for AI Detection
app.post('/api/process-prompt', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const detectionResult = await detectAIContent(prompt);
    res.status(200).json({ reply: detectionResult });
  } catch (error) {
    console.error('Error processing prompt:', error);
    res.status(500).json({ error: 'Failed to process the prompt.' });
  }
});


//AI TEXT ENHANCEMENT


app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const SAPLING_API_URL = 'https://api.sapling.ai';

app.post('/sapling/*', (req, res, next) => {
  // remove the '/sapling/' prefix from the request path
  let requestPath  = req.path.substring(8);
  // pass request path along to Sapling
  let requestUrl = `${SAPLING_API_URL}${requestPath}`;
  // add the API Key
  req.body.key = process.env.SAPLING_API_KEY;
  axios({
    url: requestUrl,
    data: req.body,
    method: 'post',
  })
  .then(function (response) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data));
  });
})



app.use('/api/notes', notesRouter); // Routes for notes
app.use('/api/ImageProcessor', imageProcessorRouter);   // Routes for OCR
app.use('/api/chatbot', chatBotRouter);   // Routes for chatbot
app.use('/api/references', referencesRouter);   // Routes for references


app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const mongoose = require('mongoose');
const { error } = require('console');
const { rejects } = require('assert');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Server is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
