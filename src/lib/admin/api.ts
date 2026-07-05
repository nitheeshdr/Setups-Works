import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error || err.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit?: number;
  unread?: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
}

function toQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const resourceApi = <T>(resource: string) => ({
  list: (params?: ListParams) =>
    api.get<Paginated<T>>(`/${resource}${toQuery(params)}`).then((r) => r.data),
  get: (id: string) => api.get<T>(`/${resource}/${id}`).then((r) => r.data),
  create: (data: Partial<T>) =>
    api.post<T>(`/${resource}`, data).then((r) => r.data),
  update: (id: string, data: Partial<T>) =>
    api.put<T>(`/${resource}/${id}`, data).then((r) => r.data),
  remove: (id: string) =>
    api.delete(`/${resource}/${id}`).then((r) => r.data),
});

export async function uploadFile(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<{ url: string }>("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export function exportCsv(resource: string) {
  window.open(`/api/${resource}?export=csv`, "_blank");
}
