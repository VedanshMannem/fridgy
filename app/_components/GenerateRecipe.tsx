import db from '@/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function GenerateRecipe() {
    const [items, setItems] = useState<any[]>([]);
    const [recipes, setRecipes] = useState<any[]>([]);

    useEffect(() => {
        const fetchItemsInList = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "items"));
            const itemsList: any[] = [];
            querySnapshot.forEach((doc) => {
            itemsList.push({ id: doc.id, ...doc.data() });
            });
            setItems(itemsList);
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
            console.log("Good luck cooking doofus")
        } catch (error) {
            console.log("Error fetching recipes: ", error);
        }
    }

    return (
        <div className="flex flex-col">
        <button
        onClick={generateRecipe}
        className="border bg-blue-400 p-1 rounded text-white"
        >Generate Recipe</button>

        <div className="mt-4 text-center w-full max-w-lg">
            {recipes.length > 0 && (
            <ul className="text-white items-center">
                {recipes.map((recipe) => (
                <li key={recipe.id}>
                    {recipe.title}
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    )
}