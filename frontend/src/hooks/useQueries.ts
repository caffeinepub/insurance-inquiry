import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  type UserProfile,
  type InsurancePlan,
  type InsuranceInquiry,
  type Agent as BackendAgent,
  type ContactMessage,
  InsuranceType,
  InquiryStatus,
} from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// ─── Insurance Plans ─────────────────────────────────────────────────────────

export function useGetAllInsurancePlans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InsurancePlan[]>({
    queryKey: ['insurancePlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInsurancePlans();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetInsurancePlansByType(insuranceType: InsuranceType | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InsurancePlan[]>({
    queryKey: ['insurancePlans', insuranceType],
    queryFn: async () => {
      if (!actor || !insuranceType) return [];
      return actor.getInsurancePlansByType(insuranceType);
    },
    enabled: !!actor && !actorFetching && !!insuranceType,
  });
}

// ─── Insurance Inquiries ─────────────────────────────────────────────────────

export function useSubmitInsuranceInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ insuranceType, details }: { insuranceType: InsuranceType; details: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInsuranceInquiry(insuranceType, details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInquiries'] });
      queryClient.invalidateQueries({ queryKey: ['allInquiries'] });
    },
  });
}

export function useGetMyInsuranceInquiries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InsuranceInquiry[]>({
    queryKey: ['myInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyInsuranceInquiries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllInsuranceInquiries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InsuranceInquiry[]>({
    queryKey: ['allInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInsuranceInquiries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetInsuranceInquiriesByType(insuranceType: InsuranceType | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InsuranceInquiry[]>({
    queryKey: ['allInquiries', 'byType', insuranceType],
    queryFn: async () => {
      if (!actor || !insuranceType) return [];
      return actor.getInsuranceInquiriesByType(insuranceType);
    },
    enabled: !!actor && !actorFetching && !!insuranceType,
  });
}

export function useUpdateInquiryStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inquiryId, status }: { inquiryId: string; status: InquiryStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateInquiryStatus(inquiryId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allInquiries'] });
    },
  });
}

// ─── Agents ──────────────────────────────────────────────────────────────────

export function useGetAllAgents() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BackendAgent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      if (!actor) return [];
      // Cast through unknown to resolve the naming conflict between
      // @dfinity/agent's Agent type and our backend's Agent type.
      return (await actor.getAllAgents()) as unknown as BackendAgent[];
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export function useSendMessageToAgent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, message }: { agentId: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessageToAgent(agentId, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}

export function useGetAllContactMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactMessages();
    },
    enabled: !!actor && !actorFetching,
  });
}
