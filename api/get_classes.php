<?php
$classes = file("../database/classes.txt", FILE_IGNORE_NEW_LINES);
echo json_encode($classes);
?>
