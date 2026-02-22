"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Choose endpoint based on mode
    const endpoint = isRegistering ? '/register' : '/login';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (res.ok && (data.success || data.userId)) {
        const id = data.user?.id || data.userId;
        localStorage.setItem('userId', id.toString());
        router.push('/');
      } else {
        alert(data.message || "Authentication failed!");
      }
    } catch (err) {
      alert("Backend server not reached.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-login bg-cover bg-center flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/assets/login-bg.png')] bg-no-repeat bg-cover" />
      
      <form onSubmit={handleSubmit} className="relative z-10 bg-black/75 p-16 rounded-md w-110 space-y-6">
        <h1 className="text-white text-3xl font-bold">
          {isRegistering ? 'Create Account' : 'Sign In'}
        </h1>
        
        <input 
          type="email" placeholder="Email" required
          className="w-full p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-red-600"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-red-600"
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button className="w-full bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700 transition">
          {isRegistering ? 'Sign Up' : 'Sign In'}
        </button>

        <p className="text-zinc-500 text-sm">
          {isRegistering ? 'Already have an account?' : 'New to Reflix?'} 
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-white hover:underline ml-1"
          >
            {isRegistering ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </form>
    </div>
  );
}