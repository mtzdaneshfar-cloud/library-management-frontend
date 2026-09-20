const API_BASE_URL = 'https://haditabatabaei.dev/api';




function apiRequest(endpoint, options = {}) {
    const url = API_BASE_URL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
    console.log('آدرس درخواست ما:', url);
  
    const token = getToken();

  const headers = {
        'content-Type': 'application/json'

    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;

    }
    const config = {
        ...options,
        headers: headers
    }
    return fetch(url, config)
        .then(async (response) => {
        
            let data = null;
            try {
                data = await response.json();
            } catch (e) { }

            
            if (!response.ok) {
                const message = (data && (data.message || data.error || data.msg))
                    || `خطای سرور با کد وضعیت: ${response.status}`;
                throw new Error(message);
            }

            return data;
        });

}
