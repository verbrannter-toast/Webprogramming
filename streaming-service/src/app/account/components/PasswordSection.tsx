import React, {useState} from 'react';
import SectionLayout from './SectionLayout'
import ConfirmButton from './ConfirmButton'
import AlertContainer from './AlertContainer';

type AlertType = 'success' | 'error' | 'warning';

function PasswordSection () { 
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertVar, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous alert
    setAlert(null);

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: "Passwords don't match" });
      return;
    }

    if (newPassword === currentPassword){
      setAlert({ type: 'warning', message: "The new password should differ from the old one" });
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
        setAlert({type: 'success', message: "Password was changed successfully"})
    
        // Clear the form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setAlert({type: 'error', message: data.message || "Current password is incorrect"})
      }
    } catch (err) {
      alert("Backend server not reached.");
    }
  };

    return (
      <SectionLayout sectionTitle='Change Password'>
        {alertVar && <AlertContainer type={alertVar.type} message={alertVar.message} />}
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