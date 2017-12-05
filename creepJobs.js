var creepStatus = require('creepStatus');

module.exports = {
    creepMove : function (creep, destination, path){
        var range = creep.pos.getRangeTo(destination);
        if (range > 1){
            if (path && range > 3){
                creep.moveTo(destination);
            }
            else{
                creep.moveByPath(path);
            }
        }
        return range;
    },
    harvester : function (creep, source, destination, spawn) {
        //return;
        //return creep.moveTo(Game.flags['Flag2']);
        if (creepStatus.isInService(creep)){
        //if (true){
        	if(creep.carry.energy < creep.carryCapacity) {
        		if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        			creep.moveTo(source);
        		}			
        	}
        	else {
        		if(creep.transfer(destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        			creep.moveTo(destination);
        		}	
        		else if (creep.memory.status == Memory.statusOptions.NEEDS_RENEW){
        		    creep.memory.status = Memory.statusOptions.IN_RENEW;
        		}
        	}
        }
        else{
            if (creep.pos.getRangeTo(spawn) > 1){
                creep.moveTo(spawn);
            }
        }
    },
    upgrader : function (creep, controller, charger) {
        //return creep.moveTo(Game.flags['Flag2']);
    	if(creep.carry.energy == 0) {
    	    var range = creep.pos.getRangeTo(charger);
    	    if (range < 2){
    	        if (charger.transfer){
	                charger.transfer(creep, RESOURCE_ENERGY);
    	        }
    	        else{
    	            charger.transferEnergy(creep);
    	        }
    	    }
    		else {
    			creep.moveTo(charger);				
    		}
    	}
    	else {
    		if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(controller);				
    		}
    	}
    },
    shuttle : function (creep, roomInfo, charger) {
        //return creep.moveTo(Game.flags[roomInfo.standbyFlagName]);
    	if(creep.carry.energy == 0) {
    	    if (creep.pos.getRangeTo(charger) > 1){
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
    	}
    	else {
    	    var room = Game.rooms[roomInfo.name];
    	    var emptyStructures = room.find(FIND_MY_STRUCTURES, {
    	        filter : function(s) { return s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity;}
    	        });
    	    if (!emptyStructures.length){
    	        emptyStructures = room.find(FIND_MY_STRUCTURES, {
    	        filter : function(s) { return s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity;}
    	        });
    	    }
    	    if (!emptyStructures.length){
    	        emptyStructures = room.find(FIND_MY_STRUCTURES, {
    	        filter : function(s) { return s.structureType == STRUCTURE_SPAWN && s != charger && s.energy < s.energyCapacity;}
    	        });
    	    }
    	    if (emptyStructures.length > 0){
        		if(creep.transferEnergy(emptyStructures[0]) == ERR_NOT_IN_RANGE) {
        			creep.moveTo(emptyStructures[0]);				
        		}
    	    }
    	    else{
    	        return creep.moveTo(Game.flags[roomInfo.standbyFlagName]);
    	    }
    	}
	},
}
