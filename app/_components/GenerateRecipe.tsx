import db from '@/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth } from '@/firebase/clientApp';

export default function GenerateRecipe() {
    const [items, setItems] = useState<any[]>([]);
    const [recipes, setRecipes] = useState<any[]>([]);

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
            
        } catch (error) {
            console.log("Error fetching recipes: ", error);
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

        <div className="mt-4 text-center w-full max-w-lg flex items-center justify-center">
            {recipes.length > 0 && (
            <ul className="text-white items-center flex flex-wrap">
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
    )
}