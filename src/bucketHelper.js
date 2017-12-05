//require('bucketHelper').addBucket(Memory.roomInfos[1].bucketInfos, bucketId, [previousBucketIds], [nextBucketIds]);

module.exports = {
    addBucket : function(bucketInfoList, bucketId, previousBucketIds, nextBucketIds){
        //console.log(JSON.stringify(bucketInfoList));
        
        for (var i = 0; i < previousBucketIds.length; i++){
            var previousInfo = this.findPreviousInfo(bucketInfoList, previousBucketIds[i]);
            previousInfo.nextIds.push(bucketId);
        }
        
        bucketInfoList.push({
            bucketId : bucketId,
            previousIds : previousBucketIds,
            nextIds : nextBucketIds
        });
        return 'added new bucket';
    },
    findPreviousInfo : function(bucketInfoList, previousId){
        //console.log(previousId);
        for (var i = 0; i < bucketInfoList.length; i++){
            var info = bucketInfoList[i];
            //console.log(JSON.stringify(info));
            //console.log(info.bucketId, + ', ' + previousId + ', ' + info.bucketId == previousId)
            if (info.bucketId == previousId){
                //console.log('returning matching previous bucket');
                return info;
            }
        }
    },
    processList : function(bucketInfos){
        //console.log('process bucket list');
        for (var i = 0; i < bucketInfos.length; i++){
            this.processBucket(bucketInfos[i]);
        }
    },
    processBucket : function(bucketInfo){
        var bucket = Game.getObjectById(bucketInfo.bucketId);
        //console.log(JSON.stringify(bucket));
        var energy = this.getEnergy(bucket);
        //console.log(energy);
        if (energy > 0){
            for (var i = 0; i < bucketInfo.nextIds.length; i++){
                var nextBucket = Game.getObjectById(bucketInfo.nextIds[i]);
                var shortfall = this.getCapacity(nextBucket) - this.getEnergy(nextBucket);
                //console.log(energy + ', ' + shortfall);
                if (shortfall > 0){
                    if (shortfall > energy){
                        shortfall = energy;
                    }
                    if (shortfall > 100){
                        shortfall = 100;
                    }
                    console.log(this.transferEnergy(bucket, nextBucket, shortfall));
                }
            }
        }
    },
    getEnergy : function(bucket){
        if (bucket.energy || bucket.energy === 0){
            return bucket.energy;
        }
        if (bucket.store){
            return bucket.store.energy;
        }
        return 0;
    },
    getCapacity : function(bucket){
        if (bucket.energyCapacity || bucket.energyCapacity === 0){
            return bucket.energyCapacity;
        }
        if (bucket.storeCapacity){
            return bucket.storeCapacity;
        }
        return 0;
    },
    transferEnergy : function(thisBucket, nextBucket, energyAmount){
        if (thisBucket.transfer){
            return thisBucket.transfer(nextBucket, RESOURCE_ENERGY, energyAmount)
        }
        else{
            return thisBucket.transferEnergy(nextBucket, energyAmount);
        }
    }
}
