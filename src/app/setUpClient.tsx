import WebTorrent from "webtorrent";

function setUpClient() {
    console.log("MAKING NEW CLIENT")
    const client = new WebTorrent({
        tracker: {
            //     // infoHash: new Buffer('012345678901234567890'), // hex string or Buffer
            //     // peerId: new Buffer('01234567890123456789'), // hex string or Buffer
            announce: ["wss://tracker.fileparty.co"],
        },
        dht: false,
        webSeeds: false
    });
    client.on('error', function (err) {
        console["log"]("🚀 ~ err", err);
        // alert("Fatal error")
    });
    return client;
}

export const client = setUpClient()