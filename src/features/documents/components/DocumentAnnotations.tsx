import { useEffect, useState } from "react";
import type { DocumentAnnotation } from "../../../types/document.types";
import {
  addAnnotation,
  deleteAnnotation,
  getAnnotations,
} from "../services/annotations.service";

interface DocumentAnnotationsProps {
  documentId: string;
  pageNumber: number;
  refreshKey: number;
}

export default function DocumentAnnotations({
  documentId,
  pageNumber,
  refreshKey,
}: DocumentAnnotationsProps) {
  const [annotations, setAnnotations] = useState<DocumentAnnotation[]>([]);
  const [text, setText] = useState("");

  const loadAnnotations = async () => {
    const result = await getAnnotations(documentId, pageNumber);
    setAnnotations(result);
  };

  useEffect(() => {
    void loadAnnotations();
  }, [documentId, pageNumber, refreshKey]);

  const handleAdd = async () => {
    if (!text.trim()) return;

    await addAnnotation({
      id: crypto.randomUUID(),
      documentId,
      pageNumber,
      type: "NOTE",
      text: text.trim(),
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
    });

    setText("");
    await loadAnnotations();
  };

  const handleDelete = async (id: string) => {
    await deleteAnnotation(id);
    await loadAnnotations();
  };

  return (
    <div className="document-annotations">
      <h3>Annotations — Page {pageNumber}</h3>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add an annotation for this page..."
        rows={3}
      />

      <button onClick={handleAdd} disabled={!text.trim()}>
        Add Annotation
      </button>

      {annotations.length === 0 ? (
        <p>No annotations on this page.</p>
      ) : (
        annotations.map((annotation) => (
          <div key={annotation.id} className="annotation-item">
            <strong>{annotation.type}</strong>
            <p>{annotation.text}</p>
            <small>{annotation.createdBy}</small>
            <button onClick={() => void handleDelete(annotation.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
