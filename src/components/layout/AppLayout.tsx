import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-container">
        <Header />

        <main className="page-content">
          <div className="page-heading">
            <div>
              <h1>Claims Dashboard</h1>
              <p>Manage, review and process insurance claims.</p>
            </div>

            <span className="environment-badge">Development</span>
          </div>

          <section className="welcome-panel">
            <h2>Insurance Claims Management</h2>
            <p>Welcome to your centralized claims management workspace.</p>
            <p>
              Claims, documents and workflow management will be available here.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
