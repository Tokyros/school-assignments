<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Memory Paluza</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='ex.css'>
    <script src="https://code.jquery.com/jquery-3.5.1.js" integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous"></script>
</head>

<body>
    <div id="modal">
        <div id="game-status"></div>
    </div>
    <form action="login.php" method="POST">
        <input type="email" name="email">
        <input type="password" name="password">
        <input type="submit">
    </form>
    <div class="head">
        <h1>Memory Paluza - Awesome memory game!</h1>
    </div>
    <div class="game-setup">
        <h2>Game setup</h2>
        <div class="game-details-wrapper">
            <div class="player-name-input-wrapper">
                <label for="player1-name">Enter player 1 name:</label>
                <input id="player1-name-input" value="Player 1" type="text" name="player1-name">
            </div>
            <div class="player-name-input-wrapper">
                <label for="player2-name">Enter player 2 name: </label>
                <input id="player2-name-input" value="Player 2" type="text" name="player2-name">
            </div>
            <div class="board-size-input-wrapper">
                <label for="board-size">Enter board size: </label>
                <input id="board-size" name="board-size" value="3" type="number" min="3">
            </div>
            <button onclick="startGame($('#board-size').val(), $('#player1-name-input').val(), $('#player2-name-input').val())">Start</button>
        </div>
        <div class="leaderboard">
            
        </div>
    </div>

    <div class="score-board">

    </div>
    <div class="current-player" hidden>
        
    </div>
    <div class="game-board">

    </div>
    <script src='ex.js'></script>
</body>

</html>