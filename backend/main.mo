import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type InsuranceType = {
    #health;
    #auto;
    #life;
    #home;
  };

  public type InquiryStatus = {
    #pending;
    #inReview;
    #resolved;
  };

  public type InsurancePlan = {
    planId : Text;
    name : Text;
    insuranceType : InsuranceType;
    features : [Text];
    coverageAmount : Nat;
    premium : Nat;
  };

  public type InsuranceInquiry = {
    inquiryId : Text;
    user : Principal;
    insuranceType : InsuranceType;
    status : InquiryStatus;
    details : Text;
    timestamp : Time.Time;
  };

  public type Agent = {
    agentId : Text;
    name : Text;
    specialization : [InsuranceType];
    phone : Text;
    email : Text;
  };

  public type ContactMessage = {
    messageId : Text;
    sender : Principal;
    agentId : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let insurancePlans = Map.empty<Text, InsurancePlan>();
  let insuranceInquiries = Map.empty<Text, InsuranceInquiry>();
  let agents = Map.empty<Text, Agent>();
  let contactMessages = Map.empty<Text, ContactMessage>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Insurance Plans - public read, admin write
  public query func getInsurancePlansByType(insuranceType : InsuranceType) : async [InsurancePlan] {
    insurancePlans.values().toArray().filter(
      func(plan : InsurancePlan) : Bool { plan.insuranceType == insuranceType }
    );
  };

  public query func getAllInsurancePlans() : async [InsurancePlan] {
    insurancePlans.values().toArray();
  };

  // Insurance Inquiries - users submit, admins manage
  public shared ({ caller }) func submitInsuranceInquiry(insuranceType : InsuranceType, details : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can submit insurance inquiries");
    };
    let inquiryId = "INQ-" # Time.now().toText();
    let inquiry : InsuranceInquiry = {
      inquiryId;
      user = caller;
      insuranceType;
      status = #pending;
      details;
      timestamp = Time.now();
    };
    insuranceInquiries.add(inquiryId, inquiry);
    inquiryId;
  };

  public query ({ caller }) func getMyInsuranceInquiries() : async [InsuranceInquiry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view their inquiries");
    };
    insuranceInquiries.values().toArray().filter(
      func(inquiry : InsuranceInquiry) : Bool { inquiry.user == caller }
    );
  };

  public query ({ caller }) func getInsuranceInquiriesByType(insuranceType : InsuranceType) : async [InsuranceInquiry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all inquiries by type");
    };
    insuranceInquiries.values().toArray().filter(
      func(inquiry : InsuranceInquiry) : Bool { inquiry.insuranceType == insuranceType }
    );
  };

  public query ({ caller }) func getPendingInsuranceInquiries() : async [InsuranceInquiry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view pending inquiries");
    };
    insuranceInquiries.values().toArray().filter(
      func(inquiry : InsuranceInquiry) : Bool { inquiry.status == #pending }
    );
  };

  public query ({ caller }) func getAllInsuranceInquiries() : async [InsuranceInquiry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all inquiries");
    };
    insuranceInquiries.values().toArray().sort(
      func(a : InsuranceInquiry, b : InsuranceInquiry) : Order.Order {
        if (a.timestamp < b.timestamp) #less
        else if (a.timestamp > b.timestamp) #greater
        else #equal;
      }
    );
  };

  // Agents - public read, admin write
  public query func getAllAgents() : async [Agent] {
    agents.values().toArray();
  };

  // Contact Messages - users send, admins read
  public shared ({ caller }) func sendMessageToAgent(agentId : Text, message : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can send messages to agents");
    };
    let messageId = "MSG-" # Time.now().toText();
    let contactMessage : ContactMessage = {
      messageId;
      sender = caller;
      agentId;
      message;
      timestamp = Time.now();
    };
    contactMessages.add(messageId, contactMessage);
    messageId;
  };

  public query ({ caller }) func getContactMessagesForAgent(agentId : Text) : async [ContactMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray().filter(
      func(msg : ContactMessage) : Bool { msg.agentId == agentId }
    );
  };

  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all contact messages");
    };
    contactMessages.values().toArray().sort(
      func(a : ContactMessage, b : ContactMessage) : Order.Order {
        if (a.timestamp < b.timestamp) #less
        else if (a.timestamp > b.timestamp) #greater
        else #equal;
      }
    );
  };

  // Admin Functions
  public shared ({ caller }) func addInsurancePlan(plan : InsurancePlan) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add insurance plans");
    };
    insurancePlans.add(plan.planId, plan);
  };

  public shared ({ caller }) func addAgent(agent : Agent) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add agents");
    };
    agents.add(agent.agentId, agent);
  };

  public shared ({ caller }) func updateInquiryStatus(inquiryId : Text, status : InquiryStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update inquiry status");
    };
    switch (insuranceInquiries.get(inquiryId)) {
      case (?inquiry) {
        let updatedInquiry = {
          inquiry with
          status
        };
        insuranceInquiries.add(inquiryId, updatedInquiry);
      };
      case (null) { Runtime.trap("Inquiry not found") };
    };
  };
};
