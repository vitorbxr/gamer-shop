// backend/src/controllers/authController.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logService } from '../services/logService.js';

const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '8h' }
  );
};

export const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Tentativa de login:', { email });
      
      const user = await prisma.user.findUnique({ where: { email } });
      console.log('Usuário encontrado:', user ? 'sim' : 'não');
      
      if (!user) {
        console.log('Usuário não encontrado');
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }

      console.log('Senha armazenada:', user.password);
      console.log('Senha fornecida:', password);
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Senha válida:', isValidPassword);

      if (!isValidPassword) {
        console.log('Senha inválida');
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }

      const token = generateToken(user);
      console.log('Token gerado com sucesso');
      
      logService.info('Login realizado com sucesso', { userId: user.id });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erro completo no login:', error);
      logService.error('Erro no login', error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log('Tentativa de registro:', { email, name });

      // Verifica se usuário já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Senha criptografada:', hashedPassword);

      // Cria o usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER'
        }
      });

      const token = generateToken(user);
      
      logService.info('Usuário registrado com sucesso', { userId: user.id });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erro completo no registro:', error);
      logService.error('Erro no registro', error);
      res.status(500).json({ message: 'Erro ao criar conta' });
    }
  }
};