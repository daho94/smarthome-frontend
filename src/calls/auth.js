const ENTRYPOINT = '/api';

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    };

    return fetch(`${ENTRYPOINT}/auth`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user
        })
}

async function logout() {
    const requestOptions = {
        method: 'DELETE',
        credentials: 'include'
    };

    let response = await fetch(`${ENTRYPOINT}/auth`, requestOptions)
    return response.ok
}

function validate() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    return fetch(`${ENTRYPOINT}/auth`, requestOptions)
        .then(response => {
            return response.ok
        })
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text)
        if (!response.ok) {
            if (response.status === 401) {
                logout()
                location.reload(true)
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error)
        }

        return data
    });
}


export { login, logout, validate, handleResponse }

