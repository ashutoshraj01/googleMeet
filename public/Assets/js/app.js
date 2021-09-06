let AppProcess = (function () {
    // Stun ice server will provide users info from their computer such as network details(eg:- IP) 
    let iceConfiguration = {
        // stun servers URL
        iceServers: [{
                urls: "stun:stun.l.google.com:19302"
            },
            {
                urls: "stun:stun1.l.google.com:19302"
            },
        ]
    };

    function setConnection(connID) {
        let connection = new RTCPeerConnection(iceConfiguration);
    }

    return {
        setNewConnection: async function (connId) {
            await setConnection(connID);
        }
    }
});

let MyApp = (function () {
    let socket = null;
    let user_id = '';
    let meeting_id = '';

    function init(uid, mid) {
        user_id = uid;
        meeting_id = mid;
        event_process_for_signaling_server();
    }

    function event_process_for_signaling_server() {
        socket = io.connect();
        socket.on("connect", () => {
            if (socket.connected) {
                if (user_id !== "" && meeting_id !== "") {
                    socket.emit("userconnect", {
                        displayName: user_id,
                        meetingid: meeting_id
                    })
                }
            }
        });

        socket.on("inform_others_about_me", function (data) {
            addUser(data.other_user_id, data.connId);
            AppProcess.setNewConnection(data.connID);
        });

        // Creates a DIV for the user in the room
        function addUser(other_user_id, connID) {
            let newDivId = $("#otherTemplate").clone();
            newDivId = newDivId.attr("id", connID).addClass("other");
            newDivId.find("h2").text(other_user_id);
            newDivId.find("video").attr("id", "v_" + connID);
            newDivId.find("audio").attr("id", "a_" + connID);
            newDivId.show();
            $("#divUsers").append(newDivId);
        }
    }

    return {
        _init: function (uid, mid) {
            init(uid, mid);
        }
    };
})();