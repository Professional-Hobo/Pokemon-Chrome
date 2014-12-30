<?php
require_once("Database.class.php");
require_once("global.php");

header("HTTP/1.1 200 OK");
header("access-control-allow-origin: *");
header('content-type: application/json; charset=UTF-8');

$directions = array("up", "right", "down", "left");
$genders = array("male", "female");

$guid = $_GET['guid'];

// Check if user exists
if (Database::doesExist("mine", "guid", $guid)) {
    $user = fetchUser($guid);
    $data["exists"] = true;
} else {
    makeUser($guid);
    $user = fetchUser($guid);
    $data["exists"] = false;
}

$data["id"] = $user->id;
$data["guid"] = $user->guid;

$data["map"] = $user->map;
$data["direction"] = $user->direction;
$data["gender"] = $genders[$user->gender];

$data["x"] = $user->x;
$data["y"] = $user->y;

$data["steps"] = $user->steps;

echo json_encode(array("player" => $data));
?>
