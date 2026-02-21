import React, {useState} from 'react';
import SectionLayout from './SectionLayout'
import ConfirmButton from './ConfirmButton'

function PasswordSection () { 
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
    // TO-DO implement handleUpdatePassword
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("passwords don't match");
      // TO-DO: it should be displayed under the form on the page
      return;
    }

    if (newPassword === currentPassword){
      alert("the new password should differ from the old one");
      // TO-DO: it should be displayed under the form on the page
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/account/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword, newPassword })
      });

      const data = await res.json();
      
      if (data.success) {
        alert("Password was changed successfully");
        // TO-DO: it should displayed under the form on the page
        
        // Optionally clear the form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.message || "Current password is incorrect");
        // TO-DO: it should displayed under the form on the page
      }
    } catch (err) {
      alert("Backend server not reached.");
    }
  };

    return (
      <SectionLayout sectionTitle='Change Password'>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input 
            type="password" 
            placeholder="Current Password" 
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="New Password" 
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <ConfirmButton text="Update Password" type="submit" />
        </form>
      </SectionLayout>

    );
}


export default PasswordSection