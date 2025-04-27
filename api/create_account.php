<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
        exit;
    }

    $file = '../database/users.txt';
    $line = "$username:$password:user\n";

    if (file_put_contents($file, $line, FILE_APPEND)) {
        echo json_encode(['success' => true, 'message' => 'Account created.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create account.']);
    }
}
?>
