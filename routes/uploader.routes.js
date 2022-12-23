const router = require("express").Router()
const uploader = require("../middlewares/uploader")

router.post("/", uploader.single("image"), (req, res, next)=>{

    if(req.file === undefined){
        res.json({errorMessage: "No se puede subir la imagen"})
        return
    }

    res.json({imgUrl: req.file.path})

})

module.exports = router