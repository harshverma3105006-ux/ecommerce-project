const productGrid = document.getElementById('productGrid');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let currentPage = 1;
let currentKeyword = '';

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

const loadProducts = async (keyword = '', page = 1) => {
    showLoader(loading);
    hideMessage(errorMessage);
    productGrid.innerHTML = '';

    try {
        const query = `?keyword=${keyword}&pageNumber=${page}`;
        const data = await fetchAPI(`/products${query}`);

        if (data.products.length === 0) {
            showMessage(errorMessage, 'No products found', 'info');
        } else {
            renderProducts(data.products);
        }
    } catch (error) {
        showMessage(errorMessage, error.message);
    } finally {
        hideLoader(loading);
    }
};

const renderProducts = (products) => {
    products.forEach((product) => {
        const ratingHtml = getRatingHtml(product.rating, product.numReviews);

        // Dynamically fix the image path to point to your backend server
        const imageUrl = product.image.startsWith('/')
            ? `${product.image}`
            : product.image;

        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => {
            window.location.href = `pages/product.html?id=${product._id}`;
        };

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${imageUrl}" alt="${product.name}" class="card-img" style="object-fit: cover;">
            </div>
            <div class="card-body">
                <div class="card-brand">${product.brand}</div>
                <h3 class="card-title">${product.name}</h3>
                <div class="card-rating">
                    ${ratingHtml}
                </div>
                <div class="card-price">₹${product.price}</div>
            </div>
        `;

        productGrid.appendChild(card);
    });
};

const getRatingHtml = (rating, numReviews) => {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            html += '<i class="fas fa-star"></i>';
        } else if (rating >= i - 0.5) {
            html += '<i class="fas fa-star-half-alt"></i>';
        } else {
            html += '<i class="far fa-star"></i>';
        }
    }
    html += ` <span style="color: var(--text-muted); font-size: 0.8rem;">(${numReviews})</span>`;
    return html;
};

// Search Logic
searchBtn.addEventListener('click', () => {
    currentKeyword = searchInput.value;
    currentPage = 1;
    loadProducts(currentKeyword, currentPage);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentKeyword = searchInput.value;
        currentPage = 1;
        loadProducts(currentKeyword, currentPage);
    }
});

// Promotional Carousel Logic
const carouselInner = document.getElementById('carouselInner');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let currentSlide = 0;
let totalSlides = indicators.length;
let autoSlideInterval;

if (carouselInner && indicators.length > 0) {
    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        indicators.forEach((ind, index) => {
            ind.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
            resetAutoSlide();
        });
    });

    startAutoSlide();
}
