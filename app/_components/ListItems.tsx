"use client"
import { useState, useEffect } from 'react';
import db from '@/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import DeleteItem from './DeleteItem';

export default function ListItems() {
    const [items, setItems] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(false); 

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "items"));
                const itemsArray: any[] = [];
                querySnapshot.forEach((doc) => {
                    itemsArray.push({ id: doc.id, ...doc.data() });
                });
                setItems(itemsArray);
            } catch (error) {
                console.error("Error fetching items: ", error);
            }
        };
        fetchItems();
    }, [refresh]);

    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    return (
        <div className='border text-white w-96 text-center p-4'>
            <h1 className="text-2xl font-bold mb-4">Pantry</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center border-t-2 p-2 text-white">
                        {item.name}
                        <DeleteItem id={item.id} onDelete={handleRefresh} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
