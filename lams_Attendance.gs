function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var editedValue = range.getValue();
  var userEmail = Session.getActiveUser().getEmail();
  // Ensure the edit is in the range of the leave dates
  if (range.getRow() > 3 && range.getColumn() >= 5 && range.getColumn() <= 36) {
    var leaveDate = sheet.getRange(3, range.getColumn()).getValue();
    var leaveType = range.getValue();
    const startColumn = 5; // Column E
    const endColumn = 35;
    var allowedUser = "subhojit.banerjee@imerit.net"; // Replace with the authorized user's email
  
    if (range.getColumn() >= startColumn && range.getColumn() <= endColumn && (editedValue === "Approved" || editedValue === "Approved Half")) {
    if (userEmail !== allowedUser) {
        // Revert the change for unauthorized users
        range.setValue("Rejected"); // Default value
        SpreadsheetApp.getActiveSpreadsheet().toast(
          "You are not authorized to select 'Approved'.",
          "Access Denied",
          5
        );
      }
    }

    if (leaveType === 'PL' || leaveType === 'P-Half') {
      var row = range.getRow();
      var empID = sheet.getRange(row, 1).getValue();
      var empName = sheet.getRange(row, 2).getValue();
      var empEmail = sheet.getRange(row, 3).getValue();
      var formattedDate = Utilities.formatDate(new Date(leaveDate), Session.getScriptTimeZone(), 'EEE MMM dd yyyy');

      // Check existing approvals
      var approvalCount = getLeaveCount(sheet, range.getColumn());
      var approvalStatusColumn = 36; // Column AJ

      // Clear previous processed status if a new leave request is being made
      var emailSent = sheet.getRange(row, approvalStatusColumn).getValue();

      if (emailSent === 'Processed') {
        // Clear previous processed status
        sheet.getRange(row, approvalStatusColumn).setValue('');
      }

      // Re-check leave count after clearing previous status
      approvalCount = getLeaveCount(sheet, range.getColumn());

      if (approvalCount <= 1) {
        // Send approval email
        MailApp.sendEmail({
          to: empEmail,
          cc: 'subhojit.banerjee@imerit.net, jenif.mo@imerit.net',
          subject: 'Leave Approved - ' + formattedDate + ' - ' + empName,
          body: 'Dear ' + empName + ',\n\nYour leave request for ' + formattedDate + ' has been approved.\n\nPlease note, this is an auto-generated mail. Your leave approval will be officially reflected in the sheet after confirmation from L1. While your leave has been approved, it is subject to cancellation at any time due to business needs.\n\nBest Regards,\nSTE Team'
        });
        sheet.getRange(row, approvalStatusColumn).setValue('Processed');
      } else if (approvalCount > 1) {
        // Replace "PL" or "P-HL" with "Rejected"
        sheet.getRange(row, range.getColumn()).setValue('Rejected');
        
        // Debugging line to ensure the script is reaching this point
        Logger.log('Entry changed to Rejected for ' + empName + ' on ' + formattedDate);

        // Send rejection email
        MailApp.sendEmail({
          to: empEmail,
          cc: 'subhojit.banerjee@imerit.net, anupam.da@imerit.net, atanu.p@imerit.net',
          subject: 'Leave Request - Reconsideration Needed - ' + formattedDate + ' - ' + empName,
          body: 'Dear ' + empName + ',\n\nYour leave request for ' + formattedDate + ' only one leave is allowed on that date, and it has already been approved. The request has been marked as "Rejected". Please contact your team lead or manager for further consideration.\n\nBest Regards,\nSTE Team'
        });
        sheet.getRange(row, approvalStatusColumn).setValue('Processed');
      }
    }
  }
}

function getLeaveCount(sheet, col) {
  var lastRow = sheet.getLastRow();
  var leaveRequests = sheet.getRange(4, col, lastRow - 3).getValues().flat();
  var leaveCount = leaveRequests.filter(function (val) {
    return val === 'PL' || val === 'P-Half';
  }).length;
  return leaveCount;
}
