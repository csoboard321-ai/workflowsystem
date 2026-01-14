"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import TaskGroupCard from "../components/TaskGroupCard";
import ForwardTaskModal from "../components/ForwardTaskModal";
import { Task, forwardTask, getTasks } from "../lib/api";
import { useLiff } from "../components/LiffProvider";
import { registerUser } from "../lib/register";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Expanded state
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { isLoggedIn, profile, error: liffError } = useLiff();
  const [isRegistering, setIsRegistering] = useState(false);

  // Fetch tasks
  useEffect(() => {
    getTasks().then((fetchedTasks) => {
      setTasks(fetchedTasks);
    }).finally(() => {
      setIsFetching(false);
    });
  }, []);

  // Register user
  useEffect(() => {
    if (isLoggedIn && profile) {
      setIsRegistering(true);
      registerUser(profile.userId, profile.displayName)
        .then((res) => console.log("Registration:", res))
        .finally(() => setIsRegistering(false));
    }
  }, [isLoggedIn, profile]);

  const currentUserName = profile ? profile.displayName : "User A (Guest)";

  // Grouping Logic
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.mainTask]) {
      acc[task.mainTask] = [];
    }
    acc[task.mainTask].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  /* Safe grouping logic */
  const processGroupTasks = (groupTasks: Task[]) => {
    // 1. Group by SubTask Name
    const subGroups = groupTasks.reduce((acc, t) => {
      const key = t.subTask ? String(t.subTask) : "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
      return acc;
    }, {} as Record<string, Task[]>);

    // 2. Return the "Latest" task for each subtask
    return Object.values(subGroups).map(subList => {
      const pending = subList.find(t => t.status === 'Pending');
      if (pending) return pending;
      return subList[subList.length - 1];
    });
  };

  /* History Map Logic */
  const historyMap = tasks.reduce((acc, t) => {
    const key = (t.subTask ? String(t.subTask) : "Unknown") + t.mainTask;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleTaskClick = (task: Task) => {
    // Toggle expansion
    if (expandedTaskId === task.id) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(task.id);
    }
  };

  const handleForwardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleConfirmForward = async (nextUserName: string, remark: string) => {
    if (!selectedTask) return;

    setLoading(true);
    const result = await forwardTask(selectedTask.id, remark, nextUserName, currentUserName);
    setLoading(false);

    if (result.success) {
      setTasks((prev) => {
        const updated = prev.map(t => t.id === selectedTask.id ? { ...t, status: 'Done' as const, remark } : t);
        const newTask: Task = {
          id: result.newId || "temp-" + Date.now(),
          mainTask: selectedTask.mainTask,
          subTask: selectedTask.subTask,
          assignedToName: nextUserName,
          status: 'Pending',
          sentBy: currentUserName
        };
        return [...updated, newTask];
      });
      setIsModalOpen(false);
      setSelectedTask(null);
    } else {
      alert("Error: " + result.error);
    }
  };

  // Calculate stats
  const totalTasks = tasks.length; // Approximate
  const completedTasks = tasks.filter(t => t.status === 'Done').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-50 to-transparent -z-10"></div>

      <div className="max-w-md mx-auto p-4">
        <DashboardHeader
          profile={profile ? profile : null}
          totalTasks={tasks.length}
          completedTasks={completedTasks}
        />

        {isFetching ? (
          <div className="text-center text-slate-400 py-10">Loading tasks...</div>
        ) : (
          Object.entries(groupedTasks).map(([mainTaskName, groupTasks]) => {
            const latestSubTasks = processGroupTasks(groupTasks);
            return (
              <TaskGroupCard
                key={mainTaskName}
                mainTaskName={mainTaskName}
                tasks={latestSubTasks}
                expandedTaskId={expandedTaskId}
                historyMap={historyMap}
                onTaskClick={handleTaskClick}
                onForwardClick={handleForwardClick}
              />
            );
          })
        )}

        <ForwardTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmForward}
          loading={loading}
        />
      </div>
    </div>
  );
}
