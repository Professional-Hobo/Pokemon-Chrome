function Entity() {
    this.guid = newguid();
    this.x = 0;
    this.y = 0;
    this.realx = 0;
    this.realy = -4;
    this.sprite = "man_1";
}

Entity.prototype.getX = function() {
    return this.x;
};

Entity.prototype.setX = function(val) {
    this.x = typeof val !== 'undefined' ? val : 0;
    this.realx = ((this.x-1)*16);
};

Entity.prototype.getY = function() {
    return this.y;
};

Entity.prototype.setY = function(val) {
    this.y = typeof val !== 'undefined' ? val : 0;
    this.realy = ((this.y-1)*16)-4;
};

Entity.prototype.getCoords = function() {
    return [this.x, this.y];
};

Entity.prototype.setCoords = function(coords) {
    this.setX(coords[0]);
    this.setY(coords[1]);
};

Entity.prototype.getRealX = function() {
    return this.realx;
};

Entity.prototype.getRealY = function() {
    return this.realy;
};

Entity.prototype.getGUID = function() {
    return this.guid;
};