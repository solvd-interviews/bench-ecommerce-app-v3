import { User } from "@/lib/models/UserModel";

export interface UserTableState {
  isLoading: boolean;
  page: number;
  totalPages: undefined | number;
  currentUsers: User[];
  limit: number;
  sort: {
    prop: string;
    order: "asc" | "desc";
  };
}

export interface Filter {
  id: number | null;
  name: string | null;
  createDate: Date | string | null;
  updatedDate: Date | string | null;
  email: string | null;
  isAdmin: boolean | null;
  isBlocked: boolean | null;
}
