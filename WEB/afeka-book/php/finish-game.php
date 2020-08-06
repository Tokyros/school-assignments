<?php
    require("./utils.php");

    $loggedInUser = getLoggedInUser();
    $game = getGame();
    $playerKey = getPlayerKey($loggedInUser, $game);
    $otherPlayerKey = getOtherPlayerKey($playerKey);

    $game[$playerKey."-done"] = TRUE;
    setGame($game);

    // Once both players confirmed finishing the game, cleanup the game file
    if ($game[$otherPlayerKey."-done"]) {
        unlink("./game.json");
    }

    header("Location: ./index.php");
?>