/// <reference path="..\..\ScreepsAutocomplete\_references.js" />

var auxFlagDistance = 4;
var attackFlagDistance = 6;

var creepStatus = require('creepStatus');

module.exports = {
    addSquad : function (spawnId, chargerId, rallyName, standbyName, retreatName, numFighters, numArchers, numMedics, numColliers){
        if(!Memory.squads){
            Memory.squads = [];
        }
        
        Memory.squads.push({
           order : Memory.orderOptions.DISBAND,
           spawnId : spawnId,
           chargerId : spawnId,
           rallyFlagName : rallyName,
           standbyFlagName : standbyName,
           retreatFlagName : retreatName,
           fighterNames : [],
           numFighters : numFighters,
           archerNames : [],
           numArchers : 0,
           medicNames : [],
           numMedics : 0,
           collierNames : [],
           numColliers : 0
        });
    },
    processSquad : function(squadInfo){
        // remove dead creeps
        for (var i = 0; i < squadInfo.fighterNames.length; i++){
            if (!Game.creeps[squadInfo.fighterNames[i]]){
                squadInfo.fighterNames.splice(i, 1);
            }
        }
        for (var i = 0; i < squadInfo.archerNames.length; i++){
            if (!Game.creeps[squadInfo.archerNames[i]]){
                squadInfo.archerNames.splice(i, 1);
            }
        }
        for (var i = 0; i < squadInfo.medicNames.length; i++){
            if (!Game.creeps[squadInfo.medicNames[i]]){
                squadInfo.medicNames.splice(i, 1);
            }
        }
        for (var i = 0; i < squadInfo.collierNames.length; i++){
            if (!Game.creeps[squadInfo.collierNames[i]]){
                squadInfo.collierNames.splice(i, 1);
            }
        }
        
        
        if (squadInfo.order != Memory.orderOptions.DISBAND){
            if (squadInfo.fighterNames.length < squadInfo.numFighters){
                creepStatus.requestCreep(squadInfo.spawnId, squadInfo.fighterNames, 'fighter')
            }
            if (squadInfo.archerNames.length < squadInfo.numArchers){
                creepStatus.requestCreep(squadInfo.spawnId, squadInfo.archerNames, 'archer')
                console.log('build archer');
            }
        }
        
        this.processCombatants(squadInfo);
    },
    energyAvailable : function (squadInfo){
        var energy = 0;
        for (var i = 0; i < squadInfo.collierNames.length; i++){
            energy += squadInfo.colliers[i].carry.energy;
        }
        for (var i = 0; i < squadInfo.medicNames.length; i++){
            energy += squadInfo.medics[i].carry.energy;
        }
        return energy;
    },
    shouldRetreat : function (squadInfo){
        var combatants = squadInfo.fighterNames.length + squadInfo.archerNames.length;
        var maxCombatants = squadInfo.numFighters + squadInfo.numArchers;
        if (combatants < maxCombatants / 2){
            return true;
        }
        if (!this.energyAvailable(squadInfo)){
            return true;
        }
        return false;
    },
    processColliers : function (squadInfo){
        var retreatFlag = Game.flags[squadInfo.rallyFlagName];
        var standbyFlag = Game.flags[squadInfo.standbyFlagName];
        
        if (squadInfo.order == Memory.orderOptions.RETREAT){
            
        }
    },
    processMedics : function (squadInfo){
        var retreatFlag = Game.flags[squadInfo.rallyFlagName];
        var standbyFlag = Game.flags[squadInfo.standbyFlagName];
        
        if (squadInfo.order == Memory.orderOptions.RETREAT){
            
        }
    },
    processCombatants : function (squadInfo){
        var retreatFlag = Game.flags[squadInfo.rallyFlagName];
        var standbyFlag = Game.flags[squadInfo.standbyFlagName];
        var rallyFlag = Game.flags[squadInfo.rallyFlagName];
        
        var combatants = squadInfo.fighterNames.concat(squadInfo.archerNames);
        
        //console.log(squadInfo.order);
        //console.log(JSON.stringify(combatants));
        
        if (squadInfo.order == Memory.orderOptions.RETREAT){
            
        }
        else if (squadInfo.order == Memory.orderOptions.STANDBY){
            //console.log('standby')
            var enemiesNearFlag = standbyFlag.pos.findInRange(FIND_HOSTILE_CREEPS, attackFlagDistance);
            for (var i = 0; i < combatants.length; i++){
                var combatant = Game.creeps[combatants[i]];
                //console.log(JSON.stringify(combatant));
                if (combatant.pos.getRangeTo(standbyFlag) > attackFlagDistance){
                    //console.log('move');
                    combatant.moveTo(standbyFlag);
                }
                else if (enemiesNearFlag.length)
                {
                    this.combatantAttack(combatant, enemiesNearFlag[0])
                }
            }
        }
        else if (squadInfo.order == Memory.orderOptions.FOCUS){
            var enemiesNearFlag = rallyFlag.pos.findInRange(FIND_HOSTILE_CREEPS, attackFlagDistance);
            var structuresNearFlag = rallyFlag.pos.findInRange(FIND_STRUCTURES, 1, { filter : {}});
            enemiesNearFlag = enemiesNearFlag.concat(structuresNearFlag);
            
            for (var i = 0; i < combatants.length; i++){
                var combatant = Game.creeps[combatants[i]];
                if (combatant){
                    
                    //combatant.move(TOP_LEFT);
                    //continue;
                    
                    if (combatant.pos.getRangeTo(rallyFlag) > attackFlagDistance){
                        combatant.moveTo(rallyFlag);
                    }
                    else if (enemiesNearFlag.length)
                    {
                        var target = combatant.pos.findClosestByRange(enemiesNearFlag);
                        this.combatantAttack(combatant, target);
                    }
                }
            }
            
        }
        else if (squadInfo.order == Memory.orderOptions.BERSERK){
            
            //console.log('berserk');
            
            if (!rallyFlag.room){
                for (var i = 0; i < combatants.length; i++){
                    Game.creeps[combatants[i]].moveTo(rallyFlag);
                }
                return;
            }
            var enemyCreeps = rallyFlag.room.find(FIND_HOSTILE_CREEPS);
            var enemyStructures = rallyFlag.room.find(FIND_HOSTILE_STRUCTURES);
            
            //console.log('berserkAttack');
            for (var i = 0; i < squadInfo.fighterNames.length; i++){
                //console.log('fighterAttack');
                var fighter = Game.creeps[squadInfo.fighterNames[i]];
                var target;
                if (enemyStructures.length){
                    target = fighter.pos.findClosestByPath(enemyStructures);
                }
                else {
                    target = fighter.pos.findClosestByPath(enemyCreeps);
                }
                
                if (target){
                    this.combatantAttack(fighter, target);
                }
            }
            
            for (var i = 0; i < squadInfo.archerNames.length; i++){
                //console.log('archerAttack');
                var archer = Game.creeps[squadInfo.archerNames[i]];
                var target;
                if (enemyCreeps.length){
                    target = archer.pos.findClosestByPath(enemyCreeps);
                }
                else {
                    target = archer.pos.findClosestByPath(enemyStructures);
                }
                
                if (target){
                    this.combatantAttack(archer, target);
                }
            }
        }
    },
    combatantAttack : function(combatant, target){
        var attackResult = combatant.rangedAttack(target);
        if (attackResult == ERR_NO_BODYPART){
            attackResult = combatant.attack(target);
        }
        
        if (attackResult == ERR_NOT_IN_RANGE){
            combatant.moveTo(target);
        }
    },
}
