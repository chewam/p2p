var P2PChat, P2PUserList;

$(function() {

    P2PUserList = (function() {

        var name;
        var polling;
        var cirrus_id;
        var users = [];
        // var newUsers = [];

        function init() {
            startPolling();
        }

        function setName(username) {
            name = username;
        }

        function setCirrusId(id) {
            cirrus_id = id;
        }

        function startPolling() {
            polling = setInterval(function() {
                // var url = 'http://localhost/priv/projects/p2p/src/server/connection.php?callback=?';
                var url = 'http://goldledoigt:ju2pom@home.chewam.com/priv/projects/p2p/src/server/connection.php';
                var data = {
                    name: name,
                    cirrus_id: cirrus_id
                };
                $.ajax({
                    url: url,
                    data: data,
                    dataType: 'jsonp',
                    jsonpCallback: 'P2PUserList.pollingCallback'
                });
            }, 5000);
        }

        function pollingCallback(response) {
            if (response.success) {
                var users = update(response.data);
                removeUsers(users.toRemove);
                addUsers(users.toAdd);
                // P2PUserList.clearNewUsers();
                // var users = [];
                // var list = $('.p2p-userlist-list');
                // for (var i = 0, l = response.data.length; i < l; i++) {
                //     users.push(getUserTpl(response.data[i]));
                // }
                // $('.p2p-userlist-list .p2p-userlist-user').remove();
                // list.append($(users.join('')));
                // bindUserListClick();
            }
        }

        function removeUsers(items) {
            console.log("removeUsers", items);
            var ids = [];
            for (var i = 0, l = items.length; i < l; i++) {
                items[i].el.remove();
                ids.push(items[i].cirrus_id);
            }
            for (var i = 0, l = ids.length; i < l; i++) {
                delete users[ids[i]];
            }
        }

        function addUsers(items) {
            var el,
                list = $('.p2p-userlist-list');
            console.log("addUsers", items);
            for (var i = 0, l = items.length; i < l; i++) {
                items[i].el = $(getUserTpl(items[i]));
                list.append(items[i].el);
                items[i].el.click(function() {
                    $(this).toggleClass('selected');
                    var remoteId = $(this).find('.p2p-userlist-user-id').text();
                    console.log("remote", remoteId);
                    if (remoteId != cirrus_id) {
                        P2PConnection.connect(remoteId);
                    }
                });
            }
        }

        // function bindUserListClick() {
        //     $('.p2p-userlist-list .p2p-userlist-user').click(function () {
        //         $(this).toggleClass('selected');
        //         var remoteId = $(this).find('.p2p-userlist-user-id').text();
        //         console.log("remote", remoteId);
        //         if (remoteId != cirrus_id) {
        //             P2PConnection.connect(remoteId);
        //         }
        //     });
        // }

        function update(data) {
            var toAdd = [], toRemove = [];
            for (var key in users) {
                users[key].toRemove = true;
            }
            for (var i = 0, l = data.length; i < l; i++) {
                if (add(data[i])) {
                    toAdd.push(data[i]);
                } else {
                    delete users[data[i].cirrus_id].toRemove;
                }
            }
            for (var key in users) {
                if (users[key].toRemove) {
                    toRemove.push(users[key]);
                }
            }
            return {
                toAdd: toAdd,
                toRemove: toRemove
            };
        }

        function add(item) {
            if (isExist(item)) {
                return false;
            } else {
                users[item.cirrus_id] = item;
                return true;
            }
        }

        function isExist(item) {
            return !!users[item.cirrus_id];
        }

        // function clearNewUsers() {
        //     newUsers = [];
        // }

        function getUserTpl(data) {
            return '<div class="p2p-userlist-user">'
                + '<div class="p2p-userlist-user-pic">'
                    + '<img src="../../src/client/img/ghost.jpg" />'
                + '</div>'
                + '<div class="p2p-userlist-user-name">'+ data.name +'</div>'
                + '<div class="p2p-userlist-user-id">'+ data.cirrus_id +'</div>'
                + '<div class="p2p-clear"></div>'
            + '</div>';
        }

        init();

        return {
            // update: update,
            setName: setName,
            setCirrusId: setCirrusId,
            pollingCallback: pollingCallback
            // clearNewUsers: clearNewUsers
        };

    })();

    /********************************************************************************/

    P2PChat = (function() {

        var name;
        var cirrus_id;

        function init() {
            bindTextareaKeypress();
            bindToolbarButtonsClick();
        }

        function bindTextareaKeypress() {
            $('.p2p-chat-txt textarea').keypress(function(event) {
                if ( event.which == 13 ) {
                    event.preventDefault();
                    onKeyPress();
                }
            });
        }

        function bindToolbarButtonsClick() {
            $('.p2p-chat-tb-btn').click(function(event) {
                var btn = $(this).text();
                if (btn === '+') {
                    $(this).text('_');
                    $('.p2p-chat-wall, .p2p-chat-txt, .p2p-chat-cam').show();
                } else if (btn === '_') {
                    $(this).text('+');
                    $('.p2p-chat-wall, .p2p-chat-txt, .p2p-chat-cam').hide();
                } else if (btn === 'hide camera') {
                    $(this).text('show camera');
                    $('.p2p-chat-cam').addClass('hidden');
                    $('.p2p-chat-wall').height(366);
                } else if (btn === 'show camera') {
                    $(this).text('hide camera');
                    $('.p2p-chat-wall').height(180);
                    $('.p2p-chat-cam').removeClass('hidden');
                }
            });
        }

        function register(username) {
            name = username;
            P2PUserList.setName(name);
        }

        function onKeyPress() {
            var textarea = $('.p2p-chat-txt textarea');
            var msg = textarea.val();
            P2PConnection.send(msg);

            var wall = $('.p2p-chat-wall');
            var el = $(getMessageTpl({
                txt: msg
            }));
            wall.append(el);
            textarea.val('');
            wall.prop({
                scrollTop: wall.prop("scrollHeight")
            });
        }

        function getMessageTpl(data) {
            return '<div class="p2p-chat-msg">'
                + '<div class="p2p-chat-msg-pic">'
                    + '<img src="../../src/client/img/ghost.jpg" />'
                + '</div>'
                + '<div class="p2p-chat-msg-name">Gary</div>'
                + '<div class="p2p-chat-msg-txt">'+ data.txt +'</div>'
                + '<div class="p2p-chat-clear"></div>'
            + '</div>';
        }

        function afterInit(id) {
            cirrus_id = id;
            P2PUserList.setCirrusId(cirrus_id);
            // document.getElementById('localid').innerHTML = id;
        }

        function onRecieve(data) {
            var wall = $('.p2p-chat-wall');
            var el = $(getMessageTpl({
                txt: data
            }));
            wall.append(el);
            wall.prop({
                scrollTop: wall.prop("scrollHeight")
            });
        }

        P2PConnection.afterInit = afterInit;
        P2PConnection.afterRecieve = onRecieve;

        init();

        return {
            register: register
            // userListPollingCallback: userListPollingCallback
        }

    })();

});
