"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function AboutSection () {
   return (
      <div className="space-y-6">
        <h3 className="text-3xl font-bold mb-8">Account</h3>
        <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Username</h4>
            <p className="text-white mt-2">{/* Place username here*/}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Email</h4>
            <p className="text-white mt-2">{/* Place email here*/}</p>
          </div>
        </div>
      </div>
      );
}
function PasswordSection () { 
    return (
      <div className="space-y-6">
        <h3 className="text-3xl font-bold mb-8">Change Password</h3>
        <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
          <input 
            type="password" 
            placeholder="Current Password" 
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
          />
          <input 
            type="password" 
            placeholder="New Password" 
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
          />
          <button className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
            Update Password
          </button>
        </div>
      </div>
    );
}

// const ConfirmButton = ({ text }: { text: string }) => {
//   return (
//     <button className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
//       {text}
//     </button>
//   );
// }

function SignoutSection() {
     return (
      <div className="space-y-6">
        <h3 className="text-3xl font-bold mb-8">Sign Out</h3>
        <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
          <p className="text-gray-300">Are you sure you want to sign out?</p>
          {/* <ConfirmButton text="Confirm Sign Out" /> */}
          <button className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
            Confirm New Password
          </button>
        </div>
      </div>
      );
}

 export default function Account() {
  const [activeTab, setActiveTab] = useState('about');
  
  return (
    <div className='bg-[#141414] min-h-screen text-white pt-20 flex justify-center'>
      <div className='flex max-w-7xl w-full'>
        {/* Left Navigation - 20% */}
        <nav className='w-1/5 bg-zinc-900 p-6 space-y-2'>
        <button 
          onClick={() => setActiveTab('about')}
          className={`w-full text-left p-3 rounded transition ${
            activeTab === 'about' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
          }`}
        >
          Account
        </button>
        <button 
          onClick={() => setActiveTab('password')}
          className={`w-full text-left p-3 rounded transition ${
            activeTab === 'password' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
          }`}
        >
          Change Password
        </button>
        <button 
          onClick={() => setActiveTab('signout')}
          className={`w-full text-left p-3 rounded transition ${
            activeTab === 'signout' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
          }`}
        >
          Sign Out
        </button>
      </nav>
      
      {/* Right Content Area - 80% */}
      <div className='flex-1 pl-12 pt-3'>
        {activeTab === 'about' && <AboutSection />}
        {activeTab === 'password' && <PasswordSection />}
        {activeTab === 'signout' && <SignoutSection />}
      </div>
      </div>
    </div>
  );
}




//  function AccountPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://127.0.0.1:5000/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         // save the real user ID from the database
//         localStorage.setItem('userId', data.user.id.toString());
//         router.push('/');
//       } else {
//         alert("Login failed!");
//       }
//     } catch (err) {
//       alert("Backend server not reached.");
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-black">
//       <form onSubmit={handleLogin} className="bg-zinc-900 p-10 rounded-lg w-96 space-y-6">
//         <h1 className="text-white text-3xl font-bold">Sign In</h1>
//         <input 
//           type="email" placeholder="Email" 
//           className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input 
//           type="password" placeholder="Password" 
//           className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button className="w-full bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700">
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// }