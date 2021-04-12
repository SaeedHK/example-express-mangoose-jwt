const connectDB = require('../db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const addFirstAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.log('Both email and password are obligatory');
    return;
  }
  await connectDB();
  const adminExist = await User.findOne({ isAdmin: true });
  if (adminExist) {
    console.log(`There is already an admin. We cannot add a new admin with this script.`);
    return;
  }
  const emailExist = await User.findOne({ email: adminEmail });
  if (emailExist) {
    console.log(`User with email ${adminEmail} already exists`);
    return;
  }
  try {
    // Encrypt password to register to db
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    await User.create({ email: adminEmail, password: hashedPassword, isAdmin: true });
    console.log(`Create admin with email ${adminEmail}`);
  } catch (err) {
    console.log(err);
    console.log(`Failed creation admin with email ${adminEmail}`);
  }
};

addFirstAdmin();

setTimeout(() => {
  process.exit(0);
}, 5 * 1000);
