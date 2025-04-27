<?php
$violations = file("../database/violations.txt", FILE_IGNORE_NEW_LINES);
echo json_encode($violations);
?>
