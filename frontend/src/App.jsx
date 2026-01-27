import { Routes, Route } from "react-router-dom"
import SearchPage from "./pages/SearchPage.jsx"
import AddPage from "./pages/AddPage.jsx"
import NotFound from "./pages/NotFound.jsx"
import ShaderBackground from "./components/ShaderBackground.jsx"

export default function App() {
  return (
    <>
      {/* 🔮 BACKGROUND (fixed, full screen) */}
      <ShaderBackground />

      {/* 🧭 APP CONTENT OVERLAY */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/word/:word" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}
