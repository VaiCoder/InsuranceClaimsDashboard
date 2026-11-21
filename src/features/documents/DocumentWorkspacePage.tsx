import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Chip, IconButton, Typography } from "@mui/material";
import { ArrowLeft, FileText } from "lucide-react";
import PdfViewer from "./components/PdfViewer";
import DocumentComments from "./components/DocumentComments";
import DocumentAnnotations from "./components/DocumentAnnotations";
import { addAnnotation } from "./services/annotations.service";
import { useEffect, useState } from "react";
import type { DocumentAnnotation } from "../../types/document.types";
import { getAnnotations } from "./services/annotations.service";
import {
  getDocumentsByClaim,
  deleteDocument,
  uploadDocument,
  getDocumentFileUrl,
} from "./services/documents.service";
import type { ClaimDocument } from "../../types/document.types";
import { splitPdf } from "./services/pdf-split.service";
import { mergePdfs } from "./services/pdf-merge.service";

export default function DocumentWorkspacePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [splitStartPage, setSplitStartPage] = useState(1);
  const [splitEndPage, setSplitEndPage] = useState(2);
  const [splitError, setSplitError] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeError, setMergeError] = useState("");
  const [isMerging, setIsMerging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [annotationRefreshKey, setAnnotationRefreshKey] = useState(0);
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [annotations, setAnnotations] = useState<DocumentAnnotation[]>([]);
  const [documents, setDocuments] = useState<ClaimDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [documentLoadError, setDocumentLoadError] = useState("");

  const [selectedDocumentId, setSelectedDocumentId] = useState(
    documents[0]?.id ?? "",
  );

  const selectedDocument = documents.find(
    (document) => document.id === selectedDocumentId,
  );

  useEffect(() => {
    let isActive = true;

    const loadAnnotations = async () => {
      if (!selectedDocument) {
        setAnnotations([]);
        return;
      }

      setAnnotations([]);

      try {
        const loadedAnnotations = await getAnnotations(
          selectedDocument.id,
          currentPage,
        );

        if (isActive) {
          setAnnotations(loadedAnnotations);
        }
      } catch (error) {
        if (isActive) {
          setAnnotations([]);
          console.error("Failed to load annotations:", error);
        }
      }
    };

    void loadAnnotations();

    return () => {
      isActive = false;
    };
  }, [selectedDocument?.id, currentPage, annotationRefreshKey]);

  useEffect(() => {
    let isActive = true;

    const loadDocuments = async () => {
      if (!claimId) {
        setDocuments([]);
        setSelectedDocumentId("");
        setAnnotations([]);
        setCurrentPage(1);
        setDocumentLoadError("Claim ID is missing.");
        setIsLoadingDocuments(false);
        return;
      }

      try {
        setIsLoadingDocuments(true);
        setDocumentLoadError("");

        setDocuments([]);
        setSelectedDocumentId("");
        setAnnotations([]);
        setCurrentPage(1);

        const loadedDocuments = await getDocumentsByClaim(claimId);
        if (!isActive) return;

        setDocuments(loadedDocuments);

        setSelectedDocumentId((currentId) => {
          const currentDocumentExists = loadedDocuments.some(
            (document) => document.id === currentId,
          );

          return currentDocumentExists
            ? currentId
            : (loadedDocuments[0]?.id ?? "");
        });
      } catch (error) {
        if (!isActive) return;

        setDocuments([]);
        setSelectedDocumentId("");
        setAnnotations([]);
        setDocumentLoadError(
          error instanceof Error ? error.message : "Unable to load documents.",
        );
      } finally {
        if (isActive) {
          setIsLoadingDocuments(false);
        }
      }
    };

    void loadDocuments();

    return () => {
      isActive = false;
    };
  }, [claimId]);

  const formatSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleCreateHighlight = async (highlight: {
    text: string;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }) => {
    if (!selectedDocument) return;

    await addAnnotation({
      id: crypto.randomUUID(),
      documentId: selectedDocument.id,
      pageNumber: currentPage,
      type: "HIGHLIGHT",
      text: highlight.text,
      position: highlight.position,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
    });

    setAnnotationRefreshKey((key) => key + 1);
  };

  const handleMergePdfs = async () => {
    setMergeError("");

    if (mergeFiles.length < 2) {
      setMergeError("Please select at least two PDF files.");
      return;
    }

    try {
      setIsMerging(true);

      const mergedBytes = await mergePdfs(mergeFiles);

      const mergedBlob = new Blob([mergedBytes as BlobPart], {
        type: "application/pdf",
      });

      const downloadUrl = URL.createObjectURL(mergedBlob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "merged-claims-documents.pdf";
      link.click();

      URL.revokeObjectURL(downloadUrl);
      setMergeFiles([]);
    } catch (error) {
      setMergeError(
        error instanceof Error ? error.message : "PDF merging failed.",
      );
    } finally {
      setIsMerging(false);
    }
  };

  const handleUploadDocument = async (file: File) => {
    setUploadError("");

    if (!claimId) {
      setUploadError("Claim ID is missing.");
      return;
    }

    try {
      setIsUploading(true);

      const uploadedDocument = await uploadDocument(file, claimId);

      const updatedDocuments = await getDocumentsByClaim(claimId);
      setDocuments(updatedDocuments);

      setSelectedDocumentId(uploadedDocument.id);
      setCurrentPage(1);
      setAnnotationRefreshKey((key) => key + 1);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Document upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) return;

    await deleteDocument(documentId);

    const updatedDocuments = await getDocumentsByClaim(claimId!);
    setDocuments(updatedDocuments);

    if (selectedDocument?.id === documentId) {
      setSelectedDocumentId(updatedDocuments[0].id ?? null);
      setCurrentPage(1);
    }
  };

  const handleSplitPdf = async () => {
    setSplitError("");

    if (!selectedDocument) {
      setSplitError("Please select a document first.");
      return;
    }

    if (splitStartPage < 1 || splitEndPage < splitStartPage) {
      setSplitError("Please enter a valid page range.");
      return;
    }

    let downloadUrl: string | undefined;

    try {
      setIsSplitting(true);

      const fileUrl =
        getDocumentFileUrl(selectedDocument.id) ?? "/samples/case-study.pdf";

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error("Unable to load the selected PDF.");
      }

      const pdfBlob = await response.blob();

      const pdfFile = new File([pdfBlob], selectedDocument.name, {
        type: "application/pdf",
      });

      const splitBytes = await splitPdf(pdfFile, splitStartPage, splitEndPage);

      const outputBlob = new Blob([splitBytes as BlobPart], {
        type: "application/pdf",
      });

      downloadUrl = URL.createObjectURL(outputBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${selectedDocument.name.replace(/\.pdf$/i, "")}-pages-${splitStartPage}-${splitEndPage}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setSplitError(
        error instanceof Error ? error.message : "PDF splitting failed.",
      );
    } finally {
      if (downloadUrl) {
        const urlToRevoke = downloadUrl;

        window.setTimeout(() => {
          URL.revokeObjectURL(urlToRevoke);
        }, 1000);
      }

      setIsSplitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <IconButton onClick={() => navigate("/claims")}>
          <ArrowLeft />
        </IconButton>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Document Workspace
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Claim ID: {claimId}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "300px minmax(0, 1fr)",
          },
          gap: 2,
          minHeight: 650,
        }}
      >
        {/* Document List */}
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Documents ({documents.length})
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload a new PDF
            </Typography>

            <input
              type="file"
              accept="application/pdf,.pdf"
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void handleUploadDocument(file);
                }

                event.target.value = "";
              }}
            />

            {isUploading && (
              <Typography variant="caption" color="primary">
                Uploading document...
              </Typography>
            )}

            {uploadError && (
              <Typography variant="body2" color="error">
                {uploadError}
              </Typography>
            )}
          </Box>

          {documents.map((document) => (
            <Box
              key={document.id}
              onClick={() => {
                setSelectedDocumentId(document.id);
                setCurrentPage(1);
              }}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 1,
                cursor: "pointer",
                border: "1px solid",
                borderColor:
                  selectedDocumentId === document.id
                    ? "primary.main"
                    : "divider",
                bgcolor:
                  selectedDocumentId === document.id
                    ? "action.selected"
                    : "transparent",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <FileText size={20} />

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
                  >
                    {document.name}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {formatSize(document.sizeBytes)} · {document.pageCount}{" "}
                    pages
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label={document.status}
                      color={
                        document.status === "AVAILABLE" ? "success" : "warning"
                      }
                    />
                  </Box>
                </Box>
              </Box>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  void handleDeleteDocument(document.id);
                }}
              >
                Delete
              </button>
            </Box>
          ))}
        </Card>

        {/* Document Viewer Area */}
        <Card
          variant="outlined"
          sx={{
            p: 2,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isLoadingDocuments ? (
            <Typography color="text.secondary">Loading documents...</Typography>
          ) : documentLoadError ? (
            <Typography color="error">{documentLoadError}</Typography>
          ) : selectedDocument ? (
            <>
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Split PDF
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Prototype: splits the sample PDF currently displayed in the
                  viewer.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flexWrap: "wrap",
                    mt: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption">Start page</Typography>
                    <input
                      type="number"
                      min={1}
                      value={splitStartPage}
                      onChange={(event) => {
                        setSplitStartPage(Number(event.target.value));
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption">End page</Typography>
                    <input
                      type="number"
                      min={1}
                      value={splitEndPage}
                      onChange={(event) => {
                        setSplitEndPage(Number(event.target.value));
                      }}
                    />
                  </Box>

                  <button
                    onClick={() => void handleSplitPdf()}
                    disabled={isSplitting}
                  >
                    {isSplitting ? "Splitting..." : "Split and Download"}
                  </button>
                </Box>

                {splitError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {splitError}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Merge PDF Documents
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Select at least two PDF files to combine them into one
                  document.
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    multiple
                    onChange={(event) => {
                      setMergeFiles(Array.from(event.target.files ?? []));
                      setMergeError("");
                    }}
                  />
                </Box>

                {mergeFiles.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {mergeFiles.length} PDF file(s) selected
                  </Typography>
                )}

                <Box sx={{ mt: 2 }}>
                  <button
                    onClick={() => void handleMergePdfs()}
                    disabled={isMerging}
                  >
                    {isMerging ? "Merging..." : "Merge and Download"}
                  </button>
                </Box>

                {mergeError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {mergeError}
                  </Typography>
                )}
              </Box>

              <PdfViewer
                file={
                  getDocumentFileUrl(selectedDocument.id) ??
                  "/samples/case-study.pdf"
                }
                onPageChange={setCurrentPage}
                onCreateHighlight={handleCreateHighlight}
                annotations={annotations}
              />

              <DocumentComments
                documentId={selectedDocument.id}
                pageNumber={currentPage}
              />
              <DocumentAnnotations
                documentId={selectedDocument.id}
                pageNumber={currentPage}
                refreshKey={annotationRefreshKey}
              />
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
                textAlign: "center",
                gap: 1,
              }}
            >
              <FileText size={40} color="#9CA3AF" />

              <Typography variant="h6">No documents available</Typography>

              <Typography variant="body2" color="text.secondary">
                Upload a PDF using the document panel to get started.
              </Typography>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
}
