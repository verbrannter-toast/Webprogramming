import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import SectionLayout from './SectionLayout'
import ConfirmButton from './ConfirmButton'


export default function SignoutSection() {
    const router = useRouter();
    
    const handleSignOut = () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      router.push('/login');
    };

     return (
      <SectionLayout sectionTitle='Sign Out' buttonAtBottom>
        <div className='flex justify-center items-cente mb-20 mt-15'>
          <p className="text-gray-300 text-[24px]">Are you sure you want to sign out?</p>
        </div>
        <ConfirmButton text="Confirm Sign Out" onClick={handleSignOut}/>
      </SectionLayout>
      );
}