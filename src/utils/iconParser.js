/**
 * Parses svg and returns array of icon IDs.
 * 
 * @param {String} iconPath 
 */
async function getIcons(iconPath) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'image/svg+xml'},
        credentials: 'include',
    }

    const response = await fetch(iconPath, requestOptions)
    const svg = await response.text()

    const parser = new DOMParser()
    const doc = parser.parseFromString(svg, "image/svg+xml")

    return Array.from(doc.children[0].children).map(node => node.getAttribute("id"))
}

export { getIcons }