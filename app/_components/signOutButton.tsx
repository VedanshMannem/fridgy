"use client"

import { auth, signOut } from "@/auth";

export default function SignOutButton() {
//   return (
//             <form
//                 action={async () => {
//                     "use server"
//                     await signOut();
//                 }}
//             >
//                 <button className="p-2 border-2 bg-blue-400">
//                     Sign in with Google</button>
//             </form>
//         )

    return (
        <button
        onClick={()=> signOut()}>Sign Out</button>
    )
}