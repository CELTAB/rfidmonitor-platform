var RUN_THIS = true; //change this to true in order to run the script.

var fs = require('fs')
const readline = require('readline');
var log_file = "parse-db-deci-to-hexa.log";
var logger = fs.createWriteStream(log_file, {
  flags: 'a' // append
});

function writeLog(message){
    logger.write(new Date().toString() + " : " + message + "\n");
    console.log(message);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

global.__base = __dirname + '/server/';
var sequelize = require(__base + 'controller/database/platformsequelize');


console.log("This script is going to convert every rfiddata from decimal to hexadecimal. Be sure to have database backups!");

console.log("\n\n (!) WARNING: YOUR DATABASE CANNOT HAVE RFIDDATA VALUES ALREADY IN HEXADECIMAL. This script cannot detect values that already have been parsed to hexa. \n\n");

if(RUN_THIS === false){
    console.log("Also, to avoid miss usage, this script is not going to execute directly. You need to manually edit it. Check the var RUN_THIS. Bye.");
    return;
}

console.log(`Writing logs in ${log_file} \n`);

rl.question(`Convert every single rfiddata on database to hexadecimal? [ Type CONVERT to accept. ] : `, (answer) => {
    rl.close();

    if(answer === "CONVERT"){
        console.log('Alright lets convert...');
        convert();
    }else{
        console.log('As you didn\'t type CONVERT. We are aborting.');
        process.exit();
        return;
    }

});

var regHexa = /[A-Fa-f]/g;
function isHexa(str) {
    return regHexa.test(str);
}

function convert(){

	sequelize.query(`select distinct(\"rfidCode\") from tb_plat_rfiddata;`).spread(function(results, metadata) {

        for (var i = 0; i < results.length; i++) {
            var rfidCode = results[i] ? results[i].rfidCode : null;
            if(!rfidCode){
    			console.log('Result not found.');
    			rl.close();
    			process.exit();
    			return;
    		}
            try {
                if(isHexa(rfidCode)){
                    writeLog(`We have found a rfidcode as hexadecimal [${rfidCode}]. The database should not have hexadecimal values already in the database. We cannot continue.`);
                    process.exit();
        			return;
                }
                var deci = Number(rfidCode);
                if(deci){
                    var hexa = deci.toString(16);
                    var log_message = `Original: ${deci} ; Converted: ${hexa}`;
                    writeLog(log_message);

                    var query = `update tb_plat_rfiddata set \"rfidCode\" =  \'${hexa}\' where \"rfidCode\" = \'${rfidCode}\';`;

					sequelize.query(query).spread(function(results, metadata){
                        var log_message = `Query ${query} -> Registers updated: ` + metadata.rowCount;
                        writeLog(log_message);
					});

                }else{
                    var log_message = `Cannot convert ${rfidCode} to hexadecimal.`;
                    writeLog(log_message);
                }

            } catch (e) {
                var log_message = `Cannot convert ${rfidCode} to hexadecimal.` + e.toString();
                writeLog(log_message);
            }
        }
	});

}
