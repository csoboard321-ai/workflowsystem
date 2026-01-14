# Task Forwarding Workflow Instructions

## Overview
We have added a new feature to forward tasks to other users with a remark. This requires updates to both your Google Sheet/Apps Script backend and your Next.js frontend.

## 1. Backend Updates (Google Apps Script)

1.  **Open your Google Sheet** for the Task Management System.
2.  Go to **Extensions > Apps Script**.
3.  **Update columns**: Ensure your `Tasks` sheet has the following columns (headers) in this order (or adjust the script accordingly):
    -   `id`
    -   `mainTask`
    -   `subTask`
    -   `assignedToName`
    -   `status`
    -   `remark`
    -   `sentBy`
    -   `notificationStatus`
    
4.  **Create `Users` Sheet**:
    -   Create a new tab named `Users`.
    -   Add headers: `lineUserId` (Col A), `displayName` (Col B), `registeredAt` (Col C).
    -   Add some dummy data (e.g., your own name/ID) to test.
    
5.  **Copy Code**: Copy the content of the file `backend/Code.gs` from this project and paste it into your Google Apps Script editor (replace existing `Code.gs` or add as new if modular).
5.  **Deploy as Web App**:
    -   Click the blue **Deploy** button > **New deployment**.
    -   Select type: **Web app**.
    -   Description: "Task Forwarding Update".
    -   **Execute as**: Me (your email).
    -   **Who has access**: Anyone.
    -   Click **Deploy**.
6.  **Copy the Web App URL**.

## 2. Frontend Updates

1.  **Configure Environment**:
    -   Create a file named `.env.local` in the root of your project (`/Users/tor/Library/CloudStorage/OneDrive-Personal/เอกสาร/AntiGravity/workflowsystem/`).
    -   Add the following line:
        ```
        NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
        ```
    -   *Replace the URL with the one you copied in step 1.6.*

2.  **Run the App**:
    -   Run `npm run dev` in your terminal.
    -   The app will use mock data if the URL is not set or fails.
    -   When connected, it will fetch users and forward tasks using your Google Sheet.

## 3. Usage
-   Click "Mark Done & Forward" on a pending task.
-   Select the user to assign the next step to.
-   Add a remark about what you did or what needs to be done.
-   Confirm. The task status updates to "Done" and a new task is created.
-   Confirm. The task status updates to "Done" and a new task is created.

## 4. LINE LIFF Setup

1.  **Create a Channel**: Go to [LINE Developers Console](https://developers.line.biz/), create a provider and a channel of type **LINE Login**.
2.  **LIFF App**:
    -   Go to the **LIFF** tab.
    -   Click **Add**.
    -   Size: Full, Tall, or Compact (Tall recommended).
    -   Endpoint URL: Your deployed Vercel URL (e.g., `https://your-domain.vercel.app`) or `https://localhost:3000` for testing (needs https, use ngrok or similar if testing on mobile, or just ignore if testing on mock).
    -   Scopes: `profile`, `openid`.
    -   **Copy the LIFF ID**.
3.  **Environment Variable**:
    -   Add this to your `.env.local` file:
        ```
        NEXT_PUBLIC_LIFF_ID=your-liff-id-here
        ```
    -   Restart the dev server (`Ctrl+C` then `npm run dev`).
4.  **Backend Update**:
    -   Ensure you have redeployed the GAS Web App (Step 1.5) to include the `registerUser` function.
