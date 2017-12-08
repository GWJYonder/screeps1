/// <reference path="..\..\ScreepsAutocomplete\_references.js" />

module.exports = function (creep, charger, roomInfo, creepIndex) {
	//console.log('maintaining');
	if(creep.carry.energy == 0) {
	    //console.log(charger.energy);
	    if (charger.energy < 50 || charger.store.energy < 50){
		    creep.moveTo(Game.flags[roomInfo.standbyFlagName]);
	    }
		else if(creep.pos.getRangeTo(charger) > 1) {
			creep.moveTo(charger);
		}
		else{
		    if (charger.transfer){
		        charger.transfer(creep, RESOURCE_ENERGY);
		    }
			else{
			    charger.transferEnergy(creep);
			}
		}
		return true;
	}
	else {
		if(roomInfo.repairList.length) {
		    var repairIndex = 0;
		    if (creepIndex < roomInfo.repairList.length){
		        repairIndex = creepIndex;
		    }
		    var repairItem = Game.getObjectById(roomInfo.repairList[repairIndex]);
		    //console.log(JSON.stringify(repairItem));
		    if (creep.pos.getRangeTo(repairItem) > 1){
		        creep.moveTo(repairItem);
		    }
		    else{
		        creep.repair(repairItem)
		    }
		}
	}
}
