import { Task } from "../lib/api";
import TaskRow from "./TaskRow";
import TaskDetailInline from "./TaskDetailInline";

interface TaskGroupCardProps {
    mainTaskName: string;
    tasks: Task[];
    expandedTaskId: string | null;
    historyMap: Record<string, Task[]>;
    onTaskClick: (task: Task) => void;
    onForwardClick: (task: Task) => void;
}

export default function TaskGroupCard({
    mainTaskName,
    tasks,
    expandedTaskId,
    historyMap,
    onTaskClick,
    onForwardClick
}: TaskGroupCardProps) {
    // Calculate specific stats for this group if needed
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'Done').length;

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4 h-fit">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{mainTaskName}</h3>
                    <p className="text-xs text-slate-400 mt-1">สรุปภาพรวม</p>
                </div>
                <div className="text-right">
                    <span className={`text-sm font-bold ${done === total ? 'text-emerald-500' : 'text-indigo-500'}`}>
                        เสร็จ {done}/{total}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
                <div
                    className={`h-full rounded-full ${done === total ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                    style={{ width: `${(done / total) * 100}%` }}
                ></div>
            </div>

            {/* Modification Date / Context info (Mocked based on image) */}
            <div className="mb-4 bg-orange-50 p-3 rounded-xl flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">⚡</span>
                <div>
                    <p className="text-xs font-bold text-slate-700">ครั้งที่ 1-1/69</p>
                    <p className="text-[10px] text-slate-500">ส่งออกจาก ลออ. ภายในวันที่ 21 ม.ค. 2569</p>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-1">
                {/* Header for list */}
                <div className="flex justify-between px-3 mb-2 text-[10px] text-slate-400 font-medium">
                    <span>วาระ / ผู้จัดทำ</span>
                    <span>สถานะล่าสุด</span>
                </div>

                {tasks.map(task => {
                    const isExpanded = expandedTaskId === task.id;
                    return (
                        <div key={task.id}>
                            <TaskRow
                                task={task}
                                onClick={onTaskClick}
                            />
                            {isExpanded && (
                                <TaskDetailInline
                                    currentTask={task}
                                    history={historyMap[task.subTask + task.mainTask] || []}
                                    onForward={onForwardClick}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
