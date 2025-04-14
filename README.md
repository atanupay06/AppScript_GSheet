# Leave Management Automation with Google Apps Script
📋 Overview
  This Google Apps Script automates the leave management process within a Google Sheet. It handles leave requests, approvals, rejections, and sends email notifications based on predefined business rules.​

🚀 Features
  Automated Leave Processing: Automatically processes leave requests entered in the sheet.​

Approval Thresholds: Enforces a maximum number of approved leaves per day.​

Email Notifications: Sends approval or rejection emails to employees and notifies relevant managers.​

Manual Overrides: Allows authorized personnel to manually approve or reject leave requests.​

Access Control: Restricts approval actions to designated users.​

Audit Trail: Logs processed requests for transparency and record-keeping.​
Reddit
+3
GitHub
+3
GitHub
+3

🛠️ How It Works
Leave Request Entry: Employees enter their leave requests (e.g., 'PL' for Paid Leave, 'P-Half' for Half-day Leave) in the designated columns of the Google Sheet.​

Trigger Activation: The onEdit trigger activates when a cell within the leave request range is edited.​

Validation and Processing:

Checks if the user is authorized to approve leaves.​

Counts existing approved leaves for the selected date.​

Determines if the new request exceeds the daily leave limit.​

Email Notifications:

Approval: If within limits, sends an approval email to the employee and CCs relevant managers.​

Rejection: If limits are exceeded, marks the request as 'Rejected' and notifies the employee and managers.​

Manual Overrides: Authorized users can manually change the status to 'Approved' or 'Approved Half' via a dropdown, triggering the same validation and notification process.​

