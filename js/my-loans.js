document.addEventListener('DOMContentLoaded', () => {
  
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

   
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof removeToken === 'function') removeToken();
            window.location.href = 'login.html';
        });
    }

   
    loadMyLoans();
});

const loansTableBody = document.getElementById('loansTableBody');
const totalLoansCount = document.getElementById('totalLoansCount');
const activeLoansCount = document.getElementById('activeLoansCount');
const returnedLoansCount = document.getElementById('returnedLoansCount');


async function loadMyLoans() {
    if (!loansTableBody) return;

    try {
        const response = await apiRequest('/loans/my-loans');
        console.log('پاسخ دریافتی لیست امانت‌ها:', response);

        const loans = Array.isArray(response) ? response : (response.data || []);
        
        renderLoans(loans);
        updateLoanStats(loans);

    } catch (error) {
        console.error('خطا در بارگذاری لیست امانت‌ها:', error);
        loansTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #dc2626; padding: 2rem;">
                    خطا در دریافت اطلاعات: ${error.message}
                </td>
            </tr>
        `;
    }
}


function renderLoans(loans) {
    if (!loans || loans.length === 0) {
        loansTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #666; padding: 2rem;">
                    در حال حاضر هیچ سابقه‌ای از امانت کتاب ثبت نشده است.
                </td>
            </tr>
        `;
        return;
    }

    loansTableBody.innerHTML = loans.map(loan => {
        const book = loan.book || {};
        const title = book.title || loan.bookTitle || 'عنوان نامشخص';
        const author = book.author || loan.author || '-';
        const isbn = book.isbn || loan.isbn || '-';

        const rawDate = loan.loanDate || loan.createdAt || loan.borrowDate;
        const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('fa-IR') : '-';

        const isReturned = loan.status === 'returned' || Boolean(loan.returnDate);
        const statusBadge = isReturned 
            ? `<span class="badge" style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 9999px; font-size: 0.85rem;">Returned</span>`
            : `<span class="badge" style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 9999px; font-size: 0.85rem;">Active</span>`;

        const loanId = loan._id || loan.id;

        const actionButton = isReturned
            ? `<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">پس داده شد</button>`
            : `<button class="btn btn-primary btn-sm" onclick="handleReturnBook('${loanId}')">بازگرداندن کتاب</button>`;

        return `
            <tr>
                <td>
                    <div style="font-weight: 600;">${title}</div>
                    <small style="color: #6b7280;">ISBN: ${isbn}</small>
                </td>
                <td>${author}</td>
                <td>${formattedDate}</td>
                <td>${statusBadge}</td>
                <td>${actionButton}</td>
            </tr>
        `;
    }).join('');
}

function updateLoanStats(loans) {
    const total = loans.length;
    let active = 0;
    let returned = 0;

    loans.forEach(loan => {
        const isReturned = loan.status === 'returned' || Boolean(loan.returnDate);
        if (isReturned) {
            returned++;
        } else {
            active++;
        }
    });

    if (totalLoansCount) totalLoansCount.textContent = `تعداد کل: ${total}`;
    if (activeLoansCount) activeLoansCount.textContent = active;
    if (returnedLoansCount) returnedLoansCount.textContent = returned;
}


async function handleReturnBook(loanId) {
    if (!loanId) {
        alert('شناسه رکورد امانت معتبر نیست!');
        return;
    }

    const isConfirmed = confirm('آیا مطمئن هستید که می‌خواهید این کتاب را بازگردانید؟');
    if (!isConfirmed) return;

    try {
        const result = await apiRequest(`/loans/${loanId}/return`, {
            method: 'POST'
        });

        console.log('نتیجه بازگرداندن کتاب:', result);
        alert('کتاب با موفقیت بازگردانده شد.');

        localStorage.removeItem('books_cache');

        loadMyLoans();

    } catch (error) {
        console.error('خطا در فرایند بازگرداندن کتاب:', error);
        alert(`خطا در بازگرداندن کتاب: ${error.message}`);
    }
}