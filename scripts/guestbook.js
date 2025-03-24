document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("guestbook-form");
    const entriesContainer = document.getElementById("guestbook-entries");
    const loginContainer = document.getElementById("login-container");
    const loginBtn = document.getElementById("login-btn");
    const usernameInput = document.getElementById("username");
    const loggedInUserDisplay = document.getElementById("logged-in-user");

    // ✅ Handle Login System
    loginBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (!username) {
            alert("Please enter a name!");
            return;
        }

        // ✅ Generate a unique `userId` if not already set
        let userId = localStorage.getItem("userId");
        if (!userId) {
            userId = "user_" + Date.now().toString();
            localStorage.setItem("userId", userId);
        }

        localStorage.setItem("username", username);
        loggedInUserDisplay.textContent = `Logged in as: ${username}`;
    });

    // ✅ Display logged-in user if they exist
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
        loggedInUserDisplay.textContent = `Logged in as: ${storedUsername}`;
        usernameInput.value = storedUsername;
    }

    // ✅ Load guestbook data from backend
    async function loadEntries() {
        try {
            console.log("📡 Fetching guestbook entries...");  // ✅ Log API Call
            const response = await fetch("http://localhost:3000/entries");
            
            console.log("🔎 Server Response:", response); // ✅ Check response
    
            if (!response.ok) throw new Error("Failed to fetch entries.");
    
            const data = await response.json();
            console.log("✅ Loaded Entries:", data); // ✅ See what we get from the server
    
            return data.guestbook || []; // Ensure an array is always returned
        } catch (error) {
            console.error("❌ Error loading guestbook:", error);
            return [];
        }
    }
    

    // ✅ Display guestbook entries with reply & delete functionality
    async function displayEntries() {
        const guestbookEntries = await loadEntries();
        const isModerator = localStorage.getItem("isModerator") === "true";

        // ✅ Reverse entries so newest messages appear first
        guestbookEntries.reverse();

        entriesContainer.innerHTML = guestbookEntries.map(entry => `
            <div class="guest-entry" data-id="${entry.id}">
                <div class="entry-box">
                    <strong>
                        <a href="profiles.html?userId=${entry.userId}" class="profile-link">${entry.name}</a>
                    </strong>: ${entry.message}

                    <button class="reply-btn" data-id="${entry.id}">Reply</button>
                    <div class="reply-section" id="reply-box-${entry.id}" style="display: none;">
                        <input type="text" class="reply-input" placeholder="Write a reply..." id="reply-input-${entry.id}">
                        <button class="submit-reply" data-id="${entry.id}">Submit</button>
                    </div>

                    <div class="replies-box">
                        ${entry.replies.reverse().map(reply => `
                            <div class="guest-reply">
                                <strong>
                                    <a href="profiles.html?userId=${reply.userId}" class="profile-link">${reply.author}</a>
                                </strong>: ${reply.text}
                            </div>
                        `).join("")}
                    </div>

                    ${isModerator ? `<button class="delete-btn" data-id="${entry.id}">Delete</button>` : ""}
                </div>
            </div>
        `).join("");

        // ✅ Show Reply Box when "Reply" is clicked
        document.querySelectorAll(".reply-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const messageId = e.target.getAttribute("data-id");
                const replyBox = document.getElementById(`reply-box-${messageId}`);
                replyBox.style.display = replyBox.style.display === "none" ? "block" : "none";
            });
        });

        // ✅ Handle Reply Submission (Fix: Now properly submits)
        document.querySelectorAll(".submit-reply").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const messageId = e.target.getAttribute("data-id");
                const replyInput = document.getElementById(`reply-input-${messageId}`);
                const replyText = replyInput.value.trim();
                if (replyText) {
                    await addReply(messageId, replyText);
                    replyInput.value = "";
                }
            });
        });

        // ✅ Attach delete event listeners for moderators (Fix: Now correctly deletes)
        if (isModerator) {
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async (event) => {
                    const messageId = event.target.getAttribute("data-id");
                    if (!messageId) {
                        console.error("❌ No valid message ID found for deletion!");
                        return;
                    }
                    await deleteMessage(messageId);
                });
            });
        }
    }

    // ✅ Handle adding a new guestbook entry
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = localStorage.getItem("username");
        if (!username) {
            alert("You must log in before posting!");
            return;
        }

        const message = document.getElementById("message").value.trim();
        if (!message) {
            alert("Please enter a message.");
            return;
        }

        const userId = localStorage.getItem("userId");
        const newEntry = { id: Date.now().toString(), userId, name: username, message, replies: [] };

        try {
            const response = await fetch("http://localhost:3000/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEntry),
            });

            if (!response.ok) {
                alert("Failed to submit entry.");
                return;
            }

            form.reset();
            displayEntries();
        } catch (error) {
            console.error("❌ Error submitting entry:", error);
        }
    });

    // ✅ Add Reply to a message (Now stores userId & author name)
    async function addReply(messageId, text) {
        try {
            const userId = localStorage.getItem("userId");
            const author = localStorage.getItem("username") || "Anonymous";

            const replyData = { userId, author, text };

            // ✅ Send reply update to backend
            const response = await fetch(`http://localhost:3000/entries/${messageId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(replyData),
            });

            if (!response.ok) {
                alert("Failed to submit reply.");
                return;
            }

            displayEntries();
        } catch (error) {
            console.error("❌ Error adding reply:", error);
        }
    }

    // ✅ Delete a message (Moderator Only)
    async function deleteMessage(messageId) {
        const password = prompt("Enter moderator password:");
        if (password !== "mod123") return alert("Incorrect password!");

        try {
            const response = await fetch(`http://localhost:3000/entries/${messageId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                alert("Failed to delete entry.");
                return;
            }

            alert("✅ Entry deleted successfully!");
            displayEntries();
        } catch (error) {
            console.error("❌ Error deleting entry:", error);
        }
    }

    displayEntries();
});

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const usernameInput = document.getElementById("username");
    const loggedInUserDisplay = document.getElementById("logged-in-user");

    // ✅ Handle Login System
    loginBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (!username) {
            alert("Please enter a name!");
            return;
        }

        // ✅ Generate a unique `userId` if not already set
        let userId = localStorage.getItem("userId");
        if (!userId) {
            userId = "user_" + Date.now().toString();
            localStorage.setItem("userId", userId);
        }

        localStorage.setItem("username", username);
        loggedInUserDisplay.textContent = `Logged in as: ${username}`;
        loggedInUserDisplay.style.display = "block"; // ✅ Ensure visibility
    });

    // ✅ Display logged-in user if they exist
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
        loggedInUserDisplay.textContent = `Logged in as: ${storedUsername}`;
        loggedInUserDisplay.style.display = "block";
        usernameInput.value = storedUsername;
    } else {
        loggedInUserDisplay.style.display = "none"; // ✅ Hide if not logged in
    }
});
