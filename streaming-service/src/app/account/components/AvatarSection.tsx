import React, {useState} from 'react';
import SectionLayout from './SectionLayout'
import ConfirmButton from './ConfirmButton'
import e from 'express';

function AvatarSection(){


    const handleUploadImage = async (e: React.FormEvent) =>{
        e.preventDefault();
        
    }
    return(
        <SectionLayout sectionTitle='Change Password' buttonAtBottom>
            <h3>1. Choose an avatar</h3>
            {/*drag and drop form*/}
            <h3>2. Prepare your image </h3>
            {/* a field with editing the uploaded image*/}
            <ConfirmButton text="Save" type="submit" />
        </SectionLayout>
    )
}

export default AvatarSection