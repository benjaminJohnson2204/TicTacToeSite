# Ben's Tic-tac-toe Website
This project is a website I created where users can play Tic-tac-toe against each other. The site is hosted at https://bens-tic-tac-toe-site.herokuapp.com/.

## Stack
I created this website using React for the front end, MongoDB as the database, and Express and Node for the back end. I also used Socket.IO for real-time client-server communication.

## Functionality
My website allows users to register and login with a username and password. Users can play games with each other by either creating a new game or joining an existing game. Users can either join a random game, or join a specific game by entering a code. 

When a user creates a game, they receive a code (this code is merely the ID of the MongoDB document for the game) that they can give to another user who wants to play against them. 

When two users are matched in a game, they can play the game by clicking the board, and can see whose turn it is. When the game ends, the page displays the result. 

From the homepage, users can view a page that displays all the games they've played. It shows them who they played against, who won, and what the board looked like at the end.

## Code Structure
### Client
The `client` directory contains all the front-end code in its `src` directory. I've separated this code into `pages`, `components`, and `utils`.

### Database
The `db` directory contains all code for my database. I used Mongoose to interface with a MongoDB database. Within `db`, there is a directory for `models` and another for `services`. I created models for a user (primarily used for authentication and identification) and for a game (to store its state, whether it is won or lost, who is playing it, etc.). The `db/services` directory contains functions to create, find, and update users and games. These functions handle most of the game logic (checking if a game square is already taken and whether a game is won or lost, etc.).

###Server
The `server` directory contains the back end/server code. The code to set up the Express routes are in the `routes` file, and the code to run Express, connect to Mongo, and run middlewares is in `index`. I used Passport and Bcrypt for user authentication, with local authentication. 

The `server/index` file also contains server-side Socket.IO setup and handling for connection and messages. I used two Socket namespaces: `waiting` and `play`. 

The `waiting` namespace is for users who have created games and are waiting for another user to join the game. When another user joins, I use this namespace to notify the game's creator so they can be taken to the game-playing page. 

The `play` namespace is for users who are playing games with each other. When users make a move, the client code emits a message to the server, which updates the game state and then emits a message with the new game state, including where users have moved and whether the game is won or tied.

Within each namespace, I move users into rooms identified with the ID of the MongoDB document for the game the user is waiting for or playing. If many users were to play games at the same time, this system would help ensure that users only receive messages relevant to their game, and that the server can efficiently decide how to process and emit messages.

### Tests
The `tests` directory contains code for unit tests that I wrote to test my database functionality. I created these tests as a faster way to ensure that the database services worked correctly, rather than manually testing the entire app through the user interface. I wrote these tests using Mocha and Chai, and the tests are run every time the server is started.

## Future Developments
I would like to expand this website to include more multiplayer games. When I do this, I think it would be helpful to structure my code to make it easy to add new games without repeating code. I also want to add some single-player games, and give users the option to play multi-player games against the computer. 

I also have minor improvements in mind. One of these is allowing users to quit a game, but notifying their opponent when they do. Another improvement is allowing users to re-join a game they are playing or waiting for if they leave the page. Currently, I don't allow a user to join a new game if they're already waiting for or playing a game, but I think a link to their current game would be helpful. 

Finally, I'm thinking of adding an in-game chat between players. I'm also considering adding a messaging system so that users can chat with each other outside of games, such as if they want to ask if a friend wants to play with them. I think it would be best to make these two separate chat systems.