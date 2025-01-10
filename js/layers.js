

addLayer("a", {
    name: "成就", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new ExpantaNum(0),
    }},
    tooltip() {
      return "成就"
    },
    color: "#FFFF00",
    nodeStyle() {return {
        "background": "radial-gradient(#FFFF00, #d5ad83)" ,
    }},
    requires: new ExpantaNum(0), // Can be a function that takes requirement increases into account
    resource: "成就点数",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return false },
    achievements: {
    },
    tabFormat: {
        "成就" :{
            content: ["main-display",
            "achievements"]
        },
    },
})

addLayer("p", {
    name: "小朋友^1.5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1.5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
        };
    },
    update() {
        player.pointSoftcapStart = pointSoftcapStart();
        player.pointSoftcapPower = pointSoftcapPower();
        player.pointSoftcapStart2 = pointSoftcapStart2();
        player.pointSoftcapPower = pointSoftcapPower2();
        

    },
    showTotal: true,
    showBest: true,
    color: "#f32050",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "小朋友^1.5", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {
        return player.points;
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1 / 2.6, // Prestige currency exponent
    resetsNothing() {
        return hasUpgrade("c", 12) || hasMilestone("f", 0);
    },
    gainMult() {
        // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1);
        if (inChallenge("e", 11)) return ExpantaNum.ZERO.clone();

        if (hasUpgrade("p", 14)) mult = mult.mul(upgradeEffect("p", 14));
        if (hasUpgrade("p", 21)) mult = mult.mul(1.6365);
        mult = mult.mul(buyableEffect("p", 12));
        if (hasUpgrade("b", 12)) mult = mult.mul(upgradeEffect("b", 12));
        mult = mult.mul(tmp.d.effect);

        return mult;
    },
    passiveGeneration() {
        mult = new ExpantaNum(0);
        if (hasUpgrade("b", 13)) mult = mult.add(1);

        return mult;
    },
    update() {
        if (hasUpgrade("b", 14)) {
            tmp.p.buyables[11].buy();
            tmp.p.buyables[12].buy();
        }
        player.pointSoftcapStart = pointSoftcapStart();
        player.pointSoftcapPower = pointSoftcapPower();
    },
    softcap: ExpantaNum(1e25),
    softcapPower: 0.5,
    gainExp() {
        // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);

        if (hasUpgrade("p", 23)) exp = exp.add(0.01);
        if (hasUpgrade("b", 21)) exp = exp.add(upgradeEffect("b", 21));
        return exp;
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key: "p",
            description: "P: Reset for 小朋友^1.5",
            onPress() {
                if (canReset(this.layer)) doReset(this.layer);
            },
        },
    ],
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let dontreset = false;
            let kept = ["unlocked", "auto"];
            if (resettingLayer == "b") {
                if (hasUpgrade("d", 11) || hasUpgrade("b", 11)) kept.push("upgrades");
            }
            if (resettingLayer == "c") {
                if (hasUpgrade("d", 11) || hasMilestone("c", 0)) kept.push("upgrades");
            }
            if (resettingLayer == "d") {
                if (hasUpgrade("d", 11)) kept.push("upgrades");
            }
            if (resettingLayer == "e") {
                if (hasMilestone("e", 0)) kept.push("upgrades", "milestones");
            }
            if (resettingLayer == "f") {
                if (hasMilestone("f", 1)) dontreset = true;
            }
            if (!dontreset) layerDataReset(this.layer, kept);
        }
    },
    layerShown() {
        return true && player.thenewyearLay.treelayer == 0;
    },
    upgrades: {
        11: {
            title: "一切之本(root)-11",
            description: "获取+10/s小朋友",
            cost: new ExpantaNum(1),
        },
        12: {
            title: "12",
            description: "基于最高的小朋友^1.5增加小朋友获取",
            cost: new ExpantaNum(5),
            effect() {
                let eff = softcap(
                    player.p.best.div(2).add(2).pow(0.5),
                    new ExpantaNum(1e9),
                    0.02
                );

                return eff;
            },
            effectDisplay() {
                return `${format(player.p.best)}→×${format(this.effect())}`;
            },
            unlocked() {
                return hasUpgrade("p", 11);
            },
        },
        13: {
            title: "13",
            description: "基于小朋友增加小朋友获取",
            cost: new ExpantaNum(10),
            effect() {
                let eff = softcap(
                    player.points.div(5).add(2).pow(0.4),
                    new ExpantaNum(1e9),
                    0.02
                );

                return eff;
            },
            effectDisplay() {
                return "×" + format(this.effect());
            },
            unlocked() {
                return hasUpgrade("p", 12);
            },
        },
        14: {
            title: "14",
            description: "基于小朋友增加小朋友^1.5获取",
            cost: new ExpantaNum(30),
            effect() {
                let eff = softcap(
                    player.points.div(10).add(1).pow(0.25),
                    new ExpantaNum(1e9),
                    0.02
                );

                return eff;
            },
            effectDisplay() {
                return "×" + format(this.effect());
            },
            unlocked() {
                return hasUpgrade("p", 13);
            },
        },
        15: {
            title: "15",
            description: "解锁一个购买项",
            cost: new ExpantaNum(100),
            unlocked() {
                return hasUpgrade("p", 14);
            },
        },
        21: {
            title: "21",
            description: "小朋友^1.5获取×1.6365",
            cost: new ExpantaNum(500),
            unlocked() {
                return hasUpgrade("p", 15);
            },
        },
        22: {
            title: "22",
            description: "小朋友获取×6.365",
            cost: new ExpantaNum(1000),
            unlocked() {
                return hasUpgrade("p", 21);
            },
        },
        23: {
            title: "23",
            description: "小朋友^1.5获取指数+0.01",
            cost: new ExpantaNum(10000),
            unlocked() {
                return hasUpgrade("p", 22);
            },
        },
        24: {
            title: "24",
            description: "解锁一个购买项",
            cost: new ExpantaNum(30000),
            unlocked() {
                return hasUpgrade("p", 23);
            },
        },
        25: {
            title: "25",
            description: "解锁小朋友^2",
            cost: new ExpantaNum(0),
            unlocked() {
                return hasUpgrade("p", 24);
            },
        },
        31: {
            title: "31",

            description: "小朋友^1.5增益小朋友^2",
            effect() {
                return player.b.points.add(10).log(2).pow(1.2).add(1);
            },
            effectDisplay() {
                return "×" + format(this.effect());
            },
            cost: new ExpantaNum(3e42),
            unlocked() {
                return hasUpgrade("c", 24);
            },
        },
        32: {
            title: "32",
            description: "小朋友×1.000e9",
            cost: new ExpantaNum(1e45),
            unlocked() {
                return hasUpgrade("p", 31);
            },
        },
    },
    buyables: {
        11: {
            cost(x) {
                return scaleCost(100, 3, x);
            },
            display() {
                return `基于购买次数增加小朋友获取(${format(
                    getBuyableAmount(this.layer, this.id)
                )})<br>价格: ${format(this.cost())} 小朋友^1.5<br>当前效果: ×${format(
                    this.effect()
                )}`;
            },
            title: `推进器`,
            canAfford() {
                return player[this.layer].points.gte(this.cost());
            },
            buy() {
                if (
                    getBuyableAmount(this.layer, this.id).lt(
                        invScaleCost(100, 3, player.p.points)
                    )
                )
                    setBuyableAmount(
                        this.layer,
                        this.id,
                        invScaleCost(100, 3, player.p.points)
                    );
            },
            unlocked() {
                return hasUpgrade("p", 15);
            },
            effect() {
                return ExpantaNum.pow(1.1, getBuyableAmount(this.layer, this.id));
            },
        },
        12: {
            cost(x) {
                return scaleCost(1000, 5, x);
            },
            display() {
                return `基于购买次数增加小朋友^1.5获取(${format(
                    getBuyableAmount(this.layer, this.id)
                )})<br>价格: ${format(this.cost())} 小朋友^1.5<br>当前效果: ×${format(
                    this.effect()
                )}`;
            },
            title: `推进器^1.5`,
            canAfford() {
                return player[this.layer].points.gte(this.cost());
            },
            buy() {
                if (
                    getBuyableAmount(this.layer, this.id).lt(
                        invScaleCost(1000, 5, player.p.points)
                    )
                )
                    setBuyableAmount(
                        this.layer,
                        this.id,
                        invScaleCost(1000, 5, player.p.points)
                    );
            },
            effect() {
                return ExpantaNum.pow(1.02, getBuyableAmount(this.layer, this.id));
            },
            unlocked() {
                return hasUpgrade("p", 24);
            },
        },
    },
});
addLayer("b", {
    name: "小朋友^2", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        };
    },
    showTotal: true,
    showBest: true,
    color: "#646d75",
    requires: new ExpantaNum(100000), // Can be a function that takes requirement increases into account
    resource: "小朋友^2", // Name of prestige currency
    baseResource: "小朋友^1.5", // Name of resource prestige is based on
    baseAmount() {
        return player.p.points;
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1 / 2, // Prestige currency exponent
    gainMult() {
        // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1);
        if (hasUpgrade("c", 11)) mult = mult.mul(upgradeEffect("c", 11));
        if (hasUpgrade("p", 31)) mult = mult.mul(upgradeEffect("p", 31));
        if (hasUpgrade("d", 32)) mult = mult.mul(upgradeEffect("d", 32));
        if (hasUpgrade("f", 11)) mult = mult.mul(upgradeEffect("f", 11));
        return mult;
    },
    gainExp() {
        // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        if (hasChallenge("d", 11)) exp = exp.add(0.03);
        return exp;
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let dontreset = false;
            let kept = ["unlocked", "auto"];
            if (resettingLayer == "b") {
                if (hasUpgrade("d", 22)) kept.push("upgrades");
            }
            if (resettingLayer == "c") {
                if (hasUpgrade("d", 22)) kept.push("upgrades");
            }
            if (resettingLayer == "d") {
                if (hasUpgrade("d", 22)) kept.push("upgrades");
            }
            if (resettingLayer == "e") {
                if (hasMilestone("e", 0)) kept.push("upgrades", "milestones");
            }
            if (resettingLayer == "f") {
                if (hasMilestone("f", 1)) dontreset = true;
            }

            if (!dontreset) layerDataReset(this.layer, kept);
        }
    },
    passiveGeneration() {
        mult = new ExpantaNum(0);
        if (hasUpgrade("c", 23)) mult = mult.add(1);

        return mult;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key: "b",
            description: "B: Reset for 小朋友^2",
            onPress() {
                if (canReset(this.layer)) doReset(this.layer);
            },
        },
    ],
    branches: ["p"],
    layerShown() {
        return ( hasUpgrade("p", 25) || player[this.layer].unlocked) && player.thenewyearLay.treelayer == 0;
    },
    resetsNothing() {
        return hasUpgrade("c", 12) || hasMilestone("f", 0);
    },
    upgrades: {
        11: {
            title: "11",
            description:
                "基于最高的小朋友^2乘以小朋友的获取量, 小朋友^2不重置小朋友^1.5升级",
            cost: new ExpantaNum(1),
            effect() {
                return player.b.best.add(1).pow(1.1145);
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },
        },
        12: {
            title: "12",
            description: "基于总共的小朋友^2乘以小朋友^1.5的获取量",
            cost: new ExpantaNum(2),
            effect() {
                return player.b.total.add(1).pow(0.958);
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },
            unlocked() {
                return hasUpgrade("b", 11);
            },
        },
        13: {
            title: "13",
            description: "每秒获取100%小朋友^1.5",
            cost: new ExpantaNum(15),
            unlocked() {
                return hasUpgrade("b", 12);
            },
        },
        14: {
            title: "14",
            description: "自动购买小朋友^1.5的购买项",
            cost: new ExpantaNum(5.0001e13),
            unlocked() {
                return hasUpgrade("b", 13);
            },
        },
        21: {
            title: "21",
            description: "基于小朋友^2增加小朋友^1.5获取指数",
            cost: new ExpantaNum(1e114),
            effect() {
                return player.b.points
                    .max(1)
                    .log10()
                    .mul(0.001)
                    .min(1)
                    .pow(2)
                    .mul(10)
                    .min(0.5);
            },
            effectDisplay() {
                return `+${format(this.effect())}`;
            },
            unlocked() {
                return hasUpgrade("e", 24);
            },
        },
        22: {
            title: "22",
            description: "每秒获取100%小朋友^3.5",
            cost: new ExpantaNum("5e420"),
            unlocked() {
                return hasUpgrade("b", 21);
            },
        },
    },
});

addLayer("c", {
    name: "小朋友^2.5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "2.5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        };
    },
    showTotal: true,
    showBest: true,
    color: "#fe8f3a",
    requires: new ExpantaNum(8e40), // Can be a function that takes requirement increases into account
    resource: "小朋友^2.5", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {
        return player.points;
    }, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    autoPrestige() {
        return hasUpgrade("d", 22);
    },
    resetsNothing() {
        return hasUpgrade("d", 23) || hasMilestone("f", 0);
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let dontreset = false;
            let kept = ["unlocked", "auto"];
            if (resettingLayer == "d") {
                if (hasMilestone("d", 0)) kept.push("upgrades", "milestones");
                if (hasMilestone("f", 1)) dontreset = true;
            }
            if (resettingLayer == "e") {
                if (hasMilestone("e", 0)) kept.push("milestones");
                if (hasUpgrade("e", 12)) kept.push("upgrades");
                if (hasMilestone("f", 1)) dontreset = true;
            }
            if (resettingLayer == "f") {
                if (hasMilestone("f", 1)) dontreset = true;
            }
            if (!dontreset) layerDataReset(this.layer, kept);
        }
    },
    //base: new ExpantaNum(2),
    /*
      
      custom simulate static:
  
      x=player.points, 
      y=currentPoint
      getResetGain: max(log_3(x)/1e41 - y, 0).ceil()
  
      getNextAt: 1e41 * 3^(y+1)
  
      canReset: getNextAt > x
  
      */
    unlockBase: 8e40,
    multBase: 1.8,
    getResetGain() {
        if (!tmp.c.resetGain.array) return new ExpantaNum(0);
        return player.points
            .div(this.unlockBase)
            .logBase(this.multBase)
            .mul(tmp.c.gainMult)
            .sub(player.c.points)
            .ceil()
            .max(0)
            .min(tmp.c.canBuyMax ? Infinity : "1");
    },
    getNextAt(canBuyMax = false) {
        if (!tmp.c.resetGain.array) return false;
        if (canBuyMax)
            return ExpantaNum.pow(
                this.multBase,
                player.points
                    .div(this.unlockBase)
                    .logBase(this.multBase)
                    .ceil()
                    .max(player.c.points)
                    .div(tmp.c.gainMult)
            ).mul(this.unlockBase);
        return ExpantaNum.pow(
            this.multBase,
            player.c.points.div(tmp.c.gainMult)
        ).mul(this.unlockBase);
    },
    canReset() {
        if (!tmp.c.resetGain.array) return false;
        return tmp.c.baseAmount.gte(tmp.c.nextAt);
    },
    prestigeButtonText() {
        if (!tmp.c.resetGain.array) return "出bug了";
        return `重置以获得<b>${formatWhole(
            tmp.c.resetGain
        )}</b> 小朋友^2.5<br><br>${player.c.points.lt(30)
                ? player.points.gte(tmp.c.nextAt) &&
                    tmp.c.canBuyMax !== undefined &&
                    tmp.c.canBuyMax
                    ? "下一个: "
                    : "需要: "
                : ""
            } ${formatWhole(player.points)} / ${tmp.c.roundUpCost
                ? formatWhole(tmp.c.nextAtDisp)
                : format(tmp.c.nextAtDisp)
            } 小朋友		
		`;
    },

    gainMult() {
        if (inChallenge("d", 11)) return new ExpantaNum(0.1);
        mult = new ExpantaNum(1);
        if (hasUpgrade("c", 24)) mult = mult.mul(1.1);
        if (hasUpgrade("d", 12)) mult = mult.mul(1.5);
        return mult;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key: "C",
            description: "C: Reset for 小朋友^2.5",
            onPress() {
                if (canReset(this.layer)) doReset(this.layer);
            },
        },
    ],
    branches: ["p"],
    layerShown() {
        return player.b.unlocked  && player.thenewyearLay.treelayer == 0;
    },
    milestones: {
        0: {
            requirementDescription: "2 小朋友^2.5",
            effectDescription: "保留小朋友^1.5升级",
            done() {
                return player.c.points.gte(2);
            },
        },
    },
    upgrades: {
        11: {
            title: "11",
            description: "小朋友^2.5增加小朋友^2获取",
            effect() {
                return player.c.points.add(1).pow(2).max(1);
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },
            cost: new ExpantaNum(2),
        },
        12: {
            title: "12",
            description: "小朋友^2和小朋友^1.5不重置任何东西",
            cost: new ExpantaNum(3),
            unlocked() {
                return hasUpgrade("c", 11);
            },
        },
        13: {
            title: "13",
            description: "可以获取最大小朋友^2.5",
            cost: new ExpantaNum(5),
            unlocked() {
                return hasUpgrade("c", 12);
            },
        },
        14: {
            title: "14",
            description: "小朋友^2.5增加小朋友获取",
            cost: new ExpantaNum(8),
            effect() {
                if (!hasMilestone("e", 4)) return player.c.points.add(1).pow(3).max(1);
                else return softcapExponent(ExpantaNum.pow(1.006, player.c.points), "1e1000", 0.5);
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },
            unlocked() {
                return hasUpgrade("c", 13);
            },
        },
        21: {
            title: "21",
            description: "小朋友^1.03",
            cost: new ExpantaNum(25),
            unlocked() {
                return hasUpgrade("c", 14);
            },
        },
        22: {
            title: "22",
            description: "基于小朋友^2提升小朋友获取",
            cost: new ExpantaNum(25),
            effect() {
                return player.b.points.max(1).log10().max(1).log10().max(1).root(5);
            },
            effectDisplay() {
                return `^${format(this.effect())}`;
            },
            unlocked() {
                return hasUpgrade("c", 21);
            },
        },
        23: {
            title: "23",
            description: "每秒获取100%小朋友^2",
            cost: new ExpantaNum(57),
            unlocked() {
                return hasUpgrade("c", 22);
            },
        },
        24: {
            title: "24",
            description: "小朋友^2.5获取×1.1，解锁更多小朋友^1.5升级",
            cost: new ExpantaNum(57),
            unlocked() {
                return hasUpgrade("c", 23);
            },
        },
    },
    canBuyMax() {
        return hasUpgrade("c", 13);
    },
});

addLayer("d", {
    name: "小朋友^3", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        };
    },
    showTotal: true,
    showBest: true,
    effect() {
        let eff = player.d.total.add(1).max(1).pow(2);
        return eff;
    },
    effectDescription() {
        let dis = "总共使小朋友和小朋友^1.5获取×";
        dis = dis.concat(format(tmp.d.effect));
        return dis;
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let dontreset = false;
            let kept = []; // "unlocked, auto"

            if (resettingLayer == "f") {
                if (hasMilestone("f", 1)) dontreset = true;
            }
            if (!dontreset) layerDataReset(this.layer, kept);
        }
    },
    color: "#b982e1",
    requires: ExpantaNum(5e79), // Can be a function that takes requirement increases into account
    resource: "小朋友^3", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {
        return player.points;
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1 / 5, // Prestige currency exponent
    gainMult() {
        // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1);
        if (hasUpgrade("d", 21)) mult = mult.mul(upgradeEffect("d", 21));
        if (hasUpgrade("e", 11)) mult = mult.mul(13333);
        mult = mult.mul(buyableEffect("e", 21));
        return mult;
    },
    gainExp() {
        // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        return exp;
    },
    resetsNothing() {
        return hasMilestone("f", 0);
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key: "D",
            description: "D: Reset for 小朋友^3",
            onPress() {
                if (canReset(this.layer)) doReset(this.layer);
            },
        },
    ],
    branches: ["b", "c"],
    layerShown() {
        return (player.b.unlocked || player.c.unlocked || player.d.unlocked) && player.thenewyearLay.treelayer == 0;
    },
    tabFormat: {
        Main: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",
                "upgrades",
            ],
        },
        Challenges: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "challenges",
            ],
            unlocked() {
                return hasUpgrade("d", 13);
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "1.000e14 小朋友^3",
            effectDescription: "保留小朋友^2.5升级和里程碑",
            done() {
                return player.d.points.gte(1e14);
            },
        },
    },
    challenges: {
        11: {
            name: "1/4",
            challengeDescription: "小朋友^2.5获取×0.1",
            goalDescription: "1.000e68 小朋友",
            rewardDescription: "小朋友获取^1.06，解锁1个新的升级",
            unlocked() {
                return hasUpgrade("d", 13);
            },
            canComplete: function () {
                return player.points.gte("1e68");
            },
        },
        12: {
            name: "1/5",
            challengeDescription: "小朋友获取^0.2",
            goalDescription: "1.000e29 小朋友",
            rewardDescription: "小朋友^2指数+0.03，解锁1个新的升级",
            unlocked() {
                return hasUpgrade("d", 31);
            },
            canComplete: function () {
                return player.points.gte("1e29");
            },
        },
    },
    upgrades: {
        11: {
            title: "11",
            description: "重置时保留小朋友^1.5升级",
            cost: new ExpantaNum(1),
        },
        12: {
            title: "12",
            description: "小朋友^2.5获取×1.5",
            cost: new ExpantaNum(10),
            unlocked() {
                return hasUpgrade("d", 11);
            },
        },
        13: {
            title: "13",
            description: "解锁挑战",
            cost: new ExpantaNum(30),
            unlocked() {
                return hasUpgrade("d", 12);
            },
        },
        21: {
            title: "21",
            description: "基于小朋友^2提升小朋友^3获取",
            cost: new ExpantaNum(1e5),
            unlocked() {
                return hasChallenge("d", 11);
            },
            effect() {
                return player.b.points.max(1).log10().root(2).add(1);
            },
            effectDisplay() {
                return "×" + format(this.effect());
            },
        },
        22: {
            title: "22",
            description: "自动化小朋友^2.5获取,保留小朋友^2升级",
            cost: new ExpantaNum(1e6),
            unlocked() {
                return hasUpgrade("d", 21);
            },
        },
        23: {
            title: "23",
            description: "小朋友^2.5不再重置任何东西",
            cost: new ExpantaNum(0),
            unlocked() {
                return hasUpgrade("d", 22);
            },
        },
        31: {
            title: "31",
            description: "解锁一个挑战",
            cost: new ExpantaNum(1e25),
            unlocked() {
                return hasUpgrade("d", 23);
            },
        },
        32: {
            title: "32",
            description: "基于小朋友^3提升小朋友^2获取",
            cost: new ExpantaNum(1e29),
            unlocked() {
                return hasChallenge("d", 12);
            },

            effect() {
                return player.d.points.max(1).log10().root(4).add(1);
            },
            effectDisplay() {
                return "×" + format(this.effect());
            },
        },
        33: {
            title: "33",
            description: "每秒获取100%小朋友^3",
            cost: new ExpantaNum(1e34),
            unlocked() {
                return hasUpgrade("d", 32);
            },
        },
    },
    passiveGeneration() {
        let pasgen = new ExpantaNum(0);
        if (hasUpgrade("d", 33)) pasgen = pasgen.add(1);
        return pasgen;
    },
});

addLayer("e", {
    name: "小朋友^3.5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "3.5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
            p35m2: new ExpantaNum(0),
        };
    },
    update(diff) {
        player.e.p35m2 = player.e.p35m2.add(this.p35m2Gain().mul(diff));
    },
    p35m2Gain() {
        gain = new ExpantaNum(0);
        if (player.e.points.gte(1000)) {
            gain = player.e.points.div(3).log10();
        }
        return gain.mul(this.p35m2GainMult());
    },
    p35m2GainMult() {
        mult = new ExpantaNum(1);
        if (hasUpgrade("e", 14)) mult = mult.mul(2);
        if (hasUpgrade("e", 21)) mult = mult.mul(3);
        mult = mult.mul(tmp.f.effect2);
        mult = mult.mul(buyableEffect("e", 12));
        return mult;
    },
    passiveGeneration() {
        mult = new ExpantaNum(0);
        if (hasUpgrade("b", 22)) mult = mult.add(1);

        return mult;
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let dontreset = false;
            let kept = []; // "unlocked, auto"
            if (resettingLayer == "f") {
                if (hasMilestone("f", 1)) dontreset = true;
            }
            if (!dontreset) layerDataReset(this.layer, kept);
        }
    },
    showTotal: true,
    showBest: true,
    color: "#f9d5a6",
    requires: ExpantaNum("5e316"), // Can be a function that takes requirement increases into account
    resource: "小朋友^3.5", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {
        return player.points;
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1 / 5, // Prestige currency exponent
    gainMult() {
        // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1);
        mult = mult.mul(
            hasUpgrade("e", 13) ? upgradeEffect("e", 13) : new ExpantaNum(1)
        );
        mult = mult.mul(
            hasUpgrade("e", 22) ? upgradeEffect("e", 22) : new ExpantaNum(1)
        );
        mult = mult.mul(buyableEffect("e", 11));
        return mult;
    },
    gainExp() {
        // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        return exp;
    },
    resetsNothing() {
        return hasMilestone("f", 3);
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key: "E",
            description: "E: Reset for 小朋友^3.5",
            onPress() {
                if (canReset(this.layer)) doReset(this.layer);
            },
        },
    ],
    branches: ["c"],
    layerShown() {
        return player.d.unlocked && player.thenewyearLay.treelayer == 0;
    },
    milestones: {
        0: {
            requirementDescription: "1 小朋友^3.5",
            effectDescription:
                "保留小朋友^1.5, 小朋友^2升级和里程碑，小朋友^2.5里程碑",
            done() {
                return player.e.points.gte(1);
            },
        },
        1: {
            requirementDescription: "10,000,000 小朋友^3.5",
            effectDescription: "解锁挑战",
            done() {
                return player.e.points.gte(10000000);
            },
        },
        2: {
            requirementDescription: "1.000e500 小朋友^3.5",
            effectDescription: "每秒获取1% 小朋友^4",
            unlocked() {
                return hasMilestone("f", 4);
            },
            done() {
                return player.e.points.gte("1e500");
            },
        },
        3: {
            requirementDescription: "1.00e2000 小朋友^3.5",
            effectDescription: "解锁更多小朋友^3.5购买项",
            unlocked() {
                return hasMilestone("f", 4);
            },
            done() {
                return player.e.points.gte("1e2000");
            },
        },
        4: {
            requirementDescription: "1.000e17 小朋友^3.5×2",
            effectDescription: "小朋友^2.5升级14效果变得更好",
            unlocked() {
                return hasMilestone("f", 4);
            },
            done() {
                return player.e.p35m2.gte(1e17);
            },
        },
        5: {
            requirementDescription: "1.000e20 小朋友^3.5×2",
            effectDescription: "小朋友^4获取×10，每秒获取100%小朋友^4",
            unlocked() {
                return hasMilestone("f", 4);
            },
            done() {
                return player.e.p35m2.gte(1e20);
            },
        },
        6: {
            requirementDescription: "1.0e10350 小朋友^3.5",
            effectDescription: "小朋友^3.5购买项不再花费",
            unlocked() {
                return hasMilestone("f", 4);
            },
            done() {
                return player.e.points.gte("1e10350");
            },
        },
        7: {
            requirementDescription: "1.0e13500 小朋友^3.5",
            effectDescription: "每秒获取2000%小朋友^4",
            unlocked() {
                return hasMilestone("f", 4);
            },
            done() {
                return player.e.points.gte("1e13500");
            },
        },
       8: {
            requirementDescription: "1.000e24 小朋友^3.5×2",
            effectDescription: "\"小朋友获取\"增加\"小朋友^3.5×2获取\"",
            unlocked() {
                return hasMilestone("f", 4);
            },
            
            done() {
                return player.e.p35m2.gte(1e24);
            },
        },
    },
    tabFormat: {
        Main: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                [
                    "raw-html",
                    function () {
                        return (
                            "你有 " +
                            `<h2 style="color: rgb(249, 213, 166); text-shadow: rgb(249, 213, 166) 0px 0px 10px;">${format(
                                player.e.p35m2
                            )}(+${format(tmp.e.p35m2Gain)}/s)</h2> 小朋友^3.5×2` +
                            "(在1,000小朋友^3.5开始生产)"
                        );
                    },
                ],
                "blank",
                "milestones",
                "upgrades",
                "clickables",
            ],
        },
        Challenges: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                [
                    "raw-html",
                    function () {
                        return (
                            "你有 " +
                            `<h2 style="color: rgb(249, 213, 166); text-shadow: rgb(249, 213, 166) 0px 0px 10px;">${format(
                                player.e.p35m2
                            )}(+${format(tmp.e.p35m2Gain)}/s)</h2> 小朋友^3.5×2` +
                            "(在3,000小朋友^3.5开始生产)"
                        );
                    },
                ],
                "blank",
                "challenges",
            ],
        },
        Buyables: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                [
                    "raw-html",
                    function () {
                        return (
                            "你有 " +
                            `<h2 style="color: rgb(249, 213, 166); text-shadow: rgb(249, 213, 166) 0px 0px 10px;">${format(
                                player.e.p35m2
                            )}(+${format(tmp.e.p35m2Gain)}/s)</h2> 小朋友^3.5×2` +
                            "(在3,000小朋友^3.5开始生产)"
                        );
                    },
                ],
                "blank",
                "buyables",
            ],
            unlocked() {
                return hasMilestone("f", 4);
            },
        },
    },
    // 小朋友^3.5×2
    upgrades: {
        11: {
            title: "11",
            description: "小朋友^3获取×13,333",
            cost: new ExpantaNum(2),
        },
        12: {
            title: "12",
            description: "保留小朋友^2.5升级",
            cost: new ExpantaNum(75),
        },
        13: {
            currencyDisplayName: "小朋友^3.5×2",
            currencyInternalName: "p35m2",
            currencyLayer: "e",
            title: "13",
            description: "小朋友^3.5×2增加小朋友^3.5获取",
            cost: new ExpantaNum(200),
            effect() {
                let exp = new ExpantaNum(0.25);
                /*if (hasMilestone('E',12))  exp=Decimal.add(exp,0.02)
                        if (hasUpgrade('E',103))  exp=Decimal.add(exp,0.03)  
                        if (hasChallenge('E', 42))  exp = Decimal.add(exp,challengeEffect('E',42)/100)   
                        if (inChallenge('E',42)) exp=0    */
                if (hasChallenge("e", 11)) exp = exp.add(0.03);

                let ef = player.e.p35m2.max(1).pow(exp);
                return ef;
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },

            unlocked() {
                return hasUpgrade("e", 12);
            },
        },
        14: {
            currencyDisplayName: "小朋友^3.5×2",
            currencyInternalName: "p35m2",
            currencyLayer: "e",
            title: "14",
            description: "(小朋友^3.5×2)×2",
            cost: new ExpantaNum(400),
            unlocked() {
                return hasUpgrade("e", 13);
            },
        },
        21: {
            currencyDisplayName: "小朋友^3.5×2",
            currencyInternalName: "p35m2",
            currencyLayer: "e",
            title: "21",
            description: "(小朋友^3.5×2)×3",
            cost: new ExpantaNum(800),
            unlocked() {
                return hasUpgrade("e", 14);
            },
        },
        22: {
            currencyDisplayName: "小朋友^3.5×2",
            currencyInternalName: "p35m2",
            currencyLayer: "e",
            title: "22",
            description: "(小朋友^3.5×2)增加小朋友^3.5获取",
            cost: new ExpantaNum(3000),
            effect() {
                let ef = player.e.p35m2.add(10).logBase(10).pow(2);
                return ef;
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },
            unlocked() {
                return hasUpgrade("e", 21);
            },
        },
        23: {
            title: "23",
            description: "弱化小朋友软上限(+0.125)",
            cost: new ExpantaNum(4e7),
            unlocked() {
                return hasChallenge("e", 11);
            },
        },
        24: {
            title: "24",
            description: "解锁更多小朋友^2升级",
            cost: new ExpantaNum(1e9),
            unlocked() {
                return hasUpgrade("e", 23);
            },
        },
    },
    challenges: {
        11: {
            name: "不推荐",
            challengeDescription: "无法获得小朋友^1.5(进入时重置小朋友^1.5购买项)",
            goalDescription: "1.631e163 小朋友",
            rewardDescription: "升级13效果指数+0.03，解锁1个新的升级",
            unlocked() {
                return hasMilestone("e", 1);
            },
            onEnter() {
                setBuyableAmount("p", 11, new ExpantaNum(0));
                setBuyableAmount("p", 12, new ExpantaNum(0));
            },
            canComplete: function () {
                return player.points.gte("1.631e163");
            },
        },
    },
    buyables: {
        11: {
            title: "小朋友^3.5获取",
            scaleBase() {
                return new ExpantaNum(1.3);
            },

            base() {
                let base = player.e.p35m2.add(10).max(10);
                base = base.log10().pow(10);
                return base;
            },
            total() {
                let total = getBuyableAmount(this.layer, this.id).add(
                    tmp[this.layer].buyables[this.id].extra
                );
                return total;
            },
            extra() {
                let extra = new ExpantaNum(0);
                return extra;
            },
            cost(x) {
                let cost = ExpantaNum.pow(
                    tmp[this.layer].buyables[this.id].scaleBase,
                    x.pow(1.5)
                ).mul(1e8);
                return cost.floor();
            },
            display: buyableDisplay({
                effect: "增加小朋友^3.5获取",
                currency: "小朋友^3.5×2",
                effectDisplay(x) {
                    return "×" + format(x);
                },
            }),
            effect() {
                let x = tmp[this.layer].buyables[this.id].total;
                let base = tmp[this.layer].buyables[this.id].base;
                return ExpantaNum.pow(base, x);
            },
            canAfford() {
                return player.e.p35m2.gte(tmp[this.layer].buyables[this.id].cost);
            },
            unlocked() {
                return hasMilestone("f", 4);
            },
            buy: P35M2buy,
            buyMax: function (max) {
                let s = player.e.p35m2;
                let target = ExpantaNum.log10(s.div(1e8))
                    .div(ExpantaNum.log10(this.scalebase()))
                    .pow(2 / 3);
                target = target.ceil();
                let cost = ExpantaNum.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(
                    1e8
                );
                let diff = target.sub(player[this.layer].buyables[this.id]);
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.e.p35m2 = player.e.p35m2.sub(cost).max(0);
                    if (diff.gt(max)) diff = max;
                    player[this.layer].buyables[this.id] =
                        player[this.layer].buyables[this.id].add(diff);
                }
            },
        },
        12: {
            title: "小朋友^3.5×2获取",
            scaleBase() {
                return new ExpantaNum(2);
            },
            unlocked() {
                return hasMilestone("f", 4);
            },

            base() {
                let base = player.e.p35m2.add(10).max(10);
                base = base.log10().root(1.8);
                return base;
            },
            total() {
                let total = getBuyableAmount(this.layer, this.id).add(
                    tmp[this.layer].buyables[this.id].extra
                );
                return total;
            },
            extra() {
                let extra = new ExpantaNum(0);
                extra = extra.add(getBuyableAmount("e", 13))
                return extra;
            },
            cost(x) {
                let cost = ExpantaNum.pow(
                    tmp[this.layer].buyables[this.id].scaleBase,
                    x.pow(1.5)
                ).mul(2e8);
                return cost.floor();
            },
            display: buyableDisplay({
                effect: "增加小朋友^3.5×2获取",
                currency: "小朋友^3.5×2",
                effectDisplay(x) {
                    return "×" + format(x);
                },
            }),
            effect() {
                let x = tmp[this.layer].buyables[this.id].total;
                let base = tmp[this.layer].buyables[this.id].base;
                return ExpantaNum.pow(base, x);
            },
            canAfford() {
                return player.e.p35m2.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy: P35M2buy,
            buyMax: function (max) {
                let s = player.e.p35m2;
                let target = ExpantaNum.log10(s.div(2e8))
                    .div(ExpantaNum.log10(this.scalebase()))
                    .pow(2 / 3);
                target = target.ceil();
                let cost = ExpantaNum.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(
                    2e8
                );
                let diff = target.sub(player[this.layer].buyables[this.id]);
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.e.p35m2 = player.e.p35m2.sub(cost).max(0);
                    if (diff.gt(max)) diff = max;
                    player[this.layer].buyables[this.id] =
                        player[this.layer].buyables[this.id].add(diff);
                }
            },
        },
        13: {
            title: "小朋友获取",
            scaleBase() {
                return new ExpantaNum(2);
            },

            base() {
                let base = player.e.p35m2.add(10).max(10);
                base = base.log10().pow(100);
                return base;
            },
            total() {
                let total = getBuyableAmount(this.layer, this.id).add(
                    tmp[this.layer].buyables[this.id].extra
                );
                return total;
            },
            unlocked() {
                return hasMilestone("f", 4);
            },
            extra() {
                let extra = new ExpantaNum(0);
                return extra;
            },
            cost(x) {
                let cost = ExpantaNum.pow(
                    tmp[this.layer].buyables[this.id].scaleBase,
                    x.pow(1.5)
                ).mul(1e9);
                return cost.floor();
            },
            display: buyableDisplay({
                effect: "增加小朋友获取",
                currency: "小朋友^3.5×2",
                effectDisplay(x) {
                    return "×" + format(x);
                },
            }),
            effect() {
                let x = tmp[this.layer].buyables[this.id].total;
                let base = tmp[this.layer].buyables[this.id].base;
                return ExpantaNum.pow(base, x);
            },
            canAfford() {
                return player.e.p35m2.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy: P35M2buy,
            buyMax: function (max) {
                let s = player.e.p35m2;
                let target = ExpantaNum.log10(s.div(1e9))
                    .div(ExpantaNum.log10(this.scalebase()))
                    .pow(2 / 3);
                target = target.ceil();
                let cost = ExpantaNum.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(
                    1e9
                );
                let diff = target.sub(player[this.layer].buyables[this.id]);
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.e.p35m2 = player.e.p35m2.sub(cost).max(0);
                    if (diff.gt(max)) diff = max;
                    player[this.layer].buyables[this.id] =
                        player[this.layer].buyables[this.id].add(diff);
                }
            },
        },
        21: {
            title: "小朋友^3获取",
            scaleBase() {
                return new ExpantaNum(3);
            },

            base() {
                let base = player.e.p35m2.add(10).max(10);
                base = base.log10().pow(100);
                return base;
            },
            total() {
                let total = getBuyableAmount(this.layer, this.id).add(
                    tmp[this.layer].buyables[this.id].extra
                );
                return total;
            },
            unlocked() {
                return hasMilestone("e", 3);
            },
            extra() {
                let extra = new ExpantaNum(0);
                extra = extra.add(tmp.f.baixieEffect[0])
                return extra;
            },
            cost(x) {
                let cost = ExpantaNum.pow(
                    tmp[this.layer].buyables[this.id].scaleBase,
                    x.pow(1.5)
                ).mul(1e13);
                return cost.floor();
            },
            display: buyableDisplay({
                effect: "增加小朋友^3获取",
                currency: "小朋友^3.5×2",
                effectDisplay(x) {
                    return "×" + format(x);
                },
            }),
            effect() {
                let x = tmp[this.layer].buyables[this.id].total;
                let base = tmp[this.layer].buyables[this.id].base;
                return ExpantaNum.pow(base, x);
            },
            canAfford() {
                return player.e.p35m2.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy: P35M2buy,
            buyMax: function (max) {
                let s = player.e.p35m2;
                let target = ExpantaNum.log10(s.div(1e13))
                    .div(ExpantaNum.log10(this.scalebase()))
                    .pow(2 / 3);
                target = target.ceil();
                let cost = ExpantaNum.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(
                    1e13
                );
                let diff = target.sub(player[this.layer].buyables[this.id]);
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.e.p35m2 = player.e.p35m2.sub(cost).max(0);
                    if (diff.gt(max)) diff = max;
                    player[this.layer].buyables[this.id] =
                        player[this.layer].buyables[this.id].add(diff);
                }
            },
        },
    },
});

addLayer("f", {
    name: "小朋友^4", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "4", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
            p4m1p5: new ExpantaNum(0),
            lastRandomNumberTick: Date.now(),
            baixieRandomNumber: 1,
            timesBaixied: new ExpantaNum(0),
            timesWrongBaixied: new ExpantaNum(0),
            autoBaixie: false,
            lastAutoBaixie: Date.now(),
            lastGreatAutoBaixie: Date.now(),
            autobaixieStatus: 0,

            p4m3: new ExpantaNum(0),
            d1: new ExpantaNum(0),
            d2: new ExpantaNum(0),
            d3: new ExpantaNum(0),
            d4: new ExpantaNum(0),
            d5: new ExpantaNum(0),
            d6: new ExpantaNum(0),
            d7: new ExpantaNum(0),
            d8: new ExpantaNum(0),

            p4m10: new ExpantaNum(0),
        };
    },
    p4m10color: "#9cafb6",
    p4m1p5Gain() {
        gain = new ExpantaNum(0);
        gain = gain.add(tmp.f.effect);
        return gain.mul(this.p4m1p5GainMult());
    },
    p4m1p5GainMult() {
        mult = new ExpantaNum(1);
        return mult;
    },
    passiveGeneration() {
        pass = new ExpantaNum(0)
        if (hasMilestone("f", 4)) pass = pass.add(0.01)
        if (hasMilestone("e", 5)) pass = pass.add(1)
        if (hasMilestone("e", 7)) pass = pass.add(20)
        return pass;
    },
    effectDescription() {
        return `在软上限后×${format(this.effect())}小朋友获取`;
    },
    prestigeButtonText() {
        if (!tmp.f.resetGain.array) return "出bug了";
        return `${player.f.points.lt(1e3)
                ? tmp.f.resetDescription !== undefined
                    ? tmp.f.resetDescription
                    : "重置以获得 "
                : ""
            }+<b>${formatWhole(tmp.f.resetGain)}</b> ${tmp.f.resource} ${tmp.f.resetGain.lt(100) && player.f.points.lt(1e3)
                ? `<br><br>下一个在 ${tmp.f.roundUpCost ? formatWhole(tmp.f.nextAt) : format(tmp.f.nextAt)
                } ${tmp.f.baseResource}`
                : ""
            }`;
    },
    effect() {
        let eff = new ExpantaNum(1);
        eff = player.f.total.add(1).pow(2);
        return eff.max(1);
    },
    effect2() {
        let eff = new ExpantaNum(1);
        eff = player.f.p4m1p5.max(1).root(3).max(1);
        return eff.max(1);
    },
    autoBaixieInterval() {
        return 1- (player.f.timesBaixied.gte(180) ? 0.5 : 0)
    },
    update(diff) {
        if (player.f.unlocked){
            player.f.p4m3 = player.f.p4m3
            .add(tmp.f.p4m3Gain.mul(diff))
            player.f.d1 = player.f.d1
            .add(tmp.f.buyables[12].gain.mul(diff))
            player.f.d2 = player.f.d2
            .add(tmp.f.buyables[13].gain.mul(diff))
            player.f.d3 = player.f.d3
            .add(tmp.f.buyables[14].gain.mul(diff))
            player.f.p4m1p5 = player.f.p4m1p5
                .add(tmp.f.p4m1p5Gain.times(diff))
                .min(tmp.f.p4m1p5Gain.mul(1000));
            if (Date.now() - player.f.lastRandomNumberTick>=tmp.f.numberInterval*1000){
                player.f.lastRandomNumberTick = Date.now()
                player.f.baixieRandomNumber = Math.floor(Math.random()*10)
                if (Math.random()>tmp.f.add10Chance){
                    player.f.baixieRandomNumber += 10
                }
                player.f.baixieRandomNumber *= (player.f.timesBaixied.gte(400) ? 5 : 1)
            }
            if (player.f.autoBaixie){
                if (Date.now() - player.f.lastAutoBaixie >= 1000*tmp.f.autoBaixieInterval){
                    if (player.f.baixieRandomNumber >= 10){
                        layers.f.clickables[11].onClick()
                    }
                    player.f.lastAutoBaixie = Date.now()
                }
            }
            
        }
    },
    p4m3effect(){
        
        let eff = player.f.p4m3.add(1).max(1)
        eff = eff.pow(0.6)
        return eff
    },
    milestones: {
        0: {
            requirementDescription: "1 小朋友^4",
            effectDescription: "小朋友^1.5~小朋友^3不重置任何东西",
            done() {
                return player.f.points.gte(1);
            },
        },
        1: {
            requirementDescription: "15 小朋友^4",
            effectDescription: "保留小朋友^1.5~小朋友^2.5内容",
            done() {
                return player.f.points.gte(15);
            },
        },
        2: {
            requirementDescription: "50 小朋友^4",
            effectDescription: "保留小朋友^3~小朋友^3.5内容",
            done() {
                return player.f.points.gte(50);
            },
        },
        3: {
            requirementDescription: "100 小朋友^4",
            effectDescription: "小朋友^3.5不再重置任何东西",
            done() {
                return player.f.points.gte(100);
            },
        },
        4: {
            requirementDescription: "1000 小朋友^4",
            effectDescription: "解锁小朋友^3.5购买项",
            done() {
                return player.f.points.gte(1000);
            },
        },
        5: {
            requirementDescription: "2.222e11 小朋友^4",
            effectDescription: "解锁拜谢",
            done() {
                return player.f.points.gte(2.222e11);
            },
        },
        6: {
            requirementDescription: "e2.000e9 小朋友",
            effectDescription: "解锁小朋友^4 Dimensions",
            done() {
                return player.points.gte("e2e9");
            },
            unlocked() {
                return hasMilestone("f", 5)
            }
        },
        7: {
            requirementDescription: "e9.007e15 小朋友",
            effectDescription: "解锁小朋友^4×10",
            done() {
                return player.points.gte("e9007199254740991");
            },
            unlocked () {
                return hasMilestone("f", 6)
            }
        }
    },
    showTotal: true,
    showBest: true,
    color: "#380af7",
    requires: ExpantaNum("1e820").clone(), // Can be a function that takes requirement increases into account
    resource: "小朋友^4", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {
        return player.points;
    }, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have

    /*
      type custom simulate exponent-growing
  
  
  
      unlockBase: 8e40,
      multBase: 1.8,
      getResetGain() {
          if (!tmp.c.resetGain.array) return new ExpantaNum(0);
          return 
      },
      getNextAt(canBuyMax=false) {
          if (!tmp.c.resetGain.array) return false
          if (canBuyMax) return
          return 
      },
      canReset(){
          if (!tmp.c.resetGain.array) return false
          return 
      },
      */

    unlockBase: ExpantaNum("1e720").clone(),
    increasing: ExpantaNum("1e100"),
    getResetGain() {
        return tmp.f.baseAmount
            .div(tmp.f.unlockBase)
            .logBase(tmp.f.increasing)
            .mul(tmp.f.gainMult)
            .floor()
            
            .max(0);
    },
    getNextAt(canBuyMax = false) {
        if (!tmp.f.resetGain.array) return ExpantaNum.POSITIVE_INFINITY;
        return ExpantaNum.mul(
            tmp.f.unlockBase,
            ExpantaNum.pow(
                tmp.f.increasing,
                tmp.f.baseAmount
                    .div(tmp.f.unlockBase)
                    .logBase(tmp.f.increasing)
                    .floor()
                    .mul(tmp.f.gainMult)
                    .add(1)
            )
        ).max(tmp.f.unlockBase.mul(tmp.f.increasing));
    },
    canReset() {
        if (!tmp.f.resetGain.array) return false;
        return tmp.f.baseAmount.gte(tmp.f.unlockBase.mul(tmp.f.increasing));
    },
    gainMult() {
        // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1);
        if (hasMilestone("e", 5)) mult = mult.mul(10)
        if (hasUpgrade("f", 12)) mult = mult.mul(upgradeEffect("f", 12))
        if (hasUpgrade("f", 13)) mult = mult.mul(upgradeEffect("f", 13))
        mult = mult.mul(tmp.f.baixieEffect[2])
        mult = mult.mul(tmp.f.p4m3effect)
        return mult;
    },
    baixieCap() {
        return new ExpantaNum(4.725e6)
    },
    clickables: {
        11: {
            display() {
                return `拜谢!`
            },
            style() {
                return {
                    "font-size": "24px"
                }
            },
            canClick(){
                return true
            },
            onClick() {
                if (player.f.baixieRandomNumber>=10){
                    player.f.timesBaixied = player.f.timesBaixied
                    .add(new ExpantaNum(player.f.timesBaixied.gte(700) ? 2 : 1)
                    .mul(tmp.f.p4m3effect))
                    .min(tmp.f.baixieCap)
                    player.f.lastRandomNumberTick = Date.now()
                    player.f.baixieRandomNumber = 4
                } else {
                    player.f.timesWrongBaixied = player.f.timesWrongBaixied.add(1)
                    player.f.points = player.f.points.div(2)
                }
            }
        },
        12: {
            display() {
                return `自动化拜谢<br>${player.f.autoBaixie ? "ON" : "OFF"}`
            },
            style() {
                return {
                    "font-size": "18px"
                }
            },
            canClick(){
                return true
            },
            onClick() {
                player.f.autoBaixie = !player.f.autoBaixie
            }
        },
        21: {
            display(){
                return `重置维度以获得 <b>0.000</b> 小朋友^4×10<br>(5小时后更新)`
            },
            style(){return {
                height: "120px",
                width: "180px",
                "font-size": "13px",
                "border-radius": "25%",
                border: "4px solid",
                "border-color": "rgba(0, 0, 0, 0.125)",
                "background-color": tmp.f.p4m10color
            }}
        }
    },
    upgrades: {
        11: {
            title: "11",
            description: "小朋友^3增强小朋友^2获取",
            cost: new ExpantaNum(2),
            effect() {
                let eff = player.d.points.add(1).max(1).root(2);
                eff = softcapExponent(eff, new ExpantaNum("1e100"), 0.2);
                return eff;
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },
        },
        12: {
            title: "12",
            description: "小朋友增加小朋友^4获取",
            cost: new ExpantaNum(1e9),
            effect() {
                let eff = player.points.add(1).max(1).log10().max(1).log10().mul(6).max(1);
                return eff;
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },
            unlocked() {
                return hasMilestone("e", 8)
            }
        },
        13: {
            title: "13",
            description: "小朋友^3.5×2增加小朋友^4获取",
            cost: new ExpantaNum(1e10),
            effect() {
                let eff = player.e.p35m2.add(1).max(1).log10().max(1).log10().mul(6).max(1);
                return eff;
            },
            effectDisplay() {
                return `×${format(this.effect())}`;
            },
            unlocked() {
                return hasUpgrade("f", 12)
            }
        },
        
    },
    baixieEffect() {
        let a = player.f.timesBaixied.pow(2);
        let b = new ExpantaNum(0)
        let c = new ExpantaNum(1)
        if (player.f.timesBaixied.gte(10)){
            b = player.f.timesBaixied.max(1).log10().max(1).log10().pow(1.2).add(1)
        }
        if (player.f.timesBaixied.gte(50)){
            c = player.f.timesBaixied.max(1).pow(1.3)
        }
        return [a, b, c]
    },
    numberInterval() {
        return 0.7 - (player.f.timesBaixied.gte(180) ? 0.5 : 0)
    },
    add10Chance() {
        return 0.7 - (player.f.timesBaixied.gte(250) ? 0.4 : 0)
    },
    p4m3Gain(){
        let gain = tmp.f.buyables[11].gain
        return gain
    },
    dimMultBase() {
        let mult = new ExpantaNum(2);

        return mult;
    },
    buyables: {
        11: {
            title: "小朋友^4维度1",
            gain(x=this.bought()) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            cost() {
                let x=this.total()
                let cost = ExpantaNum.pow(1e3, x).mul(1e18)
                return cost.floor()
            },
            total() {
                let total = getBuyableAmount("f", 11)
                return total
            },
            bought() {
                let bought = player.f.d1
                return bought
            },
            effect() {
                let effect = new ExpantaNum(1);
                effect = tmp.f.dimMultBase.pow(this.total())
                return effect
            },
            display() { // Everything else displayed in the buyable button after the title
                return "生产小朋友^4×3\n\
                价格: " + format(tmp[this.layer].buyables[this.id].cost)+" 小朋友^4\n\
                乘法: " + format(tmp[this.layer].buyables[this.id].effect)+"×\n\
                数量: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d1 = player.f.d1.add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)
                },
            buyMax(b) {
                let cost = this.cost()
                let f = player.f.points
                
                let max = f.div(1e18).max(10).log10().div(3).ceil().min(m)
                let diff = max.sub(player.f.d1).min(b)
                cost = ExpantaNum.sub(1,ExpantaNum.pow(1e3,max)).div(-999).mul(1e18)
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d1 = player.f.d1.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
        },
        12: {
            title: "小朋友^4维度2",
            gain(x=this.bought()) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            cost() {
                let x=this.total()
                let cost = ExpantaNum.pow(1e4, x).mul(1e19)
                return cost.floor()
            },
            total() {
                let total = getBuyableAmount("f", 12)
                return total
            },
            bought() {
                let bought = player.f.d2
                return bought
            },
            effect() {
                let effect = new ExpantaNum(1);
                effect = tmp.f.dimMultBase.pow(this.total())
                return effect
            },
            display() { // Everything else displayed in the buyable button after the title
                return "生产小朋友^4维度1\n\
                价格: " + format(tmp[this.layer].buyables[this.id].cost)+" 小朋友^4\n\
                乘法: " + format(tmp[this.layer].buyables[this.id].effect)+"×\n\
                数量: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d2 = player.f.d2.add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)
                },
            buyMax(b) {
                let cost = this.cost()
                let f = player.f.points
                
                let max = f.div(1e19).max(10).log10().div(4).ceil().min(m)
                let diff = max.sub(player.f.d2).min(b)
                cost = ExpantaNum.sub(1,ExpantaNum.pow(1e4,max)).div(-999).mul(1e19)
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d2 = player.f.d2.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
        },
        13: {
            title: "小朋友^4维度3",
            gain(x=this.bought()) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            cost() {
                let x=this.total()
                let cost = ExpantaNum.pow(1e6, x).mul(1e22)
                return cost.floor()
            },
            total() {
                let total = getBuyableAmount("f", 13)
                return total
            },
            bought() {
                let bought = player.f.d3
                return bought
            },
            effect() {
                let effect = new ExpantaNum(1);
                effect = tmp.f.dimMultBase.pow(this.total())
                return effect
            },
            display() { // Everything else displayed in the buyable button after the title
                return "生产小朋友^4维度2\n\
                价格: " + format(tmp[this.layer].buyables[this.id].cost)+" 小朋友^4\n\
                乘法: " + format(tmp[this.layer].buyables[this.id].effect)+"×\n\
                数量: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d3 = player.f.d3.add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)
                },
            buyMax(b) {
                let cost = this.cost()
                let f = player.f.points
                
                let max = f.div(1e22).max(10).log10().div(6).ceil().min(m)
                let diff = max.sub(player.f.d3).min(b)
                cost = ExpantaNum.sub(1,ExpantaNum.pow(1e6,max)).div(-999).mul(1e22)
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d3 = player.f.d3.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
        },
        14: {
            title: "小朋友^4维度4",
            gain(x=this.bought()) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            cost() {
                let x=this.total()
                let cost = ExpantaNum.pow(1e8, x).mul(1e35)
                return cost.floor()
            },
            total() {
                let total = getBuyableAmount("f", 14)
                return total
            },
            bought() {
                let bought = player.f.d4
                return bought
            },
            effect() {
                let effect = new ExpantaNum(1);
                effect = tmp.f.dimMultBase.pow(this.total())
                return effect
            },
            display() { // Everything else displayed in the buyable button after the title
                return "生产小朋友^4维度3\n\
                价格: " + format(tmp[this.layer].buyables[this.id].cost)+" 小朋友^4\n\
                乘法: " + format(tmp[this.layer].buyables[this.id].effect)+"×\n\
                数量: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d4 = player.f.d4.add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)
                },
            buyMax(b) {
                let cost = this.cost()
                let f = player.f.points
                
                let max = f.div(1e35).max(10).log10().div(8).ceil().min(m)
                let diff = max.sub(player.f.d4).min(b)
                cost = ExpantaNum.sub(1,ExpantaNum.pow(1e8,max)).div(-999).mul(1e35)
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d4 = player.f.d4.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
        },
    },
    
    tabFormat: {
        Main: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                [
                    "raw-html",
                    function () {
                        return (
                            "你有 " +
                            `<h2 style="color: #380af7; text-shadow: #380af7 0px 0px 10px;">${format(
                                player.f.p4m1p5
                            )}(+${format(tmp.f.p4m1p5Gain)}/s)</h2>` +
                            "小朋友^4×1.5, " +
                            `×${format(tmp.f.effect2)}小朋友^3.5×2获取(在${format(
                                tmp.f.p4m1p5Gain.mul(1000)
                            )}受硬上限)`
                        );
                    },
                ],
                "blank",
                "milestones",
                "upgrades",
            ],
        },
        "拜谢": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                [
                    "raw-html",
                    function () {
                        return (
                            "你有 " +
                            `<h2 style="color: #380af7; text-shadow: #380af7 0px 0px 10px;">${format(
                                player.f.p4m1p5
                            )}(+${format(tmp.f.p4m1p5Gain)}/s)</h2>` +
                            "小朋友^4×1.5, " +
                            `×${format(tmp.f.effect2)}小朋友^3.5×2获取(在${format(
                                tmp.f.p4m1p5Gain.mul(1000)
                            )}受硬上限)`
                        );
                    },
                ],
                "blank",
                "blank",
                ["display-text", "下面有一个随机的数字，每当数字超过10的时候，就需要点击下面的\"拜谢\"(不要在不合时宜的时候拜谢，拜谢错误会将小朋友^4数量×0.5)"],
                ["raw-html", function() {
                    return `<div style="border: 2px solid #380af7; width: 200px; height: 200px; margin: auto;">
                    <h2 style="color: #380af7; text-shadow: #380af7 0px 0px 10px;">${player.f.baixieRandomNumber}</h2>
                    </div>`
                }],
                ["raw-html", function() {
                    return `你拜谢了<h2 style="color: #380af7; text-shadow: #380af7 0px 0px 10px;">${format(player.f.timesBaixied)}</h2>次，获得`+
                    `${format(tmp.f.baixieEffect[0])}免费的\"小朋友^3获取\"`
                }],
                /*["raw-html", function() {
                    return `你拜谢错了<h2 style="color: #380af7; text-shadow: #380af7 0px 0px 10px;">${format(player.f.timesWrongBaixied)}</h2>次，获得`+
                    `, ×1.000小朋友获取`
                }],*/
                ["raw-html", function() {
                    if (player.f.timesBaixied.lt(10)) return `超过10次拜谢解锁拜谢第二效果`
                    return `拜谢使小朋友获取^${format(tmp.f.baixieEffect[1])}`
                }],
                ["raw-html", function() {
                    if (player.f.timesBaixied.lt(50)) return `超过50次拜谢解锁拜谢第三效果`
                    return `拜谢使小朋友^4获取×${format(tmp.f.baixieEffect[2])}`
                }],
                ["raw-html", function() {
                    if (player.f.timesBaixied.lt(60)) return `超过60次拜谢解锁拜谢第四效果`
                    return `自动化拜谢：当前每${formatTime(tmp.f.autoBaixieInterval)}拜谢一次`
                }],
                ["raw-html", function() {
                    if (player.f.timesBaixied.lt(180)) return `超过180次拜谢解锁拜谢第五效果`
                    return `拜谢间隔减少0.5s， 随机数变化减少0.5s`
                }],
                ["raw-html", function() {
                    if (player.f.timesBaixied.lt(250)) return `超过250次拜谢解锁拜谢第六效果`
                    return `随机数+10几率从30%到70%`
                }],
                ["raw-html", function() {
                    if (player.f.timesBaixied.lt(400)) return `超过400次拜谢解锁拜谢第七效果`
                    return `随机数×5`
                }],
                ["raw-html", function() {
                    if (player.f.timesBaixied.lt(700)) return `超过700次拜谢解锁拜谢第八效果`
                    return `拜谢次数×2`
                }],
                ["raw-html", function() {
                    if (Date.now() - player.f.lastGreatAutoBaixie < 500){
                        return "已成功自动拜谢！"
                    }
                    return ""
                }],
                ["clickable", 11],
                ["clickable", 12],
            ],
            unlocked() {
                return hasMilestone("f", 5)
            }
        },
        "Dimensions": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                [
                    "raw-html",
                    function () {
                        return (
                            "你有 " +
                            `<h2 style="color: #380af7; text-shadow: #380af7 0px 0px 10px;">${format(
                                player.f.p4m3
                            )}(+${format(tmp.f.p4m3Gain)}/s)</h2>` +
                            "小朋友^4×3， 使小朋友^4和拜谢次数获取×"+
                            `<h2 style="color: #380af7; text-shadow: #380af7 0px 0px 10px;">${format(
                                tmp.f.p4m3effect
                            )}</h2>`
                        );
                    },
                ],
                ["buyable", 11],
                ["buyable", 12],
                ["buyable", 13],
                ["buyable", 14]
            ],
            unlocked() {
                return hasMilestone("f", 6)
            }
        },
        "小朋友^4×10": {
            content: [
                "main-display",
                "resource-display",
                ["clickable", 21]
            ],
            unlocked() {
                return hasMilestone("f", 7)
            }
        }

        /*
        "Challenges": {
                content:[
                    "main-display",
                    "prestige-button",
                    "resource-display",
                    ["raw-html", 
                        function() { 
                            return "你有 " + 
                            `<h2 style="color: rgb(249, 213, 166); text-shadow: rgb(249, 213, 166) 0px 0px 10px;">${format(player.e.p35m2)}(+${format(tmp.e.p35m2Gain)}/s)</h2> 小朋友^3.5×2`+
                             '(在3,000小朋友^3.5开始生产)'
                        }
                    ],
                    "blank",
                    "challenges",
                    
                ]
            },*/
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key: "F",
            description: "F: Reset for 小朋友^4",
            onPress() {
                if (canReset(this.layer)) doReset(this.layer);
            },
        },
    ],
    branches: ["d", "e"],
    layerShown() {
        return (player.d.unlocked || player.e.unlocked) && player.thenewyearLay.treelayer == 0;
    },

});

function layerRegisterComponent(){
}

addLayer("test1", {
    name: "小朋友^", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "J9e15", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        };
    },

    showTotal: true,
    showBest: true,
    color: "#380af7",
    requires: ExpantaNum.POSITIVE_INFINITY, // Can be a function that takes requirement increases into account
    resource: "测试点数^2", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {
        return player.points;
    }, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have

    getResetGain() {
        return ExpantaNum.ZERO
    },
    getNextAt(canBuyMax = false) {
        return ExpantaNum.POSITIVE_INFINITY;
    },
    canReset() {
        return false;
    },
    tabFormat: {
        Main: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",
                "upgrades",
            ],
        },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        return player.thenewyearLay.treelayer == 1;
    },
})
addLayer("thenewyearLay", {
    name: "测试", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "K9e15", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
            treelayer: 0
        };
    },
    showTotal: true,
    showBest: true,
    color: "#f9d5a6",
    requires: ExpantaNum(1), // Can be a function that takes requirement increases into account
    resource: "测试点数", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    resetsNothing() {return true},
    exponent: ExpantaNum(1),
    baseAmount() {
        return player.points;
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 9, // Row the layer is in on the tree (0 is the first row)
    tabFormat: {
        Main: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                [
                    "display-text",
                    function () {
                        return `距离2026年还有${formatTime(
                            (new Date(2026, 0, 1).getTime() - Date.now()) / 1000
                        )}`;
                    },
                ],
                ["infobox", "lore"],
                ["bar", "progressof2025"],
                "clickables",
                "grid",
                "achievements",
                "buyables",
                "challenges",
                "milestones",
                "upgrades"
            ],
        },
    },
    milestones: {
        0: {
            requirementDescription: "123 waffles",
            effectDescription: "blah",
            done() { return player.p.points.gte(123) }
        }
    },
    buyables: {
        11: {
            title: "test",
            cost: ExpantaNum.POSITIVE_INFINITY,
            display() {return "8U9U89"},
            buy(){},
            canAfford(){return true},
            canSellOne(){return true},
            sellOne(){},
            showRespec(){return true},
        }
    },
    infoboxes: {
        lore: {
            title: "foo",
            body() { return "bar" },
        },
    },
    challenges: {
        11: {
            name: "Ouch",
            challengeDescription: "description of ouchie",
            canComplete: function() {return player.points.gte(100)},
            goal: new ExpantaNum(100),
            rewardDescription: "小朋友获取×1"
        },
    },
    grid: {
        rows: 4, // If these are dynamic make sure to have a max value as well!
        cols: 5,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id) { 
            player[this.layer].grid[id]++
            player.thenewyearLay.treelayer = Math.floor(id/100-1)*5 + id%100-1
        },
        getDisplay(data, id) {
            return `Switch to layer ${Math.floor(id/100-1)*5 + id%100-1}(${data} with id${id})`
        },
    
    },
    achievements: {
        11: {
            name: "Achievement",
            done(){
                return true;
            }
        },
    },
    bars: {
        progressof2025: {
            direction: RIGHT,
            width: 600,
            height: 36,
            fillStyle: { "background-color": "#cc9900" },
            display() {
                return (
                    "你已经过完了2025年的" + `${(this.progress() * 100).toFixed(6)}%`
                );
            },
            progress() {
                return (Date.now() - new Date(2025, 0, 1).getTime()) / 31536000000;
            },
        },
    },
    clickables: {
        rows: 4,
        cols: 2,
        11: {
            display() {
                return "<h2>Switch to Layer #0</h2>"
            },
            canClick() {return true},
            onClick() {
                player.thenewyearLay.treelayer = 0
            },
        },
        12: {
            display() {
                return "<h2>Switch to Layer #1</h2>"
            },
            canClick() {return true},
            onClick() {
                player.thenewyearLay.treelayer = 1
            },
        },
    }
});
function checkarrayUndefined(data, keyname){
    for (let key in data){
        if (data[key] instanceof ExpantaNum){
            if (data[key].array === void 0){
                console.log(`${keyname}.${key}`, "has a undefined array")
            }
        } else if (typeof data[key]=="object"){
            checkarrayUndefined(data[key], `${keyname}.${key}`)
        }
    }
}