var name = "Pokemon Chrome";
var version = "1.0.0";
var player;
var map;
var guid;
var amt = {
    0: {left: 0, top: -16, xtile: 0, ytile: -1},
    1: {left: 16, top: 0, xtile: 1, ytile: 0},
    2: {left: 0, top: 16, xtile: 0, ytile: 1},
    3: {left: -16, top: 0, xtile: -1, ytile: 0}
};
var directions = ["up", "right", "down", "left"];
var UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
var arrows = [38, 39, 40, 37];
var dirs = {
    38: 0,
    39: 1,
    40: 2,
    37: 3
};
logger(name + " " + version);


function addScript(file, callback) {
    $("body").append("<script src=\"js/"+file+"\"></script>");

    typeof callback === 'function' && callback();
}

function logger(text) {
    date = new Date();
    console.log("[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]" + text);
}

function newguid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
}

function inArray(value, array) {
  return array.indexOf(value) > -1;
}

function random(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function newNPC() {
    types = ["man_1", "woman_1", "boy_1"];
    new NPC(random(1,20), random(1,20), DOWN, types[random(0,2)]).AI();
}

function removeAllEntities() {
    map.removeAllEntities();
}

function objWithProp(array, attr, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}