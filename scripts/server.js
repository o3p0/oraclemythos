// scripts/server.js - Guestbook Backend Server
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const GUESTBOOK_FILE = "./data/guestbook.json";

// 📥 Load Guestbook Entries
app.get("/entries", (req, res) => {
    fs.readFile(GUESTBOOK_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("❌ ERROR: Failed to read guestbook.json", err);
            return res.status(500).json({ error: "Failed to load guestbook." });
        }

        console.log("📖 RAW JSON CONTENT:", data);  // ✅ Check exact JSON content

        try {
            const parsedData = JSON.parse(data);
            console.log("✅ Parsed Guestbook Data:", parsedData); // ✅ Log parsed output

            if (!Array.isArray(parsedData.guestbook)) {
                console.error("❌ ERROR: guestbook is not an array!", parsedData);
                return res.status(500).json({ error: "Invalid guestbook format." });
            }

            res.json(parsedData.guestbook);
        } catch (error) {
            console.error("❌ ERROR: JSON parsing failed", error);
            res.status(500).json({ error: "Error parsing guestbook data." });
        }
    });
});

// 📝 Add a New Entry
app.post("/entries", (req, res) => {
    const { userId, name, message } = req.body;
    if (!userId || !name || !message) {
        return res.status(400).json({ error: "UserId, name, and message required." });
    }

    fs.readFile(GUESTBOOK_FILE, "utf8", (err, data) => {
        let guestbookEntries = [];

        if (!err && data) {
            try {
                const parsedData = JSON.parse(data);
                guestbookEntries = Array.isArray(parsedData.guestbook) ? parsedData.guestbook : [];
            } catch (parseError) {
                console.error("❌ JSON Parse Error:", parseError);
                return res.status(500).json({ error: "Error parsing guestbook data." });
            }
        }

        const newEntry = {
            id: Date.now().toString(),
            userId,
            name,
            message,
            replies: []
        };

        guestbookEntries.push(newEntry);

        // ✅ Always write a clean array
        const updatedData = JSON.stringify({ guestbook: guestbookEntries }, null, 2);

        fs.writeFile(GUESTBOOK_FILE, updatedData, (err) => {
            if (err) {
                console.error("❌ ERROR: Failed to save entry:", err);
                return res.status(500).json({ error: "Failed to save entry." });
            }
            console.log("✅ Entry successfully saved!");
            res.status(201).json(newEntry);
        });
    });
});

// ❌ Delete an Entry (For Moderators Only)
app.delete("/entries/:id", (req, res) => {
    const messageId = req.params.id;

    fs.readFile(GUESTBOOK_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to load guestbook." });

        let guestbookEntries;
        try {
            guestbookEntries = JSON.parse(data).guestbook || [];
        } catch (parseError) {
            return res.status(500).json({ error: "Error parsing guestbook data." });
        }

        const entryIndex = guestbookEntries.findIndex(entry => entry.id === messageId);
        if (entryIndex === -1) {
            return res.status(404).json({ error: "Entry not found." });
        }

        guestbookEntries.splice(entryIndex, 1);

        fs.writeFile(GUESTBOOK_FILE, JSON.stringify({ guestbook: guestbookEntries }, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete entry." });
            res.status(200).json({ message: "Entry deleted successfully." });
        });
    });
});

// 🔄 Add a Reply to a Message
app.post("/entries/:id/reply", (req, res) => {
    const { userId, author, text } = req.body;
    if (!userId || !author || !text) {
        return res.status(400).json({ error: "Invalid reply data." });
    }

    fs.readFile(GUESTBOOK_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to load guestbook." });

        let guestbookEntries;
        try {
            guestbookEntries = JSON.parse(data).guestbook || [];
        } catch (parseError) {
            return res.status(500).json({ error: "Error parsing guestbook data." });
        }

        let message = guestbookEntries.find(entry => entry.id === req.params.id);
        if (!message) {
            return res.status(404).json({ error: "Message not found." });
        }

        message.replies.push({ userId, author, text });

        fs.writeFile(GUESTBOOK_FILE, JSON.stringify({ guestbook: guestbookEntries }, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to save reply." });
            res.status(201).json({ message: "Reply added successfully." });
        });
    });
});

// 🚀 Start the Server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
