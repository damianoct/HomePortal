var TOPIC = 'homematic/status';
var TOPIC_CMD = 'homematic/command';
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:1883');
 
client.on('connect', function () 
{
	console.log("CONNECTED TO BROKER");
	client.subscribe(TOPIC_CMD);
	//client.publish('presence', 'Hello mqtt');
});
 
client.on('message', function (topic, message) 
{
	runCommand(message.toString());
});

var homegearAddress = 'localhost'
var homegearPort = 2001
var xmlrpcServerAddress = 'localhost'
var xmlrpcServerPort = 9091
var xmlrpc = require('xmlrpc')
var xmlrpcServer = xmlrpc.createServer({ host: '0.0.0.0', port: xmlrpcServerPort });
var xmlrpcClient = xmlrpc.createClient({ host: homegearAddress, port: homegearPort, path: '/'});


var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) 
{
	fs.readFile(__dirname + '/index.html',
	function (err, data) 
	{
		if (err) 
		{
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
					
		res.writeHead(200);
		res.end(data);
	});
}

io.on('connection', function (socket) 
{
	console.log("CONNECTION REQUEST");
	socket.emit('welcome', 'tano');
	socket.on('command', function (command) 
	{
		console.log(command);
		runCommand(command, socket);
	});
});

function runCommand(command)
{
	var splitted = command.split('_');
	if (splitted.length > 1) //comando con parametri
	{
		switch(splitted[0])
		{
			case 'setTemperature' : 
							xmlrpcClient.methodCall('setValue', [splitted[1].concat(':4'), 
							'SET_TEMPERATURE', splitted[2]], 
							function (error, value) 
							{
							if (error)
								client.publish(TOPIC, error['faultString']);
							});
							break;

			default: return "Command not found!";
		}
	}
	else
	{
		switch(splitted[0])
		{
			case 'listDevices' :
							xmlrpcClient.methodCall('listDevices',[false, ["ADDRESS"]],  
							function (error, value) 
							{
								if (error)
									client.publish(TOPIC, error['faultString']);
								else
								{
									addresses = [];
									for (var i=0; i< value.length; i++)
										addresses.push(value[i]["ADDRESS"]);		
												
									client.publish(TOPIC, JSON.stringify({"DEVICES" : addresses}));
								}
							});
							break;

			default: return "Command not found!";
		}
	}	
	
}

function runCommand(command, socket)
{
	var splitted = command.split('_');
	if (splitted.length > 1) //comando con parametri
	{
		switch(splitted[0])
		{
			case 'setTemperature' : 
							xmlrpcClient.methodCall('setValue', [splitted[1].concat(':4'), 
							'SET_TEMPERATURE', splitted[2]], 
							function (error, value) 
							{
							if (error)
								socket.emit('status', error['faultString']);
							});
							break;

			default: return "Command not found!";
		}
	}
	else
	{
		switch(splitted[0])
		{
			case 'listDevices' :
							xmlrpcClient.methodCall('listDevices',[false, ["ADDRESS"]],  
							function (error, value) 
							{
								if (error)
									socket.emit('status', error['faultString']);
								else
								{
									addresses = [];
									for (var i=0; i< value.length; i++)
										addresses.push(value[i]["ADDRESS"]);		
												
									socket.emit('status', JSON.stringify({"DEVICES" : addresses}));
								}
							});
							break;

			default: return "Command not found!";
		}
	}	
	
}


xmlrpcServer.on('system.multicall', function (err, params, callback) 
{
	if(params instanceof Array && params[0] instanceof Array) 
	{
		
		var ext_dic = {};
		var dict = {};
		var device;
		var listVars = [];	
		
		for(var i = 0; i < params[0].length; i++) 
		{
			if(!params[0][i].params || params[0][i].params.length != 4 || params[0].length == 1) continue;
			if(params[0][i].methodName == 'event') 
			{		
				device = params[0][i].params[1];
				var varName = params[0][i].params[2];
				var value = params[0][i].params[3];
				listVars.push([varName, value]);
			}
				
			dict['status'] = listVars;
			dict['timestamp'] = Date.now();
			dict['address_source'] = device;

			ext_dic['homematic'] = dict; //per ogni device creo un JSON completo


		}

		if (!isEmpty(dict))
		{
			//console.log(JSON.stringify(ext_dic));
			io.emit('status', JSON.stringify(ext_dic));
			client.publish(TOPIC, JSON.stringify(ext_dic));
		}
	}
			
	callback(null, null)
});

console.log('XML-RPC server listening on port ' + xmlrpcServerPort);
 
setTimeout(function () 
{
	xmlrpcClient.methodCall('init', 
				['http://' + xmlrpcServerAddress + ':' + xmlrpcServerPort, 'HomegearClient'], 
				function (error, value) {})
}, 1000);


function isEmpty(dic)
{
	return Object.keys(dic).length === 0;
}
