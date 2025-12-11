// بررسی دسترسی ادمین
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// اگر کاربر ادمین نباشد، به صفحه اصلی ریدایرکت شود
if (!currentUser || !currentUser.isAdmin) {
    alert('شما مجوز دسترسی به این صفحه را ندارید!');
    window.location.href = 'index.html';
}

// داده‌های اولیه
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: "ایزوگام پلیمری",
        price: 850000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        description: "ایزوگام پلیمری با کیفیت بالا و مقاومت عالی در برابر نفوذ آب و رطوبت"
    },
    {
        id: 2,
        name: "ایزوگام معمولی",
        price: 650000,
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        description: "ایزوگام معمولی با قیمت مناسب و کارایی خوب برای سقف های شیبدار"
    },
    {
        id: 3,
        name: "ایزوگام مسلح",
        price: 950000,
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        description: "ایزوگام مسلح شده با الیاف پلی استر برای مقاومت بیشتر"
    },
    {
        id: 4,
        name: "ایزوگام ضد حریق",
        price: 1200000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        description: "ایزوگام مقاوم در برابر آتش با استانداردهای بین المللی"
    }
];

// نمایش سفارشات
function displayOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersTableBody = document.getElementById('orders-table-body');
    
    if (!ordersTableBody) return;
    
    ordersTableBody.innerHTML = '';
    
    if (orders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #666;">
                    هیچ سفارشی ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    // نمایش 10 سفارش آخر
    const recentOrders = orders.slice(-10).reverse();
    
    recentOrders.forEach(order => {
        // پیدا کردن نام کاربر
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === order.userId) || { name: 'مهمان' };
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${user.name}</td>
            <td>${order.date}</td>
            <td>${order.total.toLocaleString()} تومان</td>
            <td><span class="status ${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="editOrderStatus(${order.id})">ویرایش وضعیت</button>
                <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})">حذف</button>
            </td>
        `;
        
        ordersTableBody.appendChild(row);
    });
}

// نمایش محصولات در پنل ادمین
function displayAdminProducts() {
    const productsTableBody = document.getElementById('products-table-body');
    
    if (!productsTableBody) return;
    
    productsTableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;"></td>
            <td>${product.name}</td>
            <td>${product.price.toLocaleString()} تومان</td>
            <td>${product.description.substring(0, 50)}...</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">ویرایش</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">حذف</button>
            </td>
        `;
        
        productsTableBody.appendChild(row);
    });
}

// نمایش کاربران
function displayUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usersTableBody = document.getElementById('users-table-body');
    
    if (!usersTableBody) return;
    
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #666;">
                    هیچ کاربری ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td>${user.registerDate || 'نامشخص'}</td>
            <td>${user.isAdmin ? 'ادمین' : 'کاربر عادی'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editUser(${user.id})">ویرایش</button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">حذف</button>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });
}

// اضافه کردن محصول جدید
function addProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const price = parseInt(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value;
    const description = document.getElementById('product-description').value;
    
    // ایجاد محصول جدید
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price,
        image,
        description
    };
    
    // اضافه کردن محصول به لیست
    products.push(newProduct);
    
    // ذخیره در localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // به روزرسانی نمایش
    displayAdminProducts();
    
    // ریست فرم
    document.getElementById('add-product-form').reset();
    
    // نمایش پیام موفقیت
    showNotification('محصول جدید با موفقیت اضافه شد', 'success');
}

// حذف محصول
function deleteProduct(productId) {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
        products = products.filter(product => product.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        displayAdminProducts();
        showNotification('محصول با موفقیت حذف شد', 'success');
    }
}

// ویرایش محصول
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // در اینجا می‌توانید یک مودال برای ویرایش محصول ایجاد کنید
    const newName = prompt('نام جدید محصول:', product.name);
    if (newName) product.name = newName;
    
    const newPrice = prompt('قیمت جدید محصول:', product.price);
    if (newPrice) product.price = parseInt(newPrice);
    
    const newDescription = prompt('توضیحات جدید:', product.description);
    if (newDescription) product.description = newDescription;
    
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
    showNotification('محصول با موفقیت ویرایش شد', 'success');
}

// ویرایش وضعیت سفارش
function editOrderStatus(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return;
    
    const newStatus = prompt('وضعیت جدید سفارش را انتخاب کنید:\n1. pending (در انتظار)\n2. completed (تکمیل شده)\n3. cancelled (لغو شده)', orders[orderIndex].status);
    
    if (newStatus && ['pending', 'completed', 'cancelled'].includes(newStatus)) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        showNotification('وضعیت سفارش با موفقیت ویرایش شد', 'success');
    }
}

// حذف سفارش
function deleteOrder(orderId) {
    if (confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const updatedOrders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        displayOrders();
        showNotification('سفارش با موفقیت حذف شد', 'success');
    }
}

// ویرایش کاربر
function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return;
    
    const newName = prompt('نام جدید کاربر:', users[userIndex].name);
    if (newName) users[userIndex].name = newName;
    
    const makeAdmin = confirm('آیا این کاربر را به ادمین تبدیل کنید؟');
    users[userIndex].isAdmin = makeAdmin;
    
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
    showNotification('کاربر با موفقیت ویرایش شد', 'success');
}

// حذف کاربر
function deleteUser(userId) {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        displayUsers();
        showNotification('کاربر با موفقیت حذف شد', 'success');
    }
}

// تابع کمکی برای دریافت متن وضعیت
function getStatusText(status) {
    const statusMap = {
        'pending': 'در انتظار',
        'completed': 'تکمیل شده',
        'cancelled': 'لغو شده'
    };
    
    return statusMap[status] || status;
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

// مدیریت تب‌ها
function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const sections = document.querySelectorAll('.admin-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // حذف کلاس active از همه تب‌ها و بخش‌ها
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // اضافه کردن کلاس active به تب و بخش انتخاب شده
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-section`).classList.add('active');
        });
    });
}

// خروج از حساب
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
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
    // نمایش نام ادمین
    const adminName = document.getElementById('admin-name');
    if (adminName && currentUser) {
        adminName.textContent = currentUser.name;
    }
    
    // نمایش داده‌ها
    displayOrders();
    displayAdminProducts();
    displayUsers();
    
    // تنظیم رویدادها
    setupTabs();
    setupMobileMenu();
    
    // تنظیم فرم افزودن محصول
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', addProduct);
    }
    
    // تنظیم دکمه خروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
