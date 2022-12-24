const router = require("express").Router()


router.post("/create", async (req, res, next)=>{

    const {ownerId} = req.body

    try{
        
    }
    catch(err){
        console.log(err)
    }

})

module.exports = router