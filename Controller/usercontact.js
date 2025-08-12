const Contact = require('../Schemas/contact');

exports.contact = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, message } = req.body;

    console.log('Incoming contact:', req.body);

    if (!firstName || !lastName || !phone || !email || !message) {
      console.log('Missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = new Contact({ firstName, lastName, phone, email, message });

    await newContact.save(); 
    console.log('Contact saved:', newContact);

    res.status(201).json({ message: 'Message submitted successfully', contact: newContact });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ error: err.message });
  }
};
