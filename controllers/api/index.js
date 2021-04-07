const router = require('express').Router();
//need route
const userRoutes = require('./userRoutes');

router.use('/users', userRoutes);

module.exports = router;