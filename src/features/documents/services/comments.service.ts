
import type { DocumentComment } from "../../../types/document.types";

let mockComments: DocumentComment[] = [
  {
    id: "COMMENT-001",
    documentId: "DOC-001",
    pageNumber: 1,
    comment: "Please verify the policyholder details.",
    createdBy: "Claims Reviewer",
    createdAt: new Date().toISOString(),
  },
];

export async function getDocumentComments(
  documentId: string
): Promise<DocumentComment[]> {
  return mockComments.filter(
    (comment) => comment.documentId === documentId
  );
}

export async function addDocumentComment(
  comment: DocumentComment
): Promise<DocumentComment> {
  mockComments = [...mockComments, comment];
  return comment;
}

export async function deleteDocumentComment(
  commentId: string
): Promise<void> {
  mockComments = mockComments.filter(
    (comment) => comment.id !== commentId
  );
}
