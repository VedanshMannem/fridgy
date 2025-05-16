import { auth } from "@/auth";
import AddItem from "./_components/AddItem";
import AddItemClient from "./_components/AddItemClient";
import React from 'react';

export default async function Home() {

  const session = await auth();
  const user = session?.user;

  return user ? (
    <div>
      <main>
        <AddItemClient />
      </main>
    </div>
  ) : (
    <div>
      <h1> you're not signed in yet </h1>
    </div>
  )

}
