/** require dependencies */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cloudinary = require('cloudinary');
const routes = require('./routes');
const firebase = require('./firebase/auth');
const usersRouter = require('./routes/users');

const app = express();
const router = express.Router();
const url = process.env.MONGODB_URI || 'mongodb://localhost:2121';

/** configure cloudinary */
cloudinary.config({
  cloud_name: 'chidumennamdi',
  api_key: '',
  api_secret: '',
});

/** connect to MongoDB datastore */
mongoose.connect('mongodb://127.0.0.1:2121/test',
  { useNewUrlParser: true , useUnifiedTopology: true  }
).then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
  });
const port = 5000 || process.env.PORT;

/** set up routes {API Endpoints} */
routes(router);

/** set up middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
// app.use('/static',express.static(path.join(__dirname,'static')))

// Auth checker middleware
//app.use(firebase.firebaseAuthenticationMiddleware);
//app.use(firebase.firebaseAuthorizationMiddleware);
//app.use(firebase.firebaseAddUserMiddleware);


app.use('/api', router);
//app.use('/users', usersRouter);


/** start server */
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
