document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('cultureModal');
    const modalTitle = document.getElementById('modal-title');
    const cultureList = document.getElementById('culture-list');
    const closeModal = modal.querySelector('.close');
    const regionButtons = document.querySelectorAll('.region-button');

    const regionCultures = {
        america: {
            title: "Mythologies of the Americas",
            cultures: [
                { name: "Aztec Mythology", link: "aztec.html" },
                { name: "Mayan Mythology", link: "mayan.html" }
            ]
        },
        europe: {
            title: "Mythologies of Europe",
            cultures: [
                { name: "Greek Mythology", link: "greek.html" },
                { name: "Norse Mythology", link: "norse.html" }
            ]
        },
        africa: {
            title: "Mythologies of Africa",
            cultures: [
                { name: "Yoruba Mythology", link: "yoruba.html" },
                { name: "Egyptian Mythology", link: "egyptian.html" }
            ]
        },
        asia: {
            title: "Mythologies of Asia",
            cultures: [
                { name: "Chinese Mythology", link: "chinese.html" },
                { name: "Hindu Mythology", link: "hindu.html" }
            ]
        }
    };

    regionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const regionName = e.target.dataset.region;
            openModal(regionName);
        });
    });

    function openModal(regionName) {
        const regionData = regionCultures[regionName];

        if (!regionData) {
            modalTitle.textContent = "Region not found";
            cultureList.innerHTML = "<li>No data available for this region.</li>";
        } else {
            modalTitle.textContent = regionData.title;
            cultureList.innerHTML = regionData.cultures
                .map(culture => `<li><a href="${culture.link}" target="_blank">${culture.name}</a></li>`)
                .join('');
        }

        modal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.style.display = 'none';
    });
});
document.querySelectorAll('.region-button').forEach(button => {
    button.addEventListener('click', () => {
        const region = button.getAttribute('data-region');
        openModal(region);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('tooltip');
    const modal = document.getElementById('cultureModal');
    const modalTitle = document.getElementById('modal-title');
    const cultureList = document.getElementById('culture-list');
    const closeModal = modal.querySelector('.close');
    const buttons = document.querySelectorAll('.region-button');

    const regionData = {
        north: {
            title: "North",
            content: [
                { name: "Norse Mythology", link: "norse.html" },
                { name: "Celtic Mythology", link: "celtic.html" }
            ]
        },
        south: {
            title: "South",
            content: [
                { name: "Mayan Mythology", link: "mayan.html" },
                { name: "Aztec Mythology", link: "aztec.html" }
            ]
        },
        east: {
            title: "East",
            content: [
                { name: "Chinese Mythology", link: "chinese.html" },
                { name: "Hindu Mythology", link: "hindu.html" }
            ]
        },
        west: {
            title: "West",
            content: [
                { name: "Greek Mythology", link: "greek.html" },
                { name: "Roman Mythology", link: "roman.html" }
            ]
        }
    };

    // Button Click Event
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const region = button.dataset.region;
            const data = regionData[region];
            if (data) {
                modalTitle.textContent = data.title;
                cultureList.innerHTML = data.content
                    .map(item => `<li><a href="${item.link}">${item.name}</a></li>`)
                    .join('');
                modal.style.display = 'block';
            }
        });
    });

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('cultureModal');
    const modalTitle = document.getElementById('modal-title');
    const cultureList = document.getElementById('culture-list');
    const closeModal = modal.querySelector('.close');
    const regionButtons = document.querySelectorAll('.region-button');

    const regionCultures = {
        north: {
            title: "North",
            cultures: [
                { name: "Norse Mythology", link: "norse.html" },
                { name: "Celtic Mythology", link: "celtic.html" }
            ]
        },
        south: {
            title: "South",
            cultures: [
                { name: "Mayan Mythology", link: "mayan.html" },
                { name: "Aztec Mythology", link: "aztec.html" }
            ]
        },
        east: {
            title: "East",
            cultures: [
                { name: "Chinese Mythology", link: "chinese.html" },
                { name: "Hindu Mythology", link: "hindu.html" }
            ]
        },
        west: {
            title: " West",
            cultures: [
                { name: "Greek Mythology", link: "greek.html" },
                { name: "Roman Mythology", link: "roman.html" }
            ]
        }
    };

    // Button Click Event
    regionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const region = button.dataset.region;
            openModal(region);
        });
    });

    // Open Modal
    function openModal(regionName) {
        const regionData = regionCultures[regionName];
        if (regionData) {
            modalTitle.textContent = regionData.title;
            cultureList.innerHTML = regionData.cultures
                .map(culture => `<li><a href="${culture.link}" target="_blank">${culture.name}</a></li>`)
                .join('');
        } else {
            modalTitle.textContent = "Region not found";
            cultureList.innerHTML = "<li>No data available for this region.</li>";
        }
        modal.style.display = 'block';
    }

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.style.display = 'none';
    });
});
