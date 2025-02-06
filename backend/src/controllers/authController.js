// backend/src/controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verifica se usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER'
      }
    });

    // Gera o token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar conta' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};