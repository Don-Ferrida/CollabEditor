import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, reload } from "firebase/auth";
import "./DocumentList.css";
import { useLocation } from "react-router-dom";
import NewDocumentPopup from "./NewDocumentPopup";
function DocumentList({ reload }) {
  const [documents, setDocuments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadDocuments = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.warn("No user logged in");
        return <p>Please log in to view your documents.</p>;
      }

      const token = await user.getIdToken();
      console.log("Token:", token);
      const res = await fetch("http://localhost:5000/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to load documents:", err.message);
        setLoadError(true);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setDocuments(data);
        setLoadError(false);
        if (data.length === 0) {
          setShowPopup(true);
        } else {
          setShowPopup(false);
        }
      } else {
        console.error("Unexpected response:", data);
        setLoadError(true);
      }
    } catch (err) {
      console.error("Error loading documents", err);
      setLoadError(true);
    }
  };

  const handleDelete = async () => {
    if (!docToDelete) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      await fetch(`http://localhost:5000/documents/${docToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowConfirm(false);
      setDocToDelete(null);
      loadDocuments(); // Refresh list
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  useEffect(() => {
    console.log("Reload triggered:", reload);
    loadDocuments();
  }, [location, reload]);

  if (loadError) {
    return <p className="error-text">Error: Could not load documents.</p>;
  }

  return (
    <div className="doc-container">
      <h2 className="doc-heading">Your Documents</h2>

      <div className="doc-grid">
        {documents.map((doc) => {
          const currentUserId = getAuth().currentUser?.uid;
          const isOwner = doc.collaborators[0] === currentUserId;
          const isShared = doc.collaborators.length > 1;
          const cardClass = `doc-card ${isShared ? "shared" : "owner"}`;

          return (
            <div
              key={doc._id}
              className={cardClass}
              onClick={() => navigate(`/documents/${doc._id}`)}
              onMouseEnter={() => setHoveredId(doc._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className="doc-title">
                {isOwner ? "⭐ " : ""}
                {doc.title}
                {isShared && !isOwner ? " (Shared)" : ""}
              </span>

              {hoveredId === doc._id && (
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocToDelete(doc._id);
                    setShowConfirm(true);
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              )}
            </div>
          );
        })}

        {showConfirm && (
          <div className="confirm-popup">
            <p>Are you sure you want to delete?</p>
            <div className="button-row">
              <button className="yes-btn" onClick={handleDelete}>
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentList;
