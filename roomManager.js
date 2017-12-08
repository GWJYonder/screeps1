/// <reference path="..\..\ScreepsAutocomplete\_references.js" />

//require('roomManager').addSource(0, 'sourceId', 'destinationId', 'spawnId', 0);
var spawnRole = require('spawnRole');
var creepJobs = require('creepJobs');
var creepStatus = require('creepStatus');
//require('roomManager').addController(0, 'controllerId', 'chargerId', 'spawnId', 4);

var repairHelper = require('repairHelper');

var builder = require('builder');
var maintainer = require('maintainer');
var guard = require('guard');

module.exports = {
    addRoom : function (roomName, spawnId){
        Memory.roomInfos.push({
           name  : roomName,
           spawnId : spawnId,
           claimedSources : [],
           claimedControllers : [],
           claimedNeighbors : [],
           repairList : [],
           builders : [],
           numBuilders : 0,
           guards : [],
           numGuards : 0,
           shuttles : [],
           numShuttles : 0
        });
    },
    addSource : function (roomIndex, sourceId, destinationId, spawnId, numHarvesters){
        Memory.roomInfos[roomIndex].claimedSources.push({
            sourceId : sourceId,
            destinationId : destinationId,
            spawnId : spawnId,
            harvesters : [],
            numHarvesters : numHarvesters
        });
    },
    handleClaimedSource : function(sourceInfo) {
        
        creepStatus.deleteDeadCreeps(sourceInfo.harvesters);
        if (sourceInfo.harvesters.length < sourceInfo.numHarvesters){
            creepStatus.requestCreep(sourceInfo.spawnId, sourceInfo.harvesters, 'harvester');
        }
        
        for (var i = 0; i < sourceInfo.harvesters.length; i++)
        {
            var creep = Game.creeps[sourceInfo.harvesters[i]];
            // Because of how commands are generated then executed we need this check even though we pruned dead creeps earlier.
            if (!creep){
                continue;
            }
            
            var source = Game.getObjectById(sourceInfo.sourceId);
            var destination = Game.getObjectById(sourceInfo.destinationId);
            var spawn = Game.getObjectById(sourceInfo.spawnId);
            
            //TODO
            if (!destination){
                console.log('handleClaimedSource todo');
                destination = Game.rooms['W13S1'].find(FIND_SOURCES)[0];
            }
            
            creepJobs.harvester(creep, source, destination, spawn);
        }
    },
    addController : function (roomIndex, controllerId, chargerId, spawnId, numUpgraders){
        Memory.roomInfos[roomIndex].claimedControllers.push({
            controllerId : controllerId,
            chargerId : chargerId,
            spawnId : spawnId,
            upgraders : [],
            numUpgraders : numUpgraders
        });
    },
    handleClaimedController : function(controllerInfo) {
        
        creepStatus.deleteDeadCreeps(controllerInfo.upgraders);
        if (controllerInfo.upgraders.length < controllerInfo.numUpgraders){
            creepStatus.requestCreep(controllerInfo.spawnId, controllerInfo.upgraders, 'upgrader');
        }
        
        for (var i = 0; i < controllerInfo.upgraders.length; i++)
        {
            var creep = Game.creeps[controllerInfo.upgraders[i]];
            // Because of how commands are generated then executed we need this check even though we pruned dead creeps earlier.
            if (!creep){
                continue;
            }
            
            var contr = Game.getObjectById(controllerInfo.controllerId);
            var charger = Game.getObjectById(controllerInfo.chargerId);
            creepJobs.upgrader(creep, contr, charger);
        }
    },
    handleBuilders : function(roomInfo) {
        
        creepStatus.deleteDeadCreeps(roomInfo.builders);
        if (roomInfo.builders.length < roomInfo.numBuilders){
            //console.log(roomInfo.name + ' request builder')
            creepStatus.requestCreep(roomInfo.spawnId, roomInfo.builders, 'builder');
        }
        
        var charger = this.getCharger(roomInfo);
        //console.log(roomInfo.name + ' job search')
        for (var i = 0; i < roomInfo.builders.length; i++)
        {
            var creep = Game.creeps[roomInfo.builders[i]];
            // Because of how commands are generated then executed we need this check even though we pruned dead creeps earlier.
            if (!creep){
                continue;
            }
            //return creep.moveTo(Game.flags['Flag2'].pos);
            //console.log('builder ' + i);
            //if (i == 0){
                if (roomInfo.repairList.length){
                    maintainer(creep, charger, roomInfo, i);
                }
                else{
                    builder(creep, charger, roomInfo);
                }
            //}
            //else{
            //    if (!builder(creep, charger, roomInfo)){
            //        maintainer(creep, charger, roomInfo);
            //    }
            //}
        }
    },
    handleGuards : function(roomInfo) {
        
        creepStatus.deleteDeadCreeps(roomInfo.guards);
        if (roomInfo.guards.length < roomInfo.numGuards){
            creepStatus.requestCreep(roomInfo.spawnId, roomInfo.guards, 'guard');
        }
        
        for (var i = 0; i < roomInfo.guards.length; i++)
        {
            var creep = Game.creeps[roomInfo.guards[i]];
            // Because of how commands are generated then executed we need this check even though we pruned dead creeps earlier.
            if (!creep){
                continue;
            }
            
            guard(creep);
        }
    },
    handleShuttles : function(roomInfo) {
        
        creepStatus.deleteDeadCreeps(roomInfo.shuttles);
        if (roomInfo.shuttles.length < roomInfo.numShuttles){
            creepStatus.requestCreep(roomInfo.spawnId, roomInfo.shuttles, 'shuttle');
        }
        
        for (var i = 0; i < roomInfo.shuttles.length; i++)
        {
            var creep = Game.creeps[roomInfo.shuttles[i]];
            // Because of how commands are generated then executed we need this check even though we pruned dead creeps earlier.
            if (!creep){
                continue;
            }
            
            creepJobs.shuttle(creep, roomInfo, this.getCharger(roomInfo));
        }
    },
    handleRepairList: function(roomInfo) {
        
        for (var i = 0; i < roomInfo.repairList.length; i++)
        {
            var structure = Game.getObjectById(roomInfo.repairList[i]);
            if (repairHelper.doneRepair(structure))
            {
                roomInfo.repairList.splice(i, 1);
            }
        }
        
        var room = Game.rooms[roomInfo.name];
        repairHelper.addRoomStructuresToRepairList(room, roomInfo.repairList, 1);
        
        var i = 0;
        while(!roomInfo.repairList.length && i < roomInfo.claimedNeighbors.length){
            room = Game.rooms[roomInfo.claimedNeighbors[i].roomName];
            repairHelper.addRoomStructuresToRepairList(room, roomInfo.repairList);
            i++;
        }
    },
    manageNeighbors: function(roomInfo) {
        if (roomInfo.claimedNeighbors){
            for (var i = 0; i < roomInfo.claimedNeighbors.length; i++){
                var neighbor = roomInfo.claimedNeighbors[i];
                
                creepStatus.deleteDeadCreeps(neighbor.claimers);
                if (neighbor.claimers.length < 1){
                    var controller = Game.getObjectById(neighbor.controllerId);
                    if (!controller || !controller.reservation || controller.reservation.ticksToEnd < 1000){
                        //creepStatus.requestCreep(roomInfo.spawnId, neighbor.claimers, 'claimer');
                    }
                }
                
                creepStatus.deleteDeadCreeps(neighbor.observers);
                var requestObs = neighbor.observers.length == 0 || (neighbor.observers.length == 1 && Game.creeps[neighbor.observers[0]] && Game.creeps[neighbor.observers[0]].ticksToLive < 500);
                if (requestObs){
                    creepStatus.requestCreep(roomInfo.spawnId, neighbor.observers, 'observer');
                }
                
                this.claimRooms(neighbor);
                this.observeRooms(neighbor);
            }
        }
    },
    claimRooms: function(neighbor) {
        var neighborFlag = Game.flags[neighbor.flagName];
        var neighborRoom = neighborFlag.room;
        for (var j = 0; j < neighbor.claimers.length; j++){
            var claimer = Game.creeps[neighbor.claimers[j]];
            // Because of how commands are generated then executed we need this check even though we pruned dead creeps earlier.
            if (!claimer){
                continue;
            }
            if (!neighborRoom){
                claimer.moveTo(neighborFlag);
            }
            else{
                var controller = neighborRoom.find(FIND_STRUCTURES, { filter : { structureType : STRUCTURE_CONTROLLER}})[0];
                if (claimer.pos.getRangeTo(controller) > 1){
                    claimer.moveTo(controller);
                }
                else{
                    if (neighbor.claim){
                        claimer.claimController(controller);
                    }
                    else{
                        claimer.reserveController(controller);
                    }
                }
            }
        }
    },
    observeRooms: function(neighbor) {
        var neighborFlag = Game.flags[neighbor.flagName];
        for (var j = 0; j < neighbor.observers.length; j++){
            var observer = Game.creeps[neighbor.observers[j]];
            if (!observer){
                continue;
            }
            
            if (observer.pos.getRangeTo(neighborFlag) > 3){
                observer.moveTo(neighborFlag);
            }
        }
    },
    getCharger : function(roomInfo){
        var charger = null;
        var chargers = Game.rooms[roomInfo.name].find(FIND_MY_STRUCTURES, { filter : { structureType : STRUCTURE_STORAGE }})
        if (chargers && chargers.length){
            charger = chargers[0];
        }
        else{
            charger = Game.getObjectById(roomInfo.spawnId);
        }
        return charger;
    }
}
