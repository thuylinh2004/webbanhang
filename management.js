const API_URL = 'https://67ffae04b72e9cfaf72583b0.mockapi.io/products';
let products = [];
let filteredProducts = [];

function openAddProductModal() {
  clearModalInputs('add');
  new bootstrap.Modal(document.getElementById('addProductModal')).show();
}

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    products = await response.json();
    filteredProducts = [...products];
    renderProducts();
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
  }
}

function validateInputs(modalType) {
  const fields = ['ProductName', 'ProductDescription', 'ProductPrice', 'ProductImage'];
  let isValid = true;
  fields.forEach(field => {
    const input = document.getElementById(`${modalType}${field}`);
    const error = document.getElementById(`${modalType}${field}Error`);
    error.style.display = input.value ? 'none' : 'block';
    if (!input.value) isValid = false;
  });
  return isValid;
}

function clearModalInputs(modalType) {
  ['ProductName', 'ProductDescription', 'ProductPrice', 'ProductImage'].forEach(field => {
    document.getElementById(`${modalType}${field}`).value = '';
    document.getElementById(`${modalType}${field}Error`).style.display = 'none';
  });
}

function renderProducts() {
  const tableBody = document.getElementById('productTableBody');
  tableBody.innerHTML = '';
  filteredProducts.forEach(product => {
    const row = document.createElement('tr');
    row.className = 'animate__animated animate__fadeIn';
    row.innerHTML = `
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price.toLocaleString('vi-VN')} VNĐ</td>
      <td><img src="${product.image}" alt="${product.title}"></td>
      <td>${new Date(product.createdAt).toLocaleString()}</td>
      <td>
        <button class="btn btn-primary btn-sm me-1" onclick="viewProduct(${product.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-warning btn-sm me-1" onclick="editProduct(${product.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
  renderProducts();
}

async function addProduct() {
  if (!validateInputs('add')) return;
  const button = document.getElementById('addProductBtn');
  button.classList.add('loading');
  button.disabled = true;
  const newProduct = {
    title: document.getElementById('addProductName').value,
    description: document.getElementById('addProductDescription').value,
    price: parseFloat(document.getElementById('addProductPrice').value),
    image: document.getElementById('addProductImage').value,
    createdAt: new Date().toISOString()
  };
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    await fetchProducts();
    button.classList.remove('loading');
    button.disabled = false;
    document.getElementById('addProductModal').querySelector('.btn-close').click();
    clearModalInputs('add');
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
  }
}

function viewProduct(id) {
  const product = products.find(p => p.id == id);
  if (product) {
    document.getElementById('viewProductName').textContent = product.title;
    document.getElementById('viewProductDescription').textContent = product.description;
    document.getElementById('viewProductPrice').textContent = product.price.toLocaleString('vi-VN') + ' VNĐ';
    document.getElementById('viewProductCreatedAt').textContent = new Date(product.createdAt).toLocaleString();
    document.getElementById('viewProductImage').src = product.image;
    new bootstrap.Modal(document.getElementById('viewProductModal')).show();
  }
}

function editProduct(id) {
  const product = products.find(p => p.id == id);
  if (product) {
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.title;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductImage').value = product.image;
    new bootstrap.Modal(document.getElementById('editProductModal')).show();
  } else {
    console.error('Không tìm thấy sản phẩm với id:', id);
  }
}

async function saveEditProduct() {
  if (!validateInputs('edit')) return;
  const id = document.getElementById('editProductId').value;
  const button = document.getElementById('editProductBtn');
  button.classList.add('loading');
  button.disabled = true;
  const updatedProduct = {
    title: document.getElementById('editProductName').value,
    description: document.getElementById('editProductDescription').value,
    price: parseFloat(document.getElementById('editProductPrice').value),
    image: document.getElementById('editProductImage').value,
    createdAt: new Date().toISOString()
  };
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    await fetchProducts();
    button.classList.remove('loading');
    button.disabled = false;
    document.getElementById('editProductModal').querySelector('.btn-close').click();
  } catch (error) {
    console.error('Lỗi khi sửa sản phẩm:', error);
  }
}

async function deleteProduct(id) {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      await fetchProducts();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});