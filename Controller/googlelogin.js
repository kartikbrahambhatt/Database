const { OAuth2Client } = require('google-auth-library');
const User = require('../Schemas/user'); 
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture, sub } = payload;

    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        firstName,
        lastName,
        email,
        picture,
        googleId: sub,
      });

      await user.save();
    }

    res.status(200).json({
      message: 'Google login successful',
      user,
    });
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = { googleLogin };
