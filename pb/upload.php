<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['json_data']) && isset($_POST['filename'])) {
        $upload_dir = 'json/';
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);
        $file_path = $upload_dir . $_POST['filename'] . ".json";
        file_put_contents($file_path, $_POST['json_data']);
        
        // Set the JSON content type header
        header('Content-Type: application/json');
        echo json_encode(['message' => 'JSON file uploaded successfully']);
    } else {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Missing JSON data or filename']);
    }
} else {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method not allowed']);
}
?>