import {
  UsersRound,
  UserCheck,
  Monitor,
  ArrowUp,
  ArrowDown,
  CircleUserRound,
} from "lucide-react";
import { mockClaims } from "../data/claims.mock";
import { Box, Card, Chip, Typography } from "@mui/material";

const totalCustomers = mockClaims.length;

const allMembers = mockClaims.filter(
  (claim) =>
    claim.memberStatus === "ACTIVE" || claim.memberStatus === "INACTIVE",
).length;

const activeMembers = mockClaims.filter(
  (claim) => claim.memberStatus === "ACTIVE",
).length;

const metrics = [
  {
    label: "Total Customers",
    value: totalCustomers.toLocaleString(),
    description: "16%",
    icon: <UsersRound size={40} />,
  },
  {
    label: "Members",
    value: allMembers.toLocaleString(),
    description: "-2%",
    icon: <UserCheck size={40} />,
  },
  {
    label: "Active Now",
    value: activeMembers.toLocaleString(),
    description: "Currently active",
    icon: <Monitor size={40} />,
  },
];

export default function ClaimsCard() {
  return (
    <div className="flex justify-between items-center mb-4 card-section">
      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 0.1,
          mb: 3,
          backgroundColor: "#f4f6fb",
          borderRadius: 0,
        }}
      >
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            sx={{
              borderRadius: 1,
              bgcolor: "#ffffff",
              borderColor: "#e5e9f0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "none",
              fontFamily: "Poppins, sans-serif",
            }}
            elevation={0}
            variant="outlined"
          >
            {/* add 24px gap between icons and text */}
            <div
              className="flex items-center mb-2"
              style={{ gap: "24px", paddingLeft: "24px" }}
            >
              <div>
                <Box
                  sx={{
                    mb: 2,
                    color: "#00AC4F",
                    backgroundColor: "#D3FFE7",
                    p: 1,
                    borderRadius: "50%",
                    width: 84,
                    height: 84,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {metric.icon}
                </Box>
              </div>
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ACACAC",
                    fontWeight: 400,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {metric.label}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    mt: 1,
                    mb: 1,
                    fontSize: "32px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {metric.value}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#172033",
                    fontSize: "0.75rem",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {metric.label === "Active Now" ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        // on hover, the color should change to blue
                        <CircleUserRound
                          key={index}
                          size={24}
                          style={{
                            color: "#172033",
                            marginLeft: index === 0 ? 0 : "-8px",
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            position: "relative",
                            zIndex: index,
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.color = "#3B82F6";
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.color = "#172033";
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {metric.description.startsWith("-") ? (
                        <span style={{ color: "#EF4444", display: "flex", alignItems: "center" }}>
                          <ArrowDown
                            size={16}
                            style={{ display: "inline", marginRight: "4px" }}
                          />
                          {metric.description.replace("-", "")}
                        </span>
                      ) : (
                        <span style={{ color: "#10B981" }}>
                          <ArrowUp
                            size={16}
                            style={{
                              display: "inline",
                              marginRight: "4px",
                              color: "#10B981",
                            }}
                          />
                          {metric.description}
                        </span>
                      )}
                      {" this month"}
                    </span>
                  )}
                </Typography>
              </div>
            </div>
          </Card>
        ))}
      </Box>
    </div>
  );
}
