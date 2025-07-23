import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Editor from "./Editor";
import Login from "./components/Login";
import Register from "./components/Register";
import FloatButton from "./components/FloatButton";
import NewDocumentPopup from "./components/NewDocumentPopup";
import DocumentList from "./components/DocumentList";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute"; // assuming this exists
import LogoutButton from "./components/LogoutButton";
import "./firebaseConfig";

function HomeWithPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const handleSave = () => {
    setReloadFlag((prev) => !prev); // This will trigger a reload in DocumentList
  };
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{ position: "absolute", top: "25px", right: "25px", zIndex: 10 }}
      >
        <LogoutButton />
      </div>
      <DocumentList reload={reloadFlag} />
      <FloatButton onClick={() => setShowPopup(true)} />
      {showPopup && (
        <NewDocumentPopup
          onClose={() => setShowPopup(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <HomeWithPopup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="bottom-center" reverseOrder={false} />
      </>
    </Router>
  );
}

export default App;
