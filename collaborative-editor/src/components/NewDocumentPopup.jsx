import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";

const NewDocumentPopup = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setMessage("Not logged in.");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5000/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, collaborators: [user.uid] }),
      });

      if (res.ok) {
        toast.success("Saved!");
        setTimeout(() => {
          setMessage("");
          onSave();
          onClose();
        }, 1000);
      } else {
        toast.error("Failed to save.");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Error saving document.");
    }
  };
  const inputStyle = {
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    color: "white",
    background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    fontSize: "16px",
    outline: "none",
  };
  const textareaStyle = {
    ...inputStyle,
    height: "120px",
    resize: "vertical",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -20%)",
        width: "400px",
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Create New Document</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={textareaStyle}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
      {message && (
        <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
      )}
    </div>
  );
};

export default NewDocumentPopup;
