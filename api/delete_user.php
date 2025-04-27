<?php
$file = '../database/users.txt';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $usernameToDelete = trim($input['username'] ?? '');

    if (empty($usernameToDelete)) {
        echo json_encode(['success' => false, 'message' => 'Invalid username.']);
        exit;
    }

    // Kiểm tra nếu username là 'admin'
    if ($usernameToDelete === 'admin') {
        echo json_encode(['success' => false, 'message' => 'Cannot delete admin account.']);
        exit;
    }

    if (file_exists($file)) {
        $users = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $updatedUsers = array_filter($users, function($user) use ($usernameToDelete) {
            return !str_starts_with($user, $usernameToDelete . ",");
        });

        if (file_put_contents($file, implode("\n", $updatedUsers) . "\n")) {
            echo json_encode(['success' => true, 'message' => 'User deleted.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete user.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'File not found.']);
    }
}
?>
