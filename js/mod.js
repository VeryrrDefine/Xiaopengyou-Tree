let modInfo = {
	name: "小朋友树",
	id: "xiaopengyoutree",
	author: "VeryrrDefine",
	pointsName: "小朋友",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.4",
	name: "小朋友^4维度",
}

let changelog = `<h1>更新日志:</h1><br>
<h3>v0.4</h3><br>
    - 增加了小朋友^4维度<br>
	- 增加了拜谢<br>
<h3>v0.3</h3><br>
    - 增加了小朋友^3.5<br>
	- 增加了小朋友^4<br>
	- 增加了小朋友^3.5 购买项<br>
<h3>v0.2</h3><br>
	- 增加了小朋友^2<br>
	- 增加了小朋友^2.5<br>
	- 增加了小朋友^3<br>
<h3>v0.1</h3><br>
	- 增加了小朋友^1<br>
	- 增加了小朋友^1.5`

let winText = `恭喜通关...? 你已经通关了游戏， 但现在...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(0)
	if (hasUpgrade('p', 11)) gain = gain.add(10)
	if (hasUpgrade("p", 12)) gain = gain.mul(upgradeEffect("p", 12))
	if (hasUpgrade("p", 13)) gain = gain.mul(upgradeEffect("p", 13))
	gain = gain.mul(buyableEffect("p", 11))
	if (hasUpgrade("p", 22)) gain = gain.mul(6.365)
	if (hasUpgrade("b", 11)) gain = gain.mul(upgradeEffect("b", 11))
	if (hasUpgrade("c", 14)) gain = gain.mul(upgradeEffect("c", 14))
	if (hasUpgrade("c", 21)) gain = gain.pow(1.03)
	if (hasUpgrade("c", 22)) gain = gain.pow(upgradeEffect("c", 22))
	if (hasUpgrade("p", 32)) gain = gain.mul(1e9)
	gain = gain.mul(tmp.d.effect)
	if (hasChallenge("d", 11)) gain = gain.pow(1.06)
	
	if (inChallenge("d", 12)) gain = gain.pow(0.2)

	if(gain.gte(player.pointSoftcapStart))  gain=gain.div(player.pointSoftcapStart).pow(player.pointSoftcapPower).mul(player.pointSoftcapStart)
	
	gain = gain.mul(tmp.f.effect)
	gain = gain.mul(buyableEffect("e", 13))

	gain = gain.pow(tmp.f.baixieEffect[1].max(1))

	if(gain.gte(player.pointSoftcapStart2))  gain=gain.div(player.pointSoftcapStart2).pow(player.pointSoftcapPower2).mul(player.pointSoftcapStart2)
	
	return gain
}

function pointSoftcapPower() {
	let power=new ExpantaNum(0.5)
	if (hasUpgrade("e", 22)) power = power.add(0.125)
	return power
}
function pointSoftcapStart() {
	let start = ExpantaNum.pow(2, 1024);

	return start;
}
function pointSoftcapPower2() {
	let power=new ExpantaNum(0.5)
	return power
}
function pointSoftcapStart2() {
	let start = ExpantaNum.pow(10, 1700000000);

	return start;
}
// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	pointSoftcapStart: ExpantaNum.pow(2, 1024),
	pointSoftcapPower: new ExpantaNum(".5"),
	pointSoftcapStart2: ExpantaNum.pow(10, 1700000000),
	pointSoftcapPower2: new ExpantaNum(".5"),
	hideNews: false,
	newsTotal: new ExpantaNum(0),
}}

/*

<div style="
    display: inline-flex;
    flex-direction: column;
"><span style="
    text-align: center;
">199</span><div style="
    border: 0.5px solid black;
"></div><span style="text-align:center;">2997932050</span></div>

*/
function generateFrac(x, y, fracColor="white"){
	return `<div style="
    display: inline-flex;
    flex-direction: column;
"><span style="
    text-align: center;
">${x}</span><div style="
    border: 0.5px solid ${fracColor};
"></div><span style="text-align:center;">${y}</span></div>`
}
// Display extra things at the top of the page
var displayThings = [
	function (){
		let a = ""
		if(getPointGen().gte(player.pointSoftcapStart)) a=a+"<br>小朋友获取量在"+format(player.pointSoftcapStart)+"达到软上限！";
		return a;
	},
	function (){
		let a = ""
		if(getPointGen().gte(player.pointSoftcapStart2)) a=a+"小朋友获取量在"+format(player.pointSoftcapStart2)+"达到二阶软上限！";
		return a;
	},
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("e9007199254740991")
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}