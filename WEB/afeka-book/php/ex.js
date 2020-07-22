let db;
let playerOne;
let playerTwo;
const fullDeck = [
 2,
 2,
 2,
 2,
 3,
 3,
 3,
 3,
 4,
 4,
 4,
 4,
 5,
 5,
 5,
 5,
 6,
 6,
 6,
 6,
 7,
 7,
 7,
 7,
 8,
 8,
 8,
 8,
 9,
 9,
 9,
 9,
 10,
 10,
 10,
 10,
 11,
 11,
 11,
 11,
 12,
 12,
 12,
 12,
 13,
 13,
 13,
 13,
 14,
 14,
 14,
 14,
 15,
 15
]

function setForm(player) {
    player.submit((event) => {
        console.log('here')
        event.preventDefault();

        $.ajax({
            type: "POST",
            url: player.attr('action'),
            data: {
                email: player.find('input[type="email"]').val(),
                password: player.find('input[type="password"]').val(),
            },
            dataType: 'json',
            encode: true,
            success: (data) => { 
                if (data) {
                    console.log(data);
                    const currentPlayer = JSON.parse(data)
                    if (true) {
                        player.replaceWith(`<h3 class="player-ready">${currentPlayer.name} is Ready</h3>`);
                        if (!playerOne && !playerTwo) {
                            playerOne = currentPlayer.name;
                        } else if (playerOne) {
                            playerTwo = currentPlayer.name;
                        } else if (playerTwo) {
                            playerOne = currentPlayer.name;
                        }
                    }
                }
            },
            error: ( xhr, status, err ) => {
                alert( "Sorry, there was a problem!" );
                console.log( "Error: " + err );
                console.log( "Status: " + status );
                console.dir( xhr );
            }
        });
    });
}

setForm($('#player1'));
setForm($('#player2'));

if (window.openDatabase) {
    db = openDatabase("memory-game", "0.1", "Memory game database", 1024 * 1024);
    initializeDatabase(db).then(initializeGameSetupGUI);
} else {
    alert("WebSQL is not supported by your browser!");
}

function persistGameConfig(gameConfig) {
    db.transaction((t) => {
        t.executeSql(`UPDATE CONFIG SET gridSize = ${gameConfig.gridSize}, player1 = '${gameConfig.player1}', player2 = '${gameConfig.player2}' WHERE id = 1;`)
    });
}

function addGameResult(gameResult) {
    db.transaction((t) => {
        t.executeSql(`INSERT INTO GAMES (player1, player2, winner) VALUES ("${gameResult.player1}", "${gameResult.player2}", "${gameResult.winner}")`)
    })
}

function initializeConfig(t) {
    return new Promise((res) => {
        t.executeSql("CREATE TABLE IF NOT EXISTS CONFIG (id, gridSize, player1, player2)");
        t.executeSql("SELECT * FROM CONFIG", [], (t, config) => {
            if (!config.rows.length) {
                t.executeSql('INSERT INTO CONFIG (id, gridSize, player1, player2) VALUES (1, 3, "Player 1", "Player 2")');
                res({gridSize: 3, player1: "Player 1", player2: "Player 2"});
            } else {
                res(config.rows[0])
            }
        });
    })
}

function updateLeaderboard(games) {
    return new Promise((res) => {
        db.transaction((t) => {
            t.executeSql("SELECT * FROM GAMES", [], (t, games) => {
                if (games.rows.length) {
                    const leaderboard = Array.from(games.rows).reduce((leaderBoard, game) => {
                        const winner = game.winner;
                        return {
                            ...leaderBoard,
                            [winner]: leaderBoard[winner] ? leaderBoard[winner] + 1 : 1
                        }
                    }, {});
                    const players = Object.keys(leaderboard);
                    const playersSorted = players.sort((p1, p2) => leaderboard[p2] - leaderboard[p1]);
                    const playerRows = playersSorted.map((player) => {
                        return $(`<div class="leaderboard-cell">${player} - ${leaderboard[player]} wins</div>`);
                    })
                    $('.leaderboard').empty();
                    $('.leaderboard').append(`<h1>Leaderboard</h1>`);
                    $(".leaderboard").append(playerRows);
                }
                res();
            })
        })
    })
}

function initializeGame(t) {
    return new Promise((res) => {
        t.executeSql("CREATE TABLE IF NOT EXISTS GAMES (player1, player2, winner)");
        updateLeaderboard().then(res);
    })
}

async function initializeDatabase() {
    return new Promise((res) => {
        db.transaction(function (t) {
            const configPromise = initializeConfig(t);
            const gamePromise = initializeGame(t);
            Promise.all([configPromise, gamePromise]).then(([config]) => {
                res(config);
            });
        });
    })
}

function initializeGameSetupGUI(gameConfig) {
    console.log(gameConfig);
    $("#player1-name-input").val(gameConfig.player1);
    $("#player2-name-input").val(gameConfig.player2);
    $("#board-size").val(gameConfig.gridSize);
    $(".game-setup").css('display', 'flex');
}

function shuffle(arr) {
    return arr.sort(function (a, b) { return 0.5 - Math.random() })
}

function createBoard(boardSize) {
    let currentCard = 1;
    const cardCount = boardSize * boardSize;
    const maxCardValue = Math.floor(cardCount / 2);
    const board = new Array(cardCount).fill('').map((_, i) => {
        if (currentCard > maxCardValue) {
            return -1;
        }
        if (i % 2 === 1) {
            return currentCard++;
        } else {
            return currentCard
        }
    });
    return shuffle(board);
}

class Player {
    static playerCount = 0;

    constructor(playerName, deck) {
        this.playerName = playerName;
        this.playerNumber = ++Player.playerCount;
        this.deck = deck;
        this.initializeElement();
    }

    initializeElement() {
        this.element = $('<div></div>');
        this.element.attr('id', this.playerName);
        this.element.addClass('player');
        
        this.playerNameElement = $('<div></div>');
        this.playerNameElement.addClass(`name-${this.playerNumber}`);
        this.playerNameElement.addClass(`player-score`);
        this.updateScore();

        this.element.append(this.playerNameElement);
    }

    addCards(cards) {
        this.deck = [...this.deck, ...cards];
        this.updateScore();
    }

    playCard() {
        this.chosenCard = this.deck.shift();
        this.updateScore();
    }

    updateScore() {
        this.playerNameElement.text(`${this.playerName} score: ${this.deck.length}`);
    }
}

class Board {
    constructor(boardSize, onCellFlipped, getCurrentPlayer) {
        this.boardSize = boardSize;
        this.pendingFlippedCellId = null;
        this.isLocked = false;
        this.cells = createBoard(boardSize).map((value, i) => new Cell(i, value, Math.floor(i / boardSize)))
        this.cells.forEach((cell) => this.registerOnCellClick(cell, onCellFlipped, getCurrentPlayer))
    }

    registerOnCellClick(cell, onCellFlipped, getCurrentPlayer) {
        cell.registerOnClick(async () => {
            if (!cell.isCellSuccessful() && !this.isLocked && cell.value !== -1) {
                const result = await this.flipCell(cell.id, getCurrentPlayer());
                onCellFlipped(result);
            }
        })
    }

    isGameOver() {
        return this.cells.every((cell) => cell.value === -1 || cell.isCellSuccessful())
    }

    getCell(cellId) {
        return this.cells[cellId];
    }

    lock() {
        this.isLocked = true;
    }

    unlock() {
        this.isLocked = false;
    }

    flipCell(cellId, currentPlayer) {
        const cellToFlip = this.getCell(cellId);

        if (this.pendingFlippedCellId === null) {
            cellToFlip.markCellAsPending();
            this.pendingFlippedCellId = cellId;
            return Promise.resolve('pending');
        }

        if (this.pendingFlippedCellId === cellToFlip.id) {
            return Promise.resolve('neutral');
        }

        this.lock();
        return new Promise((res) => {
            cellToFlip.markCellAsPending();
            const pendingFlippedCell = this.getCell(this.pendingFlippedCellId);
            this.pendingFlippedCellId = null;
            // Delay the result for one second, 
            setTimeout(() => {
                const result = this.checkCellMatch(cellToFlip, pendingFlippedCell, currentPlayer);
                res(result);
                setTimeout(() => {
                    this.unlock();
                }, 650);
            }, 1000)
        });
    }

    checkCellMatch(cellA, cellB, currentPlayer) {
        if (cellA.value === cellB.value) {
            cellA.markCellAsSuccess(currentPlayer.playerNumber);
            cellB.markCellAsSuccess(currentPlayer.playerNumber);
            return 'success';
        } else {
            cellA.markCellAsFailure();
            cellB.markCellAsFailure();
            return 'failure';
        }
    }

    render() {
        return this.cells.map((cell) => cell.element);
    }
}

class Cell {
    constructor(id, value, row) {
        this.id = id;
        this.value = value;
        this.row = row;
        this.initializeElement();
    }

    initializeElement() {
        this.element = $('<div></div>');
        this.element.attr('id', this.id);
        this.element.css('grid-row', this.row);
        this.clearCellStatus();
        this.element.append(`<img src="https://picsum.photos/id/${1057 + this.value}/140/140">`);
    }

    clearCellStatus() {
        this.element.removeClass();
        this.element.addClass('cell');
        if (this.value === -1) {
            this.element.addClass('unpaired-card')
        }
    }

    markCellAsPending() {
        this.clearCellStatus();
        this.element.addClass('pending');
    }

    markCellAsSuccess(playerNumber) {
        this.clearCellStatus();
        this.element.addClass('success');
        this.element.css('background-color', playerNumber === 1 ? 'blue' : 'red');
    }

    markCellAsFailure() {
        setTimeout(() => this.clearCellStatus(), 500);
    }

    isCellSuccessful() {
        return this.element.hasClass('success');
    }

    registerOnClick(onClick) {
        this.element.click(onClick);
    }
}

class Modal {
    constructor() {
        $('#modal').click(() => this.hide());
        $('#game-status').click((e) => e.stopPropagation());
    }

    hide() {
        $('#modal').css('display', 'none');
        this.resolveClosePromise();
    }

    show() {
        const closePromise = new Promise((res) => {
            this.resolveClosePromise = res;
        })
        $('#modal').css('display', 'flex');
        return closePromise;
    }

    setText(text) {
        $('#game-status').text(text);
    }
}

class Game {
    constructor(player1, player2) {
        this.war = new War(player1, player2);
        this.player1 = player1;
        this.player2 = player2;
        this.setCurrentPlayer(player1);
        this.modal = new Modal();
    }

    setCurrentPlayer(player) {
        this.currentPlayer = player;
        $('.current-player').text(`Current player: ${this.currentPlayer.playerName}`);
    }

    getNextPlayer() {
        return this.currentPlayer.playerName === this.player1.playerName ? this.player2 : this.player1
    }

    onFlipCell(result) {
        switch (result) {
            case 'success':
                this.incrementPlayerScore(this.currentPlayer)
                break;
            case 'failure':
                this.setCurrentPlayer(this.getNextPlayer());
                break;
        }

        if (this.board.isGameOver()) {
            this.modal.show().then(showGameSetup);
            if (this.player1.score === this.player2.score) {
                this.modal.setText("It's a tie! click anywhere to play again")
            } else {
                const winner = this.player1.score > this.player2.score ? this.player1.playerName : this.player2.playerName;
                this.modal.setText(`${winner} wins! click anywhere to play again`);
                addGameResult({player1: this.player1.playerName, player2: this.player2.playerName, winner});
            }
        }
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    incrementPlayerScore(player) {
        player.incrementScore();
    }

    render() {
        
        $('.score-board').append(
            this.player1.element,
            this.player2.element,
        )
        $('.game-board').html($(this.war.render()));
    }
}

class Deck {
    constructor(player, onCardPlayed) {
        this.player = player;
        this.onCardPlayed = onCardPlayed;
    }

    render() {
        this.element = $('<div></div>');
        this.element.addClass('deck');
        this.element.text(this.player.playerName);
        this.element.click(() => this.onCardPlayed(this.player));
        return this.element;
    }
}

class War {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Deck = new Deck(player1, this.onCardPlayed);
        this.player2Deck = new Deck(player2, this.onCardPlayed);
    }

    onCardPlayed = (player) => {
        if (player.playerNumber === 1) {
            $('.pl1').text(this.player1.deck[0]);
            this.player1.playCard();
        } else {
            $('.pl2').text(this.player2.deck[0]);
            this.player2.playCard();
        }
        if (this.player1.chosenCard && this.player2.chosenCard) {
            if (this.player1.chosenCard > this.player2.chosenCard) {
                this.player2.addCards([this.player1.chosenCard, this.player2.chosenCard]);
            } else if (this.player1.chosenCard < this.player2.chosenCard) {
                this.player1.addCards([this.player1.chosenCard, this.player2.chosenCard]);
            } else {
                console.log('WAR');
            }
            this.player1.chosenCard = null;
            this.player2.chosenCard = null;
            setTimeout(() => this.clearFields(), 700);
        }
    }

    clearFields() {
        $('.pl1').text('');
        $('.pl2').text('');
    }

    renderField() {
        const field = $('<div></div>');
        field.addClass('decks');
        field.append('<div class="deck pl1"></div>');
        field.append('<div class="deck pl2"></div>');
        return field;
    }

    renderDecks() {
        const decks = $('<div></div>');
        decks.addClass('decks');
        decks.append(this.player1Deck.render());
        decks.append(this.player2Deck.render());
        return decks;
    }

    render() {
        this.element = $('<div></div>');
        this.element.addClass('container');
        this.element.append(this.renderField());
        this.element.append(this.renderDecks());
        return this.element;
    }
}

function showGame() {
    $(".score-board").show();
    $(".game-board").show();
    $(".score-board").empty();
    $(".game-board").empty();
}

function showGameSetup() {
    updateLeaderboard()
    $(".game-setup").show()
    $('.current-player').hide()
    $(".score-board").hide();
    $(".game-board").hide();
}

function startGame() {
    const deck = shuffle(fullDeck);
    const player1Deck = deck.slice(0, deck.length / 2);
    const player2Deck = deck.slice(deck.length / 2);
    if (playerOne && playerTwo) {
        showGame();
        const game = new Game(new Player(playerOne, player1Deck), new Player(playerTwo, player2Deck));
        game.render();
        $(".game-setup").hide()
        $('.current-player').show()
    } else {
        alert('All players must be ready!')
    }
}
