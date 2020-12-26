var WebTorrent = require('webtorrent')
 
var client = new WebTorrent()
var magnetURI = 'magnet:?xt=urn:btih:4635f0f0e3ae8e4325e761ad4d4a93144b603568&dn=Gears+sounds.mp3&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com'
 
client.add(magnetURI, {
  announce: ["http://localhost:2468"]
}
  , function (torrent) {
  // Got torrent metadata!
  console.log('Client is downloading:', torrent)
})