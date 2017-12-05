var initialize = require('initialize');

var roomManager = require('roomManager');
var bucketHelper = require('bucketHelper');
var squadManager = require('squadManager');
var creepStatus = require('creepStatus');

module.exports.loop = function () {
    return;
    if (!Memory.pause){
        if (!Memory.initialized){
            initialize();
        }
        
        for (var i = 0; i < Memory.towers.length; i++)
        {
            var tower = Game.getObjectById(Memory.towers[i].towerId);
            
            var enemies = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
            if (enemies && enemies.length){
                tower.attack(enemies[0]);
                continue;
            }
            var enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (enemy){
                tower.attack(enemy);
                continue;
            }
            
            var filterObj = { filter : function(s){ return s.structureType == STRUCTURE_RAMPART && s.hits < 20000; } };
            var ramparts = tower.pos.findInRange(FIND_MY_STRUCTURES, 10, filterObj);
            //console.log(ramparts.length);
            if (ramparts && ramparts.length){
                tower.repair(ramparts[0]);
                continue;
            }
            var rampart = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, filterObj);
            if (rampart){
                tower.repair(rampart);
                continue;
            }
            
        }
        
        for (var creepName in Game.creeps){
            if(!Memory.creeps[creepName]){
                Memory.creeps[creepName] = {};
            }
            var creep = Game.creeps[creepName];
            creepStatus.checkStatus(creep);
        }
        
        for (var i = 0; i < Memory.squads.length; i++){
            squadManager.processSquad(Memory.squads[i]);
        }
        
        for (var spawnName in Game.spawns){
            var spawn = Game.spawns[spawnName];
            var creepsToRenew = spawn.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter : function(c){
                    return c.memory.status == Memory.statusOptions.NEEDS_RENEW ||
                    c.memory.status == Memory.statusOptions.IN_RENEW;
                }});
            if (creepsToRenew.length){
                spawn.renewCreep(creepsToRenew[0]);
            }
        }
        
        for (var i = 0; i < Memory.roomInfos.length; i++) {
            var roomInfo = Memory.roomInfos[i];
            //console.log('room' + i)
            for(var j = 0; j < roomInfo.claimedSources.length; j++){
                roomManager.handleClaimedSource(roomInfo.claimedSources[j]);
            }
            for(var j = 0; j < roomInfo.claimedControllers.length; j++){
                roomManager.handleClaimedController(roomInfo.claimedControllers[j]);
            }
            roomManager.handleGuards(roomInfo);
            //bucketHelper.processList(roomInfo.bucketInfos);
            roomManager.handleShuttles(roomInfo);
            roomManager.handleRepairList(roomInfo);
            roomManager.handleBuilders(roomInfo);
            roomManager.manageNeighbors(roomInfo);
        }
	}
}
