import { Category } from "./category.model";
import { User } from "./user.model";

export type ReportStatus = "new" | "in_progress" | "done" | "rejected";
export type ReportPriority = "low" | "medium" | "high";

export interface ReportStatusHistoryItem {
  id: number;
  old_status: string;
  old_status_display: string;
  new_status: string;
  new_status_display: string;
  changed_by: User | null;
  note: string;
  created_at: string;
}

export interface Comment {
  id: number;
  report?: number;
  user: User;
  text: string;
  created_at: string;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  category: Category;
  status: ReportStatus;
  status_display: string;
  priority: ReportPriority;
  priority_display: string;
  address: string;
  image: string | null;
  user: User;
  lat: number;
  lng: number;
  created_at: string;
  updated_at: string;
  status_history?: ReportStatusHistoryItem[];
  comments?: Comment[];
}

export interface PaginatedResponse<T> {
  count: number;
  num_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ReportFilters {
  status?: ReportStatus | "";
  category?: number | "";
  bbox?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  mine?: boolean;
}

export interface CreateReportPayload {
  title: string;
  description: string;
  category: number;
  priority: ReportPriority;
  address: string;
  lat: number;
  lng: number;
  image?: File | null;
}

export interface StatsOverview {
  total: number;
  by_status: { status: ReportStatus; count: number }[];
  by_category: {
    category__id: number;
    category__name: string;
    category__color: string;
    count: number;
  }[];
  monthly_trend: { month: string; count: number }[];
  top_areas: { address: string; count: number }[];
  total_categories: number;
}
