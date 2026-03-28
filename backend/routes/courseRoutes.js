import express from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse, enrollInCourse, getEnrolledCourses } from '../controllers/courseController.js';
import { protect, instructor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, instructor, createCourse);
router.get('/', getAllCourses);
router.get('/enrolled', protect, getEnrolledCourses);
router.get('/:id', getCourseById);
router.put('/:id', protect, instructor, updateCourse);
router.post('/:id/enroll', protect, enrollInCourse);

export default router;