"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


import AboutSection from './components/AboutSection';
import PasswordSection from './components/PasswordSection';
import SignoutSection from './components/SignoutSection';


 export default function Account() {
  const [activeTab, setActiveTab] = useState('about');
  
  return (
    <div className='bg-[#141414] min-h-screen text-white pt-20 flex justify-center'>
      <div className='flex max-w-7xl w-full'>
        {/* Left Navigation - 20% */}
        <nav className='w-1/5 bg-zinc-900 p-6 space-y-2'>

          <SidebarButton
            buttonText='Account'
            tabValue='about'
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <SidebarButton
            buttonText='Change Password'
            tabValue='password'
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />


          <SidebarButton
            buttonText='Sign Out'
            tabValue='signout'
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
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


const SidebarButton = ({
  buttonText,
  tabValue,
  activeTab,
  setActiveTab
}: {
  buttonText: string; 
  tabValue: string;
  activeTab: string;
  setActiveTab: (tab: string) => void
}) => {
  return (
    <button 
          onClick={() => setActiveTab(tabValue)}
          className={`w-full text-left p-3 rounded transition ${
            activeTab === tabValue ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
          }`}
        >
          {buttonText}
    </button>
  )
}