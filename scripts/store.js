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

  // Log the price (simulate checkout process)
  console.log(`User set price: $${price.toFixed(2)}`);

  // Simulate instant download (replace URL with actual file)
  window.location.href = "files/oracle-ebook.pdf";
});

// Simple Carousel Auto Scroll for Featured Products
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
