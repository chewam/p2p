var P2PChat;

$(function() {

    P2PChat = (function() {

        // P2PConnection.afterInit = afterInit;
        P2PConnection.afterRecieve = onRecieve;
        // P2PConnection.afterPeerConnect = afterPeerConnect;

        $('.p2p-chat-txt textarea').keypress(function(event) {
            if ( event.which == 13 ) {
                event.preventDefault();
                console.log("keypress", this, arguments);
                onKeyPress();
            }
        });

        $('.p2p-chat-tb-btn').click(function(event) {
            var btn = $(this).text();
            if (btn === '+') {
                $(this).text('_');
                $('.p2p-chat-wall, .p2p-chat-txt, .p2p-chat-cam').show();
            } else if (btn === '_') {
                $(this).text('+');
                $('.p2p-chat-wall, .p2p-chat-txt, .p2p-chat-cam').hide();
            // } else if (btn === 'hide camera') {
            //     $(this).text('show camera');
            //     $('.p2p-chat-cam').hide();
            //     $('.p2p-chat-wall').height(366);
            // } else if (btn === 'show camera') {
            //     $(this).text('hide camera');
            //     $('.p2p-chat-wall').height(180);
            //     $('.p2p-chat-cam').show();
            }
        });

        function onKeyPress() {
            var textarea = $('.p2p-chat-txt textarea');
            var msg = textarea.val();
            P2PConnection.send(msg);

            // var textarea = $('.p2p-chat-txt textarea');
            // var msg = textarea.val();
            var wall = $('.p2p-chat-wall');
            var el = $(getMessage({
                txt: msg
            }));
            wall.append(el);
            textarea.val('');
            wall.prop({
                scrollTop: wall.prop("scrollHeight")
            });
        }

        function getMessage(data) {
            return '<div class="p2p-chat-msg">'
                + '<div class="p2p-chat-msg-pic">'
                    + '<img src="../../src/client/img/ghost.jpg" />'
                + '</div>'
                + '<div class="p2p-chat-msg-name">Gary</div>'
                + '<div class="p2p-chat-msg-txt">'+ data.txt +'</div>'
                + '<div class="p2p-chat-clear"></div>'
            + '</div>';
        }

        function onRecieve(data) {
            var wall = $('.p2p-chat-wall');
            var el = $(getMessage({
                txt: data
            }));
            wall.append(el);
            wall.prop({
                scrollTop: wall.prop("scrollHeight")
            });
        }

        // return {
        //     onKeyPress: onKeyPress
        // };

        P2PConnection.afterRecieve = onRecieve;

    })();

});


// var P2PChat = (function() {
// 
//     
// 
//     return {
//         
//     };
// })();