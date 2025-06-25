// scripts/index.js - Handles Dynamic Character & Story Display
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // ✅ Load Characters from JSON Files
        const characterFiles = ["data/norse.json", "data/egyptian.json"];
        let characters = [];

        for (const file of characterFiles) {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            const data = await response.json();
            characters = characters.concat(data.map(char => ({
                ...char,
                mythology: file.includes("norse") ? "norse" : "egyptian"
            })));
        }

        // ✅ Define Story Paths (Modify as needed)
        const storyLinks = [
            
            "stories/greek-odyssey.html",
            "stories/greek-medusa.html",
            "stories/norse-yggdrasil.html",
            "stories/aztec-fifth-sun.html",
            "stories/aztec-huitzilopochtli.html",
            "stories/chinese-cowherd-weaver.html",
            "stories/chinese-monkey-king.html",
            "stories/egypt-ra.html",
            "stories/egypt-story.html",
            "stories/hindu-churning-ocean.html",
            "stories/hindu-ramayana.html",
            "stories/mayan-hero-twins.html",
            "stories/mayan-maize-humans.html",
            "stories/trojan-war.html",
            "stories/yoruba-creation.html",
            "stories/yoruba-sango.html"

        ];

        // ✅ Fetch Story Title & Image Dynamically
        async function fetchStoryData(storyUrl) {
            try {
                const response = await fetch(storyUrl);
                if (!response.ok) throw new Error(`Failed to fetch ${storyUrl}`);
                const html = await response.text();

                // ✅ Extract Story Title from <title> tag
                const titleMatch = html.match(/<title>(.*?)<\/title>/);
                const title = titleMatch ? titleMatch[1] : "Unknown Story";

                // ✅ Extract the background-image URL from <header class="chapter-hero">
                const imageMatch = html.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
                const image = imageMatch ? imageMatch[1] : "images/default-story.jpg"; // Fallback image

                // ✅ Extract Mythology from filename (e.g., "norse-loki" → "norse")
                const mythologyMatch = storyUrl.match(/stories\/([a-z]+)-/i);
                const mythology = mythologyMatch ? mythologyMatch[1] : "unknown";

                return { title, image, link: storyUrl, mythology };
            } catch (error) {
                console.error(`❌ Error fetching data for ${storyUrl}:`, error);
                return { title: "Unknown Story", image: "images/default-story.jpg", link: storyUrl, mythology: "unknown" };
            }
        }

        // ✅ Prepare Story Data with Titles & Images
        const stories = await Promise.all(storyLinks.map(story => fetchStoryData(story)));

        // ✅ Function to Get Random Subset
        function getRandomSubset(array, size) {
            return array.sort(() => Math.random() - 0.5).slice(0, size);
        }

        // ✅ Select 3 Random Characters & 3 Random Stories
        const selectedCharacters = getRandomSubset(characters, 3);
        const selectedStories = getRandomSubset(stories, 3);

        // ✅ Populate Character Grid (FULLY CLICKABLE)
        const characterGrid = document.querySelector(".character-grid");
        if (characterGrid) {
            characterGrid.innerHTML = selectedCharacters.map(char => `
                <a href="characters.html?mythology=${char.mythology}&character=${char.id}" class="character-card">
                  <img src="${char.image}" alt="${char.name}" loading="lazy" class="character-card-image" />
                  <h3>${char.name}</h3>
                </a>
              `).join("");
              
        }

        // ✅ Populate Story Grid (FULLY CLICKABLE)
        const storyGrid = document.querySelector(".myths-grid");
        if (storyGrid) {
            storyGrid.innerHTML = selectedStories.map(story => `
                <a href="${story.link}" class="myth-card">
                    <div class="myth-card-image" style="background-image: url('${story.image}');"></div>
                    <h3>${story.title}</h3>
                </a>
            `).join("");
        }

    } catch (error) {
        console.error("❌ Error loading content:", error);
    }
});

