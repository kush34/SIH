import express from 'express';
import RoadBlock from "../models/roadBlocks.js"
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const roadBlock = new RoadBlock(req.body);
    const saved = await roadBlock.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get('/', async (_req, res) => {
  try {
    const roadBlocks = await RoadBlock.find();
    res.json(roadBlocks);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const roadBlock = await RoadBlock.findById(req.params.id);
    if (!roadBlock) return res.status(404).json({ message: 'Not found' });
    res.json(roadBlock);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await RoadBlock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await RoadBlock.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
