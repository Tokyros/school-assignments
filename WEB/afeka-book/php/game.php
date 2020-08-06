<?php 
    require("./utils.php");

    $game = getGame();
    $player = getLoggedInUser();

    // If the game hasn't started redirect to lobby
    if (!isGameStarted($game)) {
        header("Location: ./index.php");
    }

    $playerKey = getPlayerKey($player, $game);
    $otherPlayerKey = getOtherPlayerKey($playerKey);
    
    $playerCardsLeft = count($game[$playerKey]['cards']);
    $otherPlayerCardsLeft = count($game[$otherPlayerKey]['cards']);

    $playerName = $game[$playerKey]['name'];
    $otherPlayerName = $game[$otherPlayerKey]['name'];

    $myCard = getPlayerVisibleCard($game, $playerKey);
    $otherPlayerCard = getPlayerVisibleCard($game, $otherPlayerKey);
?>
<!DOCTYPE html>
<html>
<?php
    require('./head.php');

    // Check if the game is over, but only do it after the previous round is over
    if (!$game['round-over'] && ($playerCardsLeft === 0 || $otherPlayerCardsLeft === 0)) {
        // TIE
        if ($playerCardsLeft === 0 && $otherPlayerCardsLeft === 0) {
            echo "<div class=\"game-over\">The game is over, the result is a TIE.</div>";
            echo "<a href=\"./finish-game.php\">Finish Game</a>";
            return;
        // current player wins
        } else if ($playerCardsLeft === 0) {
            echo "<div class=\"game-over\">The game is over, congratulations, you win!<br>🏆🏆🏆🏆🏆</div>";
            echo "<a href=\"./finish-game.php\">Finish Game</a>";
            return;
        // current player loses
        } else {
            echo "<div class=\"game-over\">The game is over, ".$otherPlayerName." wins, better luck next time!<br>😢😢😢😢😢</div>";
            echo "<a href=\"./finish-game.php\">Finish Game</a>";
            return;
        }
    }
?>
<body>
    <div class="player-scores">
        <div class="player1">
            <?php
                echo "Player <span class=\"name\">".$playerName."</span> has ".$playerCardsLeft." cards left";
            ?>
        </div>
        <div class="player2">
            <?php
                echo "Player <span class=\"name\">".$otherPlayerName."</span> has ".$otherPlayerCardsLeft." cards left";
            ?>
        </div>
    </div>
    
    <?php
        // Let the user choose a card
        if ($myCard === FALSE) {
            $output = "<form class=\"draw-card\" action=\"draw-card.php\">";
            $output .= "<input type=\"submit\" value=\"Draw Card\">";
            $output .= "<input type=\"hidden\" name=\"player\" value=\"".$playerKey."\">";
            $output .= "</form>";
            echo $output;
        } else {
            // User already chose a card, show him his card
            echo "<div class=\"current-card\">Your card is <span class=\"card-number\">".$myCard."</span></div>";
            // Check if other player already drew a card
            if ($otherPlayerCard) {
                echo "<div class=\"opponent-card\">Opponent's card is <span class=\"card-number\">".$otherPlayerCard."</span></div>";
                // Check round results
                if ($otherPlayerCard > $myCard) {
                    // Only update cards array once when the round is over
                    if (!$game['round-over']) {
                        array_push($game[$playerKey]['cards'], array_pop($game[$otherPlayerKey]['cards']));
                    }
                    echo "<div>You lose this round... 😢</div>";
                } else if ($otherPlayerCard === $myCard) {
                    if (!$game['round-over']) {
                        array_pop($game[$otherPlayerKey]['cards']);
                        array_pop($game[$playerKey]['cards']);
                    }
                    echo "<div class=\"round-results\">This round resulted in a TIE!</div>";
                } else {
                    if (!$game['round-over']) {
                        array_push($game[$otherPlayerKey]['cards'], array_pop($game[$playerKey]['cards']));
                    }
                    echo "<div>You win this round! 🏆</div>";
                }

                // Let players approve the results of the round, giving them a chance to see what happened
                if (!$game[$playerKey."-round-approved"]) {
                    echo "<div>Please approve the round's results - <a href=\"./next-round.php\">Next Round</a></div>";    
                } else if (!$game[$otherPlayerKey."-round-approved"]) {
                    echo "<div>Waiting for other player to confirm round <a href=\"./next-round.php\">refresh</a></div>";
                } else {
                    echo "<div>Round is over <a href=\"./next-round.php\">refresh</a></div>";
                }

                // Set the round as over
                $game['round-over'] = TRUE;
                setGame($game);
            } else {
                // Opponent has not yet drew a card, the current user should refresh until the other user drew
                echo "<div>Waiting for other player to draw a card</div>";
                echo "<div><a href=\"./game.php\">Check</a> to see if the other player played his turn<div>";
            }
        }
    ?>
</body>
</html>