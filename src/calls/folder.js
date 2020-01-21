const ENTRYPOINT = '/api/folder';

async function getFolders() {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
    }
    let response = await fetch(`${ENTRYPOINT}`, requestOptions)
    
    if(response.ok) {
        let folders = await response.json()
        return folders
    } else {
        return []
    }
}

export { getFolders }