
const mes = (num) => {
    switch (num) {
        case 1: return "Enero"
            break
        case 2: return "Febrero"
            break
        case 3: return "Marzo"
            break
        case 4: return "Abril"
            break
        case 5: return "Mayo"
            break
        case 6: return "Junio"
            break
        case 7: return "Julio"
            break
        case 8: return "Agosto"
            break
        case 9: return "Septiembre"
            break
        case 10: return "Octubre"
            break
        case 11: return "Noviembre"
            break
        case 12: return "Dicembre"
            break
    }
}

const getFecha = (fecha) => {

    const splitFecha = fecha.split("-")

    return `${splitFecha[2].slice(0, 2)} de ${mes(splitFecha[1])} de ${splitFecha[0]}`
}

// const getResultMonth = (month) => {

//     if(Number(month) == 12)
// }

const createTable = (arr) => {

    let str = ""

    arr.forEach(obj => {
        let total = obj.cantidad * obj.product.price + (obj.product.corte * obj.corte)
        let html = `
        <tr>
            <td>${obj.product.name}</td>
            <td>${obj.cantidad}</td>
            <td>${!obj.corte ? "No" : `${obj.corte} (${obj.product.corte})`}</td>
            <td>${!obj.corte ? obj.cantidad * obj.product.price : total}</td>
        </tr>
        `
        str += html
    })

    return str
}

module.exports = { getFecha, mes, createTable }