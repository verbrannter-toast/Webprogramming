import React, {useState} from 'react';
import SectionLayout from './SectionLayout'
import ConfirmButton from './ConfirmButton'

function PasswordSection () { 

    // TO-DO implement handleUpdatePassword
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    // validate and api call to backend for updating password
  }

    return (
      <SectionLayout sectionTitle='Change Password'>
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
      </SectionLayout>

    );
}


export default PasswordSection