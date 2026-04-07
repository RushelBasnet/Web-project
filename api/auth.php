<?php
header("Access-Control-Allow-Origin:*");//CORS
header("Content-Type:application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
require_once 'db.php';//Imports database connection
$action=$_POST['action']??'';
if($action=='register'){
    $name=trim($_POST['name']??'');
    $email=trim($_POST['email']??'');
    $password=$_POST['password']??'';

    if(!$name||!$email||!$password){
        echo json_encode(["success"=>false,"message"=>"All fields are required"]);
        exit;
    }
    if(!filter_var($email,FILTER_VALIDATE_EMAIL)){// a built-in PHP function that checks if email format is valid
        echo json_encode(["success" => false, "message" => "Invalid email address"]);
        exit;
    }
    if(strlen($password)<8){
        echo json_encode(["success" => false, "message" => "Password must be at least 8 characters"]);
        exit;
    }
    $stmt=$pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Email already registered"]);
        exit;
        }
        $hashed = password_hash($password, PASSWORD_BCRYPT);//built in PHP function that hashes the password
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $hashed]);
        $userId = $pdo->lastInsertId();
        echo json_encode([
        "success" => true,
        "message" => "Your Account has been created successfully",
        "user" => ["id" => $userId, "name" => $name, "email" => $email, "role" => "user"]
    ]);
}
//Now for login
elseif($action==='login'){
    $email=trim($_POST['email']??'');
    $password=$_POST['password']??'';
    if(!$email||!$password){
        echo json_encode(['email']??'');
        exit;
    }
     $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);//returns as associative array

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User does not exist"]);
        exit;
    }
    if (!password_verify($password, $user['password'])) {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Logged in successfully",
        "user" => ["id" => $user['id'], "name" => $user['name'], "email" => $user['email'], "role" => $user['role'] ?? 'user']
    ]);
}

else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>
