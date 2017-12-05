//require('initialize')();

module.exports = function () {
    Memory.initialized = 1;
    Memory.pause = 1;
    if (!Memory.creepNumbers){
        Memory.creepNumbers = {};
    }
    if (!Memory.roomInfos){
        Memory.roomInfos = [];
    }
    Memory.statusOptions = {
        GOOD : 1,
        NEEDS_RENEW : 2,
        IN_RENEW : 4,
        NEEDS_REPAIR : 8,
        IN_REPAIR : 16
    };
    Memory.orderOptions = {
        DISBAND : 0,
        STANDBY : 1,
        FOCUS : 2,
        BERSERK : 3,
        RETREAT : 4,
    };
}
