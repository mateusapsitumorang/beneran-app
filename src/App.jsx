import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import CheckerPage from "./pages/CheckerPage";
import DatabaseHitamPage from "./pages/DatabaseHitamPage";
import LaporkanScamPage from "./pages/LaporkanScamPage";
import PanicButtonPage from "./pages/PanicButtonPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cek" element={<CheckerPage />} />
        <Route path="/database-hitam" element={<DatabaseHitamPage />} />
        <Route path="/lapor" element={<LaporkanScamPage />} />
        <Route path="/darurat" element={<PanicButtonPage />} />
      </Routes>
    </div>
  );
}
