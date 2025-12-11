// ویرایش محصول با امکان تغییر عکس
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // ایجاد مودال ویرایش
    const modal = document.createElement('div');
    modal.className = 'edit-product-modal';
    modal.innerHTML = `
        <div class="edit-product-content">
            <div class="modal-header">
                <h3>ویرایش محصول</h3>
                <button class="close-modal">&times;</button>
            </div>
            <form id="edit-product-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-product-name">نام محصول</label>
                        <input type="text" id="edit-product-name" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-product-price">قیمت (تومان)</label>
                        <input type="number" id="edit-product-price" value="${product.price}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>تصویر فعلی</label>
                        <div class="current-image">
                            <img src="${product.image}" alt="${product.name}" style="max-width: 100px; border-radius: 5px;">
                        </div>
                        <div class="form-group">
                            <label for="edit-product-image-upload">تغییر تصویر (اختیاری)</label>
                            <input type="file" id="edit-product-image-upload" accept="image/*">
                            <small>فرمت‌های مجاز: JPG, PNG, GIF - حداکثر حجم: 2MB</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-product-description">توضیحات</label>
                        <textarea id="edit-product-description" required>${product.description}</textarea>
                    </div>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn">ذخیره تغییرات</button>
                    <button type="button" class="btn-secondary close-modal">انصراف</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // رویداد بستن مودال
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // رویداد ارسال فرم
    const form = modal.querySelector('#edit-product-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedName = document.getElementById('edit-product-name').value;
        const updatedPrice = parseInt(document.getElementById('edit-product-price').value);
        const updatedDescription = document.getElementById('edit-product-description').value;
        const imageUpload = document.getElementById('edit-product-image-upload');
        
        // به‌روزرسانی محصول
        product.name = updatedName;
        product.price = updatedPrice;
        product.description = updatedDescription;
        
        // اگر تصویر جدید آپلود شده
        if (imageUpload.files.length > 0) {
            const file = imageUpload.files[0];
            
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
            
            // آپلود تصویر جدید
            uploadImage(file)
                .then(result => {
                    product.image = result.url;
                    saveAndClose();
                })
                .catch(error => {
                    showNotification('خطا در آپلود تصویر جدید: ' + error, 'error');
                });
        } else {
            saveAndClose();
        }
        
        function saveAndClose() {
            // ذخیره تغییرات
            localStorage.setItem('products', JSON.stringify(products));
            
            // به‌روزرسانی نمایش
            displayAdminProducts();
            
            // بستن مودال
            document.body.removeChild(modal);
            
            // نمایش پیام موفقیت
            showNotification('محصول با موفقیت ویرایش شد', 'success');
        }
    });
    
    // جلوگیری از بسته شدن مودال با کلیک روی پس‌زمینه
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}
