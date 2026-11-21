
import type {
  Claim,
  ClaimsQuery,
  ClaimsResponse,
} from "../../../types/claim.types";

import { mockClaims } from "../data/claims.mock";

export async function getClaims(
  query: ClaimsQuery
): Promise<ClaimsResponse> {
  const {
    page,
    pageSize,
    sortField,
    sortDirection,
    search,
  } = query;

  let result: Claim[] = [...mockClaims];

  // Search
  if (search?.trim()) {
    const term = search.toLowerCase();

    result = result.filter((claim) =>
      [
        claim.claimNumber,
        claim.customerName,
        claim.policyNumber,
        claim.claimType,
        claim.status,
      ].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  }

  // Sorting
  if (sortField) {
    result.sort((a, b) => {
      const first = a[sortField as keyof Claim];
      const second = b[sortField as keyof Claim];

      const comparison =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first ?? "").localeCompare(
              String(second ?? "")
            );

      return sortDirection === "desc"
        ? -comparison
        : comparison;
    });
  }

  // Pagination
  const total = result.length;
  const start = page * pageSize;

  const data = result.slice(start, start + pageSize);

  return {
    data,
    total,
    page,
    pageSize,
  };
}
