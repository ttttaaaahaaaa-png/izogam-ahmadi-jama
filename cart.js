// بارگذاری سبد خرید از localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// نمایش سبد خرید
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        subtotalElement.textContent = '0 تومان';
        discountElement.textContent = '0 تومان';
        totalElement.textContent = '0 تومان';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';
    
    // پاک کردن محتوای قبلی
    cartItemsContainer.innerHTML = '';
    
    // محاسبات مالی
    let subtotal = 0;
    
    // نمایش هر آیتم
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price.toLocaleString()} تومان</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-total">
                ${itemTotal.toLocaleString()} تومان
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i> حذف
            </button>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // محاسبه تخفیف و مبلغ نهایی
    const discount = subtotal > 2000000 ? subtotal * 0.1 : 0; // 10% تخفیف برای خریدهای بالای 2 میلیون
    const total = subtotal - discount;
    
    // به روزرسانی مقادیر مالی
    subtotalElement.textContent = `${subtotal.toLocaleString()} تومان`;
    discountElement.textContent = `${discount.toLocaleString()} تومان`;
    totalElement.textContent = `${total.toLocaleString()} تومان`;
    
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.cursor = 'pointer';
}

// به روزرسانی تعداد محصول
function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        // اگر تعداد به صفر یا کمتر رسید، محصول را حذف کن
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // ذخیره تغییرات
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // به روزرسانی نمایش
        displayCart();
        updateCartCount();
        
        // نمایش پیام
        showNotification('تعداد محصول به روزرسانی شد', 'success');
    }
}

// حذف محصول از سبد خرید
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // ذخیره تغییرات
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // به روزرسانی نمایش
    displayCart();
    updateCartCount();
    
    // نمایش پیام
    showNotification('محصول از سبد خرید حذف شد', 'success');
}

// تکمیل فرآیند خرید
function checkout() {
    if (!currentUser) {
        showNotification('لطفا ابتدا وارد حساب کاربری خود شوید', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    if (cart.length === 0) {
        showNotification('سبد خرید شما خالی است', 'error');
        return;
    }
    
    // ایجاد سفارش
    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: [...cart],
        date: new Date().toLocaleString('fa-IR'),
        status: 'pending',
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        discount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 2000000 ? 
                 cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1 : 0,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) - 
               (cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 2000000 ? 
                cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1 : 0)
    };
    
    // ذخیره سفارش در localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // خالی کردن سبد خرید
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // نمایش پیام موفقیت
    showNotification('سفارش شما با موفقیت ثبت شد. کد پیگیری: ' + order.id, 'success');
    
    // به روزرسانی نمایش
    displayCart();
    
    // ریدایرکت به صفحه اصلی بعد از 3 ثانیه
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// نمایش نوتیفیکیشن
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        text-align: center;
        transform: translateY(-100px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(-100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// به روزرسانی تعداد آیتم های سبد خرید
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// بررسی وضعیت کاربر
function checkUserStatus() {
    const authLink = document.getElementById('auth-link');
    const adminLink = document.getElementById('admin-link');
    
    if (currentUser) {
        if (authLink) {
            authLink.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
            authLink.href = "#";
        }
        
        if (currentUser.isAdmin && adminLink) {
            adminLink.style.display = 'block';
        }
    }
}

// مدیریت منوی موبایل
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar ul');
    
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updateCartCount();
    checkUserStatus();
    setupMobileMenu();
    
    // تنظیم رویداد برای دکمه تکمیل خرید
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});
