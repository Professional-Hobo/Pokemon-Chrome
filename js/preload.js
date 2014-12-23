function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}

preload([
    "data/img/birch_lab.png",
    "data/img/littleroot.png",
    "data/img/path.png",
    "data/img/rival_house_downstairs.png",
    "data/img/trainer_house_downstairs.png",
    "data/img/trainer_house_upstairs.png",
    "img/sprites/player/male_1/up_1.png",
    "img/sprites/player/male_1/up_2.png",
    "img/sprites/player/male_1/up_3.png",
    "img/sprites/player/male_1/right_1.png",
    "img/sprites/player/male_1/right_2.png",
    "img/sprites/player/male_1/right_3.png",
    "img/sprites/player/male_1/down_1.png",
    "img/sprites/player/male_1/down_2.png",
    "img/sprites/player/male_1/down_3.png",
    "img/sprites/player/male_1/left_1.png",
    "img/sprites/player/male_1/left_2.png",
    "img/sprites/player/male_1/left_3.png"
]);