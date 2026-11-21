
import type { ClaimDocument } from "../../../types/document.types";

export const mockDocuments: ClaimDocument[] = [
  {
    id: "DOC-001",
    claimId: "20000",
    name: "Insurance Claim Application.pdf",
    type: "PDF",
    sizeBytes: 25 * 1024 * 1024,
    pageCount: 45,
    uploadedAt: "2026-11-15",
    status: "AVAILABLE",
  },
  {
    id: "DOC-002",
    claimId: "20000",
    name: "Medical Assessment Report.pdf",
    type: "PDF",
    sizeBytes: 120 * 1024 * 1024,
    pageCount: 180,
    uploadedAt: "2026-11-16",
    status: "AVAILABLE",
  },
  {
    id: "DOC-003",
    claimId: "20000",
    name: "Supporting Evidence.pdf",
    type: "PDF",
    sizeBytes: 850 * 1024 * 1024,
    pageCount: 620,
    uploadedAt: "2026-11-17",
    status: "PROCESSING",
  },
];
