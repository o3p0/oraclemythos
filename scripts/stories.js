document.addEventListener("DOMContentLoaded", () => {
    const timelineContainer = document.querySelector(".timeline-container");
    const mythologyFilter = document.getElementById("mythology-filter");
    const randomMythButton = document.getElementById("random-myth-btn");
    const randomMythDisplay = document.getElementById("random-myth-display");

    let stories = [];

    // Fetch stories from JSON
    function fetchStories() {
        fetch('/data/stories.json')
            .then(response => response.json())
            .then(data => {
                stories = data;
                renderStories(stories);
                applyCardHoverEffect(); // Apply hover after rendering
            })
            .catch(error => console.error("Error fetching stories:", error));
    }

    // Render story cards dynamically
    function renderStories(storiesToRender) {
        timelineContainer.innerHTML = ""; // Clear previous content

        storiesToRender.forEach(story => {
            const card = document.createElement("a");
            card.className = "story-card";
            card.href = story.full_story;

            card.innerHTML = `
                <img src="${story.image}" alt="${story.title}">
                <div class="story-title">${story.title}</div>
            `;

            timelineContainer.appendChild(card);
        });

        applyCardHoverEffect(); // Ensure hover effect applies to new cards
    }

    // Filter stories based on selected mythology
    function filterStories() {
        const selectedMythology = mythologyFilter.value;
        const filteredStories = selectedMythology === "all"
            ? stories
            : stories.filter(story => story.mythology === selectedMythology);

        renderStories(filteredStories);
    }

    // Generate and highlight a random story
    function generateRandomMyth() {
        if (stories.length > 0) {
            const randomStory = stories[Math.floor(Math.random() * stories.length)];
            highlightRandomCard(randomStory.id);
        } else {
            randomMythDisplay.innerHTML = "<p>No myths available to display.</p>";
        }
    }

    // Highlight the random card visually
    function highlightRandomCard(storyId) {
        const cards = document.querySelectorAll('.story-card');
        cards.forEach(card => card.classList.remove('highlight'));

        const randomCard = [...cards].find(card => card.href.includes(storyId));
        if (randomCard) {
            randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            randomCard.classList.add('highlight');

            setTimeout(() => randomCard.classList.remove('highlight'), 3000);
        }
    }

    // Apply hover effect for CD-like feel
    function applyCardHoverEffect() {
        const cards = document.querySelectorAll('.story-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const moveX = (x - rect.width / 2) * 0.05;
                const moveY = (y - rect.height / 2) * -0.05; // Inverted Y for natural tilt

                card.style.transform = `rotateY(${moveX}deg) rotateX(${moveY}deg) scale(1.05)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
            });
        });
    }

    // Set up event listeners
    mythologyFilter.addEventListener("change", filterStories);
    randomMythButton.addEventListener("click", generateRandomMyth);

    // Initialize page
    fetchStories();
});
// Hamburger Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");

    hamburgerBtn.addEventListener("click", () => {
        dropdownMenu.classList.toggle("active");
    });

    // Close the menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!dropdownMenu.contains(e.target) && e.target !== hamburgerBtn) {
            dropdownMenu.classList.remove("active");
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Get URL Parameters
    const params = new URLSearchParams(window.location.search);
    const story = params.get('story'); // Get ?story=ragnarok

    if (story) {
        const target = document.getElementById(story);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' }); // Scrolls to story
        }
    }
});
