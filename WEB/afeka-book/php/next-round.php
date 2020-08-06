<?php
    require("./utils.php");

    $loggedInUser = getLoggedInUser();
    $game = getGame();
    $playerKey = getPlayerKey($loggedInUser, $game);
    $otherPlayerKey = getOtherPlayerKey($playerKey);

    // approve round
    $game[$playerKey."-round-approved"] = TRUE;
    setGame($game);

    // reset round
    if ($game[$otherPlayerKey."-round-approved"]) {
        $game[$playerKey."-card"] = null;
        $game[$otherPlayerKey."-card"] = null;
        $game['round-over'] = FALSE;
        setGame($game);
    }

    header("Location: ./game.php");
?>