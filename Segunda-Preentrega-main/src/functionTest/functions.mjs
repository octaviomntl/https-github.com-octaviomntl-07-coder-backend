//Notemos que la función admite cualquier string, pero si el número es negativo o decimal, el caracter '-', '.' y ',' hace que retorne false, por lo que solo admite naturales y el 0. Luego el 0 tomado en un if es false, por lo que sirve para números naturales como se pretendía.
//Esta función fue creada ya que los id que necesito, tienen que ser solo números. Y el problema es que si yo parseo 2f354df por ejemplo, lo toma como el número 2 y eso está mal. Además si pongo números con punto también me los transforma en enteros. 
export function soloNumero(num) {
    for (let i of String(num)) {
        if (isNaN(parseInt(i))) {
            return false
        }
    }
    return parseInt(num)
}

export function unoMenosUno(num) {
    if(num == -1 || num == 1){
        return parseInt(num)
    }
    return false
}