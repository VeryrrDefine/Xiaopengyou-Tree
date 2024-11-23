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
	num: "0.2",
	name: "小朋友^3",
}

let changelog = `<h1>更新日志:</h1><br>
<h3>v0.2</h3><br>
	- 增加了小朋友^2<br>
	- 增加了小朋友^2.5<br>
	- 增加了小朋友^3<br>
<h3>v0.1</h3><br>
	- 增加了小朋友^1<br>
	- 增加了小朋友^1.5`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

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
	if (hasUpgrade('p', 11)) gain = gain.add(1)
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
	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
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