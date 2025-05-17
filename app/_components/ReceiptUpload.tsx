"use client";

import { useState } from "react";
// @ts-ignore
import { OCRClient } from "tesseract-wasm";

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>("No file chosen");

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
    const imageResponse = await fetch(url);
    const imageBlob = await imageResponse.blob();
    const image = await createImageBitmap(imageBlob);

    const ocr = new OCRClient();

    try {
      await ocr.loadModel('@/public/tesseract/eng.traineddata');
      await ocr.loadImage(image);
      const text = await ocr.getText();
      console.log("OCR Result:", text);
    } finally {
      ocr.destroy();
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
        <div className="mb-3"/>
        <span className="text-gray-600">{fileName}</span>
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

          <button
            onClick={() => runOcr(imageUrl!)}>
            <span className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
              Run OCR
            </span>
          </button>
          
        </>
      )}
    </div>
  );
}