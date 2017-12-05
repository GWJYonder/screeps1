var contains = function (arr, value){
    for (var cI = 0; cI < arr.length; cI++){
        if (arr[cI] === value){
            return true;
        }
    }
    return false;
}

module.exports = {
    doneRepair : function (structure){
        if(!structure || contains(Memory.repairExceptions, structure.id)){
            return true;
        }
        if (structure.structureType == STRUCTURE_ROAD)
        {
            return structure.hits > structure.hitsMax * .95;
        }
        if (structure.structureType == STRUCTURE_WALL)
        {
            return structure.hits >= 110000;
        }
        if (structure.structureType == STRUCTURE_TOWER)
        {
            return structure.hits >= structure.hitsMax;
        }
        if (structure.structureType == STRUCTURE_RAMPART)
        {
            return structure.hits >= 50000;
        }
        
        return false;
    },
    needsRepair : function (structure){
        if(!structure || contains(Memory.repairExceptions, structure.id)){
            return false;
        }
        if (structure.structureType == STRUCTURE_ROAD)
        {
            return structure.hits < structure.hitsMax * .75;
        }
        if (structure.structureType == STRUCTURE_WALL)
        {
            return structure.hits < 110000;
        }
        if (structure.owner){
            if (structure.owner.username == 'Yonder')
            {
                if (structure.structureType == STRUCTURE_TOWER)
                {
                    return structure.hits < structure.hitsMax;
                }
                if (structure.structureType == STRUCTURE_RAMPART)
                {
                    return structure.hits < 40000;
                }
            }
        }
        
        return false;
    },
    addRoomStructuresToRepairList : function(room, list, includeWalls){
        if (room){
            var filterFuncOrig = this.needsRepair;
            if (!includeWalls){
                filterFunc = function(structure){ return structure.structureType != STRUCTURE_WALL && filterFuncOrig(structure)};
            }
            else{
                filterFunc = filterFuncOrig;
            }
    	    var toRepair = room.find(FIND_STRUCTURES, {
                filter: filterFunc
            });
            
            for (var i = 0; i < toRepair.length; i++){
                if (!contains(list, toRepair[i].id)){
                    list.push(toRepair[i].id);
                }
            }
        }
    }
}
