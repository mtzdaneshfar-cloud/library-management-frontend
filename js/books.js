if (!isAuthenticated()) {
    window.location.href = 'login.html';
}


const booksGrid = document.getElementById('booksGrid');
const CACHE_KEY = 'books_cache';
const CACHE_DURATION = 5 * 60 * 1000;

function renderBooks(books) {
    if (!booksGrid) return;

    if (!books || books.length === 0) {
        booksGrid.innerHTML = '<p style="color: #666; grid-column: 1 / -1; text-align: center;">هیچ کتابی یافت نشد.</p>';
        return;
    }

    booksGrid.innerHTML = books.map(book => {
        const isAvailable = (book.availableCopies !== undefined ? book.availableCopies > 0 : book.status === 'available');
        const badgeClass = isAvailable ? 'badge-success' : 'badge-danger';
        const badgeText = isAvailable ? 'موجود' : 'ناموجود';
        const copiesCount = book.availableCopies !== undefined ? book.availableCopies : (book.copies || 0);
        const borrowButton = isAvailable
            ? `<button class="btn btn-primary btn-sm" onclick="borrowBook('${book.id || book._id}')">Borrow Book</button>`
            : `<button class="btn btn-secondary btn-sm" disabled>Not Available</button>`;

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: #2c3e50;">${book.title || 'بدون عنوان'}</h3>
                    <span class="status ${badgeClass}">${badgeText}</span>
                </div>
                <p style="color: #666; margin-bottom: 0.5rem;"><strong>Author:</strong> ${book.author || 'نامشخص'}</p>
                <p style="color: #666; margin-bottom: 0.5rem;"><strong>ISBN:</strong> ${book.isbn || '-'}</p>
                <p style="color: #666; margin-bottom: 0.5rem;"><strong>Category:</strong> ${book.category || 'عمومی'}</p>
                <p style="color: #666; margin-bottom: 1rem;"><strong>Available Copies:</strong> ${copiesCount}</p>
                <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #555;">${book.description || ''}</p>
                <div style="display: flex; gap: 0.5rem;">
                    ${borrowButton}
                    <button class="btn btn-secondary btn-sm">View Details</button>
                </div>
            </div>
        `;
    }).join('');
}

function loadBooks() {
    if (!booksGrid) {
        console.error("المان   در صفحه پیدا نشد.");
        return;
    }

    const cachedData = localStorage.getItem(CACHE_KEY);
    const now = Date.now();

    if (cachedData) {
        try {
            const parsed = JSON.parse(cachedData);
            const isFresh = (now - parsed.timestamp) < CACHE_DURATION;
            const hasBooks = Array.isArray(parsed.data) && parsed.data.length > 0;

            if (isFresh && hasBooks) {
                console.log('⚡ داده‌های کتاب از کش ۵ دقیقه‌ای لود شدند.');
                renderBooks(parsed.data);
                return;
            }
        } catch (event) {
            localStorage.removeItem(CACHE_KEY);
        }
    }

    booksGrid.innerHTML = '<p style="color: #666; grid-column: 1 / -1; text-align: center;">در حال دریافت کتاب‌ها...</p>';

    apiRequest('/books', {
        method: 'GET'
    })
        .then((data) => {
            console.log('کتاب‌های دریافتی از سرور:', data);

            const booksList = Array.isArray(data) ? data : (data.books || data.data || []);


            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: booksList
            }));

            renderBooks(booksList);
        })
        .catch((error) => {
            console.error('خطا در دریافت لیست کتاب‌ها:', error);
            booksGrid.innerHTML = '<p style="color: red; grid-column: 1 / -1; text-align: center;">خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش کنید.</p>';
        });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooks);
} else {
    loadBooks();
}


function borrowBook(bookId) {
    if (!bookId) {
        alert('شناسه کتاب نامعتبر است.');
        return;
    }

    if (!confirm('آیا از امانت گرفتن این کتاب اطمینان دارید؟')) {
        return;
    }

       apiRequest('/auth/me')
        .then(function(response) {
          
            console.log('محتوای پاسخ دریافتی از /auth/me:', response);
            const userId = response.data.user.id;

            if (!userId) {
                throw new Error('شناسه کاربر یافت نشد.');
            }

         
            return apiRequest('/loans', {
                method: 'POST',
                body: JSON.stringify({ 
                    bookId: bookId, 
                    userId: userId 
                })
            });
        })
        .then(function(result) {
         
            alert('کتاب با موفقیت امانت گرفته شد.');
         
            localStorage.removeItem(CACHE_KEY);
            if (typeof loadBooks === 'function') {
                loadBooks();
            }
        })
        .catch(function(error) {
         
            console.error('خطا در ثبت امانت:', error);
            alert('خطا در ثبت امانت: ' + (error.message || 'مشکل در ارتباط با سرور'));
        });
}