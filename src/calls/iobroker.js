import { logout } from './auth'

const ENTRYPOINT = '/api/iobroker';

/**
 * Get availability of objId in database
 * 
 * @param {String} objId 
 * @returns true if history is persitent in database or false
 */
function hasHistory(objId) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ name: objId }),
    }

    return fetch(`${ENTRYPOINT}/history`, requestOptions)

    .then(handleResponse)
    .then(data => {
        return data
    })

}

/**
 * Get all datapoints for the time between 'from' and 'to'
 *
 * @param {String} objId
 * @param {Number} from UNIX epoch time in milliseconds
 * @param {Number} to UNIX epoch time in milliseconds
 * @returns Promise: Array of datapoints
 */
function getData(objId, from, to) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ name: objId, from, to }),
    };

    return fetch(`${ENTRYPOINT}/datapoints`, requestOptions)

        .then(handleResponse)
        .then(data => {
            return data
        })
}

/**
 * Get all datapoints for the last 24 hours
 *
 * @param {String} objId
 * @returns Promise: Array of datapoints
 */
function getLast24Hours(objId) {
    const now = + new Date()
    return getData(objId, now - 86400000, now)
}

/**
 * Get all datapoint for the last hour
 *
 * @param String objId
 * @returns Promise: Array of datapoints
 */
function getLastHour(objId) {
    const now = + new Date()
    return getData(objId, now - 3600000, now)
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

export { getData, getLast24Hours, getLastHour, hasHistory }