
import { useCallback, useEffect, useState } from "react";
import type {
  Claim,
  ClaimsQuery,
} from "../../../types/claim.types";
import { getClaims } from "../services/claims.service";

export function useClaims() {
  const [rows, setRows] = useState<Claim[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState<ClaimsQuery>({
    page: 0,
    pageSize: 25,
    sortField: "createdAt",
    sortDirection: "desc",
    search: "",
  });

  const loadClaims = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getClaims(query);
      setRows(response.data);
      setRowCount(response.total);
    } catch (error) {
      console.error("Failed to load claims", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadClaims();
  }, [loadClaims]);

  const updateQuery = (changes: Partial<ClaimsQuery>) => {
    setQuery((previous) => ({
      ...previous,
      ...changes,
    }));
  };

  return {
    rows,
    rowCount,
    loading,
    query,
    updateQuery,
  };
}
