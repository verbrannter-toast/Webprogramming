"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        // save the real user ID from the database
        localStorage.setItem('userId', data.user.id.toString());
        router.push('/');
      } else {
        alert("Login failed!");
      }
    } catch (err) {
      alert("Backend server not reached.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[url('/assets/login-bg.png')] bg-no-repeat bg-cover">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-10 rounded-lg w-96 space-y-6">
        <h1 className="text-white text-3xl font-bold">Sign In</h1>
        <input 
          type="email" placeholder="Email" 
          className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700">
          Sign In
        </button>
      </form>
    </div>
  );
}