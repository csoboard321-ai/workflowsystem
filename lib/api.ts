// Helper to call GAS backend
// NOTE: This URL should be the Web App URL from your Google Apps Script deployment.
// You might want to put this in .env.local
const GAS_API_URL = process.env.NEXT_PUBLIC_GAS_API_URL || '';

export interface User {
  name: string;
  id: string;
}

export interface Task {
  id: string;
  mainTask: string;
  subTask: string;
  assignedToName: string;
  status: 'Pending' | 'Done';
  remark?: string;
  sentBy?: string;
}

export async function getUsers(): Promise<User[]> {
  // Mock data for development if no URL is set
  if (!GAS_API_URL) {
    return [
      { name: "User A", id: "user_a" },
      { name: "User B", id: "user_b" },
      { name: "User C", id: "user_c" },
      { name: "Manager", id: "manager" }
    ];
  }

  try {
    const response = await fetch(GAS_API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "getUsers" }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getTasks(): Promise<Task[]> {
  if (!GAS_API_URL) {
    console.log("No GAS URL provided, returning empty list.");
    return [];
  }

  try {
    const response = await fetch(GAS_API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "getTasks" }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function forwardTask(
  currentTaskId: string,
  remark: string,
  nextUserName: string,
  currentUserName: string
): Promise<{ success: boolean; newId?: string; error?: string }> {

  if (!GAS_API_URL) {
    console.log("Mocking forwardTask call:", { currentTaskId, remark, nextUserName, currentUserName });
    return { success: true, newId: "mock-new-id-" + Date.now() };
  }

  try {
    const response = await fetch(GAS_API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "forwardTask",
        currentTaskId,
        remark,
        nextUserName,
        currentUserName,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error forwarding task:", error);
    return { success: false, error: String(error) };
  }
}
