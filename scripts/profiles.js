document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId"); // ✅ Get `userId` from URL

    if (!userId) {
        document.body.innerHTML = "<h2>User not found</h2>";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/entries");
        if (!response.ok) throw new Error("Failed to load entries.");
        
        const data = await response.json();
        const guestbookEntries = data.guestbook || [];

        // ✅ Filter posts by `userId`
        let userPosts = guestbookEntries.filter(entry => entry.userId === userId);

        if (userPosts.length === 0) {
            document.getElementById("user-posts").innerHTML = "<h3>No posts found for this user.</h3>";
            document.getElementById("profile-name").textContent = "User Profile";
            return;
        }

        // ✅ Set Profile Name at the Top
        document.getElementById("profile-name").textContent = userPosts[0].name;

        // ✅ Reverse posts so newest appears first
        userPosts.reverse();

        // ✅ Display user posts in separate boxes
        const profileContainer = document.getElementById("user-posts");
        profileContainer.innerHTML = userPosts.map(entry => `
            <div class="profile-entry">
                <strong>${entry.name}</strong>
                <p class="post-content">${entry.message}</p>

                <div class="replies-box">
                    ${entry.replies.length > 0 ? entry.replies.reverse().map(reply => `
                        <div class="profile-reply">
                            <strong><a href="profiles.html?userId=${reply.userId}" class="profile-link">${reply.author}</a></strong>: ${reply.text}
                        </div>
                    `).join("") : `<p class="no-replies">No replies yet.</p>`}
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error loading user profile:", error);
        document.body.innerHTML = "<h2>Error loading profile. Try again later.</h2>";
    }
});
