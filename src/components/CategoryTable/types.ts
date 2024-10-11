import { Category } from "@/lib/models/CategoryModel";

export interface CategoryTableState {
  isLoading: boolean;
  page: number;
  totalPages: undefined | number;
  currentCategories: Category[];
  limit: number;
}
