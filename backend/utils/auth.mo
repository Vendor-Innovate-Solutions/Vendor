import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";

module {
  public type AuthSession = {
    user : Principal;
    created_at : Int;
    expires_at : Int;
    groups : [Text];
  };

  public func isAuthenticated(caller : Principal) : Bool {
    // Placeholder: In production, use ICP identity or token validation
    Principal.toText(caller) != "2vxsx-fae"
  };

  public func hasRole(sessions : [AuthSession], caller : Principal, role : Text) : Bool {
    switch (Array.find<AuthSession>(sessions, func(s) { s.user == caller })) {
      case null { false };
      case (?session) {
        Array.find<Text>(session.groups, func(g) { g == role }) != null
      };
    }
  };

  public func createSession(sessions : [AuthSession], user : Principal, groups : [Text]) : ([AuthSession], AuthSession) {
    let now = Time.now();
    let session = {
      user = user;
      created_at = now;
      expires_at = now + (24 * 60 * 60 * 1000_000_000); // 24 hours in nanoseconds
      groups = groups;
    };
    let newSessions = Array.append(sessions, [session]);
    (newSessions, session)
  };

  public func getSession(sessions : [AuthSession], user : Principal) : ?AuthSession {
    let now = Time.now();
    Array.find<AuthSession>(sessions, func(s) { 
      s.user == user and s.expires_at > now 
    })
  };

  public func removeSession(sessions : [AuthSession], user : Principal) : ([AuthSession], Bool) {
    let newSessions = Array.filter<AuthSession>(sessions, func(s) { s.user != user });
    let removed = newSessions.size() < sessions.size();
    (newSessions, removed)
  };

  public func isAdmin(sessions : [AuthSession], caller : Principal) : Bool {
    hasRole(sessions, caller, "admin")
  };

  public func isEmployee(sessions : [AuthSession], caller : Principal) : Bool {
    hasRole(sessions, caller, "employee")
  };

  public func generateOTP() : Text {
    // Generate a simple 6-digit OTP (in production, use proper random generation)
    "123456"
  };

  public func validatePassword(password : Text) : Bool {
    // Basic password validation (in production, implement proper validation)
    Text.size(password) >= 6
  };

  public func hashPassword(password : Text) : Text {
    // Placeholder for password hashing (in production, use proper hashing)
    "hashed_" # password
  };
}
