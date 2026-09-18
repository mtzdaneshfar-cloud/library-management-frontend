if (!isAuthenticated()) {
    window.location.href = 'login.html'
}
const logoutBtn = document.querySelector('.nav a[href="login.html"]');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();
        removeToken();
        window.location.href = 'login.html'
    })
}

const availableBooksEl = document.getElementById('availableBooks');
const activeLoansEl = document.getElementById('activeLoans');

apiRequest('/books')
    .then((response) => {
        const booksList = response.data || [];
        const availableCount = booksList.filter(book => book.availableCopies > 0).length;
        if (availableBooksEl) {
            availableBooksEl.textContent = availableCount;
        }
    })
    .catch((error) => {
        console.error('خطا در دریافت لیست کتاب:', error);

    });



apiRequest('/loans/my-loans')
    .then((loans) => {

        let activeCount = 0;

        if (Array.isArray(loans)) {
            activeCount = loans.length;
        }

        if (activeLoansEl) {
            activeLoansEl.textContent = activeCount;
        }
    })
    .catch((error) => {
        console.error('خطا در دریافت امانت‌های فعال:', error);
    });

