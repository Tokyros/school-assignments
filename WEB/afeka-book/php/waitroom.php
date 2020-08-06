<?php 
    require("./utils.php");

    $loggedInUser = getLoggedInUser();
    $game = getGame();

    // If a game has not started, redirect back to lobby
    if (!$game) {
        header("Location: ./index.php");
        return;
    }

    $playerKey = getPlayerKey($loggedInUser, $game);
    $gameStarted = isGameStarted($game);
    if ($gameStarted) {
        if ($playerKey !== FALSE) {
            // Game started, going to game
            header("Location: ./game.php");
            return;
        } else {
            // Game started but player is not one of the registered players
            header("Location: ./index.php");
            return;
        }
    }
?>

<?php require('./head.php'); ?>

<div class="waitroom">
    <h1>Hi, <?php echo $loggedInUser['name'] ?> please wait for the other player to join</h1>
    <div>You will be redirected to the game once the other user has joined</div>
    <script>
        setInterval(() => {
            // reload the page every second to check if the other user logged in
            location.reload();
        }, 1000);
    </script>
</div>