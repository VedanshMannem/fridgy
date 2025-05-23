"use client"
import { useState, useEffect } from 'react';
import db from '@/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import DeleteItem from './DeleteItem';
import { auth } from '@/firebase/clientApp';

export default function ListItems({addRefresh}: {addRefresh: boolean}) {
    const [items, setItems] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(false); 

    const user = auth.currentUser;
    const uid = user?.uid;

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, `users/${uid}/items`));
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
    }, [refresh, addRefresh]);

    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    return (
        <div>
            <h1 className="flex items-center text-2xl font-bold mb-4">Pantry</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center p-2 text-white">
                        {item.name}
                        <div className='mr-20'></div>
                        <DeleteItem id={item.id} onDelete={handleRefresh} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
