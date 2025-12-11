// admin.js - اضافه کردن توابع آپلود عکس

// آپلود عکس به صورت مجازی (در localStorage ذخیره می‌شود)
function uploadImage(file) {
    return new Promise((resolve, reject) => {
        // شبیه‌سازی آپلود
        const reader = new FileReader();
        
        reader.onloadstart = function() {
            // نمایش نوار پیشرفت
            document.getElementById('upload-progress').style.display = 'block';
            updateProgress(0);
        };
        
        reader.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentLoaded = Math.round((event.loaded / event.total) * 100);
                updateProgress(percentLoaded);
            }
        };
        
        reader.onload = function(event) {
            // شبیه‌سازی تاخیر در آپلود
            setTimeout(() => {
                // ذخیره تصویر در localStorage
                const imageId = 'img_' + Date.now();
                const imageData = {
                    id: imageId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: event.target.result, // داده Base64
                    uploadDate: new Date().toLocaleString('fa-IR')
                };
                
                // ذخیره در localStorage
                const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
                uploadedImages.push(imageData);
                localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
                
                // تکمیل نوار پیشرفت
                updateProgress(100);
                
                setTimeout(() => {
                    document.getElementById('upload-progress').style.display = 'none';
                    resolve({
                        id: imageId,
                        url: event.target.result, // URL داده Base64
                        name: file.name
                    });
                }, 500);
            }, 1000);
        };
        
        reader.onerror = function() {
            reject('خطا در خواندن فایل');
        };
        
        reader.readAsDataURL(file);
    });
}

// به‌روزرسانی نوار پیشرفت
function updateProgress(percent) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = percent + '%';
    }
    
    if (progressText) {
        progressText.textContent = percent + '%';
    }
}

// نمایش پیش‌نمایش تصویر
function showImagePreview(file) {
    const reader = new FileReader();
    const preview = document.getElementById('image-preview');
    
    reader.onload = function(e) {
        preview.innerHTML = `
            <img src="${e.target.result}" alt="پیش‌نمایش">
            <div class="image-info">
                <span>${file.name}</span>
                <small>${(file.size / 1024).toFixed(2)} KB</small>
            </div>
        `;
    };
    
    reader.readAsDataURL(file);
}

// نمایش تصاویر آپلود شده
function displayUploadedImages() {
    const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    const imagesGrid = document.getElementById('uploaded-images-grid');
    
    if (!imagesGrid) return;
    
    imagesGrid.innerHTML = '';
    
    if (uploadedImages.length === 0) {
        imagesGrid.innerHTML = `
            <div class="no-images">
                <i class="fas fa-images fa-2x"></i>
                <p>هیچ تصویری آپلود نشده است</p>
            </div>
        `;
        return;
    }
    
    // نمایش 12 تصویر آخر
    const recentImages = uploadedImages.slice(-12).reverse();
    
    recentImages.forEach(image => {
        const imageElement = document.createElement('div');
        imageElement.className = 'uploaded-image-item';
        imageElement.innerHTML = `
            <div class="image-thumbnail">
                <img src="${image.data}" alt="${image.name}">
                <div class="image-actions">
                    <button class="action-btn use-image-btn" onclick="useImage('${image.data}')" title="استفاده از این تصویر">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="action-btn delete-image-btn" onclick="deleteImage('${image.id}')" title="حذف تصویر">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="image-name">${image.name}</div>
        `;
        
        imagesGrid.appendChild(imageElement);
    });
}

// استفاده از تصویر آپلود شده
function useImage(imageUrl) {
    document.getElementById('product-image-url').value = imageUrl;
    document.getElementById('image-preview').innerHTML = `
        <img src="${imageUrl}" alt="تصویر انتخاب شده">
        <div class="image-info">
            <span>تصویر انتخاب شده</span>
        </div>
    `;
    
    showNotification('تصویر برای محصول انتخاب شد', 'success');
}

// حذف تصویر آپلود شده
function deleteImage(imageId) {
    if (confirm('آیا از حذف این تصویر اطمینان دارید؟')) {
        const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
        const updatedImages = uploadedImages.filter(img => img.id !== imageId);
        localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
        
        displayUploadedImages();
        showNotification('تصویر با موفقیت حذف شد', 'success');
    }
}

// تنظیم آپلود عکس
function setupImageUpload() {
    const imageUpload = document.getElementById('product-image-upload');
    const chooseImageBtn = document.getElementById('choose-image-btn');
    const imagePreview = document.getElementById('image-preview');
    
    if (!imageUpload || !chooseImageBtn) return;
    
    // کلیک روی دکمه انتخاب تصویر
    chooseImageBtn.addEventListener('click', () => {
        imageUpload.click();
    });
    
    // تغییر در input فایل
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // اعتبارسنجی فایل
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        
        if (!validTypes.includes(file.type)) {
            showNotification('فقط فایل‌های تصویری (JPG, PNG, GIF) مجاز هستند', 'error');
            return;
        }
        
        if (file.size > maxSize) {
            showNotification('حجم فایل نباید بیشتر از 2 مگابایت باشد', 'error');
            return;
        }
        
        // نمایش پیش‌نمایش
        showImagePreview(file);
        
        // آپلود تصویر
        uploadImage(file)
            .then(result => {
                document.getElementById('product-image-url').value = result.url;
                showNotification(`تصویر "${result.name}" با موفقیت آپلود شد`, 'success');
                displayUploadedImages();
            })
            .catch(error => {
                showNotification('خطا در آپلود تصویر: ' + error, 'error');
            });
    });
    
    // امکان کشیدن و رها کردن (drag and drop)
    imagePreview.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    imagePreview.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    imagePreview.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            // شبیه‌سازی تغییر input فایل
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageUpload.files = dataTransfer.files;
            
            // اجرای رویداد تغییر
            const event = new Event('change');
            imageUpload.dispatchEvent(event);
        }
    });
}

// اصلاح تابع addProduct برای استفاده از آپلود عکس
function addProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const price = parseInt(document.getElementById('product-price').value);
    const imageUrl = document.getElementById('product-image-url').value;
    const description = document.getElementById('product-description').value;
    
    // اعتبارسنجی
    if (!imageUrl) {
        showNotification('لطفا یک تصویر برای محصول انتخاب کنید', 'error');
        return;
    }
    
    // ایجاد محصول جدید
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price,
        image: imageUrl,
        description
    };
    
    // اضافه کردن محصول به لیست
    products.push(newProduct);
    
    // ذخیره در localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // به‌روزرسانی نمایش
    displayAdminProducts();
    
    // ریست فرم
    document.getElementById('add-product-form').reset();
    document.getElementById('image-preview').innerHTML = '<span>هیچ تصویری انتخاب نشده است</span>';
    document.getElementById('product-image-url').value = '';
    
    // نمایش پیام موفقیت
    showNotification('محصول جدید با موفقیت اضافه شد', 'success');
}

// در بارگذاری اولیه، setupImageUpload را فراخوانی کنید
document.addEventListener('DOMContentLoaded', function() {
    // ... کدهای قبلی ...
    
    // تنظیم آپلود عکس
    setupImageUpload();
    
    // نمایش تصاویر آپلود شده
    displayUploadedImages();
    
    // ... کدهای قبلی ...
});
