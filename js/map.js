function Pokemap(name, music) {
    this.setName(typeof name !== 'undefined' ? name : "littleroot");
    this.setMusic(typeof music !== 'undefined' ? music : "littleroot");
}

Pokemap.prototype.getName = function() {
    return this.name;
};

Pokemap.prototype.setName = function(val) {
    this.name = val;
};

Pokemap.prototype.getMusic = function() {
    return this.music;
};

Pokemap.prototype.setMusic = function(val) {
    this.music = val;
};

Pokemap.prototype.getWidth = function() {
    return this.width;
};

Pokemap.prototype.setWidth = function(val) {
    this.width = val;
    this.tileWidth = val/16;
};

Pokemap.prototype.getHeight = function() {
    return this.height;
};

Pokemap.prototype.setHeight = function(val) {
    this.height = val;
    this.tileHeight = val/16;
};

Pokemap.prototype.getTileWidth = function() {
    return this.width/16;
};

Pokemap.prototype.getTileHeight = function() {
    return this.height/16;
};