
import type { Claim, ClaimStatus } from "../../../types/claim.types";

const statuses: ClaimStatus[] = [
  "NEW",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
  "CLOSED",
];

const claimTypes = [
  "Life Insurance",
  "Health Insurance",
  "Property Insurance",
  "Motor Insurance",
  "Travel Insurance",
];

const customers = [
  "John Smith",
  "Emma Wilson",
  "Michael Brown",
  "Olivia Davis",
  "James Miller",
  "Sophia Taylor",
  "William Anderson",
  "Isabella Thomas",
  "Benjamin Moore",
  "Mia Martin",
];

const adjusters = [
  "Sarah Johnson",
  "David Wilson",
  "Emily Clark",
  "Robert Lewis",
  "Unassigned",
];

const activeMembers = [customers[0], customers[2], customers[4]];

export function generateClaims(count = 20000): Claim[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;

    return {
      id: String(id),
      claimNumber: `CLM-${String(id).padStart(7, "0")}`,
      customerName: customers[index % customers.length],
      policyNumber: `POL-${100000 + id}`,
      phoneNumber: `+1-555-${String(1000 + (id % 9000)).padStart(4, "0")}`,
      email: `${customers[index % customers.length]
        .toLowerCase()
        .replace(" ", ".")}@example.com`,
      country: "USA",
      claimType: claimTypes[index % claimTypes.length],
      claimAmount: Math.round(
        (500 + Math.random() * 99500) * 100
      ) / 100,
      currency: "USD",
      status: statuses[index % statuses.length],
      assignedTo: adjusters[index % adjusters.length],
      createdAt: new Date(
        Date.UTC(2025, 0, 1) + index * 3600000
      ).toISOString(),
      memberStatus: activeMembers.includes(customers[index % customers.length])
        ? "ACTIVE"
        : "INACTIVE",
    };
  });
}

export const mockClaims = generateClaims(20000);
