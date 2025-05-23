import db from '@/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth } from '@/firebase/clientApp';
import { addDoc } from 'firebase/firestore';

export default function GenerateRecipe() {
    const [items, setItems] = useState<any[]>([]);
    const [recipes, setRecipes] = useState<any[]>([]);
    const [recipeLoading, setrecipeLoading] = useState(false);

    const user = auth.currentUser;
    const uid = user?.uid;

    useEffect(() => {
        const fetchItemsInList = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, `users/${uid}/items`));
            const itemsList: any[] = [];
            querySnapshot.forEach((doc) => {
            itemsList.push({ id: doc.id, ...doc.data() });
            });
            setItems(itemsList);
            console.log("Items in list: ", itemsList);
        } catch (error) {
            console.error("Error fetching items: ", error);
        }
        };

        fetchItemsInList();
    }, []);

    const generateRecipe = async () => {
        const ingredientsString = items.map((item) => item.name).join(",");
        try {
            setrecipeLoading(true);
            const response = await fetch ("/api/spoonacular", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ingredients: ingredientsString,
                }),
            }
            )
            const data = await response.json();
            setRecipes(data);
            setrecipeLoading(false);
        } catch (error) {
            console.log("Error fetching recipes: ", error);
        }
    }

    const addBookmark = async (recipeName: string, recipeUrl: string, recipeImage: string) => {
        try {
            const docRef = await addDoc(collection(db, `users/${uid}/bookmarks`), {
                recipeName: recipeName,
                recipeUrl: recipeUrl,
                recipeImage: recipeImage,
            })
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.log("Error adding document: ", error);
        }
    }

    return (
        <div className="flex flex-col">
            <button
            onClick={generateRecipe}
            className="genButton"
            >                   
            <span>Generate Recipe</span>
            </button>

            <div className="flex flex-col items-center mt-6">
            {recipeLoading && (
                <div>
                <div className="spinner flex justify-center items-center">
                    <div className="spinnerin flex justify-center items-center"></div>
                </div>
                </div>
            )}
            </div>

            
            <div className="w-full flex justify-center mt-4">
            <div className="text-center w-full max-w-lg">
                {recipes.length > 0 && (
                <ul className="text-white items-center flex flex-wrap justify-center">
                    {recipes.map((recipe) => (
                    <li key={recipe.id}>
                        <div className='book flex flex-col items-center justify-center'>
                        <p>Ready in: {recipe.readyInMinutes} minutes</p>
                        <p>Servings: {recipe.servings}</p>
                        {recipe.diets.map((diet: string) => (
                            <span key={diet} className="text-gray-500">{diet}</span>
                        ))}

                        <a
                            href={recipe.spoonacularSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="linkbutton mt-4 text-center flex justify-center items-center"
                        >
                            See Recipe
                        </a>

                        <button 
                            className='bookmark mt-4'
                            onClick={() => addBookmark(recipe.title, recipe.spoonacularSourceUrl, recipe.image)}>
                        <svg
                            aria-hidden="true"
                            stroke="currentColor"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                            ></path>
                        </svg>
                        Bookmark
                        </button>


                        <div className="cover flex flex-col">
                            <p className='text-lg text-center'>{recipe.title}</p>
                            <img src={recipe.image} alt={recipe.title} className="rounded-md w-full h-40 object-cover" />
                        </div>
                        </div>
                    </li>
                    ))}
                </ul>
                )}
            </div>
            </div>
        </div>
    );

}