<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $file = '../database/class_scores.txt';

    $classes = [];
    if (file_exists($file)) {
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $parts = explode(',', $line);
            $classes[] = $parts[0];
        }
    }

    $resetData = array_map(fn($class) => "$class,100", $classes);
    $content = implode("\n", $resetData) . "\n";

    if (file_put_contents($file, $content)) {
        echo json_encode(['success' => true, 'message' => 'Scores reset to 100.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to reset scores.']);
    }
}
?>
