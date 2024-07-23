// Create a STOMP client
// STOMP 클라이언트는 using ws:// 또는 wss:// URL을 사용하는 STOMP 서버와 통신.
const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/gs-guide-websocket'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);

    // 구독
    stompClient.subscribe('/topic/greetings', (greeting) => {
        console.log("Greeting: " + greeting.body);
        showGreeting(JSON.parse(greeting.body).content);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    // 활성화된 연결이 있다면, reconnect 시도를 멈추고 disconnect
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    /*
        클라이언트가 서버와 연결됐다면, publish()를 사용해서 STOMP 메시지를 보낼 수 있음.
        version 5 이상부터는 binary 메시지를 보낼 수 있음.
        client.publish({
            destination: "topic/special",
            binaryBody: binaryData,
            headers: { "content-type" : "application/octet-stream"},
        });
    */

    const message = {
        "name" : $("#name").val(),
        "message" : $("#message").val()
    };

    // 발행
    stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify(message)
    });
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#send" ).click(() => sendMessage());
});