import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage.jsx";
import AddPage from "./pages/AddPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/add" element={<AddPage />} />
      <Route path="/word/:word" element={<SearchPage />} />
    </Routes>
  );
}
