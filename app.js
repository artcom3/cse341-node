//const http = require('http');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const errorController = require('./controllers/error');
const User = require('./models/user');

const PORT = process.env.PORT || 3000; // For Heroku

const app = express();

app.set('view engine', 'ejs');
// It applies /views by default
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
// To add the path for the statics elements
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('615821b74ed1a95f2519a160')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


const corsOptions = {
  origin: "https://artcom-ecommerce.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://artcom:oR90mDarp1VpDj8u@cluster0.evuqr.mongodb.net/shop?retryWrites=true&w=majority";


mongoose
  .connect(
    MONGODB_URL
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
