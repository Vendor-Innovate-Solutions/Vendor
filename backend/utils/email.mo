import Text "mo:base/Text";
import Time "mo:base/Time";

module {
  public type EmailRequest = {
    to : Text;
    subject : Text;
    body : Text;
    email_type : Text; // "otp", "invite", "notification", "password_reset"
  };

  public type EmailResult = {
    success : Bool;
    message : Text;
    sent_at : Int;
  };

  public func sendEmail(to : Text, subject : Text, body : Text) : async EmailResult {
    // Placeholder: Email sending is not natively supported on ICP. 
    // Integrate with an external service if needed via HTTP outcalls
    {
      success = true;
      message = "Email sent successfully";
      sent_at = Time.now();
    }
  };

  public func sendOTPEmail(to : Text, otp : Text, username : Text) : async EmailResult {
    let subject = "Password Reset OTP - Vendor Dapp";
    let body = "Dear " # username # ",\n\n" #
               "Your OTP for password reset is: " # otp # "\n\n" #
               "This OTP is valid for 10 minutes.\n\n" #
               "If you didn't request this, please ignore this email.\n\n" #
               "Best regards,\nVendor Dapp Team";
    await sendEmail(to, subject, body)
  };

  public func sendCompanyInviteEmail(to : Text, company_name : Text, invite_code : Text, message : Text) : async EmailResult {
    let subject = "Invitation to join " # company_name # " - Vendor Dapp";
    let body = "You have been invited to join " # company_name # " on Vendor Dapp.\n\n" #
               "Message: " # message # "\n\n" #
               "Use invite code: " # invite_code # "\n\n" #
               "Join now and start your business partnership!\n\n" #
               "Best regards,\nVendor Dapp Team";
    await sendEmail(to, subject, body)
  };

  public func sendPasswordResetConfirmation(to : Text, username : Text) : async EmailResult {
    let subject = "Password Reset Successful - Vendor Dapp";
    let body = "Dear " # username # ",\n\n" #
               "Your password has been successfully reset.\n\n" #
               "If you didn't make this change, please contact support immediately.\n\n" #
               "Best regards,\nVendor Dapp Team";
    await sendEmail(to, subject, body)
  };

  public func sendRequestStatusEmail(to : Text, company_name : Text, approved : Bool) : async EmailResult {
    let subject = if (approved) "Request Approved" else "Request Rejected";
    let status = if (approved) "approved" else "rejected";
    let body = "Your request to join " # company_name # " has been " # status # ".\n\n" #
               (if (approved) "You can now start doing business with them!" else "Feel free to try with other companies.") # "\n\n" #
               "Best regards,\nVendor Dapp Team";
    await sendEmail(to, subject, body)
  };

  public func sendOrderNotification(to : Text, order_id : Text, status : Text) : async EmailResult {
    let subject = "Order Update #" # order_id;
    let body = "Your order #" # order_id # " status has been updated to: " # status # "\n\n" #
               "Best regards,\nVendor Dapp Team";
    await sendEmail(to, subject, body)
  };
}
