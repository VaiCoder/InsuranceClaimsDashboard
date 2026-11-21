import { useEffect, useState } from "react";
import type { DocumentComment } from "../../../types/document.types";
import {
  addDocumentComment,
  deleteDocumentComment,
  getDocumentComments,
} from "../services/comments.service";

interface DocumentCommentsProps {
  documentId: string;
  pageNumber: number;
}

export default function DocumentComments({
  documentId,
  pageNumber,
}: DocumentCommentsProps) {
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState("");

  const loadComments = async () => {
    const result = await getDocumentComments(documentId);
    setComments(result);
  };

  useEffect(() => {
    void loadComments();
  }, [documentId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment: DocumentComment = {
      id: crypto.randomUUID(),
      documentId,
      pageNumber,
      comment: newComment.trim(),
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
    };

    await addDocumentComment(comment);
    setNewComment("");
    await loadComments();
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteDocumentComment(commentId);
    await loadComments();
  };

  const pageComments = comments.filter(
    (comment) => comment.pageNumber === pageNumber,
  );

  return (
    <div className="document-comments">
      <h3>Comments — Page {pageNumber}</h3>

      <textarea
        value={newComment}
        onChange={(event) => setNewComment(event.target.value)}
        placeholder="Add a comment for this page..."
        rows={3}
      />

      <button onClick={handleAddComment} disabled={!newComment.trim()}>
        Add Comment
      </button>

      {pageComments.length === 0 ? (
        <p>No comments on this page.</p>
      ) : (
        pageComments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <strong>{comment.createdBy}</strong>
            <p>{comment.comment}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
            <button onClick={() => void handleDeleteComment(comment.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
