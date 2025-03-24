document.addEventListener('DOMContentLoaded', () => {
    // 🍔 Hamburger Menu Functionality
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    hamburgerBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show-dropdown');
    });

    // 🏛️ Horizontal Scroll for Mythology Stories
    const storySlider = document.querySelector('.story-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (storySlider) {
        storySlider.addEventListener('mousedown', (e) => {
            isDown = true;
            storySlider.classList.add('active');
            startX = e.pageX - storySlider.offsetLeft;
            scrollLeft = storySlider.scrollLeft;
        });

        storySlider.addEventListener('mouseleave', () => {
            isDown = false;
            storySlider.classList.remove('active');
        });

        storySlider.addEventListener('mouseup', () => {
            isDown = false;
            storySlider.classList.remove('active');
        });

        storySlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - storySlider.offsetLeft;
            const walk = (x - startX) * 2; // Increase speed
            storySlider.scrollLeft = scrollLeft - walk;
        });
    }

    // 🎭 Smooth Fade-in for Sections on Scroll
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // 🍔 Hamburger Menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    hamburgerBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show-dropdown');
    });

    // 🔄 Horizontal Scroll Functionality for Characters
    const charScroll = document.querySelector('.character-scroll');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');

    if (charScroll) {
        leftBtn.addEventListener('click', () => {
            charScroll.scrollBy({ left: -200, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            charScroll.scrollBy({ left: 200, behavior: 'smooth' });
        });

        // Auto-scroll (Optional)
        setInterval(() => {
            charScroll.scrollBy({ left: 200, behavior: 'smooth' });
        }, 5000);
    }
});
