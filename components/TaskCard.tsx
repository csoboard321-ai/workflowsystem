"use client";

import { Task } from "../lib/api";

interface TaskCardProps {
    task: Task;
    onForward: (task: Task) => void;
}

export default function TaskCard({ task, onForward }: TaskCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{task.mainTask}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light">{task.subTask}</p>
                </div>
                <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full ${task.status === 'Done'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                    {task.status}
                </span>
            </div>

            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 space-y-1">
                <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                    It belongs to <span className="font-medium text-zinc-800 dark:text-zinc-200">{task.assignedToName}</span>
                </p>
                {task.sentBy && <p>Sent by: <span className="font-medium">{task.sentBy}</span></p>}
                {task.remark && (
                    <div className="mt-2 text-xs bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
                        <span className="font-semibold">Note:</span> {task.remark}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                {task.status === 'Pending' && (
                    <button
                        onClick={() => onForward(task)}
                        className="text-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 rounded hover:opacity-90 transition-opacity"
                    >
                        Mark Done & Forward
                    </button>
                )}
            </div>
        </div>
    );
}
