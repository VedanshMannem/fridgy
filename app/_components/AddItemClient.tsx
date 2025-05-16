"use client";

import AddItem from "./AddItem";
import GenerateRecipe from "./GenerateRecipe";
import ListItems from "./ListItems";
import WebCam from "./WebCam";

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
        <WebCam />
      </main>
    </div>
  );
}