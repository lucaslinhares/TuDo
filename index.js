const express = require('express');
const config = require('./config');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const fakeHMR = require('./fake-hmr');
const bodyParser = require('body-parser');
var cors = require('cors')

const compiler = webpack(webpackConfig);

const watching = compiler.watch({
  // Example watchOptions
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => { // Stats Object
  console.log(stats.toString({
    chunks: false,  // Makes the build much quieter
    colors: true    // Shows colors in the console
  }))
  if (stats.hasErrors()) {
    console.log('didn\' t build')
    return;
  }
  console.log('built');
  fakeHMR.built();
});

const app = express();
fakeHMR.config({ app });
app.use(cors())
app.use(express.static('public'));



// require('./webpackRunner');

const db = {
  notes: [
    {
      id: 1,
      title: "Titulo1" ,
      text: "Texto 1",
      checked: true
    },
    {
      id: 2,
      title: "Titulo2" ,
      text: "Texto 2",
      checked: false
    },
    {
      id: 3,
      title: "Titulo3" ,
      text: "Texto 3",
      checked: true
    },
    {
      id: 4,
      title: "Titulo4" ,
      text: "Texto 4",
      checked: false
    },

  ]
}

app.use(bodyParser.json());

// busca todos
app.get('/notes/', (req, res) => {
  res.json(db.notes);
});

// busca por id
app.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  const result = db.notes.filter((note) => {
    return note.id == id;
  })
  res.json(result[0]);
});

// adiciona uma nota
app.post('/notes/', (req, res) => {
  const note = req.body;
  note.id = db.notes[db.notes.length - 1].id + 1;
  note.checked = false;
  db.notes.push(note);
  res.send(`Adicionado com sucesso!
  Id: ${note.id}
  Título: ${note.title}
  Texto: ${note.text}`);

  //
  res.json(db.notes);
});

// deleta um nota pelo id
app.delete('/notes/:id', function (req, res) {
  const id = req.params.id;
  const result = db.notes.filter((note) => {
    return note.id == id;
  });
  const index = db.notes.indexOf(result[0]);
  db.notes.splice(index,1);
  res.json(db.notes);
});

// altera os valores da nota pelo id
/*
app.put('/notes/:id', function (req, res) {
  const id = req.params.id;
  const result = db.notes.filter((note) => {
    return note.id == id;
  });
  const note = req.body;
  const index = db.notes.indexOf(result[0]);
  db.notes[index].title = note.title;
  db.notes[index].text = note.text;
  res.json(db.notes[index]);
});
*/

// altera o estado da nota
app.put('/notes/:id', function (req, res) {
  const id = req.params.id;
  const result = db.notes.filter((note) => {
    return note.id == id;
  });
  const index = db.notes.indexOf(result[0]);
  db.notes[index].checked = !(db.notes[index].checked);

  res.json(db.notes);
  
});
/** */

app.listen(config.PORT, function () {
  console.log(`App currently running; navigate to localhost:${config.PORT} in a web browser.`);
});
