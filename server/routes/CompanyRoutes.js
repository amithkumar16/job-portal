import express from 'express';
import { 
    registerCompany,
    logincompany,
    getCompanyData,
    postJob,
    getCompanyJobapplications,
    getCompanyPostedjobs,
    changejobapplications,
    changeVisibilty
} from '../controllers/CompanyController.js';

import upload from '../config/multer.js';
import { protectcompany } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('image'), registerCompany);
router.post('/login', logincompany);
router.get('/company', protectcompany,getCompanyData);
router.post('/post-job', protectcompany, postJob);
router.get('/applications', protectcompany, getCompanyJobapplications);
router.get('/list-jobs',protectcompany, getCompanyPostedjobs);
router.post('/change-status',protectcompany, changejobapplications);
router.post('/change-visibility', protectcompany, changeVisibilty);

export default router;
