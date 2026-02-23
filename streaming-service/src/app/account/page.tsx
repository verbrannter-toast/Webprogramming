"use client";

import React, { useEffect, useState } from 'react';


import AboutSection from './components/AboutSection';
import AvatarSection from './components/AvatarSection';
import PasswordSection from './components/PasswordSection';
import SignoutSection from './components/SignoutSection';
import UserAvatar from '../components/UserAvatar';
import DeleteAccountSection from './components/DeleteAccountSection';

const API_URL = 'http://localhost:5000';

 export default function Account() {
  const [activeTab, setActiveTab] = useState('about');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setAvatarUrl(null);
      return;
    }

    fetch(`${API_URL}/account/avatar/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setAvatarUrl(data.avatarUrl || null);
      })
      .catch(() => {
        setAvatarUrl(null);
      });
  }, []);
  
  return (
    <div className='bg-[#141414] min-h-screen text-white pt-20 flex justify-center'>
      <div className='flex max-w-7xl w-full'>
        {/* Left Navigation - 20% */}
        
        <aside className='w-1/5 bg-zinc-900 p-5 space-y-2'>
          <UserAvatar
            avatarUrl={avatarUrl}
            sizeClass='w-24 h-24'
            className='mx-auto mb-4'
          />
          <nav className='space-y-2'>
            <SidebarButton
              buttonText='Account'
              tabValue='about'
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
             <SidebarButton
              buttonText='Change Avatar'
              tabValue='avatar'
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
              buttonText='Delete Account'
              tabValue='delete'
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
        </aside>
      
        {/* Right Content Area - 80% */}
        <div className='flex-1 pl-12'>
          {activeTab === 'about' && <AboutSection />}
          {activeTab === 'avatar' && <AvatarSection onAvatarUpdated={setAvatarUrl} />}
          {activeTab === 'password' && <PasswordSection />}
          {activeTab === 'delete' && <DeleteAccountSection />}
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