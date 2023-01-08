const router = require("express").Router()
const isAuth = require("../middlewares/isAuth")
const uploader = require("../middlewares/uploader")

router.post("/", isAuth, uploader.single("image"), (req, res, next)=>{

    if(req.file === undefined){
        res.json({errorMessage: "No se puede subir la imagen"})
        return
    }

    res.json({imgUrl: req.file.path})

})

module.exports = router