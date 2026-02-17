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

async function loadGallery() {
    const container = document.getElementById('gallery-feed');
    const loader = document.getElementById('main-loader');

    // Add V=JSON parameter to script URL
    const jsonUrl = SCRIPT_URL + '?v=json';

    try {
        const response = await fetch(jsonUrl);
        const imageIds = await response.json();

        loader.style.display = 'none';

        if (!imageIds || imageIds.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%; opacity:0.6;">Încă nu sunt poze.</p>';
            return;
        }

        imageIds.forEach(id => {
            // Google Drive Thumbnail Links
            const thumbUrl = `https://drive.google.com/thumbnail?sz=w400&id=${id}`;
            const fullUrl = `https://drive.google.com/thumbnail?sz=w1600&id=${id}`;

            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.onclick = () => openLightbox(fullUrl);

            const img = document.createElement('img');
            img.src = thumbUrl;
            img.loading = "lazy";
            img.alt = "Wedding Photo";

            card.appendChild(img);
            container.appendChild(card);
        });

    } catch (e) {
        console.error("Gallery Error:", e);
        loader.style.display = 'none';
        container.innerHTML = '<p style="text-align:center; width:100%; color:red;">Eroare la încărcarea galeriei. Verifică setările folderului.</p>';
    }
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
