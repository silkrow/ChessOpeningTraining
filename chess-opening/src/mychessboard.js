// Reference: https://github.com/oakmac/chessboardjs/ MIT license, Chris Oakman
// Author: Erkai Yu, 2023

import './mychessboard.css';

var $ = window['jQuery']

// --------------------------------
// Constants
// --------------------------------

var COLUMNS = 'abcdefgh'.split('')
var ELLIPSIS = '…'
var START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
var START_POSITION = fenToObj(START_FEN)

// default animation speeds
var DEFAULT_APPEAR_SPEED = 200
var DEFAULT_MOVE_SPEED = 200
var DEFAULT_SNAPBACK_SPEED = 60
var DEFAULT_SNAP_SPEED = 30
var DEFAULT_TRASH_SPEED = 100

// use unique class names to prevent clashing with anything else on the page
// and simplify selectors
// NOTE: these should never change
var CSS = {}
CSS['alpha'] = 'alpha-d2270'
CSS['black'] = 'black-3c85d'
CSS['board'] = 'board-b72b1'
CSS['chessboard'] = 'chessboard-63f37'
CSS['clearfix'] = 'clearfix-7da63'
CSS['highlight1'] = 'highlight1-32417'
CSS['highlight2'] = 'highlight2-9c5d2'
CSS['notation'] = 'notation-322f9'
CSS['numeric'] = 'numeric-fc462'
CSS['piece'] = 'piece-417db'
CSS['row'] = 'row-5277c'
CSS['sparePieces'] = 'spare-pieces-7492f'
CSS['sparePiecesBottom'] = 'spare-pieces-bottom-ae20f'
CSS['sparePiecesTop'] = 'spare-pieces-top-4028b'
CSS['square'] = 'square-55d63'
CSS['white'] = 'white-1e1d7'

// --------------------------------
// Misc
// --------------------------------

function uuid () {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c) {
      var r = (Math.random() * 16) | 0
      return r.toString(16)
    })
}

function deepCopy (thing) {
    return JSON.parse(JSON.stringify(thing))
}

function interpolateTemplate (str, obj) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue
      var keyTemplateStr = '{' + key + '}'
      var value = obj[key]
      while (str.indexOf(keyTemplateStr) !== -1) {
        str = str.replace(keyTemplateStr, value)
      }
    }
    return str
}

// --------------------------------
// Predicates
// --------------------------------

function isString (s) {
    return typeof s === 'string'
}

function isFunction (f) {
    return typeof f === 'function'
}

function isInteger (n) {
    return typeof n === 'number' &&
           isFinite(n) &&
           Math.floor(n) === n
}

function validAnimationSpeed (speed) {
    if (speed === 'fast' || speed === 'slow') return true
    if (!isInteger(speed)) return false
    return speed >= 0
}

// Note that this function only checks if the move is in the form of "f6-d5"
function validMove (move) {
    // move should be a string
    if (!isString(move)) return false

    // move should be in the form of "e2-e4", "f6-d5"
    var squares = move.split('-')
    if (squares.length !== 2) return false

    return validSquare(squares[0]) && validSquare(squares[1])
}

function validSquare (square) {
    return isString(square) && square.search(/^[a-h][1-8]$/) !== -1
}

function validPieceCode (code) {
    return isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1
}

// Checks if this fen represents a position with 64 blocks, check
// if the pieces are legally named
function validFen (fen) {
    if (!isString(fen)) return false

    // cut off any move, castling, etc info from the end
    // we're only interested in position information
    fen = fen.replace(/ .+$/, '') 
    //replaces the last space and all the characters after 
    // it in the string variable fen with an empty string

    // expand the empty square numbers to just 1s
    fen = expandFenEmptySquares(fen)

    // FEN should be 8 sections separated by slashes
    var chunks = fen.split('/')
    if (chunks.length !== 8) return false

    // check each section
    for (var i = 0; i < 8; i++) {
      if (chunks[i].length !== 8 ||
          chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
        return false
      }
    }

    return true
}

function validPositionObject (pos) {
    if (!$.isPlainObject(pos)) return false

    for (var i in pos) {
      if (!pos.hasOwnProperty(i)) continue

      if (!validSquare(i) || !validPieceCode(pos[i])) {
        return false
      }
    }

    return true
}

function isTouchDevice () {
    return 'ontouchstart' in document.documentElement
}

// --------------------------------
// Chess Util
// --------------------------------

// convert FEN piece code to bP, wK, etc
function fenToPieceCode (piece) {
    // black piece
    if (piece.toLowerCase() === piece) {
      return 'b' + piece.toUpperCase()
    }

    // white piece
    return 'w' + piece.toUpperCase()
}

// convert bP, wK, etc code to FEN structure
function pieceCodeToFen (piece) {
    var pieceCodeLetters = piece.split('')

    // white piece
    if (pieceCodeLetters[0] === 'w') {
      return pieceCodeLetters[1].toUpperCase()
    }

    // black piece
    return pieceCodeLetters[1].toLowerCase()
}

// convert FEN string to position object
// returns false if the FEN string is invalid
function fenToObj (fen) {
    if (!validFen(fen)) return false

    // cut off any move, castling, etc info from the end
    // we're only interested in position information
    fen = fen.replace(/ .+$/, '')

    var rows = fen.split('/')
    var position = {}

    var currentRow = 8
    for (var i = 0; i < 8; i++) {
      var row = rows[i].split('')
      var colIdx = 0

      // loop through each character in the FEN section
      for (var j = 0; j < row.length; j++) {
        // number / empty squares
        if (row[j].search(/[1-8]/) !== -1) {
          var numEmptySquares = parseInt(row[j], 10)
          colIdx = colIdx + numEmptySquares
        } else {
          // piece
          var square = COLUMNS[colIdx] + currentRow
          position[square] = fenToPieceCode(row[j])
          colIdx = colIdx + 1
        }
      }

      currentRow = currentRow - 1
    }

    return position
}

// position object to FEN string
// returns false if the obj is not a valid position object
function objToFen (obj) {
    if (!validPositionObject(obj)) return false

    var fen = ''

    var currentRow = 8
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var square = COLUMNS[j] + currentRow

        // piece exists
        if (obj.hasOwnProperty(square)) {
          fen = fen + pieceCodeToFen(obj[square])
        } else {
          // empty space
          fen = fen + '1'
        }
      }

      if (i !== 7) {
        fen = fen + '/'
      }

      currentRow = currentRow - 1
    }

    // squeeze the empty numbers together
    fen = squeezeFenEmptySquares(fen)

    return fen
}

function squeezeFenEmptySquares (fen) {
    return fen.replace(/11111111/g, '8')
      .replace(/1111111/g, '7')
      .replace(/111111/g, '6')
      .replace(/11111/g, '5')
      .replace(/1111/g, '4')
      .replace(/111/g, '3')
      .replace(/11/g, '2')
}

function expandFenEmptySquares (fen) {
    return fen.replace(/8/g, '11111111')
      .replace(/7/g, '1111111')
      .replace(/6/g, '111111')
      .replace(/5/g, '11111')
      .replace(/4/g, '1111')
      .replace(/3/g, '111')
      .replace(/2/g, '11')
}

// returns the distance between two squares
function squareDistance (squareA, squareB) {
    var squareAArray = squareA.split('')
    var squareAx = COLUMNS.indexOf(squareAArray[0]) + 1
    var squareAy = parseInt(squareAArray[1], 10)

    var squareBArray = squareB.split('')
    var squareBx = COLUMNS.indexOf(squareBArray[0]) + 1
    var squareBy = parseInt(squareBArray[1], 10)

    var xDelta = Math.abs(squareAx - squareBx)
    var yDelta = Math.abs(squareAy - squareBy)

    if (xDelta >= yDelta) return xDelta
    return yDelta
}

// returns the square of the closest instance of piece
// returns false if no instance of piece is found in position
function findClosestPiece (position, piece, square) {
    // create array of closest squares from square
    var closestSquares = createRadius(square)

    // search through the position in order of distance for the piece
    for (var i = 0; i < closestSquares.length; i++) {
      var s = closestSquares[i]

      if (position.hasOwnProperty(s) && position[s] === piece) {
        return s
      }
    }

    return false
}

// returns an array of closest squares from square
function createRadius (square) {
    var squares = []

    // calculate distance of all squares
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var s = COLUMNS[i] + (j + 1)

        // skip the square we're starting from
        if (square === s) continue

        squares.push({
          square: s,
          distance: squareDistance(square, s)
        })
      }
    }

    // sort by distance
    squares.sort(function (a, b) {
      return a.distance - b.distance
    })

    // just return the square code
    var surroundingSquares = []
    for (i = 0; i < squares.length; i++) {
      surroundingSquares.push(squares[i].square)
    }

    return surroundingSquares
}

// given a position and a set of moves, return a new position
// with the moves executed
function calculatePositionFromMoves (position, moves) {
    var newPosition = deepCopy(position)

    for (var i in moves) {
      if (!moves.hasOwnProperty(i)) continue

      // skip the move if the position doesn't have a piece on the source square
      if (!newPosition.hasOwnProperty(i)) continue

      var piece = newPosition[i]
      delete newPosition[i]
      newPosition[moves[i]] = piece
    }

    return newPosition
}

// --------------------------------
// HTML
// --------------------------------

function buildContainerHTML (hasSparePieces) {
    var html = '<div class="{chessboard}">'

    if (hasSparePieces) {
      html += '<div class="{sparePieces} {sparePiecesTop}"></div>'
    }

    html += '<div class="{board}"></div>'

    if (hasSparePieces) {
      html += '<div class="{sparePieces} {sparePiecesBottom}"></div>'
    }

    html += '</div>'

    return interpolateTemplate(html, CSS)
}

// --------------------------------
// Config
// --------------------------------

function expandConfigArgumentShorthand (config) {
    if (config === 'start') {
      config = {position: deepCopy(START_POSITION)}
    } else if (validFen(config)) {
      config = {position: fenToObj(config)}
    } else if (validPositionObject(config)) {
      config = {position: deepCopy(config)}
    }

    // config must be an object
    if (!$.isPlainObject(config)) config = {}

    return config
}

// validate config / set default options
function expandConfig (config) {
    // default for orientation is white
    if (config.orientation !== 'black') config.orientation = 'white'

    // default for showNotation is true
    if (config.showNotation !== false) config.showNotation = true

    // default for draggable is false
    if (config.draggable !== true) config.draggable = false

    // default for dropOffBoard is 'snapback'
    if (config.dropOffBoard !== 'trash') config.dropOffBoard = 'snapback'

    // default for sparePieces is false
    if (config.sparePieces !== true) config.sparePieces = false

    // draggable must be true if sparePieces is enabled
    if (config.sparePieces) config.draggable = true

    // default piece theme is wikipedia
    if (!config.hasOwnProperty('pieceTheme') ||
        (!isString(config.pieceTheme) && !isFunction(config.pieceTheme))) {
      config.pieceTheme = 'img/chesspieces/wikipedia/{piece}.png'
    }

    // animation speeds
    if (!validAnimationSpeed(config.appearSpeed)) config.appearSpeed = DEFAULT_APPEAR_SPEED
    if (!validAnimationSpeed(config.moveSpeed)) config.moveSpeed = DEFAULT_MOVE_SPEED
    if (!validAnimationSpeed(config.snapbackSpeed)) config.snapbackSpeed = DEFAULT_SNAPBACK_SPEED
    if (!validAnimationSpeed(config.snapSpeed)) config.snapSpeed = DEFAULT_SNAP_SPEED
    if (!validAnimationSpeed(config.trashSpeed)) config.trashSpeed = DEFAULT_TRASH_SPEED

    // throttle rate
    //if (!validThrottleRate(config.dragThrottleRate)) config.dragThrottleRate = DEFAULT_DRAG_THROTTLE_RATE

    return config
}

// --------------------------------
// Dependencies
// --------------------------------

// return either boolean false or the $container element
function checkContainerArg (containerElOrString) {
    if (containerElOrString === '') {
      var errorMsg1 = 'Chessboard Error 1001: ' +
        'The first argument to Chessboard() cannot be an empty string.' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg1)
      return false
    }

    // convert containerEl to query selector if it is a string
    if (isString(containerElOrString) &&
        containerElOrString.charAt(0) !== '#') {
      containerElOrString = '#' + containerElOrString
    }

    // containerEl must be something that becomes a jQuery collection of size 1
    var $container = $(containerElOrString)
    if ($container.length !== 1) {
      var errorMsg2 = 'Chessboard Error 1003: ' +
        'The first argument to Chessboard() must be the ID of a DOM node, ' +
        'an ID query selector, or a single DOM node.' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg2)
      return false
    }

    return $container
}

// --------------------------------
// Constructor
// --------------------------------



// -------------------------------- 
// Own Features
// --------------------------------

function drawboard(props) {
    const blocks = []
    for (var i = 8; i > 0; i--) // i for rows
        for (var j = 0; j < 8; j++) {// j for columns
            var piece_img = ''
            var query_piece = props.get(String.fromCharCode(97+j)+i.toString());
            if (query_piece !== false) {
                piece_img += query_piece.color;
                piece_img += query_piece.type; 
            } 
            if ((i + j)%2 === 0) {
                blocks.push(<div className="grid-itemw"
                        onMouseEnter={
                            (e) => { 
                                console.log('mouse over me')
                            }
                        }>
                        <img src={`${piece_img}.png`} alt=''></img></div>
                    )
            } else {
                blocks.push(<div className="grid-itemb"
                        onMouseEnter={
                            (e) => { 
                                console.log('mouse over me')
                            }
                        }>
                        <img src={`${piece_img}.png`} alt=''></img></div>
                    )
            }
        }
    return blocks;
}

function Mychessboard (props) {
    if (props.choice === "begin") {
        props.position.reset();
    }
    if (props.choice === "end"){
        while (!props.position.isGameOver()) {
            const moves = props.position.moves()
            const move = moves[Math.floor(Math.random() * moves.length)]
            props.position.move(move)
        }
    }

    return (
        <div>
            <p>{props.position.fen()}</p>
            <div 
                onMouseUp={ // Attempt to placing a piece
                    () => {
                        console.log('up')
                    }
                }
                onMouseDown={ // Start dragging a piece
                    (e) => { 
                        console.log('down')
                    }
                }
                onMouseMove={ // Moving
                    (e) => { 
                    }
                }
                className="grid-container">
                {drawboard(props.position)}
            </div>
        </div>
    )
}

export default Mychessboard;