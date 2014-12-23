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

Pokemap.prototype.render = function(callback) {
    // Load/update map data
    if ($("#walkables_css").length == 0) {
        $('head').append(
            $('<link id="walkables_css" rel="stylesheet" type="text/css" />').attr('href', 'data/walkables/' + this.getName() + '.css')
        );
    } else {
        $('#walkables_css').attr('href', 'data/walkables/' + this.getName() + '.css');
    }

    // Map ID
    $("map").html(this.getName());

    // Load game screen
    imgURL = 'data/img/' + this.getName() + '.png';
    self = this;

    // If map hasn't been made, create it else update
    if ($("#map").length == 0) {
        $('<img src="'+imgURL+'"/>').load(function(){
            self.setWidth(this.width);
            self.setHeight(this.height);
            $('body').prepend('<div id="game" style="position: relative; left: 0; top: 0; width: ' + this.width + 'px; height: ' + this.height + 'px;">')

            // Load map and player sprite
            $('#game').prepend('<img id="map" src="data/img/' + self.getName() + '.png" style="position: relative; top: 0; left: 0; z-index:0">');
            $('#game').prepend('<img id="player" src="img/sprites/player/male_1/' + player.getDirection() + '_1.png" style="position: absolute; left: ' + player.getRealX() + 'px; top: ' + player.getRealY() + 'px; z-index:' + (player.getRealY()+1000) + '">');
            $("#game").prepend("<div id='walkables'>");
            $.get("data/walkables/" + self.getName() + ".html", function(data) {
                $("#walkables").html(data);
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
    } else {
        $('<img src="'+imgURL+'"/>').load(function(){
            self.setWidth(this.width);
            self.setHeight(this.height);
            $('#game').css({width: this.width + "px", height: this.height + "px"});

            // Load map and player sprite
            $('#map').attr('src', 'data/img/' + self.getName() + '.png');
            $('#game').attr('src', 'img/sprites/player/male_1/' + player.getDirection() + '_1.png');
            $('#player').css({left: player.getRealX() + "px", top: player.getRealY() + "px"});
            $("#walkables").empty();
            $.get("data/walkables/" + self.getName() + ".html", function(data) {
                $("#walkables").html(data);
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
    }

    typeof callback === 'function' && callback();
}