document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Animations
    const fadeElements = document.querySelectorAll('.hero-content, .photo-frame, .couple-names');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300);
    });

    // 2. Fetch Gallery
    loadGallery();
});

// Global state for Infinite Scroll
let allImageIds = [];
let currentIndex = 0;
const BATCH_SIZE = 15;
let isLoading = false;

async function loadGallery() {
    const container = document.getElementById('gallery-feed');
    const loader = document.getElementById('main-loader');

    // Add V=JSON parameter to script URL
    const jsonUrl = SCRIPT_URL + '?v=json';

    try {
        const response = await fetch(jsonUrl);
        allImageIds = await response.json(); // Get ALL sorted IDs

        loader.style.display = 'none';

        if (!allImageIds || allImageIds.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%; opacity:0.6;">Încă nu sunt poze.</p>';
            return;
        }

        // Load first batch
        loadMoreImages();

        // Setup Infinite Scroll
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
                loadMoreImages();
            }
        });

    } catch (e) {
        console.error("Gallery Error:", e);
        loader.style.display = 'none';
        container.innerHTML = '<p style="text-align:center; width:100%; color:red;">Eroare la încărcarea galeriei.</p>';
    }
}

function loadMoreImages() {
    if (isLoading || currentIndex >= allImageIds.length) return;

    isLoading = true;
    const container = document.getElementById('gallery-feed');

    // Get next batch of IDs
    const nextBatch = allImageIds.slice(currentIndex, currentIndex + BATCH_SIZE);

    nextBatch.forEach(id => {
        // Google Drive Thumbnail Links
        const thumbUrl = `https://drive.google.com/thumbnail?sz=w400&id=${id}`;
        const fullUrl = `https://drive.google.com/thumbnail?sz=w1600&id=${id}`;

        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.onclick = () => openLightbox(fullUrl);

        const img = document.createElement('img');
        img.src = thumbUrl;
        img.loading = "lazy"; // Native lazy loading
        img.alt = "Wedding Photo";

        // Find animation (fade in)
        img.style.opacity = '0';
        img.onload = () => img.style.opacity = '1';

        card.appendChild(img);
        container.appendChild(card);
    });

    currentIndex += nextBatch.length;
    isLoading = false;
}

// Lightbox Logic
const lightboxHtml = `
<div id="lightbox" class="lightbox-modal" onclick="closeLightbox()">
    <span class="lightbox-close">&times;</span>
    <img id="lightbox-img" src="" onclick="event.stopPropagation()">
</div>`;
document.body.insertAdjacentHTML('beforeend', lightboxHtml);

function openLightbox(url) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = url;
    lb.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}
