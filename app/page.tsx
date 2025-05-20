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
      {/* Insert Figma design here */}
      <div className="mt-12"></div>
      <div className="flex justify-center flex-row">
        <a className="flex flex-col justify-center items-center text-center block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Track your pantry seamlessly</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Add/delete pantry items, upload receipts, and track your fridge</p>
        </a>
        <a className="flex flex-col justify-center items-center text-center block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Meal planning made easy</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Get meal suggestions based on your pantry items</p>
        </a>
        <a className="flex flex-col justify-center items-center text-center block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Meal planning made easy</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Get meal suggestions based on your pantry items</p>
        </a>
      </div>
    </div>
  );
}
