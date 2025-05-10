"use client";
import Image from "next/image";

import GoogleButton from 'react-google-button';
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <main>
        <h1>Homepage</h1>
        <GoogleButton onClick={() => signIn('google')} />
      </main>
    </div>
  );
}
