'use client';

import React from 'react';
import SectionLayout from './SectionLayout'

export default function AboutSection () {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

   return (
      <SectionLayout sectionTitle='Account'>
           <div>
            <h4 className="text-lg font-semibold text-gray-300">User ID</h4>
            <p className="text-white mt-2">{userId || 'Not logged in'}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Email</h4>
            <p className="text-white mt-2">{userEmail || 'Not logged in'}</p>
          </div>
      </SectionLayout>
      );
}

