import express from 'express'
import { getjobbyid, getjobs } from '../controllers/JobController.js'

const router = express.Router()

//Route to get all jobs data
router.get('/',getjobs)
//route to get a single job by id
router.get('/:id',getjobbyid)

export default router