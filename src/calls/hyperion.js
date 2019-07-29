const ENTRYPOINT = '/api/hyperion';

const HYPERION_ADDRESS = "192.168.178.48:19444"

/**
 * Set Hyperion color
 * 
 * @param {Number} red 
 * @param {Number} green 
 * @param {Number} blue 
 */
async function setColor(red ,green, blue) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            address: HYPERION_ADDRESS,
            command: {
                type: "Color",
                r: red,
                g: green,
                b: blue
            }
        }),
    }
    let response = await fetch(`${ENTRYPOINT}/command`, requestOptions)
    return response.ok
}

/**
 * Set Hyperion effect
 * 
 * @param {String} name 
 */
async function setEffect(name) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            address: HYPERION_ADDRESS,
            command: {
                type: "Effect",
                name
            }
        }),
    }
    let response = await fetch(`${ENTRYPOINT}/command`, requestOptions)
    return response.ok
}

/**
 * Get available hyperion effects
 */
async function getEffects() {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            address: HYPERION_ADDRESS,
        }),
    }
    let response = await fetch(`${ENTRYPOINT}/effects`, requestOptions)

    if(response.ok) {
        let json = await response.json()
        return json
    } else {
        return {
            effects: []
        }
    }

}

export { setColor, setEffect, getEffects }