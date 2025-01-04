function scaleCost(startcost, scaleperbought, boughtcount) {
  return ExpantaNum.mul(startcost, ExpantaNum.pow(scaleperbought, boughtcount));
}

function invScaleCost(startcost, scaleperbought, resourcecount) {
  return ExpantaNum.div(resourcecount, startcost)
    .logBase(scaleperbought)
    .ceil();
}

function softcapExponent(value, start, power, dis = false) {
  var x = value.clone();
  if (!dis && x.gte(start)) {
    x = x.div(start).max(1).pow(power).mul(start);
  }
  return x;
}

function buyableDisplay(options) {
  return function () {
    return (
      options.effect +
      "(" +
      format(getBuyableAmount(this.layer, this.id)) +
      (tmp[this.layer].buyables[this.id].extra
        ? tmp[this.layer].buyables[this.id].extra.neq(0)
          ? "+" + format(tmp[this.layer].buyables[this.id].extra)
          : ""
        : "") +
      ")<br>价格: " +
      format(this.cost()) +
      " " +
      options.currency +
      "<br>当前效果: " +
      options.effectDisplay(this.effect())
    );
  };
}
function P35M2buy() {
  cost = tmp[this.layer].buyables[this.id].cost;
  if (tmp[this.layer].buyables[this.id].canAfford) {
    if (!hasMilestone("e", 6)) player.e.p35m2 = player.e.p35m2.sub(cost).max(0);
    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id]
      .add(1)
      .max(1);
  }
}
