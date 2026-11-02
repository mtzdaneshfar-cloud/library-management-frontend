if (!isAuthenticated()) {
    window.location.href = 'login.html'
}


const availableBooksEl = document.getElementById('availableBooks');
const activeLoansEl = document.getElementById('activeLoans');





const userNameEl = document.getElementById('userName');
const studentNameEl = document.getElementById('studentName');
const userAvatarEl = document.getElementById('userAvatar');


apiRequest('/auth/me')
    .then(function (response) {
          console.log('--- پاسخ سرور برای /auth/me ---', response);
        if (response && response.data) {
            const user = response.data.user;
            const stats = response.data.stats;

            if (user) {
                const fullName = user.firstName + ' ' + user.lastName;

                if (userNameEl) {
                    userNameEl.textContent = fullName;
                }
                if (studentNameEl) {
                    studentNameEl.textContent = fullName;
                }
                if (userAvatarEl && user.firstName) {
                    userAvatarEl.textContent = user.firstName.charAt(0);
                }
            }


            if (stats) {
                if (availableBooksEl) {
                    availableBooksEl.textContent = stats.availableBooks;
                }
                if (activeLoansEl) {
                    activeLoansEl.textContent = stats.activeLoans;
                }
            }
        }
    })
    .catch(function (error) {
        console.error('خطا در دریافت اطلاعات داشبورد:', error);
    });

