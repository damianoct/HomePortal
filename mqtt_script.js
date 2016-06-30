// called when the client connects
function onConnect() {
	var connect = document.getElementsByClassName("connect")[0];
	connect.disabled = true;
	var messages = document.getElementsByClassName("messages")[0];
	text = document.createTextNode("Connected.");
	el = document.createElement('li');
	el.appendChild(text);
	messages.appendChild(el);
}

function disconnect()
{
	client.disconnect();
	var messages = document.getElementsByClassName("messages")[0];
  	text = document.createTextNode("Disconnected.");
    el = document.createElement('li');
    el.appendChild(text);
    messages.appendChild(el);
	var connect = document.getElementsByClassName("connect")[0];
  	connect.disabled = false;
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
 	console.log("onMessageArrived:"+message.payloadString);
	var messages = document.getElementsByClassName("messages")[0],
	text = document.createTextNode(message.payloadString),
	el = document.createElement('li');
	el.appendChild(text);
	messages.appendChild(el);
}

function randomString(length) 
{
	return Math.round((Math.pow(36, length + 1) - Math.random() *
			Math.pow(36, length))).toString(36).slice(1);
}

function connect() 
{
	var broker_address = document.getElementsByClassName("input-broker-ws")[0].value;
	console.log(broker_address);
	client = new Paho.MQTT.Client(broker_address, Number(9001), "distesala_"+randomString(5));
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	client.connect({onSuccess:onConnect});
}

function clearMessages()
{
	var messages = document.getElementsByClassName("messages")[0];
	while(messages.hasChildNodes())
		messages.removeChild(messages.lastChild);
}

function subscribe()
{
	var topic = document.getElementsByClassName("topic-sub")[0].value;
	client.subscribe(topic);
	console.log("Sottoscritto a " + topic);
}

function publish()
{
	var topic = document.getElementsByClassName("topic-pub")[0].value;
	var message = document.getElementsByClassName("message")[0].value;
	var mqtt_message = new Paho.MQTT.Message(message);
	mqtt_message.destinationName = topic;
	client.send(mqtt_message);
}
