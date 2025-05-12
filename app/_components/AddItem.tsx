"use client"

import { useState } from 'react';
import db from '@/firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';

export default function AddItem() {

    const [value, setValue] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "items"), {
                name: value,
            })
            console.log("Document written with ID: ", docRef.id);
            setValue("");
        } catch (error) {
            console.log("Error adding document: ", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            placeholder='add new item'
            className="w-full p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Add</button>
        </form>
    )
}

