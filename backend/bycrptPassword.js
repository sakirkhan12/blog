const bcrypt = require("bcryptjs");

const hashPassword = async () => {
  const password = "123456"; // 🔐 yaha apna password daalo

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Original Password:", password);
  console.log("Hashed Password:", hashedPassword);
};

hashPassword();