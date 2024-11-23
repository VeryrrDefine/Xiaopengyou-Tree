addLayer("p", {
    name: "小朋友^1.5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1.5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#f32050",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "小朋友^1.5", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/2.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p", 14)) mult = mult.mul(upgradeEffect("p", 14))
        if (hasUpgrade("p", 21)) mult = mult.mul(1.6365)
        mult = mult.mul(buyableEffect("p", 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        
        if (hasUpgrade("p", 23)) exp = exp.add(0.01)
        return exp;
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for 小朋友^1.5", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let kept = ["unlocked", "auto"]
            if (resettingLayer == "b") {
                if (hasUpgrade("b", 12)) kept.push("upgrades")
            }
        
            layerDataReset(this.layer, kept)
        }
    },
    layerShown(){return true},
    upgrades: {
        11: {
            title: "一切之本(root)-11",
            description: "获取+1/s小朋友",
            cost: new ExpantaNum(1)
        },
        12: {
            title: "12",
            description: "基于最高的小朋友^1.5增加小朋友获取",
            cost: new ExpantaNum(5),
            effect() {
                let eff = softcap(player.p.best.div(2).add(2).pow(0.5), new ExpantaNum(1e9), 0.02);

                return eff;
            },
            effectDisplay() { return `${format(player.p.best)}→×${format(this.effect())}` },
            unlocked() { return hasUpgrade("p", 11)}
        },
        13: {
            title: "13",
            description: "基于小朋友增加小朋友获取",
            cost: new ExpantaNum(10),
            effect() {
                let eff = softcap(player.points.div(5).add(2).pow(0.4), new ExpantaNum(1e9), 0.02);

                return eff;
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("p", 12)}
        },
        14: {
            title: "14",
            description: "基于小朋友增加小朋友^1.5获取",
            cost: new ExpantaNum(30),
            effect() {
                let eff = softcap(player.points.div(10).add(1).pow(0.25), new ExpantaNum(1e9), 0.02);

                return eff;
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("p", 13)}
        },
        15: {
            title: "15",
            description: "解锁一个购买项",
            cost: new ExpantaNum(300),
            unlocked() { return hasUpgrade("p", 14)}
        },
        21: {
            title: "21",
            description: "小朋友^1.5获取×1.6365",
            cost: new ExpantaNum(1000),
            unlocked() { return hasUpgrade("p", 15)}
        },
        22: {
            title: "22",
            description: "小朋友获取×6.365",
            cost: new ExpantaNum(1500),
            unlocked() { return hasUpgrade("p", 21)}
        },
        23: {
            title: "23",
            description: "小朋友^2获取指数+0.01",
            cost: new ExpantaNum(10000),
            unlocked() { return hasUpgrade("p", 22)}
        },
        24: {
            title: "24",
            description: "解锁一个购买项",
            cost: new ExpantaNum(30000),
            unlocked() { return hasUpgrade("p", 23)}
        },
        25: {
            title: "25",
            description: "解锁小朋友^2",
            cost: new ExpantaNum(0),
            unlocked() { return hasUpgrade("p", 24)}
        },
    },
    buyables: {
        11: {
            cost(x) { return scaleCost(100, 3, x) },
            display() { return `基于购买次数增加小朋友获取<br>价格: ${format(this.cost())} 小朋友^1.5<br>当前效果: ×${format(this.effect())}` },
            title: `推进器`,
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (getBuyableAmount(this.layer, this.id).lt(invScaleCost(100, 3, player.p.points))) 
                    setBuyableAmount(this.layer, this.id, invScaleCost(100, 3, player.p.points))
            },
            unlocked() { return hasUpgrade("p", 15)},
            effect() {
                return ExpantaNum.pow(1.1, getBuyableAmount(this.layer, this.id))
            }
        },
        12: {
            cost(x) { return scaleCost(1000, 5, x) },
            display() { return `基于购买次数增加小朋友^1.5获取<br>价格: ${format(this.cost())} 小朋友^1.5<br>当前效果: ×${format(this.effect())}` },
            title: `推进器^1.5`,
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (getBuyableAmount(this.layer, this.id).lt(invScaleCost(1000, 5, player.p.points))) 
                    setBuyableAmount(this.layer, this.id, invScaleCost(1000, 5, player.p.points))
            },
            effect() {
                return ExpantaNum.pow(1.02, getBuyableAmount(this.layer, this.id))
            },
            unlocked() { return hasUpgrade("p", 24)}
        },
    }
})
addLayer("b",{
    name: "小朋友^2", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    color: "#646d75",
    requires: new ExpantaNum(100000), // Can be a function that takes requirement increases into account
    resource: "小朋友^2", // Name of prestige currency
    baseResource: "小朋友^1.5", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/2.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        return exp;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for 小朋友^2", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["p"],
    layerShown(){return hasUpgrade("p", 25) || player[this.layer].unlocked},
    upgrades: {
        11: {
            title: "11",
            description: "基于最高的小朋友^2乘以小朋友的获取量",
            cost: new ExpantaNum(1),
            effect() { return player.b.best.add(1).pow(1.1145)},
            effectDisplay() { return `×${format(this.effect())}`},
        },
        12: {
            title: "12",
            description: "小朋友^2不重置小朋友^1.5升级",
            cost: new ExpantaNum(2),
        },
    }
})