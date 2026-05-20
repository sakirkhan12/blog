const bcrypt = require("bcryptjs");

const hashPassword = async () => {
  const password = "123456"; //  yaha apna password daalo

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Original Password:", password);
  console.log("Hashed Password:", hashedPassword); 
};

hashPassword();  





// json inserted mongodb data for login admin

/*{
  "_id": {
    "$oid": "6a0849bb691b65c358aa5ca9"
  },
  "name": "Admin",
  "email": "admin@gmail.com",
  "password": "$2b$10$9Mp0V4Tv7MSGSJxRT4vtxuU7hoJpMJjkbZZNgRFFIqkPYer1udeju",
  "role": "admin",
  "isBlocked": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDg0OWJiNjkxYjY1YzM1OGFhNWNhOSIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJBZG1pbiIsImlhdCI6MTc3OTA5MTcyMywiZXhwIjoxNzc5Njk2NTIzfQ.FoWvCB_aibNDnp8WDA7J7kp_Ve8SVAyR77pJ9Z19oCA",
  "updatedAt": {
    "$date": "2026-05-18T08:08:43.318Z"
  }
}*/