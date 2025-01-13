// Constructor to create Product objects
class Product {
    constructor(id, title, price, description, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    // Method to render product as a card
    render() {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <img src="${this.image}" alt="${this.title}" class="product-image">
            <h2 class="product-title">${this.title}</h2>
            <p class="product-price">$${this.price}</p>
            <p class="product-description">${this.description}</p>
            <button onclick="updateProduct('${this.id}')">Update</button>
            <button onclick="deleteProduct('${this.id}')">Delete</button>
        `;

        return card;
    }
}

const apiUrl = 'https://678519601ec630ca33a7328c.mockapi.io/card';
const productContainer = document.getElementById('product-container');

// READ: Fetch products from API and render them
async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        productContainer.innerHTML = '';
        products.map(productData => {
            const product = new Product(
                productData.id,
                productData.title,
                productData.price,
                productData.description,
                productData.image
            );
            productContainer.appendChild(product.render());
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// CREATE: Add a new product
async function createProduct(newProduct) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        const createdProduct = await response.json();
        console.log('Product created:', createdProduct);
        fetchProducts();
    } catch (error) {
        console.error('Error creating product:', error);
    }
}

// UPDATE: Update product title
async function updateProduct(id) {
    const newTitle = prompt('Enter new title:');
    if (!newTitle) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle })
        });
        const updatedProduct = await response.json();
        console.log('Product updated:', updatedProduct);
        fetchProducts();
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

// DELETE: Delete a product
async function deleteProduct(id) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        console.log('Product deleted:', id);
        fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Initialize and fetch initial products
document.addEventListener('DOMContentLoaded', fetchProducts);

// Handle Create New Product button click
document.getElementById('create-product-btn').addEventListener('click', () => {
    // Prompt the user for product details
    const title = prompt('Enter product title:');
    const price = prompt('Enter product price:');
    const description = prompt('Enter product description:');
    const image = prompt('Enter product image URL:');

    if (title && price && description || image) {
        const newProduct = {
            title,
            price: parseFloat(price),
            description,
            image
        };

        // Call createProduct to add the new product
        createProduct(newProduct);
    } else {
        alert('All fields are required.');
    }
});
