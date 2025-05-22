"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import db from '@/firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '@/firebase/clientApp';


export default function ImageUploader({onAdd} : { onAdd: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>("No file chosen");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);

  const user = auth.currentUser;
  const uid = user?.uid;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      setFileName(file.name);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const runOcr = async (url: string) => {
    setOcrLoading(true);
    (async () => {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(url);
      const processedText = ret.data.text
        .replace(/[^a-zA-Z\s]/g, '')
        .replace(/\b(orgnc|org|total|subtotal|tax|amount|price|total)\b/gi, '')
        .toLowerCase()
        .replace(/\b\w/g, (char)=> char.toUpperCase()) // Capitalize first letter of each word
        .split('\n') // Split into lines
        .map((line) => line.replace(/\s+/g, ' ').trim()) // Remove redundant spaces and trim each line
        .filter((line) => line.length > 0) // Remove empty lines
        .join('\n'); // Join the cleaned lines back into a single string

      setOcrResult(processedText);
      console.log("OCR Result: ", processedText);
      await worker.terminate();
      setOcrLoading(false);
      console.log("Your receipt is being extracted. Is that from Walmart?")
    })();
  }

  const addItemsToPantry = async () => {

    if(ocrResult) {
      const items = ocrResult.split('\n');
      try {
        for(const item of items) {
          const docRef = await addDoc(collection(db, `users/${uid}/items`), {
            name: item,
          });
          console.log("Document written with ID: ", docRef.id);
          onAdd();
        }

      } catch (error) {
        console.log("Error adding document: ", error);
      }
    }
  }

    
  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setFileName("No file chosen");
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <input id="file-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
      <div>
        <label htmlFor="file-input" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            Choose File
        </label>
        <div className="mt-3 mb-3"/>
        <span className="text-gray-600 flex flex-col items-center justify-center">{fileName}</span>
      </div>

      {imageUrl && (
        <>
          <div>
            <p className="text-sm text-gray-600">Preview:</p>
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-64 rounded shadow"
            />
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reset
          </button>

          <div>
            <button
              onClick={() => runOcr(imageUrl!)}>
              <span className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                Run OCR
              </span>
              

            </button>
            {ocrLoading && (
              <span className="ml-2 text-sm text-gray-600">Processing...</span>
            )}
          </div>

          {ocrResult && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">OCR Result:</h3>
              <textarea placeholder="Something" className="bg-gray p-4 rounded shadow text-white w-full h-40" value={ocrResult} onChange={(e) => setOcrResult(e.target.value) }></textarea>
              <button onClick={addItemsToPantry} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                Add items to pantry
              </button>
            </div>
          )}
          
        </>
      )}
    </div>
  );
}