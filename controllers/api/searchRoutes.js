const router = require('express').Router();
const { Search } = require('../../models');


router.post('/', async (req, res) => {
    try{
        const searchData = await Search.create({
            artist: req.body.artist,
            artist_id: req.body.artist_id,
            img: req.body.img,
            user_id: req.body.user_id
        });
        res.status(200).json(searchData);
    }catch (err) {
        res.status(400).json(err)
    }
});

module.exports = router;