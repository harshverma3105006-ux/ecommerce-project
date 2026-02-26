const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const productContent = document.getElementById('productContent');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Product DOM
const prodImage = document.getElementById('prodImage');
const prodName = document.getElementById('prodName');
const prodBrand = document.getElementById('prodBrand');
const prodCategory = document.getElementById('prodCategory');
const prodRating = document.getElementById('prodRating');
const prodPrice = document.getElementById('prodPrice');
const prodDescription = document.getElementById('prodDescription');
const prodStatus = document.getElementById('prodStatus');
const qtyRow = document.getElementById('qtyRow');
const prodQty = document.getElementById('prodQty');
const addToCartBtn = document.getElementById('addToCartBtn');

// Reviews DOM
const reviewMessage = document.getElementById('reviewMessage');
const writeReviewBox = document.getElementById('writeReviewBox');
const loginToReviewBox = document.getElementById('loginToReviewBox');
const reviewsContainer = document.getElementById('reviewsContainer');
const submitReviewBtn = document.getElementById('submitReviewBtn');
const ratingSelect = document.getElementById('ratingSelect');
const commentBox = document.getElementById('commentBox');

let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!productId) {
        window.location.href = '../index.html';
        return;
    }
    loadProduct();
    checkReviewAuth();
});

const loadProduct = async () => {
    showLoader(loading);
    hideMessage(errorMessage);
    productContent.style.display = 'none';

    try {
        const product = await fetchAPI(`/products/${productId}`);
        currentProduct = product;
        renderProduct(product);
        renderReviews(product.reviews);
        productContent.style.display = 'block';
    } catch (error) {
        showMessage(errorMessage, error.message);
    } finally {
        hideLoader(loading);
    }
};

const renderProduct = (product) => {
    prodImage.src = product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image;
    prodName.textContent = product.name;
    prodBrand.textContent = product.brand;
    prodCategory.textContent = product.category;

    // Rating
    prodRating.innerHTML = getRatingHtml(product.rating, product.numReviews);

    prodPrice.textContent = `₹${product.price}`;
    prodDescription.textContent = product.description;

    if (product.countInStock > 0) {
        prodStatus.textContent = 'In Stock';
        prodStatus.className = 'stock-status stock-in';
        qtyRow.style.display = 'flex';
        addToCartBtn.disabled = false;

        // Populate Qty Select
        prodQty.innerHTML = '';
        const limit = Math.min(product.countInStock, 10);
        for (let i = 1; i <= limit; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            prodQty.appendChild(option);
        }
    } else {
        prodStatus.textContent = 'Out Of Stock';
        prodStatus.className = 'stock-status stock-out';
        qtyRow.style.display = 'none';
        addToCartBtn.disabled = true;
    }
};

const renderReviews = (reviews) => {
    reviewsContainer.innerHTML = '';
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<div class="alert alert-info">No Reviews</div>';
        return;
    }

    reviews.forEach(review => {
        const date = new Date(review.createdAt).toISOString().substring(0, 10);
        const stars = getRatingHtml(review.rating, '');

        const div = document.createElement('div');
        div.className = 'review-card';
        div.innerHTML = `
            <div class="review-header">
                <span class="review-author">${review.name}</span>
                <span class="review-date">${date}</span>
            </div>
            <div style="color: #f59e0b; margin-bottom: 10px;">${stars}</div>
            <p>${review.comment}</p>
        `;
        reviewsContainer.appendChild(div);
    });
};

const getRatingHtml = (rating, numReviewsStr) => {
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
    if (numReviewsStr !== '') {
        html += ` <span style="color: var(--text-muted); font-size: 0.8rem;">(${numReviewsStr} reviews)</span>`;
    }
    return html;
};

// Add to Cart Logic
addToCartBtn.addEventListener('click', () => {
    if (currentProduct) {
        addToCartUtility(currentProduct, Number(prodQty.value));
        window.location.href = `cart.html`; // Redirect to cart
    }
});

// Review Logic
const checkReviewAuth = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        writeReviewBox.style.display = 'block';
        loginToReviewBox.style.display = 'none';

        // Remove existing listener to avoid duplicates if re-rendering
        const oldForm = document.getElementById('reviewForm');
        const newForm = oldForm.cloneNode(true);
        oldForm.parentNode.replaceChild(newForm, oldForm);

        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const reviewMessage = document.getElementById('reviewMessage');
            hideMessage(reviewMessage);

            const ratingSelect = document.getElementById('ratingSelect');
            const commentBox = document.getElementById('commentBox');
            const reviewBtn = document.getElementById('submitReviewBtn');

            const rating = ratingSelect.value;
            const comment = commentBox.value;

            const originalBtnText = reviewBtn.textContent;
            reviewBtn.textContent = 'Submitting...';
            reviewBtn.disabled = true;

            try {
                await fetchAPI(`/products/${productId}/reviews`, 'POST', { rating, comment }, true);
                showMessage(reviewMessage, 'Review submitted successfully', 'success');

                // Reset form and reload product
                ratingSelect.value = '';
                commentBox.value = '';
                loadProduct();

            } catch (error) {
                showMessage(reviewMessage, error.message);
            } finally {
                reviewBtn.textContent = originalBtnText;
                reviewBtn.disabled = false;
            }
        });
    } else {
        writeReviewBox.style.display = 'none';
        loginToReviewBox.style.display = 'block';
    }
};
