import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import SectionLayout from './SectionLayout'
import AlertContainer, { type Alert } from './AlertContainer';
import ConfirmButton from './ConfirmButton'

export default function DeleteAccountSection() {
    const router = useRouter();
    const [confirmed, setConfirmed] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeletingAccount = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setAlert({ type: 'error', message: 'No user session found.' });
            return;
        }

        if (!confirmed) {
            setAlert({ type: 'warning', message: 'Please confirm you understand the consequences first.' });
            return;
        }

        try {
            setIsDeleting(true);

            const res = await fetch(`http://localhost:5000/account/${userId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setAlert({ type: 'error', message: data.message || 'Failed to delete account.' });
                return;
            }

            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            router.push('/login');
        } catch {
            setAlert({ type: 'error', message: 'Backend server not reached.' });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <SectionLayout sectionTitle='Delete Account' buttonAtBottom>
            <AlertContainer
                type='warning'
                message='This action is irreversible. Once you confirm the deletion, it cannot be undone.'
            />

            {alert && <AlertContainer type={alert.type} message={alert.message} />}

            <div className='space-y-2'>
                <h2 className='text-lg font-semibold text-gray-200'>
                    All information associated with your account will be completely and permanently deleted, including:
                </h2>
                <ul className='list-disc list-inside text-gray-400 space-y-1 pl-2'>
                    <li>Profile and personal data</li>
                    <li>Avatar image</li>
                    <li>Watchlist</li>
                    <li>Settings and preferences</li>
                </ul>
            </div>

            <div className=' bg-zinc-800 border border-zinc-700 rounded-lg p-5 space-y-4'>
                <div className='flex items-start gap-3'>
                    <input
                        id='delete-confirm-checkbox'
                        type='checkbox'
                        className='mt-1 w-4 h-4 accent-red-600 cursor-pointer flex-shrink-0'
                        checked={confirmed}
                        onChange={(e) => {
                            setConfirmed(e.target.checked);
                            setAlert(null);
                        }}
                    />
                    <label
                        htmlFor='delete-confirm-checkbox'
                        className='text-gray-300 text-sm cursor-pointer leading-relaxed'
                    >
                        I understand that all my data will be permanently deleted and that data recovery will be impossible.
                    </label>
                </div>
                <ConfirmButton
                    text={isDeleting ? 'Deleting...' : 'Confirm Delete Account'}
                    onClick={handleDeletingAccount}
                    className={!confirmed ? 'opacity-50 cursor-not-allowed' : ''}
                />
            </div>
        </SectionLayout>
    );
}