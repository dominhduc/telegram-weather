'use strict';

const fs = require('fs');
const usersFile = __dirname + '/users.json';

module.exports = exports = {
  loadUsers: () => {
    return fs.existsSync(usersFile)? JSON.parse(fs.readFileSync(usersFile, 'utf8')) : {}
  },
  saveUsers: ( data ) => {
    return fs.writeFileSync(usersFile, JSON.stringify(data));
  }
}
