const ENTRYPOINT = '/api/upload';

async function getFiles() {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
    }
    let response = await fetch(`${ENTRYPOINT}/files`, requestOptions)
    
    if(response.ok) {
        let files = await response.json()
        return files
    } else {
        return []
    }
}

export { getFiles }