import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import CheckerPage from "./pages/CheckerPage";
import DatabaseHitamPage from "./pages/DatabaseHitamPage";
import LaporkanScamPage from "./pages/LaporkanScamPage";
import EdukasiPage from "./pages/EdukasiPage";
import PanicButtonPage from "./pages/PanicButtonPage";
import ChatPage from "./pages/ChatPage";
import RiwayatPage from "./pages/RiwayatPage";
import { Toaster } from "react-hot-toast";
import MetodologiPage from "./pages/MetodologiPage";
import Footer from "./components/layout/Footer";
import OnboardingTour from "./components/ui/OnboardingTour";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
      <OnboardingTour />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cek" element={<CheckerPage />} />
        <Route path="/database-hitam" element={<DatabaseHitamPage />} />
        <Route path="/lapor" element={<LaporkanScamPage />} />
        <Route path="/edukasi" element={<EdukasiPage />} />
        <Route path="/darurat" element={<PanicButtonPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/metodologi" element={<MetodologiPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
