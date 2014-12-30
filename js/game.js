var frame = 0;
var fps = 60;
var interval = 1000/fps;
var delta = 0
var currentTime = 0;
var lastTime = (new Date()).getTime();
var start = (new Date()).getTime();

function gameLoop() {
    frame++;
    requestAnimationFrame(gameLoop);
    
    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);
    if (currentTime-lastTime > interval) {
        $("#frame").html("Frame: " + frame);
        $("#entities").html("Entities: " + map.entities.length);
        update();
    }
    
    lastTime = currentTime - (delta % interval);
}

function update() {
    // Check player object for rendering
    if (player.render) {
        //console.log(player.renderFrame);
        if (player.steps == 0) {
            player.initialRender();
        } else {
            player.renderMove();
        }
    }

    $(map.entities).each(function(index, value) {
        if (value.render) {
            if (value.steps == 0) {
                value.preRender();
            } else {
                value.renderMove();
            }
        }
        if (value.ai) {
            if (frame % 60 == 0) {
                if (random(1, 100) > 85) {
                    value.move(random(0,3));
                }
            }
        }
        // Set NPC z-index
        $("#"+value.getGUID()).css("z-index", (value.getY()+1000));
    });

    // Set player z-index
    $("#player").css("z-index", (player.getY()+1000));

    // Render map updates
    if (map.reload) {
        map.render();
        map.reload = false;
    }
}

function getAvgFPS() {
    var cur = frame;
    var timea = (new Date()).getTime();
    setTimeout(function() {
        var timeb = (new Date()).getTime();
        $("#fps").html("FPS: " + ((frame-cur)/(timeb-timea)*1000).toFixed(2));
        getAvgFPS();
    }, 2000);
}
getAvgFPS();
// running WIP //
// onkeydown = onkeyup = function(e){
//     e = e || event; // to deal with IE
//     keys[e.keyCode] = e.type == 'keydown';
//     if (keys[37] === true || keys[38] === true || keys[39] === true || keys[40] === true) {
//         if (keys[66] === true) {
//             player.running = true;
//         } else {
//             player.running = false;
//         }
//         e.preventDefault();
//         if (!player.walking) {
//             // Increase step counter
//             player.steps++;
//             player.move(dirs[e.which]);
//             player.walking = true;
//         }
//     }
// }
///////////////////