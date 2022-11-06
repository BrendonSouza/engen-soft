const express = require('express')
const app = express()
require('dotenv').config();
const bd = require('./utils/db_config')
const session = require('./utils/session_config');

const port = 4200
const routes = require('./controllers/routerController')
app.set('view engine', 'ejs')
app.set('views', 'src/views')
app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({ extended: false }));
app.use(session);
app.use(routes);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})