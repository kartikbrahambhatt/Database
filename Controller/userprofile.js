const User = require('../Schemas/user');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('firstName lastName email phone picture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {  getProfile };
