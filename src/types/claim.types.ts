
export type ClaimStatus =
  | "NEW"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CLOSED";

export interface Claim {
  id: string;
  claimNumber: string;
  customerName: string;
  policyNumber: string;
  claimType: string;
  claimAmount: number;
  currency: string;
  status: ClaimStatus;
  assignedTo: string;
  createdAt: string;
  memberStatus: "ACTIVE" | "INACTIVE";
}

export interface ClaimsQuery {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
}

export interface ClaimsResponse {
  data: Claim[];
  total: number;
  page: number;
  pageSize: number;
}
