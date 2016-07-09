# HomematicWebSocketServer
A Node.js web socket server for Homematic devices.

With this script is possible via MQTT send command and read device of Homematic family with BidCos protocol.
This Node.js script receive MQTT commands and communicate with the device through XML RPC using [Homegear](https://github.com/Homegear/Homegear). 

---

Once installed and run Homegear and the [hmland](https://git.zerfleddert.de/cgi-bin/gitweb.cgi/hmcfgusb) drivers you need to pair your Homematic devices. To do this:

Run the Homegear client
`homegear -r`
Select BidCos device family
`fs 0`
Activate pairing mode
`pon`
And follow the instruction of your Homematic Device to complete the association's process.

With your device connected to Homegear interfaces you can use the HomePortal to send command with Mqtt.
