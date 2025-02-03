// backend/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se usuário já existe
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Gera token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    // Verifica senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    // Gera token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};