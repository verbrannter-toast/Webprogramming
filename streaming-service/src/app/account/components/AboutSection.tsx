import React from 'react';
import SectionLayout from './SectionLayout'

export default function AboutSection () {
   return (
      <SectionLayout sectionTitle='Account'>
           <div>
            <h4 className="text-lg font-semibold text-gray-300">Username</h4>
            <p className="text-white mt-2">{/* Place username here*/}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Email</h4>
            <p className="text-white mt-2">{/* Place email here*/}</p>
          </div>
      </SectionLayout>
      );
}

