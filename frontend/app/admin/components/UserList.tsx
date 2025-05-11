'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { IUser } from '../../types/interface';
import { Role, UserStatus } from '../../types/enums';
import { useUserManagement } from '../../hooks/domin/useUserManagement';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ConfirmDialog';
import DoneDialog from '@/components/DoneDialog';

interface UserListProps {
    onError?: (error: string | null) => void;
}

const UserList: React.FC<UserListProps> = ({ onError }) => {
    const { getAllUsers, updateUserStatus } = useUserManagement();
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<UserStatus | 'ALL'>('ALL');

    const filteredUsers = useMemo(() => 
        selectedStatus === 'ALL' 
            ? users 
            : users.filter(user => user.status === selectedStatus), 
        [users, selectedStatus]
    );

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
            setLoading(false);
            onError?.(errorMessage);
        }
    }, [getAllUsers, onError]);

    React.useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
    const [confirmMessage, setConfirmMessage] = useState<string>('');
    const [doneMessage, setDoneMessage] = useState<string | null>(null);

    const handleUpdateStatus = useCallback(async (wallet: string, newStatus: UserStatus) => {
        try {
            const result = await updateUserStatus(wallet, newStatus);
            if (result) {
                setDoneMessage(
                    `User ${result.wallet} updated from ${UserStatus[result.oldStatus]} to ${UserStatus[result.newStatus]}.`
                );
                fetchUsers();
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update user status';
            toast.error(errorMessage);
        }
    }, [updateUserStatus, fetchUsers]);

    const confirmAndUpdateStatus = useCallback((wallet: string, newStatus: UserStatus) => {
        const warning = newStatus === UserStatus.Blocked
            ? "⚠️ Warning: You cannot unblock the user after blocking.\nAre you sure you want to block this user?"
            : `Are you sure you want to change user status to ${UserStatus[newStatus]}?`;

        setConfirmMessage(warning);
        setConfirmAction(() => () => {
            handleUpdateStatus(wallet, newStatus);
            setConfirmAction(null);
        });
    }, [handleUpdateStatus]);

    const renderActions = useCallback((status: UserStatus, wallet: string) => {
        if (status === UserStatus.Blocked) {
            return <span className="text-red-700 font-semibold text-sm">Blocked</span>;
        }

        if (status === UserStatus.Rejected) {
            return <span className="text-orange-600 font-semibold text-sm">Rejected</span>;
        }

        const actions: React.ReactNode[] = [
            <Button
                key="block"
                onClick={() => confirmAndUpdateStatus(wallet, UserStatus.Blocked)}
                variant="destructive"
                className="text-xs"
            >
                Block
            </Button>
        ];

        if (status === UserStatus.Pending) {
            actions.push(
                <Button
                    key="verify"
                    onClick={() => confirmAndUpdateStatus(wallet, UserStatus.Active)}
                    variant="primary"
                    className="text-xs"
                >
                    Verify
                </Button>,
                <Button
                    key="reject"
                    onClick={() => confirmAndUpdateStatus(wallet, UserStatus.Rejected)}
                    variant="danger"
                    className="text-xs"
                >
                    Reject
                </Button>
            );
        }

        if (status === UserStatus.Active) {
            actions.push(
                <Button
                    key="deactivate"
                    onClick={() => confirmAndUpdateStatus(wallet, UserStatus.Deactivated)}
                    variant="warning"
                    className="text-xs"
                >
                    Deactivate
                </Button>
            );
        }

        if (status === UserStatus.Deactivated) {
            actions.push(
                <Button
                    key="activate"
                    onClick={() => confirmAndUpdateStatus(wallet, UserStatus.Active)}
                    variant="primary"
                    className="text-xs"
                >
                    Activate
                </Button>
            );
        }

        return <div className="flex flex-wrap gap-2">{actions}</div>;
    }, [confirmAndUpdateStatus]);

    const renderUserTable = () => {
        if (loading) {
            return <p className="text-center font-semibold">Loading users...</p>;
        }

        if (filteredUsers.length === 0) {
            return <p className="text-center font-semibold">No users found</p>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-green-100 border-b border-green-200">
                            <th className="p-2 text-left">S.N.</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Role</th>
                            <th className="p-2 text-left">Wallet</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr 
                                key={user.wallet} 
                                className="border-b border-green-100 hover:bg-green-50 transition-colors duration-200"
                            >
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">{Role[user.role]}</td>
                                <td className="p-2 font-mono text-xs break-all">{user.wallet}</td>
                                <td className="p-2">{UserStatus[user.status]}</td>
                                <td className="p-2">{renderActions(user.status, user.wallet)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg shadow-md border border-green-200">
            <div className="flex justify-between items-center mb-4">
                <div className="w-64">
                    <label className="block text-sm font-medium mb-1">Filter by Status</label>
                    <Select
                        value={selectedStatus.toString()}
                        onValueChange={(value: string) => setSelectedStatus(value === 'ALL' ? 'ALL' : Number(value))}
                    >
                        <SelectTrigger className="border-green-300 focus:border-green-500">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL" className="hover:bg-green-100">All Statuses</SelectItem>
                            {Object.values(UserStatus)
                                .filter(status => typeof status === 'number')
                                .map((status) => (
                                    <SelectItem 
                                        key={status} 
                                        value={status.toString()} 
                                        className="hover:bg-green-100"
                                    >
                                        {UserStatus[status as UserStatus]}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <button 
                    onClick={fetchUsers} 
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* User Table */}
            <div className="mt-4">
                {renderUserTable()}
            </div>

            {confirmAction && (
                <ConfirmDialog
                    message={confirmMessage}
                    onConfirm={confirmAction}
                    onCancel={() => setConfirmAction(null)}
                />
            )}

            {doneMessage && (
                <DoneDialog
                    message={doneMessage}
                    onDone={() => setDoneMessage(null)}
                />
            )}
        </div>
    );
}

export default UserList;
