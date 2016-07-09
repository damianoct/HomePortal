# Homematic Server
A Node.js web socket server for Homematic devices.

With this script is possible via MQTT send command and read device of Homematic family with BidCos protocol.
This Node.js script receive MQTT commands and communicate with the device through XML RPC using [Homegear](https://github.com/Homegear/Homegear). 

---

Once installed and run Homegear and the [hmland](https://git.zerfleddert.de/cgi-bin/gitweb.cgi/hmcfgusb) drivers you need to pair your Homematic devices. To do this:

run the Homegear client

`$ homegear -r`

select BidCos device family

`$ fs 0`

activate pairing mode

`$ pon`

And follow the instruction of your Homematic Device to complete the association's process.

All connected device to Homegear have a unique serial number which can help you to identify it in Homegear.

For more information check [Pairing_HomeMatic_BidCoS_Devices](https://www.homegear.eu/index.php/Pairing_HomeMatic_BidCoS_Devices).

With your device connected to Homegear interface you can use the HomePortal to send command with Mqtt.

---

###Send command to device.
E.g.:
To set temperature on Wireless Thermostat (HM-CC-RT-DN) you can send this command through MQTT:

`setTemperature_SERIALNUMBER_25`

SERIALNUMBER = The device serial number gained from Homegar during pairing process.


