const Transaction = require("../models/Transaction.model")
const router = require("express").Router()
const nodemailer = require("nodemailer");
const isAuth = require("../middlewares/isAuth");
const pdf = require("html-pdf");
const { getFecha, createTable } = require("../functions/date");


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

        const prods = createTable(transaction.products)
        const mes = transaction.createdAt.getMonth()
        const dia = transaction.createdAt.getDate()
        const año = transaction.createdAt.getFullYear()
        console.log(mes, dia, año)

            if(transaction.status == "succeeded"){
                const archivo = 
                `
                <html>
                <head>
                    <style>
                        h1{
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                <h1>Factura</h1>
                <p>${dia}/${mes + 1}/${año}</p>
                <p>A nombre de: ${transaction.customer.nombre} ${transaction.customer.apellido}</p>
                <table>
                    <h2>Productos</h2>
                    <thead>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Corte</th>
                        <th>Total</th>
                    </thead>
                    <tbody>
                    ${prods}
                    </tbody>
                </table>
                <h2>Monto total ${transaction.amount / 100} euros</h2>
                </body>
                </html>
                `

                const pdfPromise = new Promise((resolve, rej)=>{

                    resolve(
                        pdf.create(archivo).toFile("./factura.pdf", (err, res)=>{
                        if(err){
                            console.log(err)
                        }
                        if(res){
                            console.log(res)
                        }
                    })
                    )
                })

                await pdfPromise

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