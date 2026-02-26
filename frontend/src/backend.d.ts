import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactMessage {
    messageId: string;
    agentId: string;
    sender: Principal;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface InsuranceInquiry {
    status: InquiryStatus;
    insuranceType: InsuranceType;
    user: Principal;
    timestamp: Time;
    details: string;
    inquiryId: string;
}
export interface Agent {
    name: string;
    agentId: string;
    email: string;
    specialization: Array<InsuranceType>;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface InsurancePlan {
    insuranceType: InsuranceType;
    features: Array<string>;
    premium: bigint;
    planId: string;
    name: string;
    coverageAmount: bigint;
}
export enum InquiryStatus {
    resolved = "resolved",
    pending = "pending",
    inReview = "inReview"
}
export enum InsuranceType {
    auto = "auto",
    home = "home",
    life = "life",
    health = "health"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAgent(agent: Agent): Promise<void>;
    addInsurancePlan(plan: InsurancePlan): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllAgents(): Promise<Array<Agent>>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllInsuranceInquiries(): Promise<Array<InsuranceInquiry>>;
    getAllInsurancePlans(): Promise<Array<InsurancePlan>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessagesForAgent(agentId: string): Promise<Array<ContactMessage>>;
    getInsuranceInquiriesByType(insuranceType: InsuranceType): Promise<Array<InsuranceInquiry>>;
    getInsurancePlansByType(insuranceType: InsuranceType): Promise<Array<InsurancePlan>>;
    getMyInsuranceInquiries(): Promise<Array<InsuranceInquiry>>;
    getPendingInsuranceInquiries(): Promise<Array<InsuranceInquiry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessageToAgent(agentId: string, message: string): Promise<string>;
    submitInsuranceInquiry(insuranceType: InsuranceType, details: string): Promise<string>;
    updateInquiryStatus(inquiryId: string, status: InquiryStatus): Promise<void>;
}
