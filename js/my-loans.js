

if (!isAuthenticated()) {
     console.log('کاربر لاگین نیست، هدایت به login.html');
    window.location.href = 'login.html';
}
const logoutBtn = document.querySelector('.nav a[href="login.html"]');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        removeToken();
        window.location.href = 'login.html';
    });
}
const loansTableBody = document.getElementById('loansTableBody');


function loadMyLoans() {
    apiRequest('/loans/my-loans')
        .then(function(response) {
            console.log('پاسخ سرور برای loans:', response);

            const loans = response.data || [];

            if (loans.length === 0) {
                loansTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">هیچ کتابی در لیست امانت شما نیست.</td></tr>';
                return;
            }

           
            loansTableBody.innerHTML = loans.map(function(loan) {
               
                const bookTitle = loan.book ? loan.book.title : 'بدون عنوان';
                const loanDate = new Date(loan.loanDate).toLocaleDateString('fa-IR');
                const dueDate = new Date(loan.dueDate).toLocaleDateString('fa-IR');
                
                const statusBadge = loan.status === 'active'
                    ? '<span class="badge badge-warning">در امانت</span>'
                    : '<span class="badge badge-success">بازگردانده شده</span>';

                const actionButton = loan.status === 'active'
                    ? `<button class="btn btn-secondary btn-sm" onclick="returnBook('${loan.id}')">ثبت بازگشت</button>`
                    : '—';

                return `
                    <tr>
                        <td><strong>${bookTitle}</strong></td>
                        <td>${loanDate}</td>
                        <td>${dueDate}</td>
                        <td>${statusBadge}</td>
                        <td>${actionButton}</td>
                    </tr>
                `;
            }).join('');
        })
        .catch(function(error) {
            console.error('خطای دریافت امانت‌ها:', error);
            loansTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">خطا در بارگذاری جدول امانت‌ها.</td></tr>';
        });
}
document.addEventListener('DOMContentLoaded', function() {
    loadMyLoans();
});

function returnBook(loanId) {
    if (!confirm('آیا از بازگرداندن این کتاب اطمینان دارید؟')) {
        return;
    }

   
    apiRequest(`/loans/${loanId}/return`, { method: 'POST' })
        .then(function(response) {
          
            if (response && response.success) {
                alert('کتاب با موفقیت بازگردانده شد.');
                loadMyLoans();
            } else {
                alert('خطا در ثبت بازگشت کتاب.');
            }
        })
        .catch(function(error) {
            console.error('خطا در بازگرداندن کتاب:', error);
            alert('خطا در ارتباط با سرور.');
        });
}