import { signIn, auth, signOut } from "@/auth";

export default async function SignIn() {
    const session = await auth();
    const user = session?.user;
    console.log(user);
    console.log(user?.name);
    return user ?  (
        <div>
            {/* <form
            action={async () => {
                "use server"
                await signOut();
            }}>
                <button className="p-2 border-2 bg-blue-400">Sign out</button>
            </form> */}
        </div>
    ) : (
        <div>
            {/* <form
                action={async () => {
                    "use server"
                    await signIn("google");
                }}
            >
                <button className="p-2 border-2 bg-blue-400">
                    Sign in with Google</button>
                <h1>Welcome</h1>
            </form> */}
        </div>
    )
        
}