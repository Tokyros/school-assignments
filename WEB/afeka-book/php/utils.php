<?php

    // Utility function to execute HTTP commands to FaceAfeka server
    function http($url, $method, $data = array(), $cookies = array()) {
        $options = array(
            'http' => array(
                'method' => $method,
            )
        );
        if (count($data)) {
            $options['http']['content'] = http_build_query($data);
        }
        if (count($cookies)) {
            $cookie_string = "Cookie: ";
            foreach ($cookies as $name => $value) {
                $cookie_string = $cookie_string . $name . "=" . $value . ";";
            }
            $options['http']['header'] = $cookie_string;
        }
        $context = stream_context_create($options);
        try {
            $result = @file_get_contents($url, false, $context);
            if ($http_response_header[0] !== "HTTP/1.1 200 OK") {
                throw new Exception("Hey");
            }

            $cookies = array();

            foreach ($http_response_header as $hdr) {
                if (preg_match('/^Set-Cookie:\s*([^;]+)/', $hdr, $matches)) {
                    parse_str($matches[1], $tmp);
                    $cookies += $tmp;
                }
            }

            return array('result' => $result, 'cookies' => $cookies);
        } catch (Exception $e) {
            return FALSE;
        }
    }

    // Get logged in user via auth cookie from FaceAfeka server
    function getLoggedInUser() {
        $auth_cookie_name = "_FAC";

        $url = 'http://localhost/api/auth/me';
        
        $result = http($url, "GET", array(), array($auth_cookie_name => $_COOKIE[$auth_cookie_name]));
        return json_decode($result['result'], true);
    }
    

    // Get the content of the game file, or redirect to lobby if it doesn't exist
    function getGame() {
        if(file_exists("./game.json")) {
            return json_decode(file_get_contents("./game.json"), true);
        } else {
            header("Location: ./index.php");
            return FALSE;
        }
        
    }

    // Save game stats to file
    function setGame($game) {
        file_put_contents("./game.json", json_encode($game));
    }

    // Get a randomly shuffled deck
    function getShuffledDeck($size) {
        $cards = array_slice(array_merge(range(1,13), range(1,13)), 0, $size);
   
        shuffle($cards);
        return $cards;
    }

    // We consider the game started once both players are in
    function isGameStarted($game) {
        return ($game['player1'] && $game['player2']);
    }

    function getPlayerKey($player, $game) {
        if ($player['id'] === $game['player1']['id']) {
            return "player1";
        } else if ($player['id'] === $game['player2']['id']) {
            return "player2";
        } else {
            return FALSE;
        }
    }

    // Get the current drawn card for a specific user
    function getPlayerVisibleCard($game, $playerKey) {
        if (array_key_exists($playerKey."-card", $game) && $game[$playerKey."-card"] !== null) {
            return $game[$playerKey."-card"];
        } else {
            return FALSE;
        }
    }

    function getOtherPlayerKey($playerKey) {
        return $playerKey === "player1" ? "player2" : "player1";
    }

    function resetGameIfPlayersChanged($game) {
        // Get the current players of the game, so we can be sure the user logging in is one of them
        $game_invitations = http("http://localhost/api/game", "GET", array(), array())['result'];
        $player1 = json_decode($game_invitations, true)['player1'];
        $player2 = json_decode($game_invitations, true)['player2'];

        // Clear old game if exists
        if (isGameStarted($game) && (!getPlayerKey($player1, $game) || !getPlayerKey($player2, $game))) {
            resetGame();
            $game_status = [];
            return FALSE;
        } else {
            return TRUE;
        }
    }

    function resetGame() {
        unlink("./game.json");
    }
?>