function exponentialFormat(num, precision, mantissa = true) {
    return num.toString(precision)
}


function fixValue(x, y = 0) {
    return x || new ExpantaNum(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return new ExpantaNum(0)
    return x.reduce((a, b) => ExpantaNum.add(a, b))
}


function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new ExpantaNum(x)
    let result = x.toString(precision)
    if (new ExpantaNum(result).gte(maxAccepted)) {
        result = new ExpantaNum(maxAccepted - Math.pow(0.1, precision)).toString(precision)
    }
    return result
}

let FORMAT_DEBUG=0,MAX_LOGP1_REPEATS=48,LOG5E=.6213349345596119;
function commaFormat(t,r){
    if(null==t)return"NaN";if((t.array?t.array[0][1]:t)<.001)return(0).toFixed(r);let e=t.toString().split(".");return e[0]=e[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,"),e[0]
}
function regularFormat(t,r){
    if(isNaN(t))return"NaN";if((t.array?t.array[0][1]:t)<.001)return(0).toFixed(r);let e=t.toString(),o=e.split(".");return 0==r?commaFormat(t.floor?t.floor():Math.floor(t)):1==o.length?e+"."+"0".repeat(r):o[1].length<r?e+"0".repeat(r-o[1].length):o[0]+"."+o[1].substring(0,r)}
    function polarize(t,r=!1){FORMAT_DEBUG>=1&&console.log("Begin polarize: "+JSON.stringify(t)+", smallTop "+r),0==t.length&&(t=[[0,0]]);let e=0==t[0][0]?t[0][1]:10,o=0,a=0;if(Number.isFinite(e))if(t.length<=1&&0==t[0][0])for(;r&&e>=10;)e=Math.log10(e),o+=1,a=1;else{let l=0==t[0][0]?1:0;for(o=t[l][1],a=t[l][0];e>=10||l<t.length||r&&o>=10;)if(e>=10){if(1==a)(e=Math.log10(e))>=10&&(e=Math.log10(e),o+=1);else if(a<MAX_LOGP1_REPEATS)for(e=e>=1e10?Math.log10(Math.log10(Math.log10(e)))+2:Math.log10(Math.log10(e))+1,i=2;i<a;i++)e=Math.log10(e)+1;else e=1;o+=1,FORMAT_DEBUG>=1&&console.log("Bottom mode: bottom "+e+", top "+o+", height "+a+", elem "+l)}else{if(l==t.length-1&&t[l][0]==a&&!(r&&o>=10))break;if(e=Math.log10(e)+o,a+=1,l<t.length&&a>t[l][0]&&(l+=1),l<t.length)if(a==t[l][0])o=t[l][1]+1;else if(e<10){let r=t[l][0]-a;if(r<MAX_LOGP1_REPEATS)for(i=0;i<r;i++)e=Math.log10(e)+1;else e=1;a=t[l][0],o=t[l][1]+1}else o=1;else o=1;FORMAT_DEBUG>=1&&console.log("Top mode: bottom "+e+", top "+o+", height "+a+", elem "+l)}}else;return FORMAT_DEBUG>=1&&console.log("Polarize result: bottom "+e+", top "+o+", height "+a),{bottom:e,top:o,height:a}}
    function arraySearch(t,r){for(i=0;i<t.length;i++){if(t[i][0]==r)return t[i][1];if(t[i][0]>r)break}return r>0?0:10}
    function setToZero(t,r){for(i=0;i<t.length&&t[i][0]!=r;i++);i<t.length&&(t[i][1]=0)}
    function format(t,r=2,e=!1){if(ExpantaNum.isNaN(t))return"NaN";let o=Math.max(3,r),a=Math.max(4,r),l=Math.max(6,r),i=(t=new ExpantaNum(t)).array;if(t.abs().lt(1e-308))return(0).toFixed(r);if(t.sign<0)return"-"+format(t.neg(),r);if(t.isInfinite())return"Infinity";if(t.lt("0.0001"))return format(t.rec(),r)+"⁻¹";if(t.lt(1))return regularFormat(t,r+(e?2:0));if(t.lt(1e3))return regularFormat(t,r);if(t.lt(1e9))return commaFormat(t);if(t.lt("10^^5")){let t=arraySearch(i,0),r=arraySearch(i,1)-1;t>=1e9&&(t=Math.log10(t),r+=1);let e,a=10**(t-Math.floor(t)),l=Math.floor(t);return(e=t<1e3?o:o-Math.log10(t)+3)<0&&(e=0),"e".repeat(r)+regularFormat(a,e)+"e"+commaFormat(l)}if(t.lt("10^^1000000")){let t=polarize(i);return regularFormat(t.bottom,a)+"F"+commaFormat(t.top)}if(t.lt("10^^^5")){let e=arraySearch(i,2);if(e>=1)return setToZero(i,2),"F".repeat(e)+format(i,r);let o=arraySearch(i,1)+1;return t.gte("10^^"+(o+1))&&(o+=1),"F"+format(o,r)}if(t.lt("10^^^1000000")){let t=polarize(i);return regularFormat(t.bottom,a)+"G"+commaFormat(t.top)}if(t.lt("10^^^^5")){let e=arraySearch(i,3);if(e>=1)return setToZero(i,3),"G".repeat(e)+format(i,r);let o=arraySearch(i,2)+1;return t.gte("10^^^"+(o+1))&&(o+=1),"G"+format(o,r)}if(t.lt("10^^^^1000000")){let t=polarize(i);return regularFormat(t.bottom,a)+"H"+commaFormat(t.top)}if(t.lt("10^^^^^5")){let e=arraySearch(i,4);if(e>=1)return setToZero(i,4),"H".repeat(e)+format(i,r);let o=arraySearch(i,3)+1;return t.gte("10^^^^"+(o+1))&&(o+=1),"H"+format(o,r)}if(t.lt("10^^^^^1000000")){let t=polarize(i);return regularFormat(t.bottom,a)+"I"+commaFormat(t.top)}if(t.lt("10^^^^^^5")){let e=arraySearch(i,5);if(e>=1)return setToZero(i,5),"I".repeat(e)+format(i,r);let o=arraySearch(i,4)+1;return t.gte("10^^^^^"+(o+1))&&(o+=1),"I"+format(o,r)}if(t.lt("J1000000")){let t=polarize(i,!0);return regularFormat(Math.log10(t.bottom)+t.top,l)+"J"+commaFormat(t.height)}if(t.lt("J^4 10")){let e=t.layer;if(e>=1)return"J".repeat(e)+format(i,r);let o=i[i.length-1][0];return t.gte("J"+(o+1))&&(o+=1),"J"+format(o,r)}if(t.lt("J^999999 10")){let r,e=polarize(i,!0),o=new ExpantaNum(i),a=t.layer;if(o.lt("10^^10"))r=1+Math.log10(Math.log10(e.bottom)+e.top),a+=1;else if(o.lt("10{10}10"))r=e.height+Math.log((Math.log10(e.bottom)+e.top)/2)*LOG5E,a+=1;else{let t=e.height+Math.log((Math.log10(e.bottom)+e.top)/2)*LOG5E,o=t>=1e10?Math.log10(Math.log10(t)):Math.log10(t),l=t>=1e10?2:1;r=1+Math.log10(Math.log10(o)+l),a+=2}return regularFormat(r,l)+"K"+commaFormat(a)}let n=t.layer+1;return t.gte("J^"+n+" 10")&&(n+=1),"K"+format(n,r)}
    function formatWhole(t){return format(t,0)}
    function formatSmall(t,r=2){return format(t,r,!0)}