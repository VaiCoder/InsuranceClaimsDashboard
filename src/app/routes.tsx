import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ClaimsPage from "../features/claims/ClaimsPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import DocumentWorkspacePage from "../features/documents/DocumentWorkspacePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ClaimsPage />
      },
      {
        path: "claims",
        element: <DashboardPage />,
      },
      {
        path: "claims/:claimId/documents",
        element: <DocumentWorkspacePage />,
      },
    ],
  },
]);
