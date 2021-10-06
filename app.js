//const http = require('http');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors')

const errorController = require('./controllers/error');
const User = require('./models/user');

const PORT = process.env.PORT || 3000; // For Heroku

const MONGODB_URI = 
  process.env.MONGODB_URL ;
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
// It applies /views by default
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: false }));
// To add the path for the statics elements
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      console.log(req.user);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


const corsOptions = {
  origin: "https://artcom-ecommerce.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  family: 4
};

mongoose
  .connect(
    MONGODB_URI, options
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Kevin',
          email: 'kevin@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
  
    app.listen(PORT, () => {
      console.log(`Our app is running on port ${ PORT }`);
    });
  })
  .catch(err => {
    console.log(err);
  });

// const server = http.createServer(app);
// server.listen(3000);
