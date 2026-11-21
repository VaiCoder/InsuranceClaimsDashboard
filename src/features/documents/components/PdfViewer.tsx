import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import AnnotationOverlay from "./AnnotationOverlay";
import type { DocumentAnnotation } from "../../../types/document.types";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  file: string;
  onPageChange: (pageNumber: number) => void;
  onCreateHighlight: (highlight: HighlightSelection) => void;
  annotations: DocumentAnnotation[];
}

interface HighlightSelection {
  text: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function PdfViewer({
  file,
  onPageChange,
  onCreateHighlight,
  annotations,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [selectedHighlight, setSelectedHighlight] =
    useState<HighlightSelection | null>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selection || !selectedText || !pageContainerRef.current) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const pageRect = pageContainerRef.current.getBoundingClientRect();

    const position = {
      x: (rect.left - pageRect.left) / pageRect.width,
      y: (rect.top - pageRect.top) / pageRect.height,
      width: rect.width / pageRect.width,
      height: rect.height / pageRect.height,
    };

    const highlight = {
      text: selectedText,
      position,
    };

    setSelectedHighlight(highlight);
  };

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError("");
    onPageChange(1);
  };

  const handleLoadError = (err: Error) => {
    console.error("PDF loading failed:", err);
    setLoading(false);
    setError("Unable to load the document. Please retry.");
  };

  const retryLoading = () => {
    setError("");
    setLoading(true);
    setNumPages(0);
    setPageNumber(1);
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <button
          disabled={pageNumber <= 1 || loading}
          onClick={() => {
            const nextPage = pageNumber - 1;
            setPageNumber(nextPage);
            onPageChange(nextPage);
          }}
        >
          Previous
        </button>

        <span>
          Page {pageNumber} of {numPages || "--"}
        </span>

        <button
          disabled={!numPages || pageNumber >= numPages || loading}
          onClick={() => {
            const nextPage = pageNumber + 1;
            setPageNumber(nextPage);
            onPageChange(nextPage);
          }}
        >
          Next
        </button>
      </div>

      {loading && <p>Loading document...</p>}

      {error ? (
        <div>
          <p role="alert">{error}</p>
          <button onClick={retryLoading}>Retry</button>
        </div>
      ) : (
        <>
          <Document
            key={file}
            file={file}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={null}
          >
            <div
              ref={pageContainerRef}
              style={{
                position: "relative",
                display: "inline-block",
              }}
              onMouseUp={handleTextSelection}
            >
              <Page pageNumber={pageNumber} />

              {annotations
                .filter(
                  (annotation) =>
                    annotation.type === "HIGHLIGHT" && annotation.position,
                )
                .map((annotation) => (
                  <AnnotationOverlay
                    key={annotation.id}
                    position={annotation.position!}
                  />
                ))}
            </div>
          </Document>
          {selectedHighlight && (
            <div>
              <p>Selected text: {selectedHighlight.text}</p>

              <button
                onClick={() => {
                  onCreateHighlight(selectedHighlight);
                  setSelectedHighlight(null);
                  window.getSelection()?.removeAllRanges();
                }}
              >
                Save Highlight
              </button>

              <button onClick={() => setSelectedHighlight(null)}>Cancel</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
