const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, dbUrl } = config;
const app = express();
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

routes(app, (err) => {
  console.log(err)
  if (err) {
    throw err;
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.info(`App listening on port ${port}`);
});
