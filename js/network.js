var network_temp = {
    rank_pos: Infinity,
    rank_players: [],
    loaded: false
}
addLayer("NW", {
    name: "网络", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NW", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new ExpantaNum(0),
    }},
    tooltip() {
      return "网络"
    },
    color: "#723f89",
    nodeStyle() {return {
        "background": "radial-gradient(#723f89, #431c53)" ,
    }},
    requires: new ExpantaNum(0), // Can be a function that takes requirement increases into account
    resource: "",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return 0 },
    achievements: {
    },
    tabFormat: {
        "排行榜" :{
            content: [
                ["raw-html", function (){
                    if (network_temp.loaded) return ""
                    return "排行榜并没有加载"
                }]
            ]
        },
    },
})
