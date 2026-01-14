import { User } from "./api"; // Re-using User interface if compatible, or define new one

const GAS_API_URL = process.env.NEXT_PUBLIC_GAS_API_URL || '';

export async function registerUser(lineUserId: string, displayName: string): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!GAS_API_URL) {
        console.log("Mocking registerUser:", { lineUserId, displayName });
        return { success: true, message: "Mock registration success" };
    }

    try {
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "registerUser",
                lineUserId,
                displayName,
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error registering user:", error);
        return { success: false, error: String(error) };
    }
}
