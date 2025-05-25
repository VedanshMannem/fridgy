"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import db from '@/firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '@/firebase/clientApp';
import { useEffect } from "react";
import { getDocs } from "firebase/firestore";


export default function ImageUploader({onAdd} : { onAdd: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>("No file chosen");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<{name: string, cost: string, expiry: string}[]>([]);

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
      console.log(ret.data.text);

      const text = ret.data.text;

      const matches = [...text.matchAll(/\b\d{1,2}\.\d{2}\b/g)]

      const parsedItems = matches.map(match => {
        const price = match[0];
        const index = match.index!;
        const leftContext = text.slice(0, index).trim().split(/\s+/);
        const itemName = leftContext.slice(-2).join(" ");
        
        return { name: itemName, cost: price, expiry: "" };
      });

      setItems(parsedItems);
      setModalOpen(true);

      // const processedText = ret.data.text
      //   .replace(/[^a-zA-Z\s]/g, '')
      //   .replace(/\b(orgnc|org|total|subtotal|tax|amount|price|total)\b/gi, '')
      //   .toLowerCase()
      //   .replace(/\b\w/g, (char)=> char.toUpperCase()) // Capitalize first letter of each word
      //   .split('\n') // Split into lines
      //   .map((line) => line.replace(/\s+/g, ' ').trim()) // Remove redundant spaces and trim each line
      //   .filter((line) => line.length > 0) // Remove empty lines
      //   .join('\n'); // Join the cleaned lines back into a single string
      // setOcrResult(processedText);

      await worker.terminate();
      setOcrLoading(false);
    })();
  }

  const addItemsToPantry = async () => {

    if(items) {
      
      try {
        for(const item of items) {
          const docRef = await addDoc(collection(db, `users/${uid}/items`), {
            name: item.name,
            cost: item.cost,
            expiry: item.expiry,
          });
          onAdd();
          setModalOpen(false);
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
        </>
      )}

      {items && modalOpen && ( 
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="w-[32rem] max-w-full h-[50vh] bg-gray-800 rounded-lg shadow-lg flex flex-col p-6">
            
            {/* Title - fixed at top */}
            <p className="text-lg font-bold mb-4 flex-shrink-0">Here's what we extracted:</p>

            <p>
              <span className="text-sm text-gray-400">Edit the Name to be the actual ingredient name, cost to reflect your receipt & state the expiry date if applicable</span>
            </p>
            
            {/* Scrollable list - flex-grow */}
            <ul className="flex-grow overflow-y-auto mb-4 space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <textarea
                    rows={1}
                    className="bg-gray-700 rounded shadow text-white resize-none overflow-hidden min-h-[2.5rem] flex-grow"
                    value={item.name}
                    onChange={(e) => {
                      const updatedItems = items.map((i, iidx) =>
                        iidx === idx ? { ...i, name: e.target.value } : i
                      );
                      setItems(updatedItems);
                    }}
                  />

                  <textarea
                    rows={1}
                    className="bg-gray-700 rounded shadow text-white resize-none overflow-hidden min-h-[2.5rem] w-24"
                    value={item.cost}
                    onChange={(e) => {
                      const updatedItems = items.map((i, iidx) =>
                        iidx === idx ? { ...i, cost: e.target.value } : i
                      );
                      setItems(updatedItems);
                    }}
                  />

                  <input 
                    type="date" 
                    value={item.expiry} 
                    onChange={(e) => {
                      const updatedItems = items.map((i, iidx) =>
                        iidx === idx ? { ...i, expiry: e.target.value } : i
                      );
                      setItems(updatedItems);
                    }}
                    placeholder='mm/dd/yy (optional)'
                    className= "p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </li>
              ))}
            </ul>

            {/* Button area - fixed at bottom */}
            <div className="flex justify-between flex-shrink-0">
              <button 
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cancel
              </button>

              <button
                onClick={addItemsToPantry}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add items to pantry
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}