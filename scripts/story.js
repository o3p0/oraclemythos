// story.js - Handles Dynamic Chapter Pages

document.addEventListener("DOMContentLoaded", () => {
    console.log("📖 Story.js Loaded!");

    const chaptersContainer = document.querySelector(".chapters-container"); // Ensure class consistency
    const bookId = document.body.dataset.bookId; // Get the story's unique ID

    if (!bookId || !chaptersContainer) {
        console.warn("❌ Missing book ID or chapter container. Dynamic chapter loading skipped.");
        return;
    }

    // 📜 Fetch chapters for the current book
    fetch('/data/chapters.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`❌ Failed to fetch chapters: ${response.status}`);
            }
            return response.json();
        })
        .then(chapters => {
            renderChapters(chapters);
        })
        .catch(error => console.error("❌ Error fetching chapters:", error));

    // 📌 Render chapters dynamically
    function renderChapters(chapters) {
        const filteredChapters = chapters.filter(chapter => chapter.book_id === bookId);

        if (filteredChapters.length === 0) {
            chaptersContainer.innerHTML = "<p>No chapters available for this story yet.</p>";
            return;
        }

        // Clear existing content and add new chapter cards
        chaptersContainer.innerHTML = filteredChapters.map(chapter => `
            <div class="chapter-card">
                <a href="${chapter.full_story}">
                    <img src="${chapter.image}" alt="${chapter.title}" class="chapter-image">
                    <h3>${chapter.title}</h3>
                    <p>${chapter.summary || "Continue the journey..."}</p>
                </a>
            </div>
        `).join('');
    }

    // 🌀 Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });

    // 🔥 Highlight current chapter link as user scrolls
    const chapters = document.querySelectorAll(".chapter-section");
    window.addEventListener("scroll", () => {
        const fromTop = window.scrollY + 150;
        chapters.forEach(chapter => {
            const link = document.querySelector(`.chapter-link[href="#${chapter.id}"]`);
            if (chapter.offsetTop <= fromTop && chapter.offsetTop + chapter.offsetHeight > fromTop) {
                link?.classList.add("active");
            } else {
                link?.classList.remove("active");
            }
        });
    });

    // ✨ Floating Quote Animation
    const quotes = document.querySelectorAll(".floating-quote");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }
        });
    }, { threshold: 0.1 });

    quotes.forEach(quote => observer.observe(quote));

    // 📊 Dynamic Progress Bar
    const progressBar = document.getElementById("progress-bar");
    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });

    // 🌄 Image Parallax Effect for Hero Image
    const heroImages = document.querySelectorAll(".chapter-hero");
    window.addEventListener("scroll", () => {
        heroImages.forEach(image => {
            const speed = image.getAttribute("data-speed") || 0.1;
            const yPos = -(window.scrollY * speed);
            image.style.backgroundPosition = `center ${yPos}px`;
        });
    });

    // 🏹 Navigation Button Visibility Enhancement
    let hideTimeout;
    const navButtons = document.querySelectorAll('#prev-button, #next-button');

    function showNavButtons() {
        navButtons.forEach(btn => btn.style.opacity = 1);
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            navButtons.forEach(btn => btn.style.opacity = 0.5);
        }, 3000);
    }

    window.addEventListener('mousemove', showNavButtons);
    window.addEventListener('scroll', showNavButtons);
});
