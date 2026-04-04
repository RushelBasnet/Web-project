<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$action = $_POST['action'] ?? '';

if($action === 'send_message') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = $_POST['phone'] ?? '';
    $message = trim($_POST['message'] ?? '');
    $property_id = !empty($_POST['property_id']) ? (int)$_POST['property_id'] : null;
    $property_name = $_POST['property_name'] ?? '';

    if(!$name || !$email || !$message) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO messages(name, email, phone, message, property_id, property_name) VALUES (?,?,?,?,?,?)");
    $stmt->execute([$name, $email, $phone, $message, $property_id, $property_name]);
    echo json_encode(["success" => true, "message" => "Message sent successfully"]);
}
elseif($action === 'get_messages') {
    $stmt = $pdo->prepare("SELECT * FROM messages");
    $stmt->execute();
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "messages" => $messages]);
}
else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>