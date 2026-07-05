"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceApi, type ListParams, type Paginated } from "@/lib/admin/api";

export function useResourceList<T>(resource: string, params: ListParams = {}) {
  const rApi = resourceApi<T>(resource);
  return useQuery<Paginated<T>>({
    queryKey: [resource, params],
    queryFn: () => rApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useResourceItem<T>(resource: string, id?: string) {
  const rApi = resourceApi<T>(resource);
  return useQuery<T>({
    queryKey: [resource, "item", id],
    queryFn: () => rApi.get(id!),
    enabled: !!id,
  });
}

export function useResourceMutations<T>(resource: string, label = "Item") {
  const qc = useQueryClient();
  const rApi = resourceApi<T>(resource);
  const invalidate = () => qc.invalidateQueries({ queryKey: [resource] });

  const create = useMutation({
    mutationFn: (data: Partial<T>) => rApi.create(data),
    onSuccess: () => {
      invalidate();
      toast.success(`${label} created`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      rApi.update(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(`${label} updated`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => rApi.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success(`${label} deleted`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove };
}
