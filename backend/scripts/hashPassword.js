const bcrypt = require('bcryptjs');

const password = 'admin123';
bcrypt.hash(password, 12).then(hash => {
    console.log('Hashed password:', hash);
}); 