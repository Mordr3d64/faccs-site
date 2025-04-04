const bcrypt = require('bcrypt');

const password = 'admin123';
bcrypt.hash(password, 12).then(hash => {
    console.log('Hashed password:', hash);
}); 