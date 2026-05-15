const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

const updateMe = async (req, res) => {
  const { name, email, avatar, phone, address, bio, teamRole, department } = req.body;

  if (email && email !== req.user.email) {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use." });
  }

  req.user.name = name ?? req.user.name;
  req.user.email = email ?? req.user.email;
  req.user.avatar = avatar ?? req.user.avatar;
  req.user.phone = phone ?? req.user.phone;
  req.user.address = address ?? req.user.address;
  req.user.bio = bio ?? req.user.bio;
  req.user.teamRole = teamRole ?? req.user.teamRole;
  req.user.department = department ?? req.user.department;

  await req.user.save();
  res.json({ user: req.user });
};

const createUser = async (req, res) => {
  const { name, email, role = "customer", teamRole = "Viewer", department = "", status = "Active" } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "Email already in use." });
  }

  const password = "Password@123";

  const user = await User.create({
    name,
    email,
    role,
    teamRole,
    department,
    status,
    password,
  });

  res.status(201).json({ user: { ...user.toObject(), password: undefined } });
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });

  const { name, email, role, teamRole, department, status } = req.body;

  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use." });
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.role = role ?? user.role;
  user.teamRole = teamRole ?? user.teamRole;
  user.department = department ?? user.department;
  user.status = status ?? user.status;

  await user.save();
  res.json({ user });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });

  await user.deleteOne();
  res.json({ message: "User deleted." });
};

module.exports = {
  getUsers,
  getMe,
  updateMe,
  createUser,
  updateUser,
  deleteUser,
};
