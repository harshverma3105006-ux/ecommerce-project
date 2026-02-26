const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const editProductForm = document.getElementById('editProductForm');
const loading = document.getElementById('loading');
const messageBox = document.getElementById('message');
const updateBtn = document.getElementById('updateBtn');

// Inputs
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('image');
const imageFileInput = document.getElementById('imageFile');
const brandInput = document.getElementById('brand');
const countInStockInput = document.getElementById('countInStock');
const categoryInput = document.getElementById('category');
const descriptionInput = document.getElementById('description');

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    if (!productId) {
        window.location.href = 'dashboard.html';
        return;
    }
    loadProduct();
});

const checkAdminAuth = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) {
        window.location.href = '../../index.html';
    }
};

const loadProduct = async () => {
    showLoader(loading);
    editProductForm.style.display = 'none';

    try {
        const product = await fetchAPI(`/products/${productId}`);

        nameInput.value = product.name;
        priceInput.value = product.price;
        imageInput.value = product.image;
        brandInput.value = product.brand;
        countInStockInput.value = product.countInStock;
        categoryInput.value = product.category;
        descriptionInput.value = product.description;

        editProductForm.style.display = 'block';
    } catch (error) {
        showMessage(messageBox, error.message);
    } finally {
        hideLoader(loading);
    }
};

editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage(messageBox);

    const originalText = updateBtn.textContent;
    updateBtn.textContent = 'Updating...';
    updateBtn.disabled = true;

    try {
        const updatedData = {
            name: nameInput.value,
            price: Number(priceInput.value),
            image: imageInput.value,
            brand: brandInput.value,
            category: categoryInput.value,
            countInStock: Number(countInStockInput.value),
            description: descriptionInput.value
        };

        await fetchAPI(`/products/${productId}`, 'PUT', updatedData, true);
        showMessage(messageBox, 'Product Updated Successfully', 'success');
    } catch (error) {
        showMessage(messageBox, error.message);
    } finally {
        updateBtn.textContent = originalText;
        updateBtn.disabled = false;
    }
});

imageFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    hideMessage(messageBox);
    loading.style.display = 'block';

    try {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const res = await fetch(`http://localhost:5000/api/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.text();

        if (res.ok) {
            imageInput.value = data;  // the server returns the path string directly
            showMessage(messageBox, 'Image Uploaded successfully', 'success');
        } else {
            showMessage(messageBox, 'Error uploading image');
        }

    } catch (error) {
        showMessage(messageBox, error.message);
    } finally {
        loading.style.display = 'none';
        imageFileInput.value = ''; // clear input
    }
});
