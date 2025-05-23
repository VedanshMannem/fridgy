import React, { useEffect, useState } from "react";
import db from "@/firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";

export default function ShowBookmarks() {

    const user = auth.currentUser;
    const uid = user?.uid;

    const [bookmarks, setBookmarks] = useState<any[]>([]);
    

    const fetchBookmarks = async () => {

        try {
            const querySnapshot = await getDocs(collection(db, `users/${uid}/bookmarks`));
            const itemsArray: any[] = [];
            querySnapshot.forEach((doc) => {
                itemsArray.push({ id: doc.id, ...doc.data() });
            });
            console.log("Bookmarks: ", itemsArray); 
            setBookmarks(itemsArray);
        } catch (error) {   
            console.error("Error fetching bookmarks: ", error);
        }
    }

    fetchBookmarks();

    const removeBookmark = async (id: string) => {
        try {
            await deleteDoc(doc(db, `users/${uid}/bookmarks`, id));
            console.log("Bookmark removed with ID: ", id);
            fetchBookmarks();
        } catch (error) {
            console.error("Error removing bookmark: ", error);
        }
    }
    
    return (
        <div className="flex items-center flex-col mt-6">
            <h1 className="flex items-center text-2xl font-bold">Bookmarks</h1>
            <ul>
            {bookmarks.map((bookmark) => (
                <li key={bookmark.id} className="flex justify-center p-2 text-white">
                <div className="flex flex-col items-center justify-center mt-8 max-w-sm w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-row items-center justify-between w-full">
                        <h5 className="text-center mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {bookmark.recipeName}
                        </h5>
                        <img
                        src={bookmark.recipeImage}
                        alt="Recipe"
                        className="w-16 h-16 rounded-lg"
                        />
                    </div>


                    <div className="flex flex-row justify-between items-center w-full mt-4">
                    <a
                        href={bookmark.recipeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        View Recipe
                    </a>

                    <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600"
                    >
                        Remove Bookmark
                    </button>
                    </div>

                    
                </div>
                </li>
            ))}
            </ul>
            {bookmarks.length === 0 && (
                <p className="text-gray-500">No bookmarks available.</p>
            )}            
        </div>
    )
}