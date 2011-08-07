var P2PConnection = (function() {

    var id;

    function getSwf() {
        var appName = 'SWFP2PConnection';
        if (navigator.appName.indexOf ("Microsoft") !=-1) {
            return window[appName];
        } else {
            return document[appName];
        }
    }

    return {
        onInit: function(nearId) {
            console.log("onConnect", this, arguments);
            id = nearId;
            this.afterInit(id);
        },
        connect: function(farId) {
            var swf = getSwf();
            swf.setFarId(farId);
        },
        send: function(data) {
            var swf = getSwf();
            swf.sendData(data);
        },
        onRecieve: function(data) {
            this.afterRecieve(data);
        },
        onPeerConnect: function(farId) {
            afterPeerConnect(farId);
        },
        afterPeerConnect: function() {},
        afterRecieve: function(data) {},
        afterInit: function() {}
    };

})();



// function onBodyLoad() {
//     // P2PConnection.init();
// }
// 
// var P2PConnection = (function() {
// 
//     console.log("THIS", this);
// 
//     var id;
// 
//     // var events = [];
// 
    function getSwf() {
        var appName = 'SWFP2PConnection';
        if (navigator.appName.indexOf ("Microsoft") !=-1) {
            return window[appName];
        } else {
            return document[appName];
        }
    }
// 
//     // function getId() {
//     //     return id;
//     // }
// 
//     function afterConnect() {
//         // to override
//     }
// 
//     // function fireEvent(eventName) {
//     //     window.dispatchEvent(events[eventName]);
//     // }
//     // 
//     // function addEvent(eventName) {
//     //     var event = document.createEvent("Event");
//     //     event.initEvent(eventName, true, true);
//     //     events[eventName] = event;
//     // }
// 
//     return {
//         callFlash: function() {
//             var swf = getSwf();
//             swf.myCallback('pof');
//         },
//         onConnect: function(peerId) {
//             id = peerId;
//             // this.fireEvent('connected');
//             console.log("onConnect", this, getId());
//             // this.afterConnect();
//         },
//         afterConnect: function() {}
//     };
// 
// })();
