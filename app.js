//const http = require('http');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors')
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const PORT = process.env.PORT || 3000; // For Heroku

const MONGODB_URI = process.env.MONGODB_URL;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views'); // It applies /views by default

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const p08Routes = require('./routes/p08');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // To add the path for the statics elements
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      //console.log(req.user);
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});


app.use('/admin', adminRoutes);
app.use('/p08/', p08Routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get404);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

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
    app.listen(PORT, () => {
      console.log(`Our app is running on port ${ PORT }`);
    });
  })
  .catch(err => {
    console.log(err);
  });

// const server = http.createServer(app);
// server.listen(3000);
