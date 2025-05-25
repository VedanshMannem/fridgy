"use client"

import { useState } from 'react';
import db from '@/firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '@/firebase/clientApp';

export default function AddItem({onAdd} : { onAdd: () => void }) {

    const [value, setValue] = useState("");

    const user = auth.currentUser;
    const uid = user?.uid;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const docRef = await addDoc(collection(db, `users/${uid}/items`), {
                name: value,
            })
           
            setValue("");
            onAdd();
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="my-4">
            <input 
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            placeholder='add new item'
            className=" p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Add</button>
        </form>
    )
}