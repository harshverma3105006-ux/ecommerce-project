const productsTableBody = document.getElementById('productsTableBody');
const loading = document.getElementById('loading');
const messageBox = document.getElementById('message');
const contentContainer = document.getElementById('contentContainer');
const createProductBtn = document.getElementById('createProductBtn');

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadProducts();
});

const checkAdminAuth = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) {
        window.location.href = '../../index.html';
    }
};

const loadProducts = async () => {
    showLoader(loading);
    contentContainer.style.display = 'none';
    hideMessage(messageBox);

    try {
        const data = await fetchAPI('/products?pageNumber=1&keyword=');

        productsTableBody.innerHTML = '';
        data.products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product._id.substring(0, 8)}...</td>
                <td>${product.name}</td>
                <td>₹${product.price}</td>
                <td>${product.category}</td>
                <td>${product.brand}</td>
                <td class="action-btns">
                    <a href="product-edit.html?id=${product._id}" class="btn btn-primary btn-sm">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-danger btn-sm" style="background:var(--danger-color); color:white; border:none;" onclick="deleteProduct('${product._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productsTableBody.appendChild(tr);
        });

        contentContainer.style.display = 'block';
    } catch (error) {
        showMessage(messageBox, error.message);
    } finally {
        hideLoader(loading);
    }
};

window.deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await fetchAPI(`/products/${id}`, 'DELETE', null, true);
            showMessage(messageBox, 'Product Deleted', 'success');
            loadProducts();
        } catch (error) {
            showMessage(messageBox, error.message);
        }
    }
};

createProductBtn.addEventListener('click', async () => {
    if (confirm('Create a new dummy product?')) {
        createProductBtn.disabled = true;
        try {
            const createdProduct = await fetchAPI('/products', 'POST', {}, true);
            window.location.href = `product-edit.html?id=${createdProduct._id}`;
        } catch (error) {
            showMessage(messageBox, error.message);
        } finally {
            createProductBtn.disabled = false;
        }
    }
});
