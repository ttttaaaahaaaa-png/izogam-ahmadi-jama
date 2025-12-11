// مدیریت حساب کاربری

// داده‌های اولیه کاربران
let users = JSON.parse(localStorage.getItem('users')) || [];

// اضافه کردن کاربر ادمین اولیه اگر وجود ندارد
if (!users.some(user => user.isAdmin)) {
    users.push({
        id: 1,
        name: "ادمین سایت",
        email: "admin@example.com",
        password: "admin123", // در حالت واقعی باید هش شود
        phone: "09123456789",
        registerDate: new Date().toLocaleString('fa-IR'),
        isAdmin: true
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// مدیریت تب‌های ورود/ثبت‌نام
function setupAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // حذف کلاس active از همه تب‌ها و فرم‌ها
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            // اضافه کردن کلاس active به تب و فرم انتخاب شده
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-form`).classList.add('active');
        });
    });
}

// ثبت‌نام کاربر جدید
function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // اعتبارسنجی
    if (password !== confirmPassword) {
        showAuthMessage('رمز عبور و تکرار آن یکسان نیستند', 'error');
        return;
    }
    
    // بررسی اینکه آیا کاربر با این ایمیل قبلاً ثبت‌نام کرده است
    if (users.some(user => user.email === email)) {
        showAuthMessage('این ایمیل قبلاً ثبت‌نام کرده است', 'error');
        return;
    }
    
    // ایجاد کاربر جدید
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        phone,
        password, // در حالت واقعی باید هش شود
        registerDate: new Date().toLocaleString('fa-IR'),
        isAdmin: false
    };
    
    // اضافه کردن کاربر به لیست
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // ورود خودکار کاربر
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // نمایش پیام موفقیت
    showAuthMessage('ثبت‌نام با موفقیت انجام شد! خوش آمدید ' + name, 'success');
    
    // ریدایرکت به صفحه اصلی بعد از 2 ثانیه
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// ورود کاربر
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // پیدا کردن کاربر
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showAuthMessage('ایمیل یا رمز عبور اشتباه است', 'error');
        return;
    }
    
    // ذخیره اطلاعات کاربر در localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // نمایش پیام موفقیت
    showAuthMessage('ورود با موفقیت انجام شد! خوش آمدید ' + user.name, 'success');
    
    // ریدایرکت به صفحه اصلی بعد از 2 ثانیه
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// نمایش پیام احراز هویت
function showAuthMessage(message, type = 'info') {
    const messageElement = document.getElementById('auth-message');
    messageElement.textContent = message;
    messageElement.className = 'auth-message';
    messageElement.classList.add(type);
    messageElement.style.display = 'block';
    
    // پنهان کردن پیام بعد از 5 ثانیه
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// بازیابی رمز عبور
function forgotPassword() {
    const email = prompt('لطفا ایمیل خود را وارد کنید:');
    
    if (!email) return;
    
    // بررسی وجود ایمیل در سیستم
    const user = users.find(u => u.email === email);
    
    if (user) {
        alert('ایمیل بازیابی رمز عبور به آدرس ' + email + ' ارسال شد.\n(این یک سیستم دمو است، در حالت واقعی ایمیل ارسال می‌شود)');
    } else {
        alert('کاربری با این ایمیل یافت نشد');
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

// به روزرسانی تعداد آیتم های سبد خرید
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    // تنظیم تب‌ها
    setupAuthTabs();
    setupMobileMenu();
    updateCartCount();
    
    // تنظیم فرم‌ها
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }
    
    // تنظیم لینک فراموشی رمز عبور
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPassword();
        });
    }
});
