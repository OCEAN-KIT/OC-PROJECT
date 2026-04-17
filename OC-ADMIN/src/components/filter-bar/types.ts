export type Status = "all" | "pending" | "approved" | "rejected";

export type FilterState = {
  status: Status;
  dateFrom: string | null; // YYYY-MM-DD
  dateTo: string | null; // YYYY-MM-DD
  q: string;
};
