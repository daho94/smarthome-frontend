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

async function createFolder({ name, parentId, icon }) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            name,
            parent_id: parentId,
            icon
        })
    }
    let response = await fetch(`${ENTRYPOINT}`, requestOptions)
    return response.ok 
}

export { getFolders, createFolder }