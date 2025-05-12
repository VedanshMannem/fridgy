import db from "@/firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";

export default function DeleteItem({id}: {id: string}) {
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "items", id));
            console.log("Document deleted with ID: ", id);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }
    return (
        <div>
            <button
            onClick={handleDelete}
            className="border bg-red-400 p-1 roudned text-white">
                Delete
            </button>
        </div>
    )

}