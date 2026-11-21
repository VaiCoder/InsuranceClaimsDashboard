
import type { DocumentAnnotation } from "../../../types/document.types";

let mockAnnotations: DocumentAnnotation[] = [];

export async function getAnnotations(
  documentId: string,
  pageNumber: number
): Promise<DocumentAnnotation[]> {
  return mockAnnotations.filter(
    (annotation) =>
      annotation.documentId === documentId &&
      annotation.pageNumber === pageNumber
  );
}

export async function addAnnotation(
  annotation: DocumentAnnotation
): Promise<DocumentAnnotation> {
  mockAnnotations = [...mockAnnotations, annotation];
  return annotation;
}

export async function deleteAnnotation(
  annotationId: string
): Promise<void> {
  mockAnnotations = mockAnnotations.filter(
    (annotation) => annotation.id !== annotationId
  );
}
