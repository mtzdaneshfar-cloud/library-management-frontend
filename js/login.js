

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value.trim(); 
    
    
    if (!usernameInput || !passwordInput) {
        alert('Please Enter Your Username and Password ');
        return;
    }

    console.log(usernameInput,passwordInput);

    apiRequest('/auth/login', {
     method: 'POST',
     body: JSON.stringify({
        email: usernameInput,
        password: passwordInput
     })      
        
    })

    .then((data) => {
        console.log('پاسخ سرور',data);
        setToken(data.token);
        window.location.href = 'dashboard.html'
    })
    .catch((error) => {
        console.error('خطا در لاگین:', error);
        document.getElementById('alert-container').innerText = 'ایمیل یا رمز عبور اشتباه است'
    });
});
