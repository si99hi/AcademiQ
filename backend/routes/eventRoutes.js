import express from 'express';
import { createEvent, getEvents } from '../controllers/eventController.js';

const router = express.Router();

router.post('/events', createEvent); // For creating events
router.get('/events', getEvents);    // For fetching events

export default router;
