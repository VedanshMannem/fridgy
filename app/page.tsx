import { auth } from "@/auth";
import { signOut } from "@/auth";
import { signIn } from "next-auth/react";

export default async function Home() {

  const session = await auth();
  const user = session?.user;
  return user ? (
    <div>
      <main>
        <h1>Welcome to Fridgy</h1>
        <form
            action={async () => {
                "use server"
                await signIn("google");
            }}
        >
            <button className="p-2 border-2 bg-blue-400">
                Sign in with Google</button>
        </form>
        
      </main>
    </div>
  ) : (
    <div></div>
  )

}
