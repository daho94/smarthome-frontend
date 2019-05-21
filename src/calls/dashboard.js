import { logout } from './auth'

const ENTRYPOINT = '/api/dashboard';

function getDashboards() {
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

function getDashboard(id) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ id }),
    };

    return fetch(`${ENTRYPOINT}/single`, requestOptions)

        .then(handleResponse)
        .then(data => {
            return data
        })
}

function getDefaultDashboard() {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
    };

    return fetch(`${ENTRYPOINT}/single`, requestOptions)

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

export { getDashboards, getDashboard, getDefaultDashboard }