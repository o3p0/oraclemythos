document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded, initializing scripts...");

    let slideIndex = 0;
    const params = new URLSearchParams(window.location.search);
    let currentMythology = params.get("mythology") || "greek"; // Detect mythology dynamically
    let selectedCharacterId = params.get("character"); // Get character from URL
    const characterDataCache = {};

    // 🎯 DOM Elements
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const mythologyBtn = document.getElementById("mythology-btn");
    const dropdownMenu = document.getElementById("mythology-dropdown");
    const heroImage = document.getElementById("hero-image");
    const heroCharacterName = document.getElementById("hero-character-name");

    const modal = document.getElementById("character-modal");
    const closeModalBtn = document.getElementById("close-modal");

    // Character Overview Elements
    const characterName = document.getElementById("character-name");
    const characterTitle = document.getElementById("character-title");
    const characterPantheon = document.getElementById("character-pantheon");
    const characterFaction = document.getElementById("character-faction");
    const characterArchetype = document.getElementById("character-archetype");
    const characterAlignment = document.getElementById("character-alignment");
    const characterEssence = document.getElementById("character-essence");
    const characterInstruments = document.getElementById("character-instruments");

    // Core Attributes
    const statElements = {
        dominion: document.getElementById("stat-dominion"),
        wrath: document.getElementById("stat-wrath"),
        arcana: document.getElementById("stat-arcana"),
        guile: document.getElementById("stat-guile"),
        resolve: document.getElementById("stat-resolve"),
    };

    const barElements = {
        dominion: document.getElementById("bar-dominion"),
        wrath: document.getElementById("bar-wrath"),
        arcana: document.getElementById("bar-arcana"),
        guile: document.getElementById("bar-guile"),
        resolve: document.getElementById("bar-resolve"),
    };

    async function loadCharacterData(mythology) {
        if (!characterDataCache[mythology]) {
            try {
                console.log(`📥 Fetching data for: ${mythology}`);
                const response = await fetch(`data/${mythology}.json`);
                if (!response.ok) throw new Error(`Failed to load data for ${mythology}`);
                characterDataCache[mythology] = await response.json();
                console.log("✅ Data Loaded:", characterDataCache[mythology]);
            } catch (error) {
                console.error(error);
                alert("Error loading character data. Check console for details.");
                return [];
            }
        }
        return characterDataCache[mythology] || [];
    }

    function updateCharacter(character) {
        if (!character) {
            console.error("🚨 Character data is missing!");
            return;
        }

        console.log("🎭 Displaying character:", character);

        heroImage.src = character.image;
        heroImage.alt = character.name;
        heroCharacterName.textContent = character.name;

        characterName.textContent = character.name;
        characterTitle.textContent = character.title;
        characterPantheon.textContent = character.core_identity.pantheon;
        characterFaction.textContent = character.core_identity.faction;
        characterArchetype.textContent = character.archetype_alignment.roles.join(", ");
        characterAlignment.textContent = character.archetype_alignment.alignment;
        characterEssence.textContent = character.archetype_alignment.essence.join(", ");
        characterInstruments.textContent = character.archetype_alignment.instruments.join(", ");

        updateCharacterStats(character);
        loadExpandableSections(character);
    }

    function updateCharacterStats(character) {
        Object.keys(statElements).forEach(stat => {
            const value = character.attributes[stat];
            if (statElements[stat] && barElements[stat]) {
                statElements[stat].textContent = `${value}%`;
                barElements[stat].style.width = `${value}%`;
            }
        });
    }

    function loadExpandableSections(character) {
        document.getElementById("world-building-list").innerHTML = character.expandable_section.about_section
            .map(item => `<li><strong>${item.title}:</strong> <span>${item.description}</span></li>`)
            .join("\n");

        document.getElementById("legend-list").innerHTML = character.expandable_section.legends
            .map(legend => `<li>${legend}</li>`)
            .join("\n");

        document.getElementById("lore-list").innerHTML = character.expandable_section.lore
            .map(lore => `<li>${lore}</li>`)
            .join("\n");
    }

    function updateCarousel(direction) {
        const data = characterDataCache[currentMythology];
        if (!data || data.length === 0) return;

        slideIndex = (slideIndex + direction + data.length) % data.length;
        updateCharacter(data[slideIndex]);
    }

    prevBtn.addEventListener("click", () => updateCarousel(-1));
    nextBtn.addEventListener("click", () => updateCarousel(1));

    async function filterCharacters(mythology) {
        currentMythology = mythology;
        const data = await loadCharacterData(mythology);
        if (data.length > 0) {
            slideIndex = 0;
            updateCharacter(data[slideIndex]);
        }
    }

    mythologyBtn.addEventListener("click", () => {
        dropdownMenu.classList.toggle("show-dropdown");

      // ✅ Close mythology dropdown when clicking outside of it
document.addEventListener("click", (event) => {
    const isClickInsideDropdown = dropdownMenu.contains(event.target);
    const isClickOnButton = mythologyBtn.contains(event.target);

    if (!isClickInsideDropdown && !isClickOnButton) {
        dropdownMenu.classList.remove("show-dropdown");
    }
});

    });

    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", (event) => {
            const mythology = event.target.getAttribute("data-value");
            filterCharacters(mythology);
            dropdownMenu.classList.remove("show-dropdown");
        });
    });

    async function initializeCharacterPage() {
        const data = await loadCharacterData(currentMythology);

        if (selectedCharacterId) {
            const character = data.find(char => char.id === selectedCharacterId);
            if (character) {
                updateCharacter(character);
                return;
            }
        }

        if (data.length > 0) {
            updateCharacter(data[0]);
        }
    }

    initializeCharacterPage();

    function openCharacterModal(character) {
        if (!character.expandable_section) return;
    
        // ✅ Info Section (Sacred Places, Rivals, Allies)
        document.getElementById("sacred-places").textContent = character.expandable_section.quick_facts.sacred_places.join(", ");
        document.getElementById("rival-names").textContent = character.expandable_section.quick_facts.rivalries_alliances.rivals.join(", ");
        document.getElementById("ally-names").textContent = character.expandable_section.quick_facts.rivalries_alliances.allies.join(", ");
    
        // ✅ About Section - World Building
        document.getElementById("world-building-list").innerHTML = character.expandable_section.about_section
            .map(item => `
                <li>
                    <strong>${item.title}:</strong> 
                    <span>${item.description}</span>
                </li>
            `)
            .join("\n");
    
        // ✅ Legends Section - Ensuring Titles are Styled
        document.getElementById("legend-list").innerHTML = character.expandable_section.legends
            .map(legend => {
                const parts = legend.split(": ");
                return parts.length > 1 
                    ? `<li><strong>${parts[0]}:</strong> <span>${parts.slice(1).join(": ")}</span></li>` 
                    : `<li><strong>${legend}</strong></li>`; // Handle cases where `:` may not exist
            })
            .join("\n");
    
        // ✅ Lore Section - Ensuring Titles are Styled
        document.getElementById("lore-list").innerHTML = character.expandable_section.lore
            .map(lore => {
                const parts = lore.split(": ");
                return parts.length > 1 
                    ? `<li><strong>${parts[0]}:</strong> <span>${parts.slice(1).join(": ")}</span></li>` 
                    : `<li><strong>${lore}</strong></li>`; // Handle cases where `:` may not exist
            })
            .join("\n");
    
        // ✅ Show Modal
        modal.style.display = "flex";
    }
    

    heroImage.addEventListener("click", () => {
        const displayedCharacter = characterDataCache[currentMythology].find(char => char.name === heroCharacterName.textContent);
        if (displayedCharacter) openCharacterModal(displayedCharacter);
    });

    closeModalBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (event) => { 
        if (event.target === modal) modal.style.display = "none"; 
    });

    console.log("✅ All scripts loaded and ready!");
});





