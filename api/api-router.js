const router = require('express').Router();
var bcrypt = require('bcryptjs')
const Users = require('../users/users-model.js');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
// const secretRouter = require('..')
router.get('/secret', (req, res) => {
  if(req.headers.authorization) {
    let { authorization } = req.headers
    // 2^10 is the number of salt rounds
    bcrypt.hash(authorization, 20, (err, hash) => {
      if(err) {
        return res.status(500).json({message: 'it broke'})
      } else {
        res.status(200).json({secret: hash})

      }
    })
  } else {
    res.status(400).json({error: "missing header"})
  }


})
router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(req.body.password, 8)
    user.password = hash
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .then(user => {
        // console.log(password, user.password)
        if (user && bcrypt.compareSync(password, user.password)) {
          // console.log('here')
          // check the password is valid
          // if match then good password
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get('/', (req, res) => {
  res.json({ api: "It's alive" });
});

module.exports = router;
