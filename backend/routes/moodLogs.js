import { Router } from 'express';

const createMoodLogsRouter = (pool) => {
  const router = Router();

  router.post('/', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { userId, title } = req.body ?? {};

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO mood_logs (user_id, title) VALUES ($1, $2) RETURNING *',
        [userId, title ?? null]
      );
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create mood log' });
    }
  });

  router.put('/:id', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const logId = Number(req.params.id);
    const { title } = req.body ?? {};

    if (!Number.isFinite(logId)) {
      return res.status(400).json({ error: 'Invalid mood log id' });
    }

    try {
      const result = await pool.query(
        `
          UPDATE mood_logs
          SET
            title = COALESCE($1, title),
            updated_at = NOW()
          WHERE id = $2
          RETURNING *
        `,
        [title ?? null, logId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Mood log not found' });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update mood log' });
    }
  });

  router.delete('/:id', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const logId = Number(req.params.id);

    if (!Number.isFinite(logId)) {
      return res.status(400).json({ error: 'Invalid mood log id' });
    }

    try {
      const result = await pool.query('DELETE FROM mood_logs WHERE id = $1 RETURNING *', [
        logId,
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Mood log not found' });
      }

      return res.json({ deleted: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete mood log' });
    }
  });

  return router;
};

export default createMoodLogsRouter;
