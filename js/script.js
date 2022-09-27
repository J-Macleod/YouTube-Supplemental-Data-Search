const yt = "AIzaSyCQHhOngXMnSmz4bZbwhnH29qs-9PSq0-M"

function getChannelID(userURL) {
    userURL.replace("https://www.youtube.com/channel/", "")
    return userURL
}
