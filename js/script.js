/*
    Jonathan Kang
    Wenjin Zhou
    COMP4610 Homework 5
    script.js

    This is the main code for the JavaScript. In particular there are two separate functions that are responsible for making the draggable boxes
    in order for it to hold in the tiles. One is for generating one box and another is for generating all 15 boxes that are gonna be used on top
    of the png board. Unfortunately at this moment they do not work.
*/

$(document).ready(function() {
    var tiles = $('#tiles');
    var scrabbleBoard = $('#scrabble-board img');
    var tileRack = [];
    var pieces = [];

    $.getJSON("pieces.json", function(data) {
        pieces = data.pieces;
        console.log('Pieces loaded:', pieces);
    });

    // Function to draw random tiles
    function drawTiles() {
        tileRack = [];
        tiles.empty(); // Clear the existing tiles
        for (var i = 0; i < 7; i++) {
            var letter = getRandomTile();
            if (letter) {
                tileRack.push(letter);
                var imageTile = (letter === '_') ? 'tiles/Scrabble_Tile_Blank.jpg' : 'tiles/Scrabble_Tile_' + letter + '.jpg';
                var tile = $('<div class="tile"></div>').css('background-image', 'url(' + imageTile + ')').attr('data-letter', letter);
                tiles.append(tile);
            }
        }
        makeTilesDraggable();
    }

    // Function to get a random tile from the ScrabbleTiles array
    function getRandomTile() {
        var letters = Object.keys(ScrabbleTiles);
        var letter = letters[Math.floor(Math.random() * letters.length)];
        if (ScrabbleTiles[letter]["number-remaining"] > 0) {
            ScrabbleTiles[letter]["number-remaining"]--;
            return letter;
        } else {
            return getRandomTile(); // Recursively get another tile if the current one is not available
        }
    }

    // Make tiles draggable
    function makeTilesDraggable() {
        $('.tile').draggable({
            revert: "invalid",
            start: function(event, ui) {
                $(this).css("z-index", 100);
            },
            stop: function(event, ui) {
                var tile = $(this);
                var isDroppedOnBoard = tile.data('droppedOnBoard');
                if (!isDroppedOnBoard) {
                    tile.animate({
                        left: tile.data('originalLeft') + 'px',
                        top: tile.data('originalTop') + 'px'
                    });
                }
                tile.data('droppedOnBoard', false);
                $(this).css("z-index", 1);
            }
        });
    }

    // Create a single droppable box on the scrabble board
    function createDroppableBox() {
        var box = $('<div class="box"></div>').css({
            left: '0px',
            top: '0px'
        });
        scrabbleBoard.append(box);

        console.log('Single box created at position:', { left: 0, top: 0 });

        box.droppable({
            accept: '.tile',
            drop: function(event, ui) {
                var tile = ui.draggable;
                tile.data('droppedOnBoard', true);
                var boxOffset = $(this).offset();
                var boardOffset = scrabbleBoard.offset();

                // Align the tile to the box
                var left = boxOffset.left - boardOffset.left;
                var top = boxOffset.top - boardOffset.top;

                tile.animate({
                    left: left + 'px',
                    top: top + 'px'
                });

                // Check the word formed
                checkWord();
            }
        });
    }


    // Make scrabble board droppable
    function createDroppableBoxes() {
        var numBoxes = 15; // Number of boxes on the board line
        for (var i = 0; i < numBoxes; i++) {
            var box = $('<div class="box"></div>').css({
                left: i * 70 + 'px',
                top: '0px'
            });
            scrabbleBoard.append(box);

            console.log('Box created at position:', { left: i * 70, top: 0 });

            box.droppable({
                accept: '.tile',
                drop: function(event, ui) {
                    var tile = ui.draggable;
                    tile.data('droppedOnBoard', true);
                    var boxOffset = $(this).offset();
                    var boardOffset = scrabbleBoard.offset();

                    // Align the tile to the box
                    var left = boxOffset.left - boardOffset.left;
                    var top = boxOffset.top - boardOffset.top;

                    tile.animate({
                        left: left + 'px',
                        top: top + 'px'
                    });

                    // Check the word formed
                    checkWord();
                }
            });
        }
    }


    function checkWord() {
        // Logic to check the formed word and calculate score
        // Placeholder for checking the word and scoring
    }

    // Draw initial tiles
    drawTiles();

    createDroppableBox();

    // Button click event to draw new tiles
    $('#draw-tiles-button').click(function() {
        drawTiles();
    });
});
