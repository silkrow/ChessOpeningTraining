# ChessOpeningTraining
To train your chess opening skills

## Dependencies
* [react](https://react.dev/)
* [chess.js](https://github.com/jhlywa/chess.js)
* [react-chessboard](https://github.com/Clariity/react-chessboard)
* [chess-openings-database](https://github.com/lichess-org/chess-openings) (git repo for pgn)
* [d3](https://d3js.org/)
* [pandas](https://pandas.pydata.org/) ([OPTIONAL] python module used for opening database tsv loading)
* [requests](https://pypi.org/project/requests/) ([OPTIONAL] python module used for opening database tsv loading)

## TODO
- [x] Find a source of chess opening FENs.
- [x] Update the form to support multiple choices (choose training targets from a pool of openings).
- [ ] Draw gif pictures for banner.
- [ ] Make the App know which opening is Mychessboard running with.

## Log
### 2023.4.8 
commit: cfeda03fcdb57d19237281d5bd60e154ae0b6441

Imported ```react-chessboard``` from https://github.com/Clariity/react-chessboard to visualize the board. Together with the previously imported ```chess.js```, the website now supports:
1. Beautifully displayed chess board, with elegant moving animations and graceful looking pieces and board.
2. Choose to play against human (yourself) or computer (random response) with a form. After pressing the "Set" button, the board will automatically reset. 

### 2023.4.16
commit: 56fb93dc4c0f09dc0de5e71b0f42166498f9c002

Found ```lichess-org```'s repo ```chess-openings-database``` for the pgn database of openings, I created a fork of this repo and download database from my own fork.  Used ```d3``` in javascripts to load tsv file (since training pgn database is locally stored as a tsv file). Python library ```requests``` is used in a python script to download the tsv files from my fork of the database and combine them as ```all.tsv```, and use ```pandas``` to add an ```Index``` column to ```all.tsv```. I've managed to do some updates to the GUI, and allow the user to train the first opening from a pool of openings they selected.

The website now supports:
1. Multiple choice form for user to pick openings to train.
2. A block of chosen openings on the right side of the webpage.
3. A block indicating numbers of openings left on the left side of the webpage.
4. **The first** randomly picked opening from user's choice can be trained, with user being white.
5. Since the left block couldn't print the name of the current opening yet, use ```console.log``` to see the pgn of the opening being trained.

Issues:
1. Right now Mychessboard can't tell App that one opening has been done, so there's always only one opening being trained.
2. Note that there are **still some synchronization issues** when the number of selected openings is too small. Also, the "number of openings left" is sometimes incorrect, I'm guessing this being the issue of asynchronization in App.js.
