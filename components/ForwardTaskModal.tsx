"use client";

import { useState, useEffect } from "react";
import { User, getUsers } from "../lib/api";

interface ForwardTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (nextUserName: string, remark: string) => void;
    loading: boolean;
}

export default function ForwardTaskModal({ isOpen, onClose, onConfirm, loading }: ForwardTaskModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [remark, setRemark] = useState("");

    useEffect(() => {
        if (isOpen) {
            getUsers().then(setUsers);
            setRemark("");
            setSelectedUser("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        onConfirm(selectedUser, remark);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Forward Task</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Assign to</label>
                        <select
                            className="w-full border rounded p-2 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            required
                        >
                            <option value="">-- Select User --</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.name}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Remark</label>
                        <textarea
                            className="w-full border rounded p-2 h-24 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                            placeholder="Add a note..."
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#0056b3] text-white rounded hover:bg-[#004494] disabled:opacity-50"
                            disabled={loading || !selectedUser}
                        >
                            {loading ? "Forwarding..." : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
