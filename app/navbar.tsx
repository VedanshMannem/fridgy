// components/Navbar.tsx
"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/clientApp";
import { loginWithGoogle, logout } from "@/firebase/firebaseAuth";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return user ? (
    <div>
      <button onClick={logout} className="signOut">Sign out</button>
      <h1 className="userName">{user.displayName}</h1>
    </div>
  ) : (
    <div>
      <button onClick={loginWithGoogle} className="signOut">Sign in with Google</button>
      <h1 className="userName">Frigdy</h1>
    </div>
  );
}
