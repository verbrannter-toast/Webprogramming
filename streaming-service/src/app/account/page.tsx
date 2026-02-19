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


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    // validate and api call to backend for updating password
  }

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
          <ConfirmButton text="Update Password" onClick={handleUpdatePassword} />
        </div>
      </div>
    );
}

const ConfirmButton = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition"
     >
      {text}
    </button>
  );
}

function SignoutSection() {
    const router = useRouter();
    
    const handleSignOut = () => {
      localStorage.removeItem('userId');
      router.push('/login');
    };

     return (
      <div className="space-y-6">
        <h3 className="text-3xl font-bold mb-8">Sign Out</h3>
        <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
          <p className="text-gray-300">Are you sure you want to sign out?</p>
          <ConfirmButton text="Confirm Sign Out" onClick={handleSignOut}/>
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

