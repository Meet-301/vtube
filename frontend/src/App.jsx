import { Header, Sidebar } from "../components";

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1">
          {/* Page content will come here */}
        </main>
      </div>
    </div>
  );
}

export default App;