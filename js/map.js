function Pokemap(name, music) {
    this.setName(typeof name !== 'undefined' ? name : "littleroot");
    this.setMusic(typeof music !== 'undefined' ? music : "littleroot");
    this.musicPlayer;
    this.bump = new buzz.sound('sound/bump.m4a');
    this.entities = [];
    this.reload = true;
}

Pokemap.prototype.update = function(name, music, next) {
    this.setName(typeof name !== 'undefined' ? name : "littleroot");
    oldMusic = this.music;
    this.setMusic(typeof music !== 'undefined' ? music : "littleroot");
    this.removeAllEntities();
    this.entities = [];
    this.reload = true;

    // Get new music
    if (oldMusic != music) {
        // Fadeout previous song and play new song
        this.musicPlayer.fadeTo(0, 1000, function() {
        this.musicPlayer = new buzz.sound('sound/music/' + music + '.m4a', {loop: true, volume: 0});
        this.musicPlayer.fadeTo(50, 1000);
        });
    }

    next();
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

Pokemap.prototype.render = function(callback) {
    // Load in walkables
    $('#walkables_css').attr('href', 'data/walkables/' + this.getName() + '.css');

    // Map ID
    $("map").html(this.getName());

    // Load game screen
    imgURL = 'data/img/' + this.getName() + '.png';
    self = this;

   $('<img src="'+imgURL+'"/>').load(function(){
        self.setWidth(this.width);
        self.setHeight(this.height);
        $('#game').css({width: this.width + "px", height: this.height + "px"});

        // Load map and player sprite
        $('#map').attr('src', 'data/img/' + self.getName() + '.png');
        $('#player').attr('src', 'img/sprites/' + player.getSprite());
        $('#player').css({left: player.getRealX() + "px", top: player.getRealY() + "px"});
        $("#walkables").empty();
        $.get("data/walkables/" + self.getName() + ".html", function(data) {
            $("#walkables").html(data).promise().done(function() {
                self.setMusic($("music").html());
                self.musicPlayer = new buzz.sound('sound/music/' + map.music + '.m4a', {loop: true, volume: 0});
                self.musicPlayer.fadeTo(50, 1000);
            });
        });

        // Load boundaries
        $.getJSON("data/boundaries/" + self.getName() + ".json", function( data ) {
            self.boundaries = data;
        });

        // Load warps
        $.getJSON("data/warps/" + self.getName() + ".json", function( data ) {
            self.warps = data;
        });

        // Load events
        $.getJSON("data/events/" + self.getName() + ".json", function( data ) {
            self.events = data;
        });
    });

    typeof callback === 'function' && callback();
}

Pokemap.prototype.removeAllEntities = function() {
    $.each(this.entities, function(index, value) {
        $('#' + this.getGUID()).remove();
    });
    this.entities.splice(0, this.entities.length);
}