import db from "@/firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";

export default function DeleteItem({id, onDelete }: {id: string, onDelete: () => void}) {
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "items", id));
            console.log("OH NO! You ran out. Maybe eat less and buy more?");
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
        onDelete();
    }
    
    return (
        <div>
            <button
            onClick={handleDelete}
            className="border bg-red-400 p-1 rounded text-white">
                Delete
            </button>
        </div>
    )
}