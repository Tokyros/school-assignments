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
    <div class="head">
        <h1>Memory Paluza - Awesome memory game!</h1>
    </div>
    <div class="game-setup">
        <h2>Game setup</h2>
        <div class="game-details-wrapper">
            <div class="forms">
                <form id="player1" class="login-form" action="login.php" method="POST">
                    <label for="email">Player 1 Email:</label>
                    <input type="email" name="email">
                    <label for="password">Player 1 Password:</label>
                    <input type="password" name="password">
                    <input class="submit-button" type="submit">
                </form>
                <form id="player2" class="login-form" action="login.php" method="POST">
                    <label for="email">Player 2 Email:</label>
                    <input type="email" name="email">
                    <label for="password">Player 2 Password:</label>
                    <input type="password" name="password">
                    <input class="submit-button" type="submit">
                </form>
            </div>
            <button onclick="startGame()">Start</button>
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