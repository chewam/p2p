$(function() {
    // P2PConnection.afterInit = afterInit;
    P2PConnection.afterPeerConnect = afterPeerConnect;
});

// function afterInit(id) {
//     console.log("afterInit", this, arguments);
//     document.getElementById('localid').innerHTML = id;
// }

function connect(id) {
    // var remoteId = document.getElementById('remoteid').value;
    // P2PConnection.connect(remoteId);
}

function register() {
    var name = document.getElementById('name').value;
    P2PChat.register(name);
}

function afterPeerConnect(farId) {
    // document.getElementById('remoteid').innerHTML = farId;
}


// function onBodyLoad() {
//     P2PConnection.afterInit = afterInit;
//     P2PConnection.afterRecieve = afterRecieve;
//     P2PConnection.afterPeerConnect = afterPeerConnect;
// }
// 
// function afterInit(id) {
//     document.getElementById('localid').innerHTML = id;
// }
// 
// function connect(id) {
//     var remoteId = document.getElementById('remoteid').value;
//     P2PConnection.connect(remoteId);
// }
// 
// function send() {
//     var msg = document.getElementById('message').value;
//     document.getElementById('wall').innerHTML += '<div>'+msg+'</div>';
//     P2PConnection.send(msg);
// }
// 
// function afterRecieve(data) {
//     document.getElementById('wall').innerHTML += '<div>'+data+'</div>';
// }
// 
// function afterPeerConnect(farId) {
//     document.getElementById('remoteid').value = farId;
// }