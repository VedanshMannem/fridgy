"use client";

import AddItem from "./AddItem";
import GenerateRecipe from "./GenerateRecipe";
import ListItems from "./ListItems";
import WebCam from "./WebCam";
import ReceiptUpload from "./ReceiptUpload";

export default function AddItemClient() {
  return (
    <div>
      <main>
        <AddItem />
        <div className="flex flex-row items-center justify-center">
          <div className="w-1/2 flex flex-col items-center">
            <ListItems />
          </div>
          <div className="flex flex-col items-center"></div>
            <GenerateRecipe /> 
          </div>
        {/* <h1 className="flex justify-center">Receipt Handling</h1> */}

        {/* <div className="flex flex-row items-center">
          <div className="w-1/2 flex flex-col items-center">
            <WebCam />
          </div>
          <div className="w-1/2 flex flex-col items-center">
            <ReceiptUpload />
          </div>
        </div> */}

        

        <div className="flex flex-col items-center justify-center mt-8 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <a>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Receipt Upload</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Upload your receipt and use "Run OCR" to extract the text and edit out misread items</p>
            <ReceiptUpload />
        </div>


        <div className="mb-8"></div>

      </main>
    </div>
  );
}