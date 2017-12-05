//require('spawnRole')('Spawn1', 'harvester');

module.exports = function (spawnId, roleName, spawnCode) {
    var spawn = Game.getObjectById(spawnId);
    var numberOfExtensions = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        }).length;
    //console.log('number of extensions: ' + numberOfExtensions)
    var getTypeCount = function (creepNumbers, creepType){
        if (!creepNumbers[creepType]){
            creepNumbers[creepType] = 0;
        }
        
        creepNumbers[creepType] = creepNumbers[creepType] + 1;
        
        return creepNumbers[creepType];
    };
    
    var bodyArray, typeName;
    
    if (roleName === 'guard') {
        //else{
        bodyArray = [TOUGH, ATTACK, MOVE, MOVE];
        //}
        typeName = 'Guard';
    }
    else if (roleName === 'fighter') {
        if (numberOfExtensions > 20 ){
            bodyArray = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else{
            bodyArray = [TOUGH, ATTACK, MOVE, MOVE];
        }
        typeName = 'Fighter';
    }
    else if (roleName === 'archer') {
        bodyArray = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        
        typeName = 'Archer';
    }
    else if (roleName === 'harvester') {
        if (numberOfExtensions > 29){
            bodyArray = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else if (numberOfExtensions > 19){
            bodyArray = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else if (numberOfExtensions > 9 ){
            bodyArray = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else if (numberOfExtensions > 4 ){
            bodyArray = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
        }
        else{
            bodyArray = [WORK, CARRY, MOVE];
        }
        typeName = 'Harvester';
    }
    else if (roleName === 'builder') {
        if (numberOfExtensions > 19){
            bodyArray = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }
        else {
            bodyArray = [WORK, CARRY, MOVE, MOVE];
        }
        typeName = 'Builder';
    }
    else if (roleName === 'upgrader') {
        if (numberOfExtensions > 19 ){
            bodyArray = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else if (numberOfExtensions > 9){
            bodyArray = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }
        else if (numberOfExtensions > 4){
            bodyArray = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else {
            bodyArray = [WORK, CARRY, MOVE];
        }
        typeName = 'Upgrader';
    }
    else if (roleName === 'shuttle') {
        if (numberOfExtensions > 19){
            bodyArray = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else if (numberOfExtensions > 4){
            bodyArray = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        //else {
            bodyArray = [CARRY, CARRY, MOVE, MOVE];
        //}
        typeName = 'Shuttle';
    }
    else if (roleName === 'claimer') {
        bodyArray = [CLAIM, CLAIM, MOVE, MOVE];
        typeName = 'Claimer';
    }
    else if (roleName === 'observer') {
        bodyArray = [MOVE];
        typeName = 'OBSERVER';
    }
    //console.log(roleName);
    //console.log(JSON.stringify(bodyArray));
    spawnCode = spawn.canCreateCreep(bodyArray);
    //console.log(spawnCode);
    if (spawnCode === OK){
        typeName = typeName + getTypeCount(Memory.creepNumbers, typeName);
        return spawn.createCreep( bodyArray, typeName, { role: roleName } );
    }
    return null;
}
