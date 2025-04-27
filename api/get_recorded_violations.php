<?php
$violationsFile = "../database/recorded_violations.txt";
$violationPointsFile = "../database/violations.txt";

$recordedViolations = file($violationsFile, FILE_IGNORE_NEW_LINES);
$violationPoints = file($violationPointsFile, FILE_IGNORE_NEW_LINES);

// Create a lookup table for violation points
$violationPointsMap = [];
foreach ($violationPoints as $violation) {
    list($desc, $points) = explode(",", $violation);
    $violationPointsMap[$desc] = $points;
}

// Append points to each recorded violation
$result = [];
foreach ($recordedViolations as $record) {
    list($class, $student, $violation, $date) = explode(",", $record);
    $points = isset($violationPointsMap[$violation]) ? $violationPointsMap[$violation] : 0;
    $result[] = "$class,$student,$violation,$date,$points";
}

echo json_encode($result);
?>
