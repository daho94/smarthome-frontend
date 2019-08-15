function getTheme() {
    return document.querySelector('#root').className.split("-")[1]
}

function isDarkTheme() {
    return getTheme() === "dark"
}

export { isDarkTheme }