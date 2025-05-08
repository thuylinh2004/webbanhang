let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartOffcanvasElement = null;
let cartOffcanvas = null;
let isOpening = false;

function initCart() {
  cartOffcanvasElement = document.getElementById('cartOffcanvas');
  console.log('cartOffcanvasElement:', cartOffcanvasElement);
  if (cartOffcanvasElement) {
    cartOffcanvas = new bootstrap.Offcanvas(cartOffcanvasElement);
    console.log('cartOffcanvas khởi tạo thành công');
    cartOffcanvasElement.addEventListener('hide.bs.offcanvas', () => {
      cartOffcanvasElement.classList.remove('animate-open');
      cartOffcanvasElement.classList.add('animate-close');
    });
    cartOffcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
      isOpening = false;
    });
  } else {
    console.error('Không tìm thấy #cartOffcanvas');
  }
  updateCartCount();
  renderCartItems();
}

function openCart(event) {
  event.preventDefault();
  event.stopPropagation();
  console.log('openCart được gọi');
  // Kiểm tra và khởi tạo lại nếu cần
  if (!cartOffcanvasElement || !cartOffcanvas) {
    cartOffcanvasElement = document.getElementById('cartOffcanvas');
    if (cartOffcanvasElement) {
      cartOffcanvas = new bootstrap.Offcanvas(cartOffcanvasElement);
      console.log('cartOffcanvas được khởi tạo lại trong openCart');
    } else {
      console.error('Không tìm thấy #cartOffcanvas khi mở giỏ hàng');
      return;
    }
  }
  if (isOpening || cartOffcanvas._isShown) {
    console.log('Giỏ hàng đang mở hoặc đang trong trạng thái mở');
    return;
  }
  isOpening = true;
  cartOffcanvasElement.classList.remove('animate-close');
  cartOffcanvasElement.classList.add('animate-open');
  renderCartItems();
  cartOffcanvas.show();
  setTimeout(() => {
    isOpening = false;
  }, 500);
}

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function updateCartCount() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
  const cartCountOffcanvasElement = document.getElementById('cartCountOffcanvas');
  if (cartCountOffcanvasElement) {
    cartCountOffcanvasElement.textContent = totalItems;
  }
}

function renderCartItems() {
  const cartItemsDiv = document.getElementById('cartItems');
  if (!cartItemsDiv) {
    console.error('Không tìm thấy #cartItems');
    return;
  }
  cartItemsDiv.innerHTML = '';
  cartItems.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item animate__animated animate__fadeInUp';
    itemDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.image}" alt="${item.title}">
        <div class="item-details">
          <h6>${item.title}</h6>
          <p>${item.price.toLocaleString('vi-VN')} VNĐ x ${item.quantity}</p>
        </div>
      </div>
      <div class="quantity-controls">
        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
        <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });
  updateCartTotal();
}

function updateQuantity(productId, change) {
  const cartItem = cartItems.find(item => item.id == productId);
  if (!cartItem) return;
  cartItem.quantity += change;
  if (cartItem.quantity <= 0) {
    cartItems = cartItems.filter(item => item.id != productId);
  }
  saveCart();
  updateCartCount();
  renderCartItems();
}

function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id != productId);
  saveCart();
  updateCartCount();
  renderCartItems();
}

function clearCart() {
  cartItems = [];
  saveCart();
  updateCartCount();
  renderCartItems();
}

function updateCartTotal() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotalElement = document.getElementById('cartTotal');
  if (cartTotalElement) {
    cartTotalElement.textContent = total.toLocaleString('vi-VN') + ' VNĐ';
  }
}

function addToCart(product) {
  const cartItem = cartItems.find(item => item.id == product.id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  saveCart();
  updateCartCount();
  renderCartItems();
  alert(`${product.title} đã được thêm vào giỏ hàng!`);
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  updateThemeToggle(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
  const themeToggles = [document.getElementById('themeToggle'), document.getElementById('themeToggleOffcanvas')];
  themeToggles.forEach(toggle => {
    if (toggle) {
      const icon = toggle.querySelector('i');
      const text = toggle.querySelector('span');
      if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        text.textContent = 'Light Mode';
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        text.textContent = 'Dark Mode';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  initCart();
  initTheme();
});