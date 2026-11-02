const API_BASE_URL = 'https://haditabatabaei.dev/api';


function apiRequest(endpoint, options = {}) {
    const url = API_BASE_URL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
    console.log('آدرس درخواست ما:', url);

    const token = getToken();

    const headers = {
        'content-Type': 'application/json'

    }

    if (token) {
        headers.Authorization = 'Bearer ' + token;

    }
    const config = {
        ...options,
        headers: headers
    }

    return fetch(url, config)
        .then(function (response) {
            if (!response.ok) {
                console.log('پاسخ ناموفق بود:', response.status);
                return null;
            }
            return response.json();
        })
        .then(function (data) {
            console.log('داده دریافت شد:', data);
            return data
        })
        .catch(function (error) {
            console.error('خطا در درخواست:', error);

            return null;
        });



}
