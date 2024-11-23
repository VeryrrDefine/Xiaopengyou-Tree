addLayer("p", {
    name: "小朋友^1.5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1.5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    showTotal: true, 
    showBest: true,
    color: "#f32050",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "小朋友^1.5", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/2.6, // Prestige currency exponent
    resetsNothing(){ return hasUpgrade("c", 12) },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p", 14)) mult = mult.mul(upgradeEffect("p", 14))
        if (hasUpgrade("p", 21)) mult = mult.mul(1.6365)
        mult = mult.mul(buyableEffect("p", 12))
        if (hasUpgrade("b", 12)) mult = mult.mul(upgradeEffect("b", 12))
        mult = mult.mul(tmp.d.effect)
        return mult
    },
    passiveGeneration(){
        mult = new ExpantaNum(0);
        if (hasUpgrade("b", 13)) mult = mult.add(1);

        return mult;

    },
    update() {
        if (hasUpgrade("b", 14)){
            tmp.p.buyables[11].buy()
            tmp.p.buyables[12].buy()
        }
    },
    softcap: ExpantaNum(1e25),
    softcapPower: 0.5,
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
                if (hasUpgrade("d", 11) || hasUpgrade("b", 11)) kept.push("upgrades")
            }
            if (resettingLayer == "c") {
                if (hasUpgrade("d", 11) || hasMilestone("c", 0)) kept.push("upgrades")
            }
            if (resettingLayer == "d") {
                if (hasUpgrade("d", 11)) kept.push("upgrades")
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
            cost: new ExpantaNum(100),
            unlocked() { return hasUpgrade("p", 14)}
        },
        21: {
            title: "21",
            description: "小朋友^1.5获取×1.6365",
            cost: new ExpantaNum(500),
            unlocked() { return hasUpgrade("p", 15)}
        },
        22: {
            title: "22",
            description: "小朋友获取×6.365",
            cost: new ExpantaNum(1000),
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
        31: {
            title: "31",

            description: "小朋友^1.5增益小朋友^2",
            effect() {
                return player.b.points.add(10).log(2).pow(1.2).add(1) 
            },
            effectDisplay() { return "×" + format(this.effect()) },
            cost: new ExpantaNum(5e43),
            unlocked() { return hasUpgrade("c", 24)}
        },
        32: {
            title: "32",
            description: "小朋友×1.000e9",
            cost: new ExpantaNum(5e45),
            unlocked() { return hasUpgrade("p", 31)}
        },
        
    },
    buyables: {
        11: {
            cost(x) { return scaleCost(100, 3, x) },
            display() { return `基于购买次数增加小朋友获取(${format(getBuyableAmount(this.layer, this.id))})<br>价格: ${format(this.cost())} 小朋友^1.5<br>当前效果: ×${format(this.effect())}` },
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
            display() { return `基于购买次数增加小朋友^1.5获取(${format(getBuyableAmount(this.layer, this.id))})<br>价格: ${format(this.cost())} 小朋友^1.5<br>当前效果: ×${format(this.effect())}` },
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
    showTotal: true, 
    showBest: true,
    color: "#646d75",
    requires: new ExpantaNum(100000), // Can be a function that takes requirement increases into account
    resource: "小朋友^2", // Name of prestige currency
    baseResource: "小朋友^1.5", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("c", 11)) mult = mult.mul(upgradeEffect("c", 11))
        if (hasUpgrade("p", 31)) mult = mult.mul(upgradeEffect("p", 31))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        return exp;
    },
    doReset(resettingLayer){
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let kept = ["unlocked", "auto"]
            if (resettingLayer == "b") {
                if (hasUpgrade('d', 22)) kept.push("upgrades")
            }
            if (resettingLayer == "c") {
                if (hasUpgrade('d', 22)) kept.push("upgrades")
            }
            if (resettingLayer == "d") {
                if (hasUpgrade('d', 22)) kept.push("upgrades")
            }
        
            layerDataReset(this.layer, kept)
        }
        
    },
    passiveGeneration(){
        mult = new ExpantaNum(0);
        if (hasUpgrade("c", 23)) mult = mult.add(1);

        return mult;

    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for 小朋友^2", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["p"],
    layerShown(){return hasUpgrade("p", 25) || player[this.layer].unlocked},
    resetsNothing(){ return hasUpgrade("c", 12) },
    upgrades: {
        11: {
            title: "11",
            description: "基于最高的小朋友^2乘以小朋友的获取量, 小朋友^2不重置小朋友^1.5升级",
            cost: new ExpantaNum(1),
            effect() { return player.b.best.add(1).pow(1.1145)},
            effectDisplay() { return `×${format(this.effect())}`},
        },
        12: {
            title: "12",
            description: "基于总共的小朋友^2乘以小朋友^1.5的获取量",
            cost: new ExpantaNum(2),
            effect() { return player.b.total.add(1).pow(0.958)},
            effectDisplay() { return `×${format(this.effect())}`},
            unlocked() {return hasUpgrade("b", 11)},
        },
        13: {
            title: "13",
            description: "每秒获取100%小朋友^1.5",
            cost: new ExpantaNum(15),
            unlocked() {return hasUpgrade("b", 12)},
        },
        14: {
            title: "14",
            description: "自动购买小朋友^1.5的购买项",
            cost: new ExpantaNum(5.0001e13),
            unlocked() {return hasUpgrade("b", 13)},
        },
    }
})

addLayer("c", {
    name: "小朋友^2.5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "2.5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    showTotal: true, 
    showBest: true,
    color: "#fe8f3a",
    requires: new ExpantaNum(1e41), // Can be a function that takes requirement increases into account
    resource: "小朋友^2.5", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    autoPrestige(){
        return hasUpgrade('d', 22)
    },
    resetsNothing(){
        return hasUpgrade('d', 23)
    },
    doReset(resettingLayer){
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let kept = ["unlocked", "auto"]
            if (resettingLayer == "d") {
                if (hasMilestone('d', 0)) kept.push("upgrades", "milestones")
            }
        
            layerDataReset(this.layer, kept)
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
    getResetGain() {
        if (!tmp.c.resetGain.array) return new ExpantaNum(0);
        return player.points.div(1e41).logBase(1.8).mul(tmp.c.gainMult).sub(player.c.points).ceil().max(0).min(tmp.c.canBuyMax ? Infinity : "1");
    },
    getNextAt(canBuyMax=false) {
        if (!tmp.c.resetGain.array) return false
        if (canBuyMax) return ExpantaNum.pow(1.8, player.points.div(1e41).logBase(1.8).ceil().max(player.c.points).div(tmp.c.gainMult)).mul(1e41)
        return ExpantaNum.pow(1.8, player.c.points.div(tmp.c.gainMult)).mul(1e41)
    },
    canReset(){
        if (!tmp.c.resetGain.array) return false
        return tmp.c.baseAmount.gte(tmp.c.nextAt) 
    },
    prestigeButtonText(){
        if (!tmp.c.resetGain.array) return "出bug了"
        return `重置以获得<b>${
			formatWhole(tmp.c.resetGain)}</b> 小朋友^2.5<br><br>${
				player.c.points.lt(30) ? (player.points.gte(tmp.c.nextAt) && 
				(tmp.c.canBuyMax !== undefined) && tmp.c.canBuyMax ? "下一个: " : "需要: ") : ""} ${formatWhole(player.points)} / ${(tmp.c.roundUpCost ? formatWhole(tmp.c.nextAtDisp) : format(tmp.c.nextAtDisp))} 小朋友		
		`
    },

    gainMult(){
        if (inChallenge("d", 11)) return new ExpantaNum(0.1)
        mult = new ExpantaNum(1);
        if (hasUpgrade("c", 24)) mult = mult.mul(1.1)
        if (hasUpgrade("d", 12)) mult = mult.mul(1.5)
        return mult;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "C", description: "C: Reset for 小朋友^2.5", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["p"],
    layerShown(){return player.b.unlocked},
    milestones: {
        0: {
            requirementDescription: "2 小朋友^2.5",
            effectDescription: "保留小朋友^1.5升级",
            done() { return player.c.points.gte(2) }
        },
    },
    upgrades: {
        11: {
            title: "11",
            description: "小朋友^2.5增加小朋友^2获取",
            effect() {
                return player.c.points.add(1).pow(2).max(1);
            },
            effectDisplay(){
                return `×${format(this.effect())}`
            },
            cost: new ExpantaNum(2)
        },
        12: {
            title: "12",
            description: "小朋友^2和小朋友^1.5不重置任何东西",
            cost: new ExpantaNum(3),
            unlocked() { return hasUpgrade("c", 11) }
        },
        13: {
            title: "13",
            description: "可以获取最大小朋友^2.5",
            cost: new ExpantaNum(5),
            unlocked() { return hasUpgrade("c", 12) }
        },
        14: {
            title: "14",
            description: "小朋友^2.5增加小朋友获取",
            cost: new ExpantaNum(8),
            effect() {
                return player.c.points.add(1).pow(3).max(1);
            },
            effectDisplay(){
                return `×${format(this.effect())}`
            },
            unlocked() { return hasUpgrade("c", 13) }
        },
        21: {
            title: "21",
            description: "小朋友^1.03",
            cost: new ExpantaNum(25),
            unlocked() { return hasUpgrade("c", 14) }
        },
        22: {
            title: "22",
            description: "基于小朋友^2提升小朋友获取",
            cost: new ExpantaNum(25),
            effect() {
                return player.b.points.max(1).log10().max(1).log10().max(1).root(5);
            },
            effectDisplay(){
                return `^${format(this.effect())}`
            },
            unlocked() { return hasUpgrade("c", 21) }
        },
        23: {
            title: "23",
            description: "每秒获取100%小朋友^2",
            cost: new ExpantaNum(57),
            unlocked() { return hasUpgrade("c", 22) }
        },
        24: {
            title: "24",
            description: "小朋友^2.5获取×1.1，解锁更多小朋友^1.5升级",
            cost: new ExpantaNum(57),
            unlocked() { return hasUpgrade("c", 23) }
        },
    },
    canBuyMax() {
        return hasUpgrade("c", 13)
    }
})


addLayer("d", {
    name: "小朋友^3", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    showTotal: true, 
    showBest: true,
    effect(){
        let eff = player.d.total.add(1).max(1).pow(2)
        return eff
    },
    effectDescription() {
        let dis = "总共使小朋友和小朋友^1.5获取×";
        dis = dis.concat(format(tmp.d.effect))
        return dis
    },
    color: "#b982e1",
    requires: ExpantaNum(5e79), // Can be a function that takes requirement increases into account
    resource: "小朋友^3", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("d", 21)) mult = mult.mul(upgradeEffect("d", 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        return exp;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "D", description: "D: Reset for 小朋友^3", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["b", "c"],
    layerShown(){return player.b.unlocked || player.c.unlocked || player.d.unlocked},
    upgrades: {
        11: {
            title: "11",
            description: "重置时保留小朋友^1.5升级",
            cost: new ExpantaNum(1)
        },
        12: {
            title: "12",
            description: "小朋友^2.5获取×1.5",
            cost: new ExpantaNum(10),
            unlocked() {return hasUpgrade('d', 11)}
        },
        13: {
            title: "13",
            description: "解锁挑战",
            cost: new ExpantaNum(30),
            unlocked() {return hasUpgrade('d', 12)}
        },
        21: {
            title: "21",
            description: "基于小朋友^2提升小朋友^3获取",
            cost: new ExpantaNum(1e5),
            unlocked() {return hasChallenge('d', 11)},
            effect() {
                return player.b.points.max(1).log10().root(2).add(1) 
            },
            effectDisplay() { return "×" + format(this.effect()) },
        },
        22: {
            title: "22",
            description: "自动化小朋友^2.5获取，保留小朋友^2升级",
            cost: new ExpantaNum(1e6),
            unlocked() {return hasUpgrade('d', 21)}
        },
        23: {
            title: "23",
            description: "小朋友^2.5不再重置任何东西",
            cost: new ExpantaNum(1e10),
            unlocked() {return hasUpgrade('d', 22)}
        },
    },
    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",
                "upgrades"
            ]
        },
        "Challenges": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "challenges"
            ],
            unlocked() {return hasUpgrade("d",13)}
        },
    },
    milestones: {
        0: {
            requirementDescription: "1.000e14 小朋友^3",
            effectDescription: "保留小朋友^2.5升级和里程碑",
            done() { return player.d.points.gte(1e14) }

        }
    },
    challenges: {
        11: {
            name: "1/4",
            challengeDescription: "小朋友^2.5获取×0.1",
            goalDescription:"1.000e68 小朋友",
            rewardDescription:"小朋友获取^1.06",
            unlocked(){
                return hasUpgrade("d",13);
       
            },
            canComplete: function() {return player.points.gte("1e68")},
        },
    },
})

addLayer("e", {
    name: "小朋友^3.5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "3.5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    showTotal: true, 
    showBest: true,
    color: "#f9d5a6",
    requires: ExpantaNum.POSITIVE_INFINITY.clone(), // Can be a function that takes requirement increases into account
    resource: "小朋友^3.5", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        return exp;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "E", description: "E: Reset for 小朋友^3.5", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["c"],
    layerShown(){return player.d.unlocked},
    
    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",
                "upgrades"
            ]
        },
    },
    
})

addLayer("f", {
    name: "小朋友^4", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "4", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    showTotal: true, 
    showBest: true,
    color: "#f9d5a6",
    requires: ExpantaNum.POSITIVE_INFINITY.clone(), // Can be a function that takes requirement increases into account
    resource: "小朋友^4", // Name of prestige currency
    baseResource: "小朋友", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1);
        return exp;
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "F", description: "F: Reset for 小朋友^4", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["d", "e"],
    layerShown(){return player.d.unlocked || player.e.unlocked},
    
    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",
                "upgrades"
            ]
        },
    },
    
})