"use client"

import { signIn } from "@/auth";

export default function SignInButton() {
    return (
        // <form
        //     action={async () => {
        //         "use server"
        //         await signIn("google");
        //     }}
        // >
        //     <button className="p-2 border-2 bg-blue-400">
        //         Sign in with Google</button>
        // </form>
        <button 
        onClick={()=>signIn("google")}>Sign In</button>
    )
}