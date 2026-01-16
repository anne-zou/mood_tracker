const requirePool = (pool) => {
  if (!pool) {
    throw new Error('Database not configured');
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const mapUser = (row) => ({
  id: row.id,
  email: row.email,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
};

export const userTypeDefs = `
  type User {
    id: ID!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }
`;

export const userQueryFields = `
  users: [User!]!
  user(id: ID!): User
`;

export const userMutationFields = `
  createUser(email: String!, password: String!): User!
  deleteUser(id: ID!): DeleteResponse!
  login(email: String!, password: String!): AuthPayload!
  updatePassword(email: String!, currentPassword: String!, newPassword: String!): User!
`;

export const createUserResolvers = (pool) => ({
  users: async () => {
    requirePool(pool);
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    return result.rows.map(mapUser);
  },
  user: async ({ id }) => {
    requirePool(pool);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [Number(id)]);
    if (result.rowCount === 0) {
      return null;
    }
    return mapUser(result.rows[0]);
  },
  createUser: async ({ email, password }) => {
    requirePool(pool);
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, passwordHash]
    );
    return mapUser(result.rows[0]);
  },
  deleteUser: async ({ id }) => {
    requirePool(pool);
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [
      Number(id),
    ]);

    if (result.rowCount === 0) {
      throw new Error('User not found');
    }

    return { deleted: true };
  },
  login: async ({ email, password }) => {
    requirePool(pool);
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const storedHash = user.password_hash;

    if (!storedHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, storedHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ sub: String(user.id) }, getJwtSecret(), {
      expiresIn: '7d',
    });

    return { user: mapUser(user), token };
  },
  updatePassword: async ({ email, currentPassword, newPassword }) => {
    requirePool(pool);
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const storedHash = user.password_hash;

    if (!storedHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(currentPassword, storedHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const nextHash = await bcrypt.hash(newPassword, 12);
    const updateResult = await pool.query(
      `
        UPDATE users
        SET
          password_hash = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `,
      [nextHash, user.id]
    );

    if (updateResult.rowCount === 0) {
      throw new Error('User not found');
    }

    return mapUser(updateResult.rows[0]);
  },
});
