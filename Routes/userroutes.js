const express = require('express');

const router = express.Router();

const { register, login } = require('../Controller/usercontroller');

const { googleLogin } = require('../Controller/googlelogin');

const { getProfile } = require('../Controller/userprofile');

const { contact } = require('../Controller/usercontact');

const {
  addBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog
} = require('../Controller/useraddblog');

const blogUpload = require('../Controller/uploadblog');

const {
  addInterview,
  getAllInterviews,
  editInterview,
  deleteInterview
} = require('../Controller/userinterview');

const {
  addCategory,
  getAllCategories,
  editCategory,
  deleteCategory
} = require('../Controller/usercategory');

const {
  addInsight,
  getAllInsights,
  editInsight,
  deleteInsight
} = require('../Controller/userinsight');

const interviewUpload = require('../Controller/uploadinterview');

const insightUpload = require('../Controller/uploadinsight');

const authMiddleware = require('../Middleware/auth');


router.post('/register', register);

router.post('/login', login);

router.post('/google-login', googleLogin);

router.get('/me', authMiddleware, getProfile);

router.post('/contact', contact);


// BLOG
router.post('/addblog', blogUpload.single('Image'), addBlog);

router.get('/blogs', getAllBlogs);

router.delete('/blogs/:id', deleteBlog);

router.put('/updateblog/:id', blogUpload.single('Image'), updateBlog);


// INTERVIEW
router.post('/addInterview', interviewUpload.single('Image'), addInterview);

router.get('/interviews', getAllInterviews);

router.put('/updateinterview/:id', interviewUpload.single('Image'), editInterview);

router.delete('/interviews/:id', deleteInterview);


// INSIGHT
router.post('/addInsight', insightUpload.single('Image'), addInsight);

router.get('/insights', getAllInsights);

router.put('/updateInsight/:id', insightUpload.single('Image'), editInsight);

router.delete('/insights/:id', deleteInsight);


// CATEGORY
router.post('/Categorys', addCategory);

router.get('/Categorys', getAllCategories);

router.put('/Categorys/:id', editCategory);

router.delete('/Categorys/:id', deleteCategory);


module.exports = router;