// تعریف محصولات اولیه
const initialProducts = [
    {
        id: 1,
        name: "ایزوگام پلیمری",
        price: 850000,
        image: "001.jpg",
        description: "ایزوگام پلیمری با کیفیت بالا و مقاومت عالی در برابر نفوذ آب و رطوبت"
    },
    {
        id: 2,
        name: "ایزوگام معمولی",
        price: 650000,
        image: "002.jpg",
        description: "ایزوگام معمولی با قیمت مناسب و کارایی خوب برای سقف های شیبدار"
    },
    {
        id: 3,
        name: "ایزوگام مسلح",
        price: 950000,
        image: "003.jpg",
        description: "ایزوگام مسلح شده با الیاف پلی استر برای مقاومت بیشتر"
    },
    {
        id: 4,
        name: "ایزوگام ضد حریق",
        price: 1200000,
        image: "004.jpg",
        description: "ایزوگام مقاوم در برابر آتش با استانداردهای بین المللی"
    }
];

// مدیریت سبد خرید
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// به روزرسانی تعداد آیتم های سبد خرید
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// ذخیره سبد خرید در localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// اضافه کردن محصول به سبد خرید
function addToCart(productId, quantity = 1) {
    const product = initialProducts.find(p => p.id === productId);
    
    if (!product) {
        alert('محصول یافت نشد!');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    
    // نمایش پیام موفقیت
    showNotification('محصول با موفقیت به سبد خرید اضافه شد!', 'success');
}

// نمایش محصولات
function displayProducts() {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    initialProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${product.price.toLocaleString()} تومان</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> افزودن به سبد خرید
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

// نمایش نوتیفیکیشن
function showNotification(message, type = 'info') {
    // ایجاد عنصر نوتیفیکیشن
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#2196F3'};
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
    
    // نمایش نوتیفیکیشن
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // حذف نوتیفیکیشن بعد از 3 ثانیه
    setTimeout(() => {
        notification.style.transform = 'translateY(-100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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

// مدیریت فرم تماس
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // در اینجا کد ارسال فرم به سرور قرار می‌گیرد
            showNotification('پیام شما با موفقیت ارسال شد!', 'success');
            contactForm.reset();
        });
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
        
        // اگر کاربر ادمین است، لینک پنل ادمین را نشان بده
        if (currentUser.isAdmin && adminLink) {
            adminLink.style.display = 'block';
        }
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartCount();
    setupMobileMenu();
    setupContactForm();
    checkUserStatus();
});
