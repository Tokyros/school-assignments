<!DOCTYPE html>
<html>

<?php
    // Use header from shared file to make it easier to share common properties
    require('./head.php');
?>

<body>
    <div class="head">
        <h1>War game - Log in with your FaceAfeka user!</h1>
    </div>
    <!-- Login form for the players -->
    <div class="game-setup">
        <form id="player1" class="login-form" action="./login.php" method="POST">
            <label for="email">Email:</label>
            <input type="email" name="email">
            <label for="password">Password:</label>
            <input type="password" name="password">
            <input class="submit-button" type="submit">
        </form>
    </div>
</body>
</html>
