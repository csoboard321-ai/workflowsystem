import { Task } from "../lib/api";

interface TaskRowProps {
    task: Task;
    onClick: (task: Task) => void;
}

export default function TaskRow({ task, onClick }: TaskRowProps) {
    // Determine badge color based on status or assignee (simulating the 'pill' look)
    // If status is Done -> Grey or Green
    // If status is Pending -> Blue/Purple indicating "With Someone"

    const isDone = task.status === 'Done';
    const subTaskName = task.subTask ? String(task.subTask) : "";

    return (
        <div
            onClick={() => onClick(task)}
            className={`flex items-center justify-between p-3 mb-2 rounded-xl transition-all cursor-pointer border ${isDone ? 'bg-gray-50 border-transparent opacity-60' : 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50 hover:shadow-sm'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-gray-200 text-gray-500' : 'bg-white text-indigo-600 shadow-sm'}`}>
                    {/* Use part of ID or just a number if we had one. Using first char of SubTask as fallback */}
                    {subTaskName.substring(0, 3)}
                </div>
                <div>
                    <h4 className={`text-sm font-semibold ${isDone ? 'text-gray-500' : 'text-gray-900'}`}>{subTaskName}</h4>
                    {/* Optional small detail */}
                    {!isDone && <p className="text-[10px] text-gray-400">Updateล่าสุด</p>}
                </div>
            </div>

            <div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${isDone
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-indigo-100 text-indigo-600'
                    }`}>
                    {isDone ? 'จบ' : `อยู่กับ ${task.assignedToName}`}
                </span>
            </div>
        </div>
    );
}
