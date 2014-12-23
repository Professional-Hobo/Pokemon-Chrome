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
        //$("#fps").html("FPS: " + getAvgFPS());
        //$("#frame").html("Frame: " + frame);
        update();
    }
    
    lastTime = currentTime - (delta % interval);
}

function update() {
    // Check player object for rendering
    if (player.render) {
        if (player.steps == 0) {
            player.initialRender();
        } else {
            player.renderMove();
        }
    }

    $(entities).each(function(index, value) {
        if (value.render) {
            if (value.steps == 0) {
                value.preRender();
            } else {
                value.renderMove();
            }
        }
        if (value.ai) {
            if (frame % 48 == 0) {
                if (random(1, 100) > 90) {
                    value.move(random(0,3));
                }
            }
        }
        // If player is above npc, set npc z-index to 99
        if (player.getY() > value.getY()) {
            $("#"+value.getGUID()).css("z-index", 99);
        } else {
            $("#"+value.getGUID()).css("z-index", 101);
        }
    });
}

function getAvgFPS() {
    return (frame/(lastTime-start)*1000).toFixed(2);
}
