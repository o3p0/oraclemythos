document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('cultureModal');
    const modalContent = document.querySelector('.modal-content'); // Get scroll content
    const cultureList = document.getElementById('culture-list');
    const regionButtons = document.querySelectorAll('.region-button');

    const regionCultures = {
        north: {
            cultures: [
                { name: "Norse Mythology", link: "culture/norse.html" },
                { name: "Greek Mythology", link: "culture/greek.html" }
            ]
        },
        south: {
            cultures: [
                { name: "Yoruba Mythology", link: "culture/yoruba.html" },
                { name: "Egyptian Mythology", link: "culture/egyptian.html" }
            ]
        },
        east: {
            cultures: [
                { name: "Chinese Mythology", link: "culture/chinese.html" },
                { name: "Hindu Mythology", link: "culture/hindu.html" }
            ]
        },
        west: {
            cultures: [
                { name: "Mayan Mythology", link: "culture/mayan.html" },
                { name: "Aztec Mythology", link: "culture/aztec.html" }
            ]
        }
    };

    // Ensure modal is hidden at the start
    modal.style.display = 'none';

    // Handle Region Clicks to Show Modal
    regionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const region = e.target.dataset.region;
            openModal(region);
        });
    });

    // Open Modal with List of Mythologies
    function openModal(regionName) {
        const regionData = regionCultures[regionName];

        if (!regionData) {
            cultureList.innerHTML = "<li>No data available for this region.</li>";
        } else {
            cultureList.innerHTML = regionData.cultures
                .map(culture => `<li><a href="${culture.link}">${culture.name}</a></li>`)
                .join('');
        }

        modal.style.display = 'flex'; // Ensure modal is visible
    }

    // ✅ Close Modal When Clicking Outside of Scroll
    modal.addEventListener('click', (e) => {
        // Ensure click happens on modal background (not inside modal-content)
        if (!modalContent.contains(e.target)) {
            modal.style.display = 'none';
        }
    });

    // Prevent Closing Modal When Clicking Inside the Scroll
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops click event from bubbling up
    });

    // ✅ Close Modal on Escape Key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
});
