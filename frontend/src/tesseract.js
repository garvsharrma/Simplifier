import Tesseract from 'tesseract.js';

const handleFileUpload = async (file) => {
  const result = await Tesseract.recognize(file, 'eng');
  console.log(result.data.text);
};

