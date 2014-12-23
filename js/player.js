function Player(x, y, direction, gender) {
    Entity.call(this);
    this.guid = guid;
    this.setX(x);
    this.setY(y);
    this.steps = 0;
    this.setGender(typeof gender !== 'undefined' && typeof gender !== 'number' ? gender : "male");
    this.setDirection(direction);
    this.render = false;
    this.renderFrame = 0;
    this.renderDirection = [0, 0];
    this.animationFrame = 1;
    this.animationFrameStep = 2;
}
// Extend Entity class
Player.prototype = new Entity();
Player.prototype.constructor = Player;

// Method definitions //
Player.prototype.getDirection = function(name) {
    typeof name !== 'undefined' ? true : false
    if (name) {
        return directions[this.direction];
    }
    return this.direction;
}

Player.prototype.getDirectionAnimation = function() {
    return this.steps%3+1;
}

Player.prototype.setDirection = function(val) {
    this.render = true;
    if (val < 0 || val > 3) {
        this.direction = 0;
        console.error("Direction may only be 0(UP), 1(RIGHT), 2(DOWN), or 3(LEFT).");
    } else {
        this.direction = val;
    }

    // Update sprite
    this.sprite = "player/" + this.getGender() + "_1/" + this.getDirection(true) + "_" + this.animationFrame + ".png";
}

Player.prototype.getGender = function() {
    return this.gender;
}

Player.prototype.setGender = function(val) {
    this.render = true;
    val = val.toLowerCase();
    if (val != "male" && val != "female") {
        this.gender = "male";
        console.error("Gender may only be male or female.");
    } else {
        this.gender = val;
        this.sprite = "player/" + this.getGender() + "_1/" + this.getDirection(true) + "_" + this.animationFrame + ".png";
    }
}

Player.prototype.getSprite = function() {
    return this.sprite;
}

Player.prototype.getRealCoords = function() {
    return [this.realx, this.realy];
};

Player.prototype.move = function(direction) {
    this.render = true;
    var validMove = true;
    var self = this;

    // Check for warps
    $.each(map.warps, function(index, warp) {
        self.checkWarp(warp, direction);
    });

    // Next, check boundaries for invalid moves
    $.each(map.boundaries, function(index, value) {
        if (Math.abs(self.getRealX()+amt[direction].left-value.x) < 10 && Math.abs(self.getRealY()+4+amt[direction].top-value.y) < 10) {
            validMove = false;
            console.error("Player cannot be moved " + directions[direction] + ". Boundary in the way.");
            return false;
        }
    });

    // Next, see if player will still be within the map
    if (this.getRealX()+amt[direction].left >= map.getWidth() || this.getRealX()+amt[direction].left < 0 || this.getRealY()+amt[direction].top+4 >= map.getHeight() || this.getRealY()+amt[direction].top+4 < 0) {
        validMove = false;
        console.error("Player cannot be moved " + directions[direction] + " or else player would be out of bounds.");
    }

    // And finally, see if player will collide with any other entities
    $.each(entities, function(index, value) {
        if (Math.abs(self.getRealX()+amt[direction].left-value.getRealX()) < 10 && Math.abs(self.getRealY()+4+amt[direction].top-value.getRealY()) < 10) {
            validMove = false;
            console.error("Player cannot be moved " + directions[direction] + " or else player would collide with NPC.");
            return false;
        }
    });

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
        return true;
    } else {
        return false;
    }
};

Player.prototype.renderMove = function() {
    // Check if player has completed move yet
    if (this.running === true) {
        div = 4;
    } else {
        div = 1;
    }
    if (this.renderFrame < (16/div)) {
        $("#player").css("left", "+="+(this.renderDirection[0]*div));
        $("#player").css("top", "+="+(this.renderDirection[1]*div));
        if (this.renderFrame == 1) {
            this.animationFrame = this.animationFrameStep;
            this.sprite = "player/" + this.getGender() + "_1/" + this.getDirection(true) + "_" + this.animationFrame + ".png";
            $("#player").attr("src", "img/sprites/" + this.getSprite());

        }
        if (this.renderFrame == (12/div)) {
            this.animationFrame = 1;
            this.sprite = "player/" + this.getGender() + "_1/" + this.getDirection(true) + "_" + this.animationFrame + ".png";
            $("#player").attr("src", "img/sprites/" + this.getSprite());
        }
        if (++this.renderFrame == (16/div)) {
            this.render = false;
            this.renderFrame = 0;
            this.renderDirection = [0, 0];
            this.walking = false;
            this.animationFrameStep = this.animationFrameStep == 2 ? 3 : 2;
        }
    }
};

Player.prototype.checkWarp = function(warp, direction) {
    src_x = +warp.src_coords["x"];
    src_y = +warp.src_coords["y"];
    dst_x = +warp.dst_coords["x"];
    dst_y = +warp.dst_coords["y"];
    dst_direction = warp.dst_direction;

    // Valid warp
    if ((this.getX()+amt[direction].xtile == src_x && this.getY()+amt[direction].ytile == src_y && (warp.src_direction === false || warp.walkin === true)) || this.getX() == src_x && this.getY() == src_y && +warp.src_direction === direction && warp.src_direction !== false) {

        // Update map id
        map = new Pokemap(warp.map);
        player.setX(dst_x);
        player.setY(dst_y);

        // Play warp sound if any
        if (warp.sound !== false) {
            //map.sound = new buzz.sound('sounds/' + warp.sound + '.m4a');
            //sound.play();
        }

        // Show walk animation first and then update
        if (warp.walkin === true && warp.src_direction == direction) {
            player.move(direction);
        }
        map.render();
        //this.walking = false;
    }
};