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
  const [items, setItems] = useState<{name: string, cost: string}[]>([]);

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
        
        return { name: itemName, cost: price };
      });

      setItems(parsedItems);

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

    if(ocrResult) {
      const items = ocrResult.split('\n');
      try {
        for(const item of items) {
          const docRef = await addDoc(collection(db, `users/${uid}/items`), {
            name: item,
          });
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

          {items && ( 

            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="w-125 my-4 p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
                <p className="text-lg font-bold">Here's what we extracted: </p>

                <ul>                  
                    {items.map((item)=> (
                      <li>
                        
                    <textarea
                      rows={1}
                      className="bg-gray rounded shadow text-white resize-none overflow-hidden min-h-[2.5rem] focus:outline-none"
                      placeholder="Something"
                      value={item.name}
                      onChange={(e) => {
                        setOcrResult(e.target.value);
                        
                        // Auto-grow: dynamic height adjustment
                        const el = e.target;
                        el.style.height = "auto";              // Reset height
                        el.style.height = `${el.scrollHeight}px`;  // Adjust to content
                      }}
                    />


                        <textarea 
                          rows={1}
                          placeholder="Something" 
                          value={item.cost}
                          className="bg-gray p-4 rounded shadow text-white w-full h-40" 
                          onChange={(e) => setOcrResult(e.target.value) }>
                        </textarea>

                        
                      </li>
                    ))}
                </ul>

                  {/* <form onSubmit={handleSubmit} className="my-4 flex flex-col items-center">
                      <input 
                      type="text" 
                      value={value} 
                      onChange={(e) => setValue(e.target.value)}
                      placeholder='Item Name'
                      className="mb-2 p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                      <p className="mb-4 mt-4">
                          Optional Info:
                      </p>
                      
                      <input 
                      type="date" 
                      value={expiry} 
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder='mm/dd/yy (optional)'
                      className=" p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <p className='text-sm text-gray-600 mb-4'>Expiry Date</p>

                      <input 
                      type="text" 
                      value={cost} 
                      onChange={(e) => setCost(e.target.value)}
                      placeholder='Add Item Cost'
                      className=" p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      
                      <button type="submit" className='mt-4 mb-4'>
                          <span className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                              Add
                          </span>
                      </button>
                  </form> */}

                  <button 
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                          Cancel
                  </button>
              </div> 

              <div className="mt-4">
                <h3 className="text-lg font-semibold">OCR Result:</h3>
                <textarea placeholder="Something" className="bg-gray p-4 rounded shadow text-white w-full h-40" onChange={(e) => setOcrResult(e.target.value) }></textarea>
                <button onClick={addItemsToPantry} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                  Add items to pantry
                </button>
              </div>
            </div>
          )}
          
        </>
      )}
    </div>
  );
}