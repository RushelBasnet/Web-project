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
    $sender_id = !empty($_POST['sender_id']) ? (int)$_POST['sender_id'] : null;
    $receiver_id = !empty($_POST['receiver_id']) ? (int)$_POST['receiver_id'] : null;

    if(!$name || !$email || !$message) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO messages(name, email, phone, message, property_id, property_name, sender_id, receiver_id) VALUES (?,?,?,?,?,?,?,?)");
    $stmt->execute([$name, $email, $phone, $message, $property_id, $property_name, $sender_id, $receiver_id]);
    echo json_encode(["success" => true, "message" => "Message sent successfully"]);
}
elseif($action === 'send_reply') {
    $sender_id = (int)($_POST['sender_id'] ?? 0);
    $receiver_id = (int)($_POST['receiver_id'] ?? 0);
    $property_id = !empty($_POST['property_id']) ? (int)$_POST['property_id'] : null;
    $property_name = $_POST['property_name'] ?? '';
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if(!$sender_id || !$receiver_id || !$message) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO messages(name, email, message, property_id, property_name, sender_id, receiver_id) VALUES (?,?,?,?,?,?,?)");
    $stmt->execute([$name, $email, $message, $property_id, $property_name, $sender_id, $receiver_id]);
    echo json_encode(["success" => true, "message" => "Reply sent"]);
}
elseif($action === 'get_conversations') {
    $user_id = (int)($_POST['user_id'] ?? 0);
    if(!$user_id) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }
    // Get the latest message per conversation (grouped by other_user + property)
    $stmt = $pdo->prepare("
        SELECT DISTINCT ON (other_id, property_id) *,
            CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS other_id
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        ORDER BY other_id, property_id, created_at DESC
    ");
    $stmt->execute([$user_id, $user_id, $user_id]);
    $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "conversations" => $conversations]);
}
elseif($action === 'get_thread') {
    $user_id = (int)($_POST['user_id'] ?? 0);
    $other_id = (int)($_POST['other_id'] ?? 0);
    $property_id = !empty($_POST['property_id']) ? (int)$_POST['property_id'] : null;

    if(!$user_id || !$other_id) {
        echo json_encode(["success" => false, "message" => "Missing fields"]);
        exit;
    }

    if($property_id) {
        $stmt = $pdo->prepare("
            SELECT * FROM messages
            WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
            AND property_id = ?
            ORDER BY created_at ASC
        ");
        $stmt->execute([$user_id, $other_id, $other_id, $user_id, $property_id]);
    } else {
        $stmt = $pdo->prepare("
            SELECT * FROM messages
            WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
            ORDER BY created_at ASC
        ");
        $stmt->execute([$user_id, $other_id, $other_id, $user_id]);
    }

    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "messages" => $messages]);
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