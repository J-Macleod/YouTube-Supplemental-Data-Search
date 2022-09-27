const yt = "AIzaSyCQHhOngXMnSmz4bZbwhnH29qs-9PSq0-M"

function getChannelID(userURL) {
    id  = userURL.replace("https://www.youtube.com/channel/", "")
    return id
}

function getUserImg(userURL) {
    let ajaxImg = new XMLHttpRequest()
    ajaxImg.onreadystatechange = function() {
        if (ajaxImg.readyState == 4) {

            if ( (ajaxImg.status >= 200 && ajaxImg.status < 300) || (ajaxImg.status == 304) ) {
                let data = JSON.parse(ajaxImg.responseText)

                let profImgHTML = "<p><img src='"+data.items[0]["snippet"]["thumbnails"]["default"]["url"]+"' alt='User Profile Picture' width='150' height='150'></p>"
                                
                document.getElementById('results').innerHTML = profImgHTML
            }
        }
    }
    
    let channelID = getChannelID(userURL)
    let imgURL = "https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items%2Fsnippet%2Fthumbnails%2Fdefault&id="+channelID+"&key="+yt
    ajaxImg.open('GET', imgURL, true)
    ajaxImg.send()
}

document.getElementById("enterButton").onclick = function() {    
    getUserImg(document.getElementById("channelURL").value)
}
