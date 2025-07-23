const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const verifyFirebaseToken = require("../middleware/firebaseAuth");
const admin = require("firebase-admin");

router.use(verifyFirebaseToken);

router.get("/", async (req, res) => {
  try {
    const userId = req.user.uid;

    const docs = await Document.find({
      collaborators: userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      collaborators: req.user.uid,
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/collaborators", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const owner = doc.collaborators[0];
    const others = doc.collaborators.slice(1);

    res.status(200).json({ owner, others });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch collaborators" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Creating document with data:", req.body);
    console.log("User ID from token:", req.user.uid);

    const { title, content, collaborators } = req.body;
    const newDoc = new Document({
      title,
      content,
      collaborators,
      owner: req.user.uid,
    });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (err) {
    console.error("Error saving document:", err);
    res.status(400).json({ message: err.message });
  }
});

router.post("/:id/collaborators", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const collaboratorUid = userRecord.uid;

    const document = await Document.findById(id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    if (!document.collaborators.includes(collaboratorUid)) {
      document.collaborators.push(collaboratorUid);
      await document.save();
    }

    res.status(200).json({ message: "Collaborator added successfully" });
  } catch (err) {
    console.error("Error adding collaborator:", err);
    res.status(500).json({ message: "Failed to add collaborator" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedDoc = await Document.findOneAndUpdate(
      { _id: req.params.id, collaborators: req.user.uid },
      { title, content },
      { new: true }
    );
    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const userId = req.user.uid;

    if (doc.collaborators[0] === userId) {
      await doc.deleteOne();
      return res
        .status(200)
        .json({ message: "Document permanently deleted by owner" });
    }

    if (doc.collaborators.includes(userId)) {
      doc.collaborators = doc.collaborators.filter((id) => id !== userId);
      await doc.save();
      return res
        .status(200)
        .json({ message: "You have been removed from this document" });
    }

    res.status(403).json({ message: "You are not part of this document" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
