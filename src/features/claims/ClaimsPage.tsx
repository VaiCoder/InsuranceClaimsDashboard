import { Container } from "@mui/material";
import ClaimsGrid from "./components/ClaimsGrid";

export default function ClaimsPage() {
  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <ClaimsGrid />
    </Container>
  );
}
