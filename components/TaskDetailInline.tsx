import { Task } from "../lib/api";

interface TaskDetailInlineProps {
    currentTask: Task;
    history: Task[];
    onForward: (task: Task) => void;
}

export default function TaskDetailInline({ currentTask, history, onForward }: TaskDetailInlineProps) {
    // Filter history to show only relevant items (excluding the current pending one if it's already in the main row)
    // Actually, standard practice is to show the full timeline including the current step at the top or bottom.
    // The image shows a "timeline" below.

    return (
        <div className="bg-slate-50/80 rounded-b-2xl p-4 mb-3 mx-2 -mt-3 border-x border-b border-indigo-100 shadow-inner relative z-0 animate-in slide-in-from-top-2 duration-200">

            {/* Note Section */}
            <div className="mb-4">
                <p className="text-xs text-orange-600 font-bold mb-1">*note: ไม่นำเสนอ*</p>
                <p className="text-xs text-slate-500">บันทึกการส่งต่อ</p>
            </div>

            {/* Action Button Area */}
            {currentTask.status === 'Pending' && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onForward(currentTask);
                        }}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs py-2 px-4 rounded-full flex items-center gap-2 transition-colors font-bold"
                    >
                        <span>✏️</span> ส่งต่อเอกสาร
                    </button>
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-3">
                {history.map((h, i) => (
                    <div key={h.id} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm relative">
                        {/* Connector Line (Virtual) */}
                        {i < history.length - 1 && (
                            <div className="absolute left-6 bottom-[-14px] w-0.5 h-4 bg-slate-200 z-0"></div>
                        )}

                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-md ${h.status === 'Done' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {h.status === 'Done' ? 'ผู้ตรวจ' : 'ผู้จัดทำ'}
                                </span>
                                <span className="text-sm font-bold text-slate-700">{h.assignedToName}</span>
                                {h.status === 'Done' && (
                                    <>
                                        <span className="text-slate-400 text-xs">➔</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-700`}>
                                            ผู้ตรวจ
                                        </span>
                                        <span className="text-sm font-bold text-slate-700">พี่จิ๋ม (Mock)</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-1 flex gap-2 text-[10px] text-slate-400">
                            <span>#{i + 1}</span>
                            <span>13 ม.ค. 2569 • 14:01 น.</span>
                        </div>

                        {h.remark && (
                            <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                {h.remark}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
