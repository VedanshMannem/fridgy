import { auth, signIn, signOut } from "@/auth";

export default async function Navbar() {  
    const session = await auth();
    const user = session?.user;
    return user ?  (
        <div>
            <form
            action={async () => {
                "use server"
                await signOut();
            }}>
                <button className="signOut">Sign out</button>
            </form>
            <h1 className="userName">{user?.name}</h1>
        </div>
    ) : (
        <div>
            <form
                action={async () => {
                    "use server"
                    await signIn("google");
                }}
            >
                <button className="signOut">
                    Sign in with Google</button>
                <h1 className="userName">Frigdy</h1>
            </form>
        </div>
    )
    
}