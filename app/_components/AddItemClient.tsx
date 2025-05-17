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
        <h1 className="flex justify-center">Receipt Handling</h1>

        <div className="flex flex-row items-center">
          <div className="w-1/2 flex flex-col items-center">
            <WebCam />
          </div>
          <div className="w-1/2 flex flex-col items-center">
            <ReceiptUpload />
          </div>
        </div>

        <div className="mb-8"></div>

      </main>
    </div>
  );
}