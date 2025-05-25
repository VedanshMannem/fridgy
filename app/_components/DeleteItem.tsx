import db from "@/firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { auth } from "@/firebase/clientApp";

export default function DeleteItem({id, onDelete }: {id: string, onDelete: () => void}) {
    
    const user = auth.currentUser;
    const uid = user?.uid;
    
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "users", `${uid}/items/${id}`));
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