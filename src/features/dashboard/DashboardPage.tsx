import { Box, Card, Chip, Typography } from "@mui/material";
import { mockClaims } from "../claims/data/claims.mock";

const totalClaims = mockClaims.length;

const openClaims = mockClaims.filter(
  (claim) => claim.status === "NEW" || claim.status === "IN_REVIEW",
).length;

const approvedClaims = mockClaims.filter(
  (claim) => claim.status === "APPROVED",
).length;

// const rejectedClaims = mockClaims.filter(
//   (claim) => claim.status === "REJECTED",
// ).length;

const totalClaimAmount = mockClaims.reduce(
  (total, claim) => total + claim.claimAmount,
  0,
);

const statusSummary = [
  { label: "New", status: "NEW", color: "#64748b" },
  { label: "In Review", status: "IN_REVIEW", color: "#ed6c02" },
  { label: "Approved", status: "APPROVED", color: "#2e7d32" },
  { label: "Rejected", status: "REJECTED", color: "#d32f2f" },
  { label: "Closed", status: "CLOSED", color: "#64748b" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const metrics = [
  {
    label: "Total Claims",
    value: totalClaims.toLocaleString(),
    description: "All registered claims",
  },
  {
    label: "Open Claims",
    value: openClaims.toLocaleString(),
    description: "New and in-review claims",
  },
  {
    label: "Approved Claims",
    value: approvedClaims.toLocaleString(),
    description: "Successfully approved",
  },
  {
    label: "Total Claim Amount",
    value: formatCurrency(totalClaimAmount),
    description: "Total submitted claim value",
  },
];

export default function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Insurance claims overview and performance
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 2,
          mb: 3,
        }}
      >
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            sx={{ p: 2.5, borderRadius: 2 }}
            elevation={0}
            variant="outlined"
          >
            <Typography color="text.secondary" variant="body2">
              {metric.label}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
              {metric.value}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {metric.description}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Status Summary */}
      <Card
        variant="outlined"
        elevation={0}
        sx={{ p: 3, borderRadius: 2, mb: 3 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Claims by Status
        </Typography>

        {statusSummary.map((item) => {
          const count = mockClaims.filter(
            (claim) => claim.status === item.status,
          ).length;

          const percentage = (count / totalClaims) * 100;

          return (
            <Box key={item.status} sx={{ mb: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.75,
                }}
              >
                <Typography variant="body2">{item.label}</Typography>

                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {count.toLocaleString()} ({percentage.toFixed(1)}%)
                </Typography>
              </Box>

              <Box
                sx={{
                  height: 10,
                  bgcolor: "#edf0f5",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: "100%",
                    bgcolor: item.color,
                    borderRadius: 5,
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Card>

      {/* Recent Claims */}
      <Card variant="outlined" elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Claims
        </Typography>

        {mockClaims
          .slice(-5)
          .reverse()
          .map((claim) => (
            <Box
              key={claim.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                py: 1.5,
                borderBottom: "1px solid #edf0f5",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }} variant="body2">
                  {claim.claimNumber}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {claim.customerName} · {claim.claimType}
                </Typography>
              </Box>

              <Chip size="small" label={claim.status.replace("_", " ")} />
            </Box>
          ))}
      </Card>
    </Box>
  );
}
