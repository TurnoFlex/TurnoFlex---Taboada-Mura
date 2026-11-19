const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Campos obligatorios.' });
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email ya registrado.' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Definimos quiénes son los administradores por email
    const adminEmails = ['maximimura55@gmail.com', 'emirtaboada2000@gmail.com'];
    const userRole = adminEmails.includes(email.toLowerCase()) ? 'ADMIN' : 'CLIENTE';
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword, userRole]
    );
    return res.status(201).json({ message: 'Usuario registrado', user: newUser.rows[0] });
  } catch (e) { return res.status(500).json({ error: 'Error del servidor' }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas.' });
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Credenciales inválidas.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { return res.status(500).json({ error: 'Error del servidor' }); }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);
    return res.status(200).json({ user: result.rows[0] });
  } catch (e) { return res.status(500).json({ error: 'Error' }); }
};

module.exports = { register, login, getMe };
