const Transaction = require("../models/Transaction.model")
const router = require("express").Router()
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "miguelvalden77@gmail.com", // generated ethereal user
      pass: "fzanddymbdbzxfeg", // generated ethereal password
    },
});

router.post("/create", async (req, res, next)=>{

    const {id, client_secret, status} = req.body

    try{
        const transaction = await Transaction.findOneAndUpdate({payment_intent: id, client_secret: client_secret}, {status: status})
    
            await transporter.sendMail({
            from: `"Fred Foo 👻" <${process.env.CORREO}>`, // sender address
            to: `${transaction.customer.correo}, ${process.env.CORREO}`, // list of receivers
            subject: "Hacienda", // Subject line
            html: `Su compra ha sido realizado con éxito por un importe de ${transaction.amount / 100}`, // html body
          });

    }
    catch(err){
        console.log(err)
    }

})

router.post("/changeState/:estado", async (req, res, next)=>{

    const {estado} = req.params
    const {id} = req.body

    if(!estado || !id){
        res.status(400).json({errorMessage: "Faltan datos"})
    }

    try{

        const transaction = await Transaction.findByIdAndUpdate(id, {state: estado})
        console.log(transaction.state, "stateee, trans")
        console.log(estado, "stateee params")
        if(estado == "Enviado"){
            console.log("Estoy dentro")
            await transporter.sendMail({
                from: `"Fred Foo 👻" <${process.env.CORREO}>`, // sender address
                to: transaction.customer.correo, // list of receivers
                subject: "Hacienda", // Subject line
                html: `su pedido ha sido enviado, le llegará en un plao de 2 a 4 días laborables`, // html body
              });
        res.json({succesMessage: "Estado cambiado"})
        return
        }

        res.json({succesMessage: "Estado cambiado"})
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router