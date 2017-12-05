module.exports = function (creep, charger, roomInfo) {
    //console.log('building');
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
	    var room = Game.rooms[roomInfo.name];
		var targets = room.find(FIND_CONSTRUCTION_SITES);
		//console.log("sites: " + targets.length);
		var i = 0;
		while(!targets.length && i < roomInfo.claimedNeighbors.length){
		    room = Game.rooms[roomInfo.claimedNeighbors[i].roomName];
		    if (room){
		        targets = room.find(FIND_CONSTRUCTION_SITES);
		    }
	        i++;
	        //console.log("sites: " + targets.length);
		}
		if(targets.length) {
		    var range = creep.pos.getRangeTo(targets[0]);
		    if (range > 2){
		        creep.moveTo(targets[0]);
		    }
		    else{
		        creep.build(targets[0]);
		    }
			//if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
			//	creep.moveTo(targets[0]);					
			//}
			return true;
		}
		else{
		    creep.moveTo(Game.flags[roomInfo.standbyFlagName]);
		    return false;
		}
	}
}
