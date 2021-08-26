const {Router}=require('express');
const router = Router();

const {getUsers,createUser,generateLink,usersRefered}=require('../controllers/index.controller')
 
router.get('/users',getUsers)
router.post('/users',createUser);
router.post('/generateLink',generateLink);
router.post('/usersRefered',usersRefered);

module.exports = router;