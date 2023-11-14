import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const pgp = require('pg-promise')();

const db = pgp({
  host: otto.db.elephantsql.com,
  port: 5432,
  database: MonopolyBH, // Update this to your database name
  user: nxrnwban,
  password: 4cO0FMR1k6Dl4onK_U1jvxspZry5_vzQ,
});


const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get('/', readHelloMessage);
router.get('/players', readPlayers);
router.get('/players/:id', readPlayer);
router.put('/players/:id', updatePlayer);
router.post('/players', createPlayer);
router.delete('/players/:id', deletePlayer);

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));


function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

function readHelloMessage(req, res) {
  res.send('Hello, CS 262 Monopoly service!');
}

function readPlayers(req, res, next) {
  db.many('SELECT * FROM Player')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readPlayer(req, res, next) {
  db.oneOrNone('SELECT * FROM Player WHERE id=${id}', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updatePlayer(req, res, next) {
  db.oneOrNone('UPDATE Player SET email=${body.email}, name=${body.name} WHERE id=${params.id} RETURNING id', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createPlayer(req, res, next) {
  db.one('INSERT INTO Player(email, name) VALUES (${email}, ${name}) RETURNING id', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deletePlayer(req, res, next) {
  db.oneOrNone('DELETE FROM Player WHERE id=${id} RETURNING id', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function readAllGames(req, res, next) {
  db.many('SELECT * FROM Game ORDER BY time DESC')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

router.get('/recentgames', readRecentGames);

function readRecentGames(req, res, next) {
  db.many('SELECT * FROM Game WHERE time >= NOW() - INTERVAL \'1 week\'')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

router.post('/games', createGame);

function createGame(req, res, next) {
  // Adjust this query based on your actual table structure
  db.one('INSERT INTO Game(column1, column2, ...) VALUES ($1, $2, ... ) RETURNING *', [req.body.column1, req.body.column2, ...])
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

router.delete('/games/:id', deleteGame);

function deleteGame(req, res, next) {
  db.oneOrNone('DELETE FROM Game WHERE ID = $1 RETURNING *', req.params.id)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}


router.get('/playergames', readPlayerGames);

function readPlayerGames(req, res, next) {
  db.many('SELECT * FROM PlayerGame')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

router.post('/playergames', createPlayerGame);

function createPlayerGame(req, res, next) {
  // Adjust this query based on your actual table structure
  db.one('INSERT INTO PlayerGame(playerID, gameID, score) VALUES ($1, $2, $3) RETURNING *', [req.body.playerID, req.body.gameID, req.body.score])
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

router.delete('/playergames/:id', deletePlayerGame);

function deletePlayerGame(req, res, next) {
  db.oneOrNone('DELETE FROM PlayerGame WHERE ID = $1 RETURNING *', req.params.id)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}
