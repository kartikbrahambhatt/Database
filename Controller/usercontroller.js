const bcrypt = require('bcryptjs');
const User = require('../Schemas/user');

exports.register = async (req, res) => {
  try {
    console.log(' REQUEST BODY:', req.body); 

    const { firstName, lastName, phone, email, password } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
      console.log('Missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists');
      return res.status(409).json({ message:'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({  firstName,  lastName,  phone,  email,  password: hashedPassword,
    });

    await newUser.save();
    console.log(' User registered:', email);
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(' Error while registering:', err); 
    res.status(500).json({ error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const { password: _, ...userData } = user._doc;
    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
