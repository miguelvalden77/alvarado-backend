const Transaction = require("../models/Transaction.model")
const router = require("express").Router()
const nodemailer = require("nodemailer");
const isAuth = require("../middlewares/isAuth");
const pdf = require("html-pdf")


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
    
            if(transaction.status == "succeeded"){
                const archivo = `<h1>Factura exitosa</h1>
                <p>Dinero gastado ${transaction.amount}</p>`

                pdf.create(archivo).toFile("./factura.pdf", (err, res)=>{
                    if(err){
                        console.log(err)
                    }
                    if(res){
                        console.log(res)
                    }
                })

                await transporter.sendMail({
                from: `"Fred Foo 👻" <${process.env.CORREO}>`, // sender address
                to: `${transaction.customer.correo}, ${process.env.CORREO}`, // list of receivers
                subject: "Hacienda", // Subject line
                html: `Su compra ha sido realizado con éxito por un importe de ${transaction.amount / 100}`, // html body
                attachments: [{
                    filename: "factura.pdf",
                    path: "./factura.pdf"
                }]
                });

                res.json({succesMessage: "hola"})
                return
            }

    }
    catch(err){
        console.log(err)
    }

})

router.post("/changeState/:estado", isAuth, async (req, res, next)=>{

    const {estado} = req.params
    const {id} = req.body

    if(!estado || !id){
        res.status(400).json({errorMessage: "Faltan datos"})
        return
    }

    try{

        const transaction = await Transaction.findByIdAndUpdate(id, {state: estado})

        if(estado == "Enviado"){
            await transporter.sendMail({
                from: `"Fred Foo 👻" <${process.env.CORREO}>`, // sender address
                to: transaction.customer.correo, // list of receivers
                subject: "Hacienda", // Subject line
                html: `su pedido ha sido enviado, le llegará en un plao de 2 a 4 días laborables`, // html body
              });
        res.json({succesMessage: "Estado cambiado"})
        }

        const transactions = await Transaction.find({status: "requires_payment_method"})

        if(transactions.length > 0){
            transactions.forEach(async (e)=>{
                await Transaction.findByIdAndDelete(e._id)
            })
        }
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router