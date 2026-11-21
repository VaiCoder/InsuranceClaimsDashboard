import { useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from "@mui/x-data-grid";
import {
  Box,
  Chip,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useClaims } from "../hooks/useClaims";
import type { Claim } from "../../../types/claim.types";
import { useNavigate } from "react-router-dom";

const columns: GridColDef<Claim>[] = [
  {
    field: "customerName",
    headerName: "Customer Name",
    minWidth: 160,
    flex: 1,
  },
  {
    field: "customerName",
    headerName: "Company",
    minWidth: 160,
    flex: 1,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    minWidth: 160,
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 260,
    flex: 1,
  },
  {
    field: "country",
    headerName: "Country",
    minWidth: 90,
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 140,
    renderCell: (params) => (
      <Chip
        label={String(params.value).replace("_", " ")}
        size="small"
        color={
          params.value === "APPROVED"
            ? "success"
            : params.value === "REJECTED"
              ? "error"
              : params.value === "IN_REVIEW"
                ? "warning"
                : "default"
        }
      />
    ),
  },
  {
    field: "claimNumber",
    headerName: "Claim Number",
    minWidth: 160,
    flex: 1,
  },
  {
    field: "policyNumber",
    headerName: "Policy Number",
    minWidth: 150,
    flex: 1,
  },
  {
    field: "claimType",
    headerName: "Claim Type",
    minWidth: 170,
    flex: 1,
  },
  {
    field: "claimAmount",
    headerName: "Claim Amount",
    minWidth: 150,
    type: "number",
    valueFormatter: (value) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value)),
  },
  {
    field: "assignedTo",
    headerName: "Assigned To",
    minWidth: 160,
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "Created Date",
    minWidth: 180,
    valueFormatter: (value) => new Date(value).toLocaleDateString(),
  },
];

export default function ClaimsGrid() {
  const navigate = useNavigate();

  const { rows, rowCount, loading, query, updateQuery } = useClaims();

  const [search, setSearch] = useState("");

  const handlePagination = (model: GridPaginationModel) => {
    updateQuery({
      page: model.page,
      pageSize: model.pageSize,
    });
  };

  const handleSorting = (model: GridSortModel) => {
    const sort = model[0];

    updateQuery({
      sortField: sort?.field,
      sortDirection: sort?.sort ?? undefined,
      page: 0,
    });
  };

  return (
    <Box sx={{ width: "100%", backgroundColor: "#ffffff", p: 3, borderRadius: "30px", fontFamily: "Poppins, sans-serif" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
            All Customers
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "#16C098" }}>
            Active Members
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search claims..."
          value={search}
          onChange={(event) => {
            const value = event.target.value;
            setSearch(value);

            updateQuery({
              search: value,
              page: 0,
            });
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 280 }}
        />
      </Box>

      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          rowCount={rowCount}
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          paginationModel={{
            page: query.page,
            pageSize: query.pageSize,
          }}
          onPaginationModelChange={handlePagination}
          sortModel={
            query.sortField
              ? [
                  {
                    field: query.sortField,
                    sort: query.sortDirection ?? null,
                  },
                ]
              : []
          }
          onSortModelChange={handleSorting}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          onRowClick={(params) => {
            navigate(`/claims/${params.row.id}/documents`);
          }}
          sx={{
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
            border: "none",
            fontFamily: "Poppins, sans-serif",
            "& .MuiDataGrid-columnHeaders": {
              color: "#B5B7C0",
              fontWeight: 600,
            }
          }}
        />
      </Box>
    </Box>
  );
}
