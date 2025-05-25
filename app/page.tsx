// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/clientApp";
import AddItemClient from "./_components/AddItemClient";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  return user ? (
    <main>
      <AddItemClient />
    </main>
  ) : (
    <div>
      {/* <h1 className="flex justify-center ">Never worry about meal planning ever again</h1> */}
      <h1 className="flex justify-center items-center mb-4 mt-4">Never worry about cooking again</h1>
      {/* <iframe style={{border: "1px solid rgba(0, 0, 0, 0.1)"}} width="1440" height="1080" src="https://embed.figma.com/design/ZHMGGSx6u0FPjJuDv1jvym/Untitled?node-id=0-1&embed-host=share"></iframe> */}
      <div className="mt-12"></div>

      <div className="flex flex-wrap w-full justify-center flex-row">
        <div className="card">
          <p className="heading">  
            Track your pantry seamlessly
          </p>
          <p>
            <span className="text-green-500 font-bold">Add</span>/
            <span className="text-red-500 font-bold">Delete</span> pantry items,
            <span className="text-blue-500 font-bold"> Upload</span> receipts, and
            <span className="text-yellow-500 font-bold"> Track</span> your fridge
          </p>

          <p></p>
        </div>

        <div className="card">
          <p className="heading">  
            Meal planning made easy
          </p>
          <p>
            Get <span className="text-orange-500 font-bold">meal suggestions</span> based on your pantry items
          </p>

          <p></p>
        </div>

        <div className="card">
          <p className="heading">  
            Easily import recipes
          </p>
          <p>
            Import <span className="text-red-500 font-bold">YouTube</span>, 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0050] to-[#00f2ea] font-bold"> TikTok </span>
            , and <span className="text-pink-500 font-bold"> Instagram </span>
            recipes with a single click
          </p>

          <p></p>
        </div>

      </div>
    </div>
  );
}
