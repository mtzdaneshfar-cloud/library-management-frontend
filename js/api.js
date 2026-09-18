const API_BASE_URL = 'https://haditabatabaei.dev/api';




function apiRequest(endpoint, options = {}) {
    const url = API_BASE_URL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
    console.log('آدرس درخواست ما:', url);
    const headers = {
        'content-Type': 'application/json'
    }
    const token = getToken();
    if (token) {
        headers.Authorization = `baerer: ${token}`;

    }
    const config = {
        ...options,
        headers: headers
    }
    return fetch(url, config)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`خطای سرور با کد وضعیت: ${response.status}`);
            }
            return response.json();
        })
        
}
