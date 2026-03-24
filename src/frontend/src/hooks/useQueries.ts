import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FoodOrderInput,
  OrderStatus,
  TaskStatus,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAgentName() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["agentName"],
    queryFn: async () => {
      if (!actor) return "Aria";
      return actor.getAIAgentName();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRestaurants() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRestaurants();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrderHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["orderHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTasks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRoutines() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["routines"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRoutines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderInput: FoodOrderInput) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.placeOrder(orderInput);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orderHistory"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
    }: { title: string; description: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createTask(title, description);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateTaskStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      taskStatus,
    }: { taskId: bigint; taskStatus: TaskStatus }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateTaskStatus(taskId, taskStatus);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useAddRoutine() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      scheduledTime,
    }: { name: string; scheduledTime: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addRoutine(name, scheduledTime);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routines"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteRoutine() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (routineId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteRoutine(routineId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routines"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useToggleRoutine() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      routineId,
      isActive,
    }: { routineId: bigint; isActive: boolean }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.toggleRoutine(routineId, isActive);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routines"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateAgentName() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newName: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateAIAgentName(newName);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agentName"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agentName"] });
    },
  });
}
