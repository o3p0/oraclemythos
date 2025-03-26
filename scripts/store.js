// store.js

// Handle eBook Download with custom pricing
const priceInput = document.getElementById("price-input");
const downloadBtn = document.getElementById("download-btn");

downloadBtn.addEventListener("click", () => {
  const price = parseFloat(priceInput.value);
  if (isNaN(price) || price < 0) {
    alert("Please enter a valid price.");
    return;
  }

  console.log(`User set price: $${price.toFixed(2)}`);
  window.location.href = "files/oracle-ebook.pdf";
});

// Simple Carousel Auto Scroll
const carousel = document.querySelector(".carousel");
let scrollInterval = setInterval(() => {
  if (!carousel) return;
  carousel.scrollBy({ left: 220, behavior: "smooth" });
}, 4000);

carousel?.addEventListener("mouseenter", () => clearInterval(scrollInterval));
carousel?.addEventListener("mouseleave", () => {
  scrollInterval = setInterval(() => {
    carousel.scrollBy({ left: 220, behavior: "smooth" });
  }, 4000);
});

// Product Click to Expand
const productCards = document.querySelectorAll(".product-card");
const detailSection = document.getElementById("product-detail");
const detailTitle = document.getElementById("detail-title");
const detailDesc = document.getElementById("detail-description");
const detailImg = document.getElementById("detail-image");
const detailBuy = document.getElementById("detail-buy");

productCards.forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.dataset.title;
    const description = card.dataset.description;
    const image = card.dataset.image;
    const link = card.dataset.link;

    detailTitle.textContent = title;
    detailDesc.textContent = description;
    detailImg.src = image;
    detailBuy.href = link;

    detailSection.style.display = "block";
    detailSection.scrollIntoView({ behavior: "smooth" });
  });
});
