import React, { useEffect, useState, useCallback } from "react";
import db from "@/firebase/firestore";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { deleteDoc, doc, addDoc, collection, getDocs  } from "firebase/firestore";

export default function ShowBookmarks() {

    const [addExt, setAddExt] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [recipeName, setRecipeName] = useState("");
    const [recipeIngredients, setRecipeIngredients] = useState("");
    const [recipeUrl, setRecipeUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [importedBookmarks, setImportedBookmarks] = useState<any[]>([]);

    const user = auth.currentUser;
    const uid = user?.uid;

    const fetchBookmarks = useCallback(async () => {
        if (!uid) return;

        try {
            const querySnapshot = await getDocs(collection(db, `users/${uid}/bookmarks`));
            const itemsArray: any[] = [];
            querySnapshot.forEach((doc) => {
                itemsArray.push({ id: doc.id, ...doc.data() });
            });
            setBookmarks(itemsArray);
        } catch (error) {
            console.error("Error fetching bookmarks: ", error);
        }
    }, [uid]);

    const fetchImportedBookmarks = useCallback(async () => {
        if (!uid) return;

        try {
            const querySnapshot = await getDocs(collection(db, `users/${uid}/imported-bookmarks`));
            const itemsArray: any[] = [];
            querySnapshot.forEach((doc) => {
                itemsArray.push({ id: doc.id, ...doc.data() });
            });
            setImportedBookmarks(itemsArray);
        } catch (error) {
            console.error("Error fetching imported bookmarks: ", error);
        }
    }, [uid]);

    useEffect(() => {
        fetchBookmarks();
        fetchImportedBookmarks();
    }, [fetchBookmarks, fetchImportedBookmarks]);

    const removeBookmark = async (id: string) => {
        try {
            await deleteDoc(doc(db, `users/${uid}/bookmarks`, id));
            await fetchBookmarks(); // Refresh list after deletion
        } catch (error) {
            console.error("Error removing bookmark: ", error);
        }
    };

    const removeImportedBookmark = async (id: string) => {
        try {
            await deleteDoc(doc(db, `users/${uid}/imported-bookmarks`, id));
            await fetchBookmarks(); // Refresh list after deletion
        } catch (error) {
            console.error("Error removing bookmark: ", error);
        }
    }

    const addBookmark = async (recipeName: string, recipeUrl: string, recipeIngredients: string) => {
        if (recipeName === "" || recipeUrl === "") {
            alert("Please fill in all the Name and URL fields");
            return;
        }
        
        try {
            setModalOpen(true);
            const docRef = await addDoc(collection(db, `users/${uid}/imported-bookmarks`), {
                recipeName: recipeName,
                recipeUrl: recipeUrl,
                recipeIngredients: recipeIngredients,
            });
            fetchBookmarks();
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding bookmark: ", error);
        }
    }
    
    return (
        <div className="flex items-center flex-col mt-6">
            <h1 className="flex items-center text-2xl font-bold">Bookmarks</h1>
            
            <button 
                onClick={()=>setModalOpen(true)}
                className="genButton">
                    <span>
                        Import Recipe
                    </span>
            </button>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div>
                        
                        <form className="w-125 my-4 p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
                            <p className="text-white text-lg font-bold mb-4">
                                Import external recipes
                            </p>

                            <div className="flex flex-row items-center mb-6">

                                <input 
                                    type="text" 
                                    value={recipeName} 
                                    onChange={(e) => setRecipeName(e.target.value)}
                                    placeholder='Recipe Name'
                                    className=" p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            
                                <input 
                                    type="text" 
                                    value={recipeUrl} 
                                    onChange={(e) => setRecipeUrl(e.target.value)}
                                    placeholder='Recipe Link'
                                    className=" p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>
                            
                            <p 
                                className="text-gray-600 text-wrap mb-2 items-center text-center">
                                    List the ingredients required separated by space, commas, or a numbered list.
                                    You can leave this blank but will miss out functionality.
                            </p>

                            <input 
                                type="text" 
                                value={recipeIngredients} 
                                onChange={(e) => setRecipeIngredients(e.target.value)}
                                placeholder='Recipe Ingredients'
                                className=" p-2 rounded-md border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button 
                                className="mt-4 mb-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" 
                                onClick={()=> setModalOpen(false)}>
                                Cancel
                            </button>

                            <button onClick={()=> addBookmark(recipeName, recipeUrl, recipeIngredients)}>
                                <span className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    Add Bookmark
                                </span>
                            </button>

                            

                        </form>
                    </div>
                </div>
            )}

            <ul>
                {importedBookmarks.map((bookmark) => (
                    <li key={bookmark.id} className="noLineListPadding flex justify-center p-2 text-white">
                        <div className="flex flex-col items-center justify-center mt-8 max-w-sm w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            
                            <div className="flex justify-center w-full">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {bookmark.recipeName}
                                </h5>
                            </div>


                            {/* fix this component */}
                            <p className="text-gray-500 mb-4">{bookmark.recipeIngredients}</p>

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
                                    onClick={() => removeImportedBookmark(bookmark.id)}
                                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600"
                                >
                                    Remove Bookmark
                                </button>

                            </div>

                            <p className="mt-4 text-gray-500 m2-4">Imported Recipe</p>
                        </div>
                    </li>
                )
            )}

            </ul>

            <ul>
            {bookmarks.map((bookmark) => (
                <li key={bookmark.id} className="noLineListPadding flex justify-center p-2 text-white">
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