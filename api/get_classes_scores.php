<?php
$scores = file("../database/class_scores.txt", FILE_IGNORE_NEW_LINES);
echo json_encode($scores);
?>
