'use client';

import { useState } from 'react';
import { Role, UserStatus } from '../../types/enums';
import { useUserManagement } from '../../hooks/domin/useUserManagement';
import DoneDialog from '@/components/DoneDialog';

const roles = Object.keys(Role).filter((r) => isNaN(Number(r)));

export default function RegisterUserForm() {
    const { registerUser, loading } = useUserManagement();
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [role, setRole] = useState<Role>(Role.Manufacturer);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);

        try {
            const result = await registerUser(name, place, role);

            if (result) {
                const successMessage = `Wallet: ${result.wallet}
Name: ${result.name}
Role: ${Role[result.role]}
Status: ${UserStatus[result.status]}`;
                
                setSuccessMessage(successMessage);

                setName('');
                setPlace('');
                setRole(Role.Manufacturer);
            } else {
                throw new Error('Failed to register user');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setLocalError(errorMessage);
        } finally {
            // Reset error after a few seconds
            if (localError) {
                setTimeout(() => setLocalError(null), 5000);
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Register New User</h2>
                    {loading && <span className="text-sm text-green-600">Processing...</span>}
                </div>

                {localError && (
                    <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded mb-4">
                        <p className="font-medium">{localError}</p>
                    </div>
                )}

                <fieldset disabled={loading} className="space-y-4">
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
                        {loading ? 'Registering User...' : 'Register User'}
                    </button>
                </fieldset>
            </form>

            {successMessage && (
                <DoneDialog
                    message={`User Registered Successfully!\n\n${successMessage}`}
                    onDone={() => setSuccessMessage(null)}
                    autoHide={false}
                />
            )}
        </>
    );
}
