"use client"

import { auth, signIn, signOut } from "@/auth";
import SignInButton from "./_components/signInButtonAction";
import SignOutButton from "./_components/signOutButton";

export default async function Navbar() {  
    const session = await auth(); 
    const user = session?.user;

    return user ? (
        <nav className="navbar">
            <h1 className="bold">Fridgy</h1>
            {user.name}
            {/* <SignOutButton /> */}
            <form
                action={async () => {
                    "use server"
                    await signOut();
                }}
            >
                <button className="p-2 border-2 bg-blue-400">
                    Sign in with Google</button>
            </form>
        </nav>
    ) : (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-2xl">Fridgy</h1>
            <SignInButton />
        </nav>
    )
    
}