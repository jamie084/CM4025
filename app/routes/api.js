var User       	= require('../models/user');
var Game 		= require('../models/game')
var Chat 		= require('../models/chat')
var jwt        	= require('jsonwebtoken');
var config     	= require('../../config');
var decodedLocal;

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {
		console.log(req.body.username);

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Authentication failed. User not found.' 
	  		});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Authentication failed. Wrong password.' 
	    		});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresIn: '24h' // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	   var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      
	      if (err)
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
		  else
		 
	        // if everything is good, save to request for use in other routes
			req.decoded = decoded;    
		
			decodedLocal = decoded;
			next();
	    });

	  } else {

	    // if there is no token
			// return an HTTP response of 403 (access forbidden) and an error message
			next();
   	 	// return res.status(403).send({ 
   	 	// 	success: false, 
   	 	// 	message: 'No token provided.' 
   	 	// });

	  }

		  // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	apiRouter.get('/me', function(req, res) {
	//	console.log(req.decoded);
	//	console.log(decodedLocal)
		//res.json({ message: res})
		res.send(decodedLocal);
		});

	// on routes that end in /chat
	// ----------------------------------------------------
	apiRouter.route('/chat')
	.get(function(req, res) {
		Chat.find(function(err, chat) {
			if (err) res.send(err);

			// return the users
			res.json(chat);
		})
	})
	;
	apiRouter.route('/chat/:chat_id')
				// update the user with this id
				.put(function(req, res) {
					var chat = new Chat();
					Chat.findById(req.params.chat_id, function(err, chat) {
		
						if (err) res.send(err);
		
						// set the new user information if it exists in the request
						if (req.body) chat.messageData = req.body;
						console.log("put req")
						console.log(req.body)
						console.log(chat.messageData)
		
						// save the user
						chat.save(function(err) {
							if (err) res.send(err);
		
							// return a message
							res.json({ message: 'chat updated!' });
						});
					});
				})
		
					
	
	

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
		//	console.log("users accessed");
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.user_id = req.body.user_id;
			user.icon = req.body.icon;

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			User.find(function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/games')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			console.log("games accessed");
			var game = new Game();		// create a new instance of the User model
		//	game.id = req.body.id;  // set the users name (comes from the request)
			game.name = req.body.name;  // set the users username (comes from the request)
			game.players = req.body.players;  // set the users password (comes from the request)
			game.map = req.body.map;

			game.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A game with that name already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'map created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/games)
		.get(function(req, res) {
			Game.find(function(err, games) {
				if (err) res.send(err);

				// return the users
				res.json(games);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/games/:game_id')

		// get the user with that id
		.get(function(req, res) {
			Game.findById(req.params.game_id, function(err, game) {
				if (err) res.send(err);

				// return that user
				res.json(game);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			var retValue;
			Game.findById(req.params.game_id, function(err, game) {

				if (err) res.send(err);
				var movement;
				

				// set the new user information if it exists in the request
				if (req.body.name) game.name = req.body.name;
				if (req.body.players) game.players = req.body.players;
				if (req.body.map) mapArray = req.body.map;
				
				if (req.body.movement) {
					userId = req.body.userId
					console.log(userId)
					movement = req.body.movement
					loop1:
					for (i=0; i < mapArray.length; i++){
					   loop2:
						for (j=0; j <mapArray[i].length; j++){
							if (mapArray[i][j] == userId){
								
								if (i >= 1 && movement === "left" ){
									retValue = mapArray[i-1][j];
									//updateCounters(mapArray[i-1][j])
									mapArray[i-1][j] = userId;
									mapArray[i][j] = 0;
									break loop1;
								}
								if (i < mapArray.length-1 && movement === "right"){
									retValue = mapArray[i+1][j];
									//updateCounters(mapArray[i+1][j])
									mapArray[i+1][j] = userId;   
									mapArray[i][j] = 0;             
									break loop1;                     
								}
								if (j > 0 && movement === "forward"){
									retValue = mapArray[i][j-1];
									//updateCounters(mapArray[i][j-1])
									mapArray[i][j-1] = userId;     
									mapArray[i][j] = 0;           
									break loop1;
								}
								if (j < mapArray[j].length-1 && movement === "back"){
									retValue = mapArray[i][j+1];
									//updateCounters(mapArray[i][j+1])
									mapArray[i][j+1] = userId; 
									mapArray[i][j] = 0;                      
									break loop1;
								}
			
							}
							if (mapArray[i][j]==0 && movement === "spawn"){
								mapArray[i][j] = userId;
								break loop1;
							}                                                
						}
					}   
					game.map = mapArray;
				}

				// save the map
				game.save(function(err) {
					if (err) res.send(err);
					console.log(retValue)
					// return a message
					res.json({ message: 'game updated!', updateValue: retValue });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			Game.remove({
				_id: req.params.game_id
			}, function(err, game) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	

	apiRouter.route('/users/:username')
		

		// get the user with that id
		.get(function(req, res) {

			User.find({"username" : req.params.username.split(":")[1]} , function(err, user) {


				if (err) res.send(err);

				// return that user				
				res.json(user);
			});
		});
	

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {

			User.findById(req.params.user_id , function(err, user) {


				if (err) res.send(err);

				// return that user
				console.log(req.params.user_id)

				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	return apiRouter;
};

