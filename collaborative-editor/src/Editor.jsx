import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Editor.css";
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Users } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { io } from "socket.io-client";
import Modal from "react-modal";

const socket = io("http://localhost:5000");

function Editor() {
  const [doc, setDoc] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showCollaborate, setShowCollaborate] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());
        if (user) setCurrentUserId(user.uid);

        const res = await fetch(`http://localhost:5000/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setDoc(data);
        setTitle(data.title);
        setContent(data.content);
        if (user && data?.owner === user.uid) {
          setIsOwner(true);
        }
        socket.emit("joinDocument", id);
      } catch (err) {
        toast.error("Failed to load document");
      }
    };

    if (id) fetchDoc();

    return () => {
      socket.emit("leaveDocument", id);
    };
  }, [id]);

  useEffect(() => {
    socket.on("receive-changes", (newContent) => {
      setContent(newContent);
    });

    socket.on("documentUpdated", ({ title, content }) => {
      setTitle(title);
      setContent(content);
    });

    return () => {
      socket.off("receive-changes");
      socket.off("documentUpdated");
    };
  }, []);

  const emitChange = (newTitle, newContent) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      socket.emit("editDocument", {
        documentId: id,
        title: newTitle,
        content: newContent,
      });
    }, 300);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    emitChange(newTitle, content);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    emitChange(title, newContent);
  };

  const saveChanges = async () => {
    if (!doc) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      const res = await fetch(`http://localhost:5000/documents/${doc._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      toast.success("Document saved!");
      setDoc(data);
    } catch (err) {
      toast.error("Failed to save document");
    }
  };
  const handleAddCollaborator = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      const res = await fetch(
        `http://localhost:5000/documents/${id}/collaborators`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: newEmail }),
        }
      );

      const result = await res.json();
      console.log("Add collaborator result:", result);
      if (res.ok) {
        toast.success("Collaborator added");
        setNewEmail("");
        setShowCollaborate(false);
      } else {
        toast.error(result.message || "Failed to add collaborator");
      }
    } catch (error) {
      console.error("Collaborator error:", error);
      toast.error("Error adding collaborator");
    }
  };

  if (!doc) return <p>Loading document...</p>;

  return (
    <div className="editor-container">
      <header className="editor-header">
        <button className="back-btn" onClick={() => navigate("/documents")}>
          <ArrowLeft size={20} /> Back
        </button>
        <button
          className="collab-btn"
          onClick={(e) => {
            e.preventDefault();
            e.currentTarget.blur();
            requestAnimationFrame(() => setShowCollaborate(true));
          }}
        >
          <Users size={18} style={{ marginRight: "4px" }} />
          Collaborate
        </button>

        <button className="save-btn" onClick={saveChanges}>
          Save
        </button>
      </header>

      <main className="editor-main">
        <input
          className={`title-input ${isOwner ? "owner-style" : "collab-style"}`}
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Document Title"
        />
        <textarea
          className={`content-area ${isOwner ? "owner-style" : "collab-style"}`}
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing..."
        />
      </main>
      <Modal
        isOpen={showCollaborate}
        onRequestClose={() => setShowCollaborate(false)}
        contentLabel="Add Collaborator"
        className="Modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <h2>Add Collaborator</h2>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter user's email"
          className="collab-input"
        />
        <div style={{ marginTop: "10px" }}>
          <button onClick={handleAddCollaborator}>Add</button>
          <button
            onClick={() => setShowCollaborate(false)}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Editor;
