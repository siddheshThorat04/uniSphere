const express=require('express')

const addCollege=require('../controllers/adminController').addCollege
const addMeet=require('../controllers/adminController').addMeet
const getColleges=require('../controllers/adminController').getColleges
const deleteMeet=require('../controllers/adminController').deleteMeet
const getLeadboard=require('../controllers/adminController').getLeadboard
const deleteNews=require('../controllers/adminController').deleteNews
const deleteEvent=require('../controllers/adminController').deleteEvent
// const { getAdmins, getAdmin } = require('../controllers/adminController')
const router=express.Router()

router.post("/addCollege",addCollege)
router.post("/addMeet",addMeet)
router.get('/getClg', getColleges )
router.post('/deleteMeet/:id', deleteMeet )
router.post('/deleteNews/:id', deleteNews )
router.post('/deleteEvent/:id', deleteEvent )   
router.get('/getLeadboard', getLeadboard )

module.exports=router