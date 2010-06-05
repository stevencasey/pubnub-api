(function(){
/*

<!--
    Simple Chat
    ===========
    <style> inside <head>
    <div> where Simple Chat will appear.
    <script> at BOTTOM of Page

    To change the conversation channel, update the channel attribute inside the div.
-->

<style>
    #simple-chat {padding:0;background-color:#c41952}
    #simple-chat-chatbox {height:60px;overflow:scroll;overflow-x:hidden;border:1px solid #ccc;padding:10px;background-color:#fff}
    #simple-chat-textbox {width:320px;margin:9px;font-size:18px}
    #simple-chat-button {width:70px;cursor:pointer;margin:9px;font-size:18px}
</style>

<div id="simple-chat" channel="mychannel">Loading Simple Chat</div>

*/
var P    = PUBNUB
,   chat = {
    init : function( node_name ) {
        var node = P.$(node_name);

        chat.node_name = node_name;

        // Create Nodes
        chat.textbox = P.create('input');
        chat.chatbox = P.create('div');
        chat.button  = P.create('button');

        // Button Text
        chat.button.innerHTML = 'Send';

        // Add Styles
        P.attr( chat.chatbox, 'id', P.attr( node, 'simple-chat-chatbox' ) );
        P.attr( chat.textbox, 'id', P.attr( node, 'simple-chat-textbox' ) );
        P.attr( chat.button, 'id', P.attr( node, 'simple-chat-button' ) );

        // Display Nodes
        node.innerHTML = '';
        node.appendChild(chat.chatbox);
        node.appendChild(chat.textbox);
        node.appendChild(chat.button);

        // Send Sign-on Message
        P.publish({
            channel : node_name,
            message : 'Someone Joined the Chat.'
        });

        function send(e) {
            var key     = e.keyCode || e.charCode || 0
            ,   message = chat.textbox.value;

            // Wait for Enter Key
            if (key != 13 && e.type == 'keydown' || !message) return true;

            // Reset Value
            chat.textbox.value = '';

            // Send Message
            P.publish({
                channel : node_name,
                message : message
            });
        }

        // Bind Events
        P.bind( 'keydown', chat.textbox, send );
        P.bind( 'blur', chat.textbox, send );

        // Register Listener
        P.subscribe({ channel : node_name, history : true }, chat.subscribe );
    },

    subscribe : function(response) {
        var br       = '<br/>'
        ,   messages = response.messages.reverse().join(br);
        chat.chatbox.innerHTML = messages + br + chat.chatbox.innerHTML;
    }

};

// Startup Simple Chat
chat.init('simple-chat');

})()