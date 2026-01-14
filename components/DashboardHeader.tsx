interface Profile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
}

interface DashboardHeaderProps {
    profile: Profile | null;
    totalTasks: number;
    completedTasks: number;
}

export default function DashboardHeader({ profile, totalTasks, completedTasks }: DashboardHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white opacity-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">สถานะเอกสารประชุม...</h1>
                        {profile && (
                            <p className="text-indigo-100 text-sm">สวัสดี {profile.displayName}</p>
                        )}
                    </div>

                    {/* Quick Stats or Actions could go here */}
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 px-3">
                        <span className="text-xs font-medium">รอตรวจ {totalTasks - completedTasks}</span>
                    </div>
                </div>

                {/* Categories / Tabs simulation from image */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['Resume', 'ร่างรายงาน', 'Conduct', 'อื่นๆ'].map((tab, i) => (
                        <span key={i} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${i === 1 ? 'bg-white text-purple-600 shadow-sm' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                            {tab}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
