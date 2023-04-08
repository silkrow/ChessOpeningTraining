# ChessOpeningTraining
To train your chess opening skills

## Dependencies
* [react](https://react.dev/)
* [chess.js](https://github.com/jhlywa/chess.js)
* [react-chessboard](https://github.com/Clariity/react-chessboard)

## TODO
[] Find a source of chess opening FENs.
[] Update the form to support multiple choices (choose training targets from a pool of openings).

## Log
### 2023.4.8 
commit: cfeda03fcdb57d19237281d5bd60e154ae0b6441

Imported ```react-chessboard``` from https://github.com/Clariity/react-chessboard to visualize the board. Together with the previously imported ```chess.js```, the website now supports:
1. Beautifully displayed chess board, with elegant moving animations and graceful looking pieces and board.
2. Choose to play against human (yourself) or computer (random response) with a form. After pressing the "Set" button, the board will automatically reset. 
