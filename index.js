async function fetchProducts() {
  try {
    console.log('Đang lấy danh sách sản phẩm...');
    const response = await fetch('https://67ffae04b72e9cfaf72583b0.mockapi.io/products');
    let products = await response.json();
    if (!products || products.length === 0) {
      console.warn('API trả về danh sách rỗng, sử dụng dữ liệu mẫu');
      products = [
        { id: 1, title: "Sản phẩm mẫu 1", price: 100000, image: "https://via.placeholder.com/150" },
        { id: 2, title: "Sản phẩm mẫu 2", price: 200000, image: "https://via.placeholder.com/150" }
      ];
    }
    console.log('Danh sách sản phẩm:', products);
    renderProducts(products);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    document.getElementById('productList').innerHTML = '<p class="text-center text-danger">Không thể tải danh sách sản phẩm!</p>';
  }
}

function renderProducts(products) {
  const productList = document.getElementById('productList');
  if (!productList) {
    console.error('Không tìm thấy phần tử #productList');
    return;
  }
  productList.innerHTML = '';
  products.forEach(product => {
    const safeProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image
    };
    const productDiv = document.createElement('div');
    productDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
    productDiv.innerHTML = `
      <div class="product-card animate__animated animate__fadeIn">
        <img src="${product.image}" alt="${product.title}">
        <h5>${product.title}</h5>
        <p>${product.price.toLocaleString('vi-VN')} VNĐ</p>
        <button class="btn btn-add-to-cart" onclick='addToCart(${JSON.stringify(safeProduct)})' title="Thêm vào giỏ hàng">
          <i class="bi bi-cart-plus"></i>
        </button>
      </div>
    `;
    productList.appendChild(productDiv);
  });
}

function renderUserSection() {
  const user = JSON.parse(localStorage.getItem('user'));
  const btnLogout = document.getElementById('btnLogout');
  const btnLogoutOffcanvas = document.getElementById('btnLogoutOffcanvas');
  if (user) {
    btnLogout.style.display = 'block';
    btnLogoutOffcanvas.style.display = 'flex';
  } else {
    btnLogout.style.display = 'none';
    btnLogoutOffcanvas.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('user');
  renderUserSection();
  alert('Đăng xuất thành công!');
}

document.getElementById('btnLogout').addEventListener('click', logout);
document.getElementById('btnLogoutOffcanvas').addEventListener('click', logout);

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded triggered');
  fetchProducts();
  renderUserSection();
});