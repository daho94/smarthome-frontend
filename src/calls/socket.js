const ENTRYPOINT = '/api/socket';

async function sendSocketState(device, state) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            group: "10101",
            device,
            state
        }),
    }
    let response = await fetch(`${ENTRYPOINT}`, requestOptions)
    return response.ok
}

export { sendSocketState }