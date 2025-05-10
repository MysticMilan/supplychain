'use client';

import { useState } from 'react';
import { Role, UserStatus } from '../../types/enums';
import { useUserManagement } from '../../hooks/domin/useUserManagement';
import DoneDialog from '@/components/DoneDialog';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const roles = Object.keys(Role).filter((r) => isNaN(Number(r)));

interface RegisterUserFormProps {
    onSuccess?: (userName: string) => void;
    onError?: (error: string) => void;
}

export default function RegisterUserForm({ onSuccess, onError }: RegisterUserFormProps) {
    const { registerUser, getAllUsers, loading, error } = useUserManagement();
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [role, setRole] = useState<Role>(Role.Manufacturer);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);

        const result = await registerUser( name, place, role);

        if (result) {
            const successMessage = `Wallet: ${result.wallet}
Name: ${result.name}
Role: ${Role[result.role]}
Status: ${UserStatus[result.status]}`;

            setSuccessMessage(successMessage);
            
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Register New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded mb-4">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <fieldset disabled={loading} className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-left text-sm font-medium text-gray-700 mb-2">Name</label>
                        <Input
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-left text-sm font-medium text-gray-700 mb-2">Place</label>
                        <Input
                            type="text"
                            placeholder="Enter place"
                            value={place}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlace(e.target.value)}
                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-left text-sm font-medium text-gray-700 mb-2">Role</label>
                        <Select
                            value={role.toString()}
                            onValueChange={(value: string) => setRole(Number(value))}
                        >
                            <SelectTrigger className="border-green-300 focus:border-green-500">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r, idx) => (
                                    <SelectItem key={r} value={idx.toString()} className="hover:bg-green-100">
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded transition duration-300"
                    >
                        {loading ? 'Adding User...' : 'Add User'}
                    </button>
                </fieldset>
            </form>
            {successMessage && (
                <DoneDialog
                    message={`User Registered Successfully!

${successMessage}`}
                    onDone={() => setSuccessMessage(null)}
                    autoHide={false}
                />
            )}
        </div>
    );
}
