// generate-password.js
import bcrypt from 'bcryptjs';

const generateHash = async () => {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash gerada:', hash);
};

generateHash();