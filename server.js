const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
require('./socketEvents')(io);
const path = require('path')
const mongoose = require('mongoose')

const cors = require('cors')
const morgan = require('morgan')
const config = require('config')

// CORS Middleware
app.use(cors());
// Logger Middleware
app.use(morgan('dev'));
// Init Middleware
app.use(express.json());


// Connect to Mongo
mongoose
  .connect(config.get('mongoURI'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/follow', require('./routes/api/follow'));
app.use('/api/dialogs', require('./routes/api/messages'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000

http.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

