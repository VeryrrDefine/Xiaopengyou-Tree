function scaleCost(startcost, scaleperbought, boughtcount){
    return ExpantaNum.mul(startcost,ExpantaNum.pow(scaleperbought, boughtcount));
}


function invScaleCost(startcost, scaleperbought, resourcecount){
    return ExpantaNum.div(resourcecount, startcost).logBase(scaleperbought).ceil();
}