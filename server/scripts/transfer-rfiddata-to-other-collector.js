const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

global.__base = __dirname + '/server/';
var sequelize = require(__base + 'controller/database/platformsequelize');

var origColId = -1;
var destColId = -1;

console.log("This script is going to transfer all rfiddata register from one collector to other. Be sure to have database backups!");

rl.question('Origin Collector\'s MAC: ', (origMac) => {

  rl.question('Destination Collector\'s MAC: ', (destMac) => {

	transfer(origMac, destMac);


  });

});

function transfer(origMac, destMac){

	sequelize.query(`select \"id\" from tb_plat_collector where \"deletedAt\" is null and \"mac\" = \'${origMac}\';`).spread(function(results, metadata) {
		origColId = results[0] ? results[0].id : null;

		if(!origColId){
			console.log('Origin collector not found.');
			rl.close();
			process.exit();
			return;
		}

		console.log(`Origin collector ${origMac} has the id ${origColId}`);

		sequelize.query(`select count(*) from tb_plat_rfiddata where \"collectorId\" = \'${origColId}\';`).spread(function(results, metadata) {
			var count = results[0].count;

			if(count === '0'){
				console.log("No registers found for Origin Collector. Are you sure the required collectors are really those you have informed? Aborting.")
				rl.close();
				process.exit();
				return;
			}

			rl.question(`The origin collector has ${count} registers. Confirm the transfer? [ Type TRANSFER to accept. ] : `, (answer) => {
				rl.close();

				if(answer === "TRANSFER"){
					console.log('Alright lets transfer...');
				}else{
					console.log('As you didn\'t type TRANSFER we are aborting.');
					process.exit();
					return;
				}

				sequelize.query(`select \"id\" from tb_plat_collector where \"deletedAt\" is null and \"mac\" = \'${destMac}\';`).spread(function(results, metadata) {
					destColId = results[0] ? results[0].id : null;

					if(!destColId){
						console.log('Destination collector not found.');
						rl.close();
						process.exit();
						return;
					}

					console.log(`Destination collector ${destMac} has the id ${destColId}`);

					var query = `update tb_plat_rfiddata set \"collectorId\" = ${destColId} where \"collectorId\" = ${origColId};`;

					sequelize.query(query).spread(function(results, metadata){
						console.log("Registers updated: " + metadata.rowCount);
						console.log("Done.");

						process.exit();
					});

				});
			});


		});

	});

}
