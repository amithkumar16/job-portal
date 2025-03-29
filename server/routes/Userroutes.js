import express from 'express'
import { applyforjob, getuserdata, getuserjobapplications, updateuserresume } from '../controllers/UserController.js'
import upload from '../config/multer.js'

const router = express.Router()

router.get('/user',getuserdata)

router.post('/apply',applyforjob)

router.get('/applications',getuserjobapplications)

router.post('/update-resume',upload.single('resume'),updateuserresume)

export default router