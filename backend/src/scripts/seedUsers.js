import { query } from '../database/connection.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../.env') });

// Usuários de login rápido baseados na página de login
const quickLoginUsers = [
  {
    name: 'Comprador Feliz',
    email: 'buyer@evelou.com',
    password: '123456',
    role: 'BUYER',
  },
  {
    name: 'Organizador Teste',
    email: 'organizer@evelou.com',
    password: '123456',
    role: 'ORGANIZER',
  },
  {
    name: 'Admin Evelou',
    email: 'admin@evelou.com',
    password: '123456',
    role: 'ADMIN',
  },
];

async function seedUsers() {
  try {
    console.log('🌱 Iniciando seed de usuários...\n');

    for (const userData of quickLoginUsers) {
      // Verificar se usuário já existe
      const existingUser = await query(
        'SELECT id, email FROM users WHERE email = $1',
        [userData.email]
      );

      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      if (existingUser.rows.length > 0) {
        // Usuário existe, atualizar senha e dados se necessário
        console.log(`🔄 Usuário ${userData.email} já existe. Atualizando senha e dados...`);
        await query(
          `UPDATE users 
           SET password_hash = $1,
               name = $2,
               role = $3,
               avatar = $4,
               is_verified = $5,
               kyc_status = $6,
               updated_at = CURRENT_TIMESTAMP
           WHERE email = $7`,
          [
            hashedPassword,
            userData.name,
            userData.role,
            `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
            userData.role === 'ADMIN',
            userData.role === 'ORGANIZER' ? 'pending' : 'not_started',
            userData.email,
          ]
        );
        console.log(`✅ Usuário atualizado: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
        continue;
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Inserir usuário
      const result = await query(
        `INSERT INTO users (
          name, 
          email, 
          password_hash, 
          role, 
          avatar, 
          is_verified, 
          kyc_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, role`,
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.role,
          `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
          userData.role === 'ADMIN', // Admins já nascem verificados
          userData.role === 'ORGANIZER' ? 'pending' : 'not_started',
        ]
      );

      const user = result.rows[0];
      console.log(`✅ Usuário criado: ${user.name} (${user.email}) - Role: ${user.role}`);
    }

    console.log('\n✨ Seed de usuários concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed de usuários:', error);
    process.exit(1);
  }
}

// Executar seed
seedUsers();

