require('dotenv').config();

module.exports = {
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  token: process.env.TOKEN,
  port: process.env.PORT || 3000
};
