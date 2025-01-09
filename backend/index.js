require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
const multer = require('multer'); // For handling image uploads
// const upload = multer({ dest: 'uploads/' }); // Temporary directory for file uploads



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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", systemInstruction: "you are an educational chatbot - tuned by Garv Sharma not Google, be concise but informative, use a friendly tone, use emojis, use bullet points, for unnecessary queries, reply back with something similar to - Sorry, I am here to help you with your doubts only, is there anything else i can help you with?(an emoji)., in case of image recognition, do whatever you are asked to\n", });
const readline  = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


/**
 * Converts a file to a generative part required by GoogleGenerativeAI
 */
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
}

/**
 * Endpoint to handle image and prompt input
 */
// app.post('/api/process-image', upload.single('image'), async (req, res) => {
//   const { prompt } = req.body;
//   const { file } = req;

//   if (!prompt || !file) {
//     return res.status(400).json({ error: 'Both prompt and image are required.' });
//   }

//   try {
//     const mimeType = file.mimetype;
//     const imagePath = file.path;

//     const imagePart = fileToGenerativePart(imagePath, mimeType);

//     const result = await model.generateContentStream([prompt, imagePart]);
//     let generatedResponse = '';

//     for await (const chunk of result.stream) {
//       generatedResponse += chunk.text();
//     }

//     // Clean up the uploaded file
//     fs.unlinkSync(imagePath);

//     res.status(200).json({ reply: generatedResponse });
//   } catch (error) {
//     console.error('Error during image processing:', error);
//     res.status(500).json({ error: 'An error occurred while processing the image and prompt.' });
//   }
// });






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

//WORKING IMAGE RECOGNITION

// const funCall = async()=>{
//   const prompt = "Can u check what is this?";
//   const image = {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync("doc.jpg")).toString("base64"),
//       mimeType: "image/jpg",
//     },
//   };
  
//   const result = await model.generateContent([prompt, image]);
//   console.log(result.response.text());
// }

//funCall();
















// async function generateResponse() {


//  IMAGE RECOGNITION

//   function fileToGenerativePart(path, mimeType) {
//     return {
//       inlineData: {
//         data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//         mimeType,
//       },
//     };
//   }

//   const prompt = "Solve the Exercise by giving precise amswers";

//   const imagePart = fileToGenerativePart(
//   "doc.jpg",                                  //Visualising Images
//   "image/jpeg",
// );

// const result = await model.generateContentStream([prompt, imagePart]); 
// for await (const chunk of result.stream) {
//   const chunkText = chunk.text();             //ChatStream
//   process.stdout.write(chunkText);
// }
 




// INTERACTIVE CHAT (CHATBOT)
const chat = model.startChat({
  history: [],                          // initially empty history
  generationConfig: {
    maxOutputTokens: 300,
    temperature: 1, 
    top_p: 1, 
  },
});

// askAndRespond();

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

// async function askAndRespond() {
//   rl.question("You: ", async(msg) => {
//     if(msg.toLowerCase() === "exit") {rl.close;}
//     else{
//       const result = await chat.sendMessage(msg);
//       const response = await result.response; 
//       const text = await response.text();
//       console.log("Bot: ", text);
//       askAndRespond();
//     }
//   })
// }

// }

//generateResponse();    - CHATBOT AND IMAGE RECOGNITION


//AI DETECTION


// async function run(text) {
//   try {
//       const response = await axios.post(
//           'https://api.sapling.ai/api/v1/aidetect',
//           {
//               key: process.env.SAPLING_API_KEY,
//               text,
//           },
//       );
//       const {status, data} = response;
//       console.log({status});
//       console.log(JSON.stringify(data, null, 4));
//   } catch (err) {
//       const { msg } = err.response.data;
//       console.log({err: msg});
//   }
// }

// run('Plagiarism detection APIs like Copyleaks and Grammarly are popular but typically come with costs. Copyleaks offers monthly plans starting at $8.99 per user, with API access included. Grammarly provides plagiarism checks under its Pro plan, costing $12 per month when billed annually, though API pricing details are not openly shared. For budget-conscious developers, alternatives like Sapling offer free-tier API usage for limited volumes. While these tools are excellent for robust plagiarism detection, exploring open-source libraries like PlagScan or Turnitin alternatives could provide cost-effective solutions. Carefully evaluate your apps needs, including expected API call volume, to choose the most feasible option.');



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
