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
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        })
}

function logout() {
    const requestOptions = {
        method: 'DELETE',
        credentials: 'include'
    };

    return fetch(`${ENTRYPOINT}/auth`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            // if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('user', JSON.stringify(user));
            // }

            return user
        })
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
                // auto logout if 401 response returned from api
                logout()
                location.reload(true)
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error)
        }

        return data
    });
}


export { login, logout, validate }

