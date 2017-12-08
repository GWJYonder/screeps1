/// <reference path="..\..\ScreepsAutocomplete\_references.js" />

var spawnRole = require('spawnRole');

module.exports = {
    checkStatus : function (creep){
        
        return creep.memory.status = Memory.statusOptions.GOOD;
        
        if (!creep.memory.status){
            creep.memory.status = Memory.statusOptions.GOOD;
        }
        
        if (creep.memory.status == Memory.statusOptions.GOOD){
            if (creep.ticksToLive < 700){
                creep.memory.status = Memory.statusOptions.NEEDS_RENEW;
            }
            else if (creep.hits < creep.hitsMax * 0.6){
                creep.memory.status = Memory.statusOptions.NEEDS_REPAIR;
            }
        }
        else if (creep.memory.status == Memory.statusOptions.IN_RENEW){
            if (creep.ticksToLive > 1400){
                creep.memory.status = Memory.statusOptions.GOOD;
            }
        }
        else if (creep.memory.status == Memory.statusOptions.IN_REPAIR){
            if (creep.hits > creep.hitsMax * 0.99){
                creep.memory.status = Memory.statusOptions.GOOD;
            }
        }
    },
    isInService : function(creep){
        return (creep.memory.status == Memory.statusOptions.GOOD ||
                creep.memory.status == Memory.statusOptions.NEEDS_RENEW ||
                creep.memory.status == Memory.statusOptions.NEEDS_REPAIR ||
                creep.memory.status == Memory.statusOptions.OBSOLETE);
    },
    obsoleteCreeps : function(roomIndex){
        var roomInfo = Memory.roomInfos[roomIndex];
        
        for (var i = 0; i < roomInfo.claimedSources.length; i++){
            var sourceInfo = roomInfo.claimedSources[i];
            for (var j = 0; j < sourceInfo.harvesters.length; j++){
                var harvester = Game.creeps[sourceInfo.harvesters[j]];
                
                harvester.memory.status = Memory.statusOptions.OBSOLETE;
            }
        }
        
        for (var i = 0; i < roomInfo.claimedControllers.length; i++){
            var controllerInfo = roomInfo.claimedControllers[i];
            for (var j = 0; j < controllerInfo.upgraders.length; j++){
                var upgrader = Game.creeps[controllerInfo.upgraders[j]];
                
                upgrader.memory.status = Memory.statusOptions.OBSOLETE;
            }
        }
        
        for (var i = 0; i < roomInfo.builders.length; i++){
            var sourceInfo = roomInfo.builders[i];
            var builder = Game.creeps[roomInfo.builders[i]];
                
            builder.memory.status = Memory.statusOptions.OBSOLETE;
        }
        
        for (var i = 0; i < roomInfo.shuttles.length; i++){
            var sourceInfo = roomInfo.shuttles[i];
            var shuttle = Game.creeps[roomInfo.shuttles[i]];
                
            shuttle.memory.status = Memory.statusOptions.OBSOLETE;
        }
        
        console.log('creeps Obsolete.');
    },
    deleteDeadCreeps : function(creepNames){
        //console.log(JSON.stringify(creepNames));
        if (creepNames){
            for (var i = 0; i < creepNames.length; i++){
                if (!Game.creeps[creepNames[i]]){
                    creepNames.splice(i, 1);
                }
            }
        }
    },
    requestCreep : function(spawnId, creepArray, role){
        var spawnCode = undefined;
        var spawnResult = spawnRole(spawnId, role, spawnCode);
        if (spawnResult){
            creepArray.push(spawnResult);
        }
    }
}
