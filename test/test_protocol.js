var expect = require("chai").expect;
var ProtocolConnectionController = require('../controllers/protocol-connection');
protocol = new ProtocolConnectionController();

//disable logger console prints present into app´s classes
var logger = require('winston');
logger.remove(logger.transports.Console);

describe("Protocol-Connection", function(){
	describe("#Send Packages", function(){

			// simulate limit number of bytes to send each TCP commit.
			var maxBytesSend = 500;
			// simulate number of packets (size + jsonobj) to send.
			var numberOfPackages = 500;
			// size of fake_data field of the json obj.
			var maxFakeDataSize = 500;
			// number of broken json pkts to send.
			var numberOfBrokenPkts = 20;


			var expectedVars = {
				numberOfPackages: numberOfPackages,
				numberOfBrokenPkts: numberOfBrokenPkts,
				numberOfSuccessPackages: numberOfPackages - numberOfBrokenPkts,
				numberOfIgnoredPackages: 0
			}

			var receivedVars = {
				numberOfPackages: 0,
				numberOfBrokenPkts: 0,
				numberOfSuccessPackages: 0,
				numberOfIgnoredPackages: 0
			}

			function buildMessage(message){
				var size = message.length;
				var newMessage = String('00000000' + size).slice(size.toString().length);
				var newMessage = newMessage.concat(message);
				return newMessage;
			}

			function randomInt (low, high) {
			    return Math.floor(Math.random() * (high - low) + low);
			}

			var sendBuffer = new Buffer(0);

			function send(message, forceSend){
				var numberBytesSend = randomInt(1,maxBytesSend);	
				// console.log("PROTOCOL_TEST[DEBUG] : numberBytesSend: "+numberBytesSend);
				
				if (message)
					sendBuffer = Buffer.concat([sendBuffer, new Buffer(message)]);

				var cur = 0;

				while(sendBuffer.length >= numberBytesSend || forceSend===true){
					cur = numberBytesSend;
					if (forceSend===true)
						cur = sendBuffer.length;
					var messageToSend = sendBuffer.slice(0,cur);
					sendBuffer = sendBuffer.slice(cur, sendBuffer.length);
					protocol.processData(new Buffer(messageToSend));

					if(sendBuffer.length == 0)
						forceSend = false;
				}
			}


		it("Should match numbers of packages", function(){
			
			var broken_count = 0;
			for (i=0;i<numberOfPackages;i++){
				var obj = {}
				obj.package_id = i;
				var size = randomInt(1,maxFakeDataSize);
				obj.fake_data_size = size;
				var fake_data = new Buffer(size);
				fake_data.fill('#');
				obj.fake_data = fake_data.toString();
				if(broken_count < numberOfBrokenPkts){
					send(buildMessage("BROKEN"+JSON.stringify(obj)+"BROKEN"),false);
					broken_count++;
				}
				else
					send(buildMessage(JSON.stringify(obj)),false);
			}

			if (sendBuffer.length > 0)
				send(null,true);

				receivedVars.numberOfPackages = protocol.debug_receivedObjs;
				receivedVars.numberOfBrokenPkts = protocol.debug_brokenJsonObjs;
				receivedVars.numberOfSuccessPackages = protocol.debug_successJsonObjs;
				receivedVars.numberOfIgnoredPackages = protocol.debug_ignoredBuffer;

			expect(expectedVars).to.deep.equals(receivedVars);
		});


		it("Should ignore wrong header size info", function(){

				expectedVars.numberOfIgnoredPackages++;

				//Should be '00000012abcdefghijkl' but we are sending just the text
				send("abcdefghijkl", true);

				receivedVars.numberOfPackages = protocol.debug_receivedObjs;
				receivedVars.numberOfBrokenPkts = protocol.debug_brokenJsonObjs;
				receivedVars.numberOfSuccessPackages = protocol.debug_successJsonObjs;
				receivedVars.numberOfIgnoredPackages = protocol.debug_ignoredBuffer;

			expect(expectedVars).to.deep.equals(receivedVars);

		});

	});

});