module.exports = function (creep) {

    var targets = creep.room.find(FIND_HOSTILE_CREEPS);
	if(targets.length) {
	    var attackResult = creep.attack(targets[0]);
		if(attackResult == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[0]);		
		}
		else if (attackResult == ERR_NO_BODYPART)
		{
		    if(creep.rangedAttack(targets[0]) == ERR_NOT_IN_RANGE) {
			    creep.moveTo(targets[0]);		
		    }
		}
	}
	else{
	    
	    //return creep.move(RIGHT);
    	
    	var flag = Game.flags['Flag1'];
    	if (creep.pos.findInRange(flag, 2) == 0){
    	    creep.moveTo(flag.pos);
    	}
	}
}
