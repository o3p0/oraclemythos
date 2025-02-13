let slideIndex = 0;
let currentMythology = 'greek'; // Default to Greek on page load
const characterDataCache = {}; // Cache loaded data

// Lazy load mythology data
async function loadCharacterData(mythology) {
    if (!characterDataCache[mythology]) {
        try {
            const response = await fetch(`data/${mythology}.json`);
            if (!response.ok) throw new Error(`Failed to load data for ${mythology}`);
            const data = await response.json();
            characterDataCache[mythology] = data;
        } catch (error) {
            console.error(error);
            alert('Error loading data. Please try again later.');
        }
    }
    return characterDataCache[mythology] || [];
}

// Filter characters based on mythology
async function filterCharacters(mythology) {
    currentMythology = mythology;
    const slidesContainer = document.querySelector('.carousel-slides');
    const carouselDots = document.querySelector('.carousel-dots');
    slidesContainer.innerHTML = '';
    carouselDots.innerHTML = '';

    const data = await loadCharacterData(mythology);

    data.forEach((character, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${mythology}`;
        slide.dataset.characterId = character.id;
        slide.innerHTML = `
            <img src="${character.image}" alt="${character.name}" loading="lazy">
            <h3>${character.name}</h3>
        `;
        slidesContainer.appendChild(slide);

        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.dataset.index = index;
        carouselDots.appendChild(dot);
    });

    slideIndex = 0;
    updateCarousel(slideIndex);
    addCharacterClickEvent();
    updateProgressDots();
}

// Carousel navigation
function moveSlide(step) {
    const slides = document.querySelectorAll(`.carousel-slide.${currentMythology}`);
    if (slides.length === 0) return;

    slideIndex = (slideIndex + step + slides.length) % slides.length;
    updateCarousel(slideIndex);
}

function updateCarousel(index) {
    const slides = document.querySelectorAll(`.carousel-slide.${currentMythology}`);
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });

    const character = characterDataCache[currentMythology][index];
    document.getElementById('carousel-description-text').innerHTML = character.carousel_description;
    updateProgressDots();
    showCharacterDetails(character);
}

function updateProgressDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
}

function addCharacterClickEvent() {
    document.querySelectorAll('.carousel-slide').forEach(slide => {
        slide.addEventListener('click', function () {
            const characterId = this.getAttribute('data-character-id');
            const character = characterDataCache[currentMythology].find(c => c.id === characterId);
            showCharacterDetails(character);
            openModal();
        });
    });
}

// Modal Functions
function openModal() {
    const modal = document.getElementById('character-modal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const modal = document.getElementById('character-modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

// Display character details in modal
function showCharacterDetails(character) {
    document.getElementById('modal-character-name').textContent = character.name;
    document.getElementById('modal-character-title').textContent = character.title;
    document.getElementById('modal-character-description').textContent = character.description;

    document.getElementById('modal-character-stories').innerHTML = (character.Legends || [])
        .map(legend => `<li><strong>${legend.split(':')[0]}:</strong> ${legend.split(':')[1]}</li>`)
        .join('');

    document.getElementById('modal-character-traits').innerHTML = (character.traits || [])
        .map(trait => `<li><strong>${trait.split(':')[0]}:</strong> ${trait.split(':')[1]}</li>`)
        .join('');
}

// Dropdown Toggle for Mythology
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('mythology-dropdown');
    dropdown.classList.toggle('show-dropdown');
}

function closeDropdown(mythologyName) {
    const dropdown = document.getElementById('mythology-dropdown');
    dropdown.classList.remove('show-dropdown');
    document.getElementById('mythology-btn').textContent = mythologyName;
}

// 🔥 Unified Click-Outside Handling
document.addEventListener('DOMContentLoaded', () => {
    const mythologyBtn = document.getElementById('mythology-btn');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    // Toggle Mythology Dropdown
    mythologyBtn.addEventListener('click', toggleDropdown);

    // Toggle Hamburger Menu
    hamburgerBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show-menu');
        document.getElementById('mythology-dropdown')?.classList.remove('show-dropdown');
    });

    // Select Mythology
    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const mythology = event.target.getAttribute('data-value');
            const mythologyName = event.target.textContent;
            filterCharacters(mythology);
            closeDropdown(mythologyName);
        });
    });

    filterCharacters(currentMythology);

    document.getElementById('prev-btn').addEventListener('click', () => moveSlide(-1));
    document.getElementById('next-btn').addEventListener('click', () => moveSlide(1));

    // Close both menus when clicking outside
    window.addEventListener('click', (event) => {
        if (
            !event.target.closest('.hamburger-menu') &&
            !event.target.closest('.mythology-dropdown')
        ) {
            dropdownMenu?.classList.remove('show-menu');
            document.getElementById('mythology-dropdown')?.classList.remove('show-dropdown');
        }
    });

    // Modal close handlers
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('character-modal')) closeModal();
    });

    document.querySelector('.close-btn').addEventListener('click', closeModal);
});
