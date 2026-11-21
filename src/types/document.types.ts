
export type DocumentStatus =
  | "AVAILABLE"
  | "PROCESSING"
  | "FAILED";

export interface ClaimDocument {
  id: string;
  claimId: string;
  name: string;
  type: string;
  sizeBytes: number;
  pageCount: number;
  uploadedAt: string;
  status: DocumentStatus;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  pageNumber: number;
  comment: string;
  createdBy: string;
  createdAt: string;
}


export type AnnotationType = "HIGHLIGHT" | "NOTE";


export interface DocumentAnnotation {
  id: string;
  documentId: string;
  pageNumber: number;
  type: AnnotationType;
  text: string;
  createdBy: string;
  createdAt: string;

  // Normalized coordinates (0 to 1)
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}


