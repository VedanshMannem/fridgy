"use client"
import { signIn, auth, signOut } from "@/auth";

export default async function SignIn() {
    const session = await auth();
    const user = session?.user;
    return user ? (
        <div>
            <button className="p-2 border-2 bg-blue-400" onClick={() => signOut()}>Sign Out</button>
            <h1> Bye </h1>
        </div>
        
    ) : (
        // <form
        //     action={async () => {
        //         "use server"
        //         await signIn("google");
        //     }}
        // >
        //     <button className="p-2 border-2 bg-blue-400">
        //         Sign in with Google</button>
        //     <h1>Welcome</h1>
        // </form>
        <div>
            <h1> You're signed in </h1>
        </div>
        
        
    )
        
}