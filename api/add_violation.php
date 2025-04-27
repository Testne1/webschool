<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $desc = trim($input['desc'] ?? '');
    $points = intval($input['points'] ?? 0);

    if (empty($desc) || $points <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
        exit;
    }

    $file = '../database/violations.txt';
    $line = "$desc,$points\n";

    if (file_put_contents($file, $line, FILE_APPEND)) {
        echo json_encode(['success' => true, 'message' => 'Violation added.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add violation.']);
    }
}
?>
