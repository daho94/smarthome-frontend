import { logout } from './auth'

const ENTRYPOINT = '/api/widget';

function getWidgets() {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    };

    return fetch(`${ENTRYPOINT}/all`, requestOptions)

        .then(handleResponse)
        .then(data => {
            return data
        })
}

function handleResponse(response) {
    if (!response.ok) {
        if (response.status === 401) {
            logout()
            location.reload(true)
        }
        return Promise.reject(response.status)
    }
    return response.json()
}

export { getWidgets }