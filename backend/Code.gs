function doGet() {
  return HtmlService.createHtmlOutput("Backend API is running.");
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  if (action === 'getUsers') {
    return getUsers();
  } else if (action === 'forwardTask') {
    return forwardTask(data);
  } else if (action === 'registerUser') {
    return registerUser(data);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
  }
}

function registerUser(data) {
  const { lineUserId, displayName } = data;
  if (!lineUserId || !displayName) {
     return ContentService.createTextOutput(JSON.stringify({ error: "Missing data" })).setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Users");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Users sheet missing" })).setMimeType(ContentService.MimeType.JSON);
  }

  const values = sheet.getDataRange().getValues();
  // Check if user already exists
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === lineUserId) {
      // User exists, maybe update display name? For now just return success.
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "User already registered", id: lineUserId })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Append new user
  sheet.appendRow([lineUserId, displayName, new Date()]);

  return ContentService.createTextOutput(JSON.stringify({ success: true, message: "User registered", id: lineUserId })).setMimeType(ContentService.MimeType.JSON);
}

function getUsers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Users");
  
  if (!sheet) {
    // Fallback if sheet doesn't exist yet, avoiding crashing
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const users = [];

  // Assuming Row 1 is headers: lineUserId | displayName | registeredAt
  for (let i = 1; i < data.length; i++) {
    const lineUserId = data[i][0];
    const displayName = data[i][1];

    if (lineUserId && displayName) {
      users.push({ 
        name: displayName, 
        id: lineUserId 
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(users)).setMimeType(ContentService.MimeType.JSON);
}

function forwardTask(data) {
  const { currentTaskId, remark, nextUserName, currentUserName } = data;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Tasks");
  const currentData = sheet.getDataRange().getValues();
  
  let rowToUpdate = -1;
  let mainTask = "";
  let subTask = "";
  
  // 1. Find the current row
  // Assuming ID is in column 1 (index 0)
  for (let i = 1; i < currentData.length; i++) {
    if (currentData[i][0] == currentTaskId) {
      rowToUpdate = i + 1; // 1-based index
      mainTask = currentData[i][1];
      subTask = currentData[i][2];
      break;
    }
  }
  
  if (rowToUpdate === -1) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Task not found" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 2. Update status to 'Done' and remark
  // Columns: id(1), mainTask(2), subTask(3), assignedToName(4), status(5), remark(6), sentBy(7), notificationStatus(8)
  sheet.getRange(rowToUpdate, 5).setValue("Done");
  sheet.getRange(rowToUpdate, 6).setValue(remark);
  
  // 3. Create a NEW ROW
  const newId = Utilities.getUuid();
  const newRow = [
    newId,
    mainTask,
    subTask,
    nextUserName,
    "Pending",
    "", // remark empty for new task
    currentUserName,
    "" // notificationStatus empty
  ];
  
  sheet.appendRow(newRow);
  
  return ContentService.createTextOutput(JSON.stringify({ success: true, newId: newId })).setMimeType(ContentService.MimeType.JSON);
}
