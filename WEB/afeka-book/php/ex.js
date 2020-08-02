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
                    if (currentPlayer.name !== playerOne) {
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

// Leaderboard?
if (window.openDatabase) {
    // db = openDatabase("memory-game", "0.1", "Memory game database", 1024 * 1024);
    // initializeDatabase().then(initializeGameSetupGUI);
    initializeGameSetupGUI();
} else {
    alert("WebSQL is not supported by your browser!");
}

function initializeGameSetupGUI(gameConfig) {
    $(".game-setup").css('display', 'flex');
}

// Leaderboard?
function persistGameConfig(gameConfig) {
    db.transaction((t) => {
        t.executeSql(`UPDATE CONFIG SET gridSize = ${gameConfig.gridSize}, player1 = '${gameConfig.player1}', player2 = '${gameConfig.player2}' WHERE id = 1;`)
    });
}

// Leaderboard?
function addGameResult(gameResult) {
    db.transaction((t) => {
        t.executeSql(`INSERT INTO GAMES (player1, player2, winner) VALUES ("${gameResult.player1}", "${gameResult.player2}", "${gameResult.winner}")`)
    })
}

// Leaderboard?
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

// Leaderboard?
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

// Leaderboard?
function initializeGame(t) {
    return new Promise((res) => {
        t.executeSql("CREATE TABLE IF NOT EXISTS GAMES (player1, player2, winner)");
        updateLeaderboard().then(res);
    })
}

// Leaderboard?
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

function shuffle(arr) {
    return arr.sort((a, b) => 0.5 - Math.random());
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
        this.playerNameElement.text(`${this.playerName} Cards Remaining: ${this.deck.length}`);
    }
}

class Modal {
    constructor() {
        $('#modal').click(() => this.hide());
        $('#game-status').click((e) => e.stopPropagation());
        $('#replay-button').click(() => {
            Player.playerCount = 0;
            this.hide();
            startGame();
        });
        $('#end-button').click(() => location.reload());
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
        this.winner = null;
        this.player1 = player1;
        this.player2 = player2;
        this.player1Deck = new Deck(player1, this.onCardPlayed);
        this.player2Deck = new Deck(player2, this.onCardPlayed);
        this.warInterval = null;
        this.warCards = [];
        this.modal = new Modal();
    }

    onCardPlayed = (player) => {
        let debounce = null;
        if ((this.player1.chosenCard && this.player2.chosenCard) || this.winner) {
            return;
        }
        if (player.playerNumber === 1 && !this.player1.chosenCard) {
            this.player1.playCard();
            $('.pl1').text(this.player1.chosenCard);
        } else if (player.playerNumber === 2 && !this.player2.chosenCard) {
            this.player2.playCard();
            $('.pl2').text(this.player2.chosenCard);
        }
        if (this.player1.chosenCard && this.player2.chosenCard) {
            let addCardPromise;
            if (this.player1.chosenCard > this.player2.chosenCard) {
                addCardPromise = new Promise((res) => res(() => this.player2.addCards([this.player1.chosenCard, this.player2.chosenCard])));
            } else if (this.player1.chosenCard < this.player2.chosenCard) {
                addCardPromise = new Promise((res) => res(() => this.player1.addCards([this.player1.chosenCard, this.player2.chosenCard])));
            } else {
                setTimeout(() => {
                    this.playWar([this.player1.chosenCard, this.player2.chosenCard]);
                }, 300);
                return;
            }
            setTimeout(() => {
                this.clearFields();
                addCardPromise.then((addCards) => {
                    addCards();
                    this.player1.chosenCard = null;
                    this.player2.chosenCard = null;
                    this.checkForWinner();
                });
            }, 700);
        }
    }

    playWar(initialCards) {
        let i = 0;
        this.warCards.push(...initialCards);
        this.warInterval = setInterval(() => {
            $('.pl1').text('X');
            $('.pl2').text('X');
            this.player1.playCard();
            this.player2.playCard();
            this.warCards.push(this.player1.chosenCard, this.player2.chosenCard);
            setTimeout(() => {
                if (i === 2) {
                    $('.pl1').text(`${this.player1.chosenCard}`);
                    $('.pl2').text(`${this.player2.chosenCard}`);
                    if (this.player1.chosenCard > this.player2.chosenCard) {
                        this.player2.addCards(this.warCards);
                        this.warCards = [];
                    } else if (this.player1.chosenCard < this.player2.chosenCard) {
                        this.player1.addCards(this.warCards);
                        this.warCards = [];
                    } else {
                        setTimeout(() => this.playWar([this.player1.chosenCard, this.player2.chosenCard]), 300);
                    }
                    setTimeout(() => {
                        this.clearFields();
                        this.player2.chosenCard = null;
                        this.player1.chosenCard = null;
                    }, 700);
                    clearInterval(this.warInterval);
                } else {
                    this.clearFields();
                }
                i++;
            }, 300);
        }, 600);
    }

    clearFields() {
        $('.pl1').text('');
        $('.pl2').text('');
    }

    checkForWinner() {
        if (this.player2.deck.length === 0) {
            this.winner = this.player2;
            this.renderEndGame();
        } else if (this.player1.deck.length === 0) {
            this.winner = this.player1;
            this.renderEndGame();
        }
    }

    async renderEndGame() {
        await this.modal.show();
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
