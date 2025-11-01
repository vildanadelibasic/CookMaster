<?php
require_once(__DIR__ . "/rest/config.php");

$db = new Database();

$conn = $db->connect(); 

if ($conn) {
    echo "<br>Baza je uspješno spojena!";
} else {
    echo "<br>Došlo je do greške pri spajanju na bazu.";
}
?>
