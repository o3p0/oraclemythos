// story.js - Handles Chapter Pages

document.addEventListener("DOMContentLoaded", () => {
    const chaptersContainer = document.querySelector(".chapter-cards");

    // Fetch chapters for the current book
    function fetchChapters() {
        fetch('/data/chapters.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch chapters: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                renderChapters(data);
            })
            .catch(error => console.error("Error fetching chapters:", error));
    }

    // Render chapters dynamically
    function renderChapters(chapters) {
        const bookId = document.body.dataset.bookId; // Assuming each book page has data-book-id

        const filteredChapters = chapters.filter(chapter => chapter.book_id === bookId);

        chaptersContainer.innerHTML = "";

        filteredChapters.forEach(chapter => {
            const card = document.createElement("a");
            card.className = "chapter-card";
            card.href = chapter.full_story;

            card.innerHTML = `
                <div class="chapter-card-content">
                    <img src="${chapter.image}" alt="${chapter.title}" class="chapter-image">
                    <h3>${chapter.title}</h3>
                    <p>${chapter.summary}</p>
                </div>
            `;

            chaptersContainer.appendChild(card);
        });
    }

    // Smooth scroll for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
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

    // Highlight current chapter link
    const chapters = document.querySelectorAll(".chapter-section");

    window.addEventListener("scroll", () => {
        const fromTop = window.scrollY + 150;

        chapters.forEach((chapter, index) => {
            const link = document.querySelector(`.chapter-link[href="#${chapter.id}"]`);

            if (
                chapter.offsetTop <= fromTop &&
                chapter.offsetTop + chapter.offsetHeight > fromTop
            ) {
                link?.classList.add("active");
            } else {
                link?.classList.remove("active");
            }
        });
    });

    // Floating Quote Animation
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

    // Dynamic Progress Bar
    const progressBar = document.getElementById("progress-bar");

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });

    // Image Parallax Effect
    const heroImages = document.querySelectorAll(".chapter-hero");

    window.addEventListener("scroll", () => {
        heroImages.forEach(image => {
            const speed = image.getAttribute("data-speed") || 0.1;
            const yPos = -(window.scrollY * speed);
            image.style.backgroundPosition = `center ${yPos}px`;
        });
    });

    // Initialize
    fetchChapters();
});

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
