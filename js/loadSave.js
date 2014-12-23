var player_ip;
var guid;
var data;

$.get("http://keitharm.me/projects/chrome/server/ip.php", function(response) {
    player_ip = response;
    queryServer();
})
.fail(function() {
    alert("Unable to contact game server. Please try again later.");
    logger("Unable to contact game server. Please try again later.");
});

function queryServer() {
    // Query game server for save data or create new user if guid not found
    var cookie = $.cookie("guid");

    // If no cookie data, generate guid for user
    if (cookie === undefined) {
        guid = newguid();
    } else {
        guid = cookie;
    }

    $.getJSON("http://keitharm.me/projects/chrome/server/loadSave.php?guid=" + guid, function(response) {
        data = response.player;
        loadPlayerData();
    })
    .fail(function() {
        alert("Unable to load player data. Please try again later.");
        logger("Unable to load player data. Please try again later.");
    });
}

function loadPlayerData() {
    // Check if new player or not
    if (data.exists == false) {
        logger("New player from " + player_ip + ".");

        // Set GUID cookie
        $.cookie("guid", data.guid, {
            expires : 1337,
        });
    } else {
        logger("Loaded saved player data for " + player_ip + ".");
    }
    logger("Your GUID is " + data.guid + ".");

    // Player guid
    guid = data.guid;
    // Update Map
    map = new Pokemap(data.map);

    // Load in player
    player = new Player(data.x, data.y, data.direction, data.gender);
    $(document).keydown(function(e) {
        // Only move if proper key is used
        if (inArray(e.which, arrows) && !player.walking) {
            e.preventDefault();
            // Increase step counter
            player.steps++;
            player.move(dirs[e.which]);
            player.walking = true;
        }
    });

    // Load in map data
    $('head').append(
        $('<link rel="stylesheet" type="text/css" />').attr({
            href: 'data/walkables/' + map.getName() + '.css',
            id: 'walkables_css'
        })
    );

    // Map ID
    $("map").html(map.getName());

    // Load game screen
    imgURL = 'data/img/' + map.getName() + '.png';
    $('<img src="'+imgURL+'"/>').load(function(){
        map.setWidth(this.width);
        map.setHeight(this.height);
        $('body').prepend('<div id="game" style="position: relative; left: 0; top: 0; width: ' + this.width + 'px; height: ' + this.height + 'px;">')

        // Load map and player sprite
        $('#game').prepend('<img id="map" src="data/img/' + map.getName() + '.png" style="position: relative; top: 0; left: 0; z-index:0">')
        $('#game').prepend('<img id="player" src="img/sprites/player/male_1/' + player.getDirection() + '_1.png" style="position: absolute; left: ' + player.getRealX() + 'px; top: ' + player.getRealY() + 'px; z-index:100">')
        $("#walkables").load("data/walkables/" + map.getName() + ".html", function() {
            playMusic($("music").html());
        });

        // Load boundaries
        $.getJSON("data/boundaries/" + map.getName() + ".json", function( data ) {
            map.boundaries = data;
        });
        // // Load boundaries and warps initially
        // loadBoundaries();
        // loadWarps();
        // loadEvents();
    });
gameLoop();
}