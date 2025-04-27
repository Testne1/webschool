<?php
$data = json_decode(file_get_contents("php://input"), true);
$class = $data['class'];
$violation = $data['violation'];
$student = $data['student'];
$date = date("Y-m-d");

if (!$class || !$violation || !$student) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$record = "$class,$student,$violation,$date\n";
file_put_contents("../database/recorded_violations.txt", $record, FILE_APPEND);

echo json_encode(["success" => true]);
?>
