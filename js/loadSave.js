var player_ip;
var guid;
var data;
var map;

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

    map.render(gameLoop);
}

$(document).keydown(function(e) {
    // Only move if proper key is used
    if (inArray(e.which, arrows)) {
        e.preventDefault();
        if (!player.walking) {
            // Increase step counter
            player.steps++;
            player.move(dirs[e.which]);
            player.walking = true;
        }
    }
});