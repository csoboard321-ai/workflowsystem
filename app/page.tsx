"use client";

import { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import ForwardTaskModal from "../components/ForwardTaskModal";
import { Task, forwardTask } from "../lib/api";
import { useLiff } from "../components/LiffProvider";
import { registerUser } from "../lib/register";

// Mock initial data for demonstration purposes since we don't have a real GAS connection yet
// In a real app, this would be fetched inside a useEffect or Server Component
const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    mainTask: "Q1 Financial Report",
    subTask: "Data Compilation",
    assignedToName: "User A",
    status: "Pending",
  },
  {
    id: "2",
    mainTask: "Website Redesign",
    subTask: "Homepage Mockup",
    assignedToName: "User A",
    status: "Pending",
  },
  {
    id: "3",
    mainTask: "Client Meeting",
    subTask: "Prepare Presentation",
    assignedToName: "User B",
    status: "Done",
    remark: "Slides ready on drive",
    sentBy: "User A",
  },
];

export default function Home() {
  // Hardcoding "User A" as the current user for this demo if not logged in via LIFF
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskToForward, setTaskToForward] = useState<Task | null>(null);

  const { isLoggedIn, profile, error: liffError } = useLiff();
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (isLoggedIn && profile) {
      // Auto-register user
      setIsRegistering(true);
      registerUser(profile.userId, profile.displayName)
        .then((res) => {
          console.log("Registration result:", res);
        })
        .finally(() => setIsRegistering(false));
    }
  }, [isLoggedIn, profile]);

  const currentUserName = profile ? profile.displayName : "User A (Guest)";

  const handleForwardClick = (task: Task) => {
    setTaskToForward(task);
    setIsModalOpen(true);
  };

  const handleConfirmForward = async (nextUserName: string, remark: string) => {
    if (!taskToForward) return;

    setLoading(true);
    const result = await forwardTask(taskToForward.id, remark, nextUserName, currentUserName);
    setLoading(false);

    if (result.success) {
      // Optimistic API Update
      setTasks((prevTasks) => {
        // 1. Mark current task as Done and update remark
        const updatedTasks = prevTasks.map((t) =>
          t.id === taskToForward.id
            ? { ...t, status: 'Done' as const, remark: remark }
            : t
        );

        // 2. Add new forwarded task (simulated)
        // In a real app we might reload data, but here we just append locally for immediate feedback
        const newTask: Task = {
          id: result.newId || "temp-" + Date.now(),
          mainTask: taskToForward.mainTask,
          subTask: taskToForward.subTask,
          assignedToName: nextUserName,
          status: 'Pending',
          sentBy: currentUserName,
        };

        return [...updatedTasks, newTask];
      });

      setIsModalOpen(false);
      setTaskToForward(null);
    } else {
      alert("Failed to forward task: " + result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-white dark:bg-black font-sans p-8">
      <main className="w-full max-w-2xl">
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extralight tracking-tight text-zinc-900 dark:text-white mb-2">My Tasks</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-light">Manage and forward your assignments.</p>
          {isLoggedIn && profile && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-4">
              {profile.pictureUrl && (
                <img src={profile.pictureUrl} alt={profile.displayName} className="w-12 h-12 rounded-full" />
              )}
              <div>
                <p className="font-semibold">Welcome, {profile.displayName}!</p>
                {isRegistering && <p className="text-xs">Syncing profile...</p>}
              </div>
            </div>
          )}
          {liffError && (
            <div className="mt-2 text-red-500 text-sm">LIFF Error: {liffError}</div>
          )}
        </header>

        <section>
          <h2 className="text-xl font-semibold mb-4 dark:text-zinc-200">Pending</h2>
          {tasks.filter(t => t.status === 'Pending').length > 0 ? (
            tasks.filter(t => t.status === 'Pending').map(task => (
              <TaskCard key={task.id} task={task} onForward={handleForwardClick} />
            ))
          ) : (
            <p className="text-zinc-500 italic">No pending tasks.</p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-zinc-200">History / Done</h2>
          {tasks.filter(t => t.status === 'Done').map(task => (
            <TaskCard key={task.id} task={task} onForward={handleForwardClick} />
          ))}
        </section>

        <ForwardTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmForward}
          loading={loading}
        />
      </main>
    </div>
  );
}
