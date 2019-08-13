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

function saveDashboard(id, settings) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ id, settings }),
    };

    return fetch(`${ENTRYPOINT}/single`, requestOptions)
    .then(response => {
        return response.ok
    })
}

async function deleteDashboard(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ id }),
    };
    let response = await fetch(`${ENTRYPOINT}/single`, requestOptions)
    return response.ok
}

async function createDashboard(name, icon, isDefault) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ name, icon, is_default: isDefault }),
    };
    let response = await fetch(`${ENTRYPOINT}/create`, requestOptions)
    return response.ok
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

export { getDashboards, getDashboard, getDefaultDashboard, saveDashboard, createDashboard, deleteDashboard }