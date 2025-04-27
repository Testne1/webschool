<?php
require_once('../database/db_connect.php');

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['class_name'])) {
    try {
        $db = connectDatabase();

        $stmt = $db->prepare("INSERT INTO classes (class_name) VALUES (?)");
        $stmt->execute([$data['class_name']]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid input']);
}
?>
