// scripts.js - Global Hamburger Menu Functionality

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (hamburgerBtn && dropdownMenu) {
        hamburgerBtn.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show-dropdown');
        });

        window.addEventListener('click', (event) => {
            if (!event.target.closest('.hamburger-menu')) {
                dropdownMenu.classList.remove('show-dropdown');
            }
        });

        // Uniform Dropdown Menu Links
        dropdownMenu.innerHTML = `
        <a href="/index.html">Home</a>
        <a href="/stories.html">Stories</a>
        <a href="/characters.html">Characters</a>
    `;
    
    
    } else {
        console.error('Hamburger button or dropdown menu not found.');
    }
});
