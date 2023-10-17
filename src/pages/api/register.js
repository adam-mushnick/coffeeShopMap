import User from '../../../models/User';

//hashes passwords
import bcrypt from 'bcryptjs';

export default async (req, res) => {
  if (req.method === 'POST') {
    // Extract user details from request body
    const { username, password } = req.body;

    try {
      // Hash the password before storing it in the database with level 10 'salt'
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const user = new User({ username, password: hashedPassword });
      const savedUser = await user.save();

      // Respond with the created user
      res.status(200).json({ user: savedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to register user.' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
