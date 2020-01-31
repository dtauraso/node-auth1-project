const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  // use the session informatino to restrict access
  console.log(req.session)
  // the store appears to be undefined
  console.log(req.session.store)
  // req could be undefined
  // has to agree with what was set in the login
  if(req.session && req.session.loggedIn) {
    next()
  } else {
    res.status(401).json({you: "shall not pass!"})
  }
}
// module.exports = (req, res, next) => {
//   const { username, password } = req.headers;

//   if (username && password) {
//     Users.findBy({ username })
//       .first()
//       .then(user => {
//         if (user && bcrypt.compareSync(password, user.password)) {
//           next();
//         } else {
//           res.status(401).json({ message: 'Invalid Credentials' });
//         }
//       })
//       .catch(error => {
//         res.status(500).json({ message: 'Ran into an unexpected error' });
//       });
//   } else {
//     res.status(400).json({ message: 'No credentials provided' });
//   }
// };
