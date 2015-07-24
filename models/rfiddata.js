var logger = require('winston');

var Rfiddata = function(obj){

    if(obj){
        this.id = obj.id;
        this.rfidReadDate = obj.rfidReadDate;
        this.serverReceivedDate = obj.serverReceivedDate;
        this.rfidcode = obj.rfidcode;
        this.collectorId = obj.collectorId;
        this.packageId = obj.packageId;
        this.extraData = obj.extraData;
    }else{
        this.id = 0;
        this.rfidReadDate = null;
        this.serverReceivedDate = new Date();
        this.rfidcode = '';
        this.collectorId = 0;
    	this.packageId = 0;
        this.extraData = '';
    }

}

module.exports = Rfiddata;