import { Container } from "@mui/material";
import ClaimsGrid from "./components/ClaimsGrid";
import { Handshake } from "lucide-react";
import ClaimsCard from "./components/ClaimsCard";

export default function ClaimsPage() {
  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <div className="flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="header-title">
            {"Hello Evano "}<Handshake size={24} />{","}
          </div>
          <div className="global-search-bar">
            <input
              type="text"
              placeholder="Search claims..."
              className="global-search-input"
              />
          </div>
        </div>
        <ClaimsCard />
        <ClaimsGrid />
      </div>
    </Container>
  );
}
