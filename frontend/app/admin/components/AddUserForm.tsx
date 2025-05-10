'use client';

import { useState } from 'react';
import { Role, UserStatus } from '../../types/enums';
import { useUserManagement } from '../../hooks/domin/useUserManagement';
import DoneDialog from '@/components/DoneDialog';

const roles = Object.keys(Role).filter((r) => isNaN(Number(r)));

interface AddUserFormProps {
    onSuccess?: (userName: string) => void;
    onError?: (error: string) => void;
}

export default function AddUserForm({ onSuccess, onError }: AddUserFormProps) {
    const { addUser, getAllUsers, loading, error } = useUserManagement();

    const [wallet, setWallet] = useState('');
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [role, setRole] = useState<Role>(Role.Manufacturer);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);

        const result = await addUser(wallet, name, place, role);

        if (result) {
            const successMessage = `Wallet: ${result.wallet}
Name: ${result.name}
Role: ${Role[result.role]}
Status: ${UserStatus[result.status]}`;

            setSuccessMessage(successMessage);

            setWallet('');
            setName('');
            setPlace('');
            setRole(Role.Manufacturer);

            await getAllUsers();

            onSuccess?.(result.name);
        } else if (error) {
            onError?.(error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200 mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New User</h2>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded mb-4">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <fieldset disabled={loading} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Wallet Address"
                        className="w-full border border-green-300 p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full border border-green-300 p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Place"
                        className="w-full border border-green-300 p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        required
                    />
                    <select
                        className="w-full border border-green-300 p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        value={role}
                        onChange={(e) => setRole(Number(e.target.value))}
                        aria-label="Select user role"
                    >
                        {roles.map((r, idx) => (
                            <option key={r} value={idx} className="bg-green-50">
                                {r}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full transition duration-300"
                    >
                        {loading ? 'Adding User...' : 'Add User'}
                    </button>
                </fieldset>
            </form>

            {successMessage && (
                <DoneDialog
                    message={`User Added Successfully!\n\n${successMessage}`}
                    onDone={() => setSuccessMessage(null)}
                    autoHide={false}
                />
            )}
        </>
    );
}
