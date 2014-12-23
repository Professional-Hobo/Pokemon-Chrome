function NPC(x, y, direction, sprite) {
    Entity.call(this);
    this.realx = 1;
    this.setX(x);
    this.setY(y);
    this.steps = 0;
    this.render = true;
    this.renderFrame = 0;
    this.renderDirection = [0, 0];
    this.animationFrame = 1;
    this.animationFrameStep = 2;
    this.setSprite(typeof sprite !== 'undefined' ? sprite : "man_1");
    this.setType(typeof sprite !== 'undefined' ? sprite : "man_1");
    this.setDirection(typeof direction !== 'undefined' ? direction : 0);
    this.ai = false;
    entities.push(this);
}
// Extend Entity class
NPC.prototype = new Entity();
NPC.prototype.constructor = NPC;

Entity.prototype.setX = function(val) {
    this.x = typeof val !== 'undefined' ? val : 0;
    this.realx = ((this.x-1)*16)+1;
};

// Method definitions //
NPC.prototype.getDirection = function(name) {
    typeof name !== 'undefined' ? true : false
    if (name) {
        return directions[this.direction];
    }
    return this.direction;
}

NPC.prototype.getDirectionAnimation = function() {
    return this.steps%3+1;
}

NPC.prototype.setDirection = function(val) {
    if (val < 0 || val > 3) {
        this.direction = 0;
        console.error("Direction may only be 0(UP), 1(RIGHT), 2(DOWN), or 3(LEFT).");
    } else {
        this.direction = val;
    }

    // Update sprite
    this.sprite = "npc/" + this.getSprite() + "/" + this.getDirection(true) + "_" + this.animationFrame + ".png";
}

NPC.prototype.getType = function() {
    return this.type;
}

NPC.prototype.setType = function(val) {
    this.type = val;
}

NPC.prototype.getSprite = function() {
    return this.sprite;
}

NPC.prototype.setSprite = function(val) {
    this.sprite = val;
}

NPC.prototype.getRealCoords = function() {
    return [this.realx, this.realy];
};

NPC.prototype.move = function(direction) {
    this.render = true;
    var validMove = true;
    var self = this;

    // First check boundaries for invalid moves
    $.each(map.boundaries, function(index, value) {
        if (Math.abs(self.getRealX()+amt[direction].left-value.x-1) < 10 && Math.abs(self.getRealY()+8+amt[direction].top-value.y) < 10) {
            validMove = false;
            console.error("NPC cannot be moved " + directions[direction] + ". Boundary in the way.");
            return false;
        }
    });

    // Next, see if NPC will still be within the map
    if (this.getRealX()+amt[direction].left-1 >= map.getWidth() || this.getRealX()+amt[direction].left-1 < 0 || this.getRealY()+amt[direction].top+8 >= map.getHeight() || this.getRealY()+amt[direction].top+8 < 0) {
        validMove = false;
        console.error("NPC cannot be moved " + directions[direction] + " or else NPC would be out of bounds.");
    }

    // See if NPC will collide with any other entities
    $.each(entities, function(index, value) {
        if (Math.abs(self.getRealX()+amt[direction].left-value.getRealX()) < 10 && Math.abs(self.getRealY()+4+amt[direction].top-value.getRealY()) < 10) {
            validMove = false;
            console.error("NPC cannot be moved " + directions[direction] + " or else NPC would collide with another NPC.");
            return false;
        }
    });

    // Finally check if NPC will collide with player
    if (Math.abs(self.getRealX()+amt[direction].left-player.getRealX()) < 10 && Math.abs(self.getRealY()+4+amt[direction].top-player.getRealY()) < 10) {
        validMove = false;
        console.error("NPC cannot be moved " + directions[direction] + " or else NPC would collide with player.");
    }

    // Update sprite regardless if player moves in valid direction
    this.setDirection(direction);
    this.steps++;

    if (validMove && !this.walking) {
        this.walking = true;
        // Change internal walking
        this.setX(this.getX()+(amt[direction].left/16));
        this.setY(this.getY()+(amt[direction].top/16));

        this.renderDirection[0] = amt[direction].xtile;
        this.renderDirection[1] = amt[direction].ytile;
    }
};

NPC.prototype.renderMove = function() {
    // Check if player has completed move yet
    if (this.renderFrame < 16) {
        $("#"+this.getGUID()).css("left", "+="+this.renderDirection[0]);
        $("#"+this.getGUID()).css("top", "+="+this.renderDirection[1]);
        if (this.renderFrame < 12) {
            this.animationFrame = this.animationFrameStep;
        } else {
            this.animationFrame = 1;
        }
        this.sprite = "npc/" + this.getType() + "/" + this.getDirection(true) + "_" + this.animationFrame + ".png";
        $("#"+this.getGUID()).attr("src", "img/sprites/" + this.getSprite());
        if (++this.renderFrame == 16) {
            this.render = false;
            this.renderFrame = 0;
            this.renderDirection = [0, 0];
            this.walking = false;
            this.animationFrameStep = this.animationFrameStep == 2 ? 3 : 2;
        }
    }
};

NPC.prototype.preRender = function() {
    $('#game').prepend('<img id="' + this.getGUID() + '" style="position: absolute; z-index:100">');
    $('#' + this.getGUID()).attr('src', 'img/sprites/' + this.getSprite());
    $('#' + this.getGUID()).css('left', this.getRealX());
    $('#' + this.getGUID()).css('top', this.getRealY());
    this.render = false;
}

NPC.prototype.AI = function() {
    this.ai = !this.ai;
}