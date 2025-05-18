// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/clientApp";
import AddItemClient from "./_components/AddItemClient";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  return user ? (
    <main>
      <AddItemClient />
    </main>
  ) : (
    <div>
      <h1>you're not signed in yet</h1>
    </div>
  );
}
