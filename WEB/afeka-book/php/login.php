<?php

    require("http_client.php");

    $auth_cookie_name = "ExpressGeneratorTs";

    $url = 'http://localhost:3000/api/auth/login';
    $data = array('email' => $_POST['email'], 'password' => $_POST['password']);

    $result = http($url, 'POST', $data);

    $cookies = $result['cookies'];

    setcookie($auth_cookie_name, $cookies[$auth_cookie_name]);
    $_COOKIE[$auth_cookie_name] = $cookies[$auth_cookie_name];

    $url = 'http://localhost:3000/api/auth/me';
    
    $result = http($url, "GET", array(), array($auth_cookie_name => $_COOKIE[$auth_cookie_name]));
    if ($result === FALSE) { 
        echo "OH NO";
    } else {
        print_r(json_encode($result['result']));
    }    
?>