import { Router } from 'express';

const createMoodEntriesRouter = (pool) => {
  const router = Router();

  router.post('/', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { userId, moodLogId, content } = req.body ?? {};

    if (!userId || !moodLogId || !content) {
      return res
        .status(400)
        .json({ error: 'userId, moodLogId, and content are required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO mood_entries (user_id, mood_log_id, content) VALUES ($1, $2, $3) RETURNING *',
        [userId, moodLogId, content]
      );
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create mood entry' });
    }
  });

  router.put('/:id', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const entryId = Number(req.params.id);
    const { content } = req.body ?? {};

    if (!Number.isFinite(entryId)) {
      return res.status(400).json({ error: 'Invalid mood entry id' });
    }

    try {
      const result = await pool.query(
        `
          UPDATE mood_entries
          SET
            content = COALESCE($1, content),
            updated_at = NOW()
          WHERE id = $2
          RETURNING *
        `,
        [content ?? null, entryId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Mood entry not found' });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update mood entry' });
    }
  });

  router.delete('/:id', async (req, res) => {
    if (!pool) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const entryId = Number(req.params.id);

    if (!Number.isFinite(entryId)) {
      return res.status(400).json({ error: 'Invalid mood entry id' });
    }

    try {
      const result = await pool.query(
        'DELETE FROM mood_entries WHERE id = $1 RETURNING *',
        [entryId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Mood entry not found' });
      }

      return res.json({ deleted: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete mood entry' });
    }
  });

  return router;
};

export default createMoodEntriesRouter;
