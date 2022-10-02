const yt = "AIzaSyCQHhOngXMnSmz4bZbwhnH29qs-9PSq0-M"
var errorMessage = "Sorry, the information from this link can not be processed. Please enter another."

idURLBase = "https://www.youtube.com/channel/"
nameURLBase = "https://www.youtube.com/c/"

//ISO Format Conversion Function from https://stackoverflow.com/questions/30950603/get-video-duration-with-youtube-data-api
function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    var h = Math.floor(duration / 3600);
    var m = Math.floor(duration % 3600 / 60);
    var s = Math.floor(duration % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

function getChannelID(userURL) {
    id  = userURL.replace(idURLBase, "")
    return id
}

function getChannelName(userURL) {
    channelName = userURL.replace(nameURLBase, "")
    return channelName
}

async function getUserImg(resolve, userURL) {
    if (userURL.includes(idURLBase)) {
        let ajaxImg = new XMLHttpRequest()
        ajaxImg.onreadystatechange = function() {
            if (ajaxImg.readyState == 4) {

                if ( (ajaxImg.status >= 200 && ajaxImg.status < 300) || (ajaxImg.status == 304) ) {
                    let data = JSON.parse(ajaxImg.responseText)
                    try{
                        resolve(getImage(data))
                    }
                    catch(err){
                        document.getElementById('results').innerHTML = "<p>"+errorMessage+"</p>"
                        resolve(None)
                    }
                }
            }
        }

        let channelID = getChannelID(userURL)
        let imgURL = "https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items%2Fsnippet%2Fthumbnails%2Fdefault&id="+channelID+"&key="+yt
        
        ajaxImg.open('GET', imgURL, true)
        ajaxImg.send()
    } else if (userURL.includes(nameURLBase)) {
        let ajaxImg = new XMLHttpRequest()
        ajaxImg.onreadystatechange = function() {
            if (ajaxImg.readyState == 4) {

                if ( (ajaxImg.status >= 200 && ajaxImg.status < 300) || (ajaxImg.status == 304) ) {
                    let data = JSON.parse(ajaxImg.responseText)
                    try{
                        resolve(getImage(data))
                    }
                    catch(err){
                        document.getElementById('results').innerHTML = "<p>"+errorMessage+"</p>"
                        resolve(None)
                    }
                }
            }
        }

        let channelID = getChannelName(userURL)

        let imgURL = "https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items%2Fsnippet%2Fthumbnails%2Fdefault&forUsername="+channelID+"&key="+yt
        
        ajaxImg.open('GET', imgURL, true)
        ajaxImg.send()
    }
}

async function getUserUploads(resolve, userURL) {
    if (userURL.includes(idURLBase)) {
        let ajaxUploadsID = new XMLHttpRequest()
        ajaxUploadsID.onreadystatechange = function() {
            if (ajaxUploadsID.readyState == 4) {

                if ( (ajaxUploadsID.status >= 200 && ajaxUploadsID.status < 300) || (ajaxUploadsID.status == 304) ) {
                    let data = JSON.parse(ajaxUploadsID.responseText)
                    try{
                        resolve(getUploadList(data))
                    }
                    catch(err){
                        document.getElementById('results').innerHTML = "<p>Error: Could not get upload list data.</p>"
                        resolve(None)
                    }
                }
            }
        }

        let channelID = getChannelID(userURL)
        let imgURL = "https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id="+channelID+"&key="+yt
        
        ajaxUploadsID.open('GET', imgURL, true)
        ajaxUploadsID.send()
    } else if (userURL.includes(nameURLBase)) {
        let ajaxUploadsID = new XMLHttpRequest()
        ajaxUploadsID.onreadystatechange = function() {
            if (ajaxUploadsID.readyState == 4) {

                if ( (ajaxUploadsID.status >= 200 && ajaxUploadsID.status < 300) || (ajaxUploadsID.status == 304) ) {
                    let data = JSON.parse(ajaxUploadsID.responseText)
                    try{
                        resolve(getUploadList(data))
                    }
                    catch(err){
                        document.getElementById('results').innerHTML = "<p>Error: Could not get upload list data.</p>"
                        resolve(None)
                    }
                }
            }
        }

        let channelID = getChannelName(userURL)

        let uploadsIdURL = "https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername="+channelID+"&key="+yt
        
        ajaxUploadsID.open('GET', uploadsIdURL, true)
        ajaxUploadsID.send()
    }
}

let videoIDList = []
let nextPageToken = 0

function getUploadsPlaylistData(resolve, listID, pageToken) {
    
    let ajaxUploadsPlaylist = new XMLHttpRequest()
    ajaxUploadsPlaylist.onreadystatechange = function() {
        if (ajaxUploadsPlaylist.readyState == 4) {

            if ( (ajaxUploadsPlaylist.status >= 200 && ajaxUploadsPlaylist.status < 300) || (ajaxUploadsPlaylist.status == 304) ) {
                let data = JSON.parse(ajaxUploadsPlaylist.responseText)
                
                //Will be "undefined" if there is none
                nextPageToken = data.nextPageToken

                for (let i = 0; i < data.items.length; i++) {
                    videoIDList.push(data.items[i]["contentDetails"]["videoId"])
                }

                resolve("token: "+data.nextPageToken)//videoIDList)//"data.nextPageToken: "+data.nextPageToken)
            }
        }
    }

    if (nextPageToken == 0 || nextPageToken == undefined) {
        if (nextPageToken == 0){
            console.log("First request")
        }
        if (nextPageToken == undefined) {
            console.log("Last request")
        }
        let uploadsPlaylistURL = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId="+listID+"&key="+yt
    
        ajaxUploadsPlaylist.open('GET', uploadsPlaylistURL, true)
        ajaxUploadsPlaylist.send()
    } else {
        console.log("Mid request")
        let uploadsPlaylistURL = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&pageToken="+pageToken+"&playlistId="+listID+"&key="+yt

        ajaxUploadsPlaylist.open('GET', uploadsPlaylistURL, true)
        ajaxUploadsPlaylist.send()
    }
}

function toSeconds(durationFormatted) {
    let durationArray = durationFormatted.split(":")

    if (durationArray.length == 3) {
        seconds = 60*60*parseInt(durationArray[0]) + 60*parseInt(durationArray[1]) + parseInt(durationArray[2])
        return seconds
    }

    if (durationArray.length == 2) {
        seconds = 60*parseInt(durationArray[0]) + parseInt(durationArray[1])
        return seconds
    } 
}

//Get duration of video based on ID
function getVideoDuration(resolve, id) {

    let ajaxDuration = new XMLHttpRequest()
    ajaxDuration.onreadystatechange = function() {
        if (ajaxDuration.readyState == 4) {

            if ( (ajaxDuration.status >= 200 && ajaxDuration.status < 300) || (ajaxDuration.status == 304) ) {
                let data = JSON.parse(ajaxDuration.responseText)
                let duration = data.items[0]["contentDetails"]["duration"]
                let durationFormatted = convert_time(duration)
                let durationInSeconds = toSeconds(durationFormatted)
                resolve(durationInSeconds)
            }
        }
    }

    let durationURL = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id="+id+"&key="+yt

    ajaxDuration.open('GET', durationURL, true)
    ajaxDuration.send()
}

//Get Youtube Profile image
function getImage(data){
    let profImgHTML = "<p><img src='"+data.items[0]["snippet"]["thumbnails"]["default"]["url"]+"' alt='User Profile Picture' width='150' height='150'></p>"         
    document.getElementById('ImageResults').innerHTML = profImgHTML
}

//Get "Uploads" playlist for channel
function getUploadList(data){
    let uploadsId = data.items[0]["contentDetails"]["relatedPlaylists"]["uploads"]
    return uploadsId
}

//Button to get link from user
document.getElementById("enterButton").onclick = async function() {

    //Clear list and token
    videoIDList = []
    nextPageToken = 0
    durationSeconds = 0

    //User Profile Picture Promise
    let userImgPromise = new Promise(function(resolve) { getUserImg(resolve, document.getElementById("channelURL").value) } )
    await userImgPromise
    
    //Uploads Id Promise
    let uploadsIdPromise = new Promise(function(resolve) { getUserUploads(resolve, document.getElementById("channelURL").value) } )
    let uploadsID = await uploadsIdPromise

    //Upload Playlist Data Promise
    while (nextPageToken != undefined) { 
        let uploadPlaylistDataPromise = new Promise(function(resolve) { getUploadsPlaylistData(resolve, uploadsID, nextPageToken) })
        await uploadPlaylistDataPromise
    }

    //let videoDurationPromise
    for (let i = 0; i < videoIDList.length; i++) {
        let uploadsIdPromise = new Promise(function(resolve) { getVideoDuration(resolve, videoIDList[i]) } )
        let newDurationSeconds = await uploadsIdPromise
        durationSeconds += newDurationSeconds
    }


    if (durationSeconds > 86400){
        let totalTime = new Date(durationSeconds * 1000).toISOString().substring(8, 19)
        document.getElementById('results').innerHTML += "<p>Total time to watch all videos:</p><p>(Format - days:hours:minutes:seconds)</p>"
        document.getElementById('results').innerHTML += "<p>"+totalTime+"</p>"
    } else if (durationSeconds > 3600){
        let totalTime = new Date(durationSeconds * 1000).toISOString().substring(11, 19)
        document.getElementById('results').innerHTML += "<p>Total time to watch all videos:</p><p>(Format - hours:minutes:seconds)</p>"
        document.getElementById('results').innerHTML += "<p>"+totalTime+"</p>"
    } else {
        let totalTime = new Date(durationSeconds * 1000).toISOString().substring(14, 19)
        document.getElementById('results').innerHTML += "<p>Total time to watch all videos:</p><p>(Format - minutes:seconds)</p>"
        document.getElementById('results').innerHTML += "<p>"+totalTime+"</p>"
    }
}