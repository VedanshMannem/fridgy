"use client"

import { useState } from 'react';
import db from '@/firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '@/firebase/clientApp';

export default function AddItem({onAdd} : { onAdd: () => void }) {

    const [value, setValue] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cost, setCost] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    
    const user = auth.currentUser;
    const uid = user?.uid;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!value) {
            alert("Please enter an item name.");
            return;
        }
        console.log("Handle Submit Working");

        try {
            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            const docRef = await addDoc(collection(db, `users/${uid}/items`), {
                name: capitalizedValue,
                expiry: expiry,
                cost: cost,
            })
           
            setValue("");
            onAdd(); // refresh automatically
            setModalOpen(false);
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    }

    return (
        <div>
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="w-125 my-4 p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
                        <form onSubmit={handleSubmit} className="my-4 flex flex-col items-center">
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
                        </form>

                        <button 
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                                Cancel
                        </button>
                    </div> 
                </div>
            )}

            <button className="genButton">
                <span onClick={() => setModalOpen(!modalOpen)}>
                    Add Item
                </span>
            </button>
        </div>
    )
}