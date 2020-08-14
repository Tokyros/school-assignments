<?php
    require("utils.php");

    // We track all the game information inside this file
    // Here we make sure to extend the data already in the file whenever a user logs in
    $game_status = getGame();
    if (!$game_status) {
        $game_status = [];
    }

    $auth_cookie_name = "_FAC";

    // Login
    $url = 'http://localhost/api/auth/login';
    $data = array('email' => $_POST['email'], 'password' => $_POST['password']);
    $result = http($url, 'POST', $data);
    
    // Show an error if login has failed
    if (!$result) {
        echo "
            <div>
                <h1>
                    Login attempt failed
                </h1>
                <a href=\"/\">Try again</a>
            </div>
        ";
        return;
    }

    // Get authentication token from login result and set it on the user's browser
    // This way we can identify him in other pages
    $cookies = $result['cookies'];
    setcookie($auth_cookie_name, $cookies[$auth_cookie_name]);
    $_COOKIE[$auth_cookie_name] = $cookies[$auth_cookie_name];

    // Get info about logged in user via cookie
    $loggedInUser = getLoggedInUser();
    
    // Get the current players of the game, so we can be sure the user logging in is one of them
    $game = http("http://localhost/api/game", "GET", array(), array())['result'];
    $player1 = json_decode($game, true)['player1'];
    $player2 = json_decode($game, true)['player2'];

    if (!resetGameIfPlayersChanged($game_status)) {
        header("Location: ./index.php");
    }

    // Check that the user is one of the users invited from the FaceAfkea app
    if ($loggedInUser['id'] === $player1['id']) {
        $game_status['player1'] = ["id" => $loggedInUser["id"], "cards" => [3, 4, 3, 5], "name" => $loggedInUser["name"]];
    } else if ($loggedInUser['id'] === $player2['id']) {
        $game_status['player2'] = ["id" => $loggedInUser["id"], "cards" => [2, 3, 1, 3], "name" => $loggedInUser["name"]];
    } else {
        // If the user is not one of the invited users, show him an error message
        echo "<div>You are currently not invited to a game</div>";
        echo "<div>Only invited users can play...</div>";
        echo "<a href=\"/\">Back to login screen</a>";
        return;
    }

    // Store the game status in a file
    setGame($game_status);

    if (isGameStarted($game_status)) {
        // If the other player already logged in, redirect user to the game
        header("Location: ./game.php");
    } else {
        // If the other player did not log in yet, go to the waitroom
        header("Location: ./waitroom.php");
    }
?>