package {

    import flash.external.*;
    import flash.net.NetStream;
    import flash.net.NetConnection;
    import flash.events.NetStatusEvent;
    import flash.media.Video;
    import flash.media.Camera;
    import flash.display.Sprite;
    import mx.core.UIComponent;

    public class P2PConnection extends Sprite {

        private const SERVER_ADDRESS:String = 'rtmfp://p2p.rtmfp.net/';
        private const DEVELOPER_KEY:String = '99ce743dbd91ea56c45f8dd9-017451b73c79';

        private var nc:NetConnection;
        private var nearId:String;
        private var farId:String;

        private var sendStream:NetStream;
        private var recieveStream:NetStream;

        private var camera:Camera;
/*        private var outVideo:Video;*/
        private var remoteVideo:Video;
/*        private var outVideoWrapper:UIComponent;*/

        public function P2PConnection() {
            ExternalInterface.call( "console.log" , "FLASH INIT");
/*            var method:Function = myCallback;*/
            ExternalInterface.addCallback("setFarId", setFarId);
            ExternalInterface.addCallback("sendData", sendData);
            initConnection();
        }

        private function initConnection():void {
            ExternalInterface.call( "console.log" , "FLASH initConnection()");
            nc = new NetConnection();
            nc.addEventListener(NetStatusEvent.NET_STATUS, ncStatus);
            nc.connect(SERVER_ADDRESS + DEVELOPER_KEY);
        }

        private function ncStatus(event:NetStatusEvent):void {
            trace(event.info.code);
            nearId = nc.nearID;
            ExternalInterface.call('P2PConnection.onInit', nearId, sendStream);
            if (!sendStream) {
                initSendStream();
            }
/*            initRecieveStream();*/
        }

        private function initSendStream():void {
            ExternalInterface.call( "console.log" , "FLASH initSendStream()");
            sendStream = new NetStream(nc, NetStream.DIRECT_CONNECTIONS);
            sendStream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
            sendStream.publish('media');
            sendStream.attachCamera(Camera.getCamera());

            var sendStreamClient:Object = new Object;
            sendStreamClient.onPeerConnect = function(callerns:NetStream):Boolean {
                farId = callerns.farID;
                ExternalInterface.call( 'P2PConnection.onPeerConnect' , farId);
                ExternalInterface.call( "console.log" , "FLASH onPeerConnect()", farId);
                if (!recieveStream) {
                    initRecieveStream();
                }
                return true;
            }

            sendStream.client = sendStreamClient;
        }

        private function setupCamera():void {
            ExternalInterface.call( "console.log" , "FLASH setupCamera()");
            remoteVideo = new Video();
			remoteVideo.width = 320;
			remoteVideo.height = 240;
			remoteVideo.attachNetStream(recieveStream);
			addChild(remoteVideo);

/*            camera = Camera.getCamera();
            camera.setMode(320, 240, 15);
            camera.setQuality(0, 80);
            outVideo = new Video();
            outVideo.width = camera.width;
            outVideo.height = camera.height;
            outVideo.attachCamera(camera);
            addChild(outVideo);
            sendStream.attachCamera(camera);*/
        }

        private function initRecieveStream():void {
            ExternalInterface.call( "console.log" , "FLASH initRecieveStream()", farId);
            recieveStream = new NetStream(nc, farId);
            recieveStream.addEventListener(NetStatusEvent.NET_STATUS, onStreamRecieve);
            recieveStream.play('media');
            recieveStream.client = this;
        }

        private function onStreamRecieve(event:NetStatusEvent):void {
            ExternalInterface.call( "console.log" , "FLASH onStreamRecieve()");
            setupCamera();
        }

        private function netStatusHandler(event:NetStatusEvent):void {
            trace(event.info.code);
        }

        public function sendData(data:String):void {
            ExternalInterface.call( "console.log" , "FLASH SEND DATA", data);
            sendStream.send('recieveData', data);
        }

        public function recieveData(data:String):void {
            ExternalInterface.call( "console.log" , "FLASH RECIEVE DATA", data);
            ExternalInterface.call('P2PConnection.onRecieve', data);
        }

        public function setFarId(id:String):void {
            ExternalInterface.call( "console.log" , "FLASH SET FAR ID", id);
            farId = id;
/*            initSendStream();*/
            setupCamera();
            initRecieveStream();
        }

/*        public function myCallback(str:String):void {
            ExternalInterface.call( "console.log" , "FLASH CALLBACK");
            sendData();
        }*/

    }

}
