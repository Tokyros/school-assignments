<?php
    require("utils.php");
    $loggedInUser = getLoggedInUser();
    $game = getGame();
    $playerKey = getPlayerKey($loggedInUser, $game);

    $cards = $game[$playerKey]['cards'];
    $cardsCount = count($cards);
    // Draw the next card in the deck
    $game[$_GET['player']."-card"] = array_pop($cards);
    $game[$playerKey]['cards'] = $cards;

    // Save the card you drew to the file
    setGame($game);
    header("Location: ./game.php");
?>