import { Router } from 'express';

const createUsersRouter = (pool) => {
  const router = Router();

  router.post('/', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { email, name } = req.body ?? {};

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
        [email, name ?? null]
      );
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create user' });
    }
  });

  router.put('/:id', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const userId = Number(req.params.id);
    const { email, name } = req.body ?? {};

    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    try {
      const result = await pool.query(
        `
          UPDATE users
          SET
            email = COALESCE($1, email),
            name = COALESCE($2, name),
            updated_at = NOW()
          WHERE id = $3
          RETURNING *
        `,
        [email ?? null, name ?? null, userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update user' });
    }
  });

  router.delete('/:id', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const userId = Number(req.params.id);

    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [
        userId,
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({ deleted: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  return router;
};

export default createUsersRouter;
