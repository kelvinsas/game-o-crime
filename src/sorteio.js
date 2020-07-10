const lugares = ['PRACA',  'CINEMA', 'PREFEITURA', 'TEATRO', 'HOSPITAL', 'RESTAURANTE'];
const armas = ['FACA', 'REVOLVER', 'TESOURA', 'PA', 'VENENO', 'PE DE CABRA'];
const pessoas = ['POLICIAL', 'MEDICO', 'PREFEITO', 'GARCOM', 'MORDOMO', 'ZELADOR', 'ATOR'];

var jogadores = {};
var crime = {};
var resto = {};

export default function createSorteio() {


        jogadores = {1:[],2:[],3:[],4:[]};
        crime = {};
        resto = {}
        Sorteio();
        return {jogadores,crime};    
 

}


const Sorteio = () => {
    crime = getCrime();
    resto = lugares.concat(armas, pessoas);

    sorteiaItem();

    function getCrime(){
     
        var lugar = sorteiaUm(lugares);
        var arma = sorteiaUm(armas);
        var pessoa = sorteiaUm(pessoas);

        excluiItem(lugares, lugar);
        excluiItem(armas, arma);
        excluiItem(pessoas, pessoa);

        return {lugar, arma, pessoa};
    }


    function sorteiaUm(array){
        let indice = Math.floor(Math.random() * array.length);
        return array[indice];
    }

    function sorteiaItem(){

        let jogador = 1;

        while(resto.length > 0){
            let item = sorteiaUm(resto);
            excluiItem(resto, item);
            jogadores[jogador].push(item);
            if(jogador < 4){
                jogador++;
            }else{
                jogador = 1;
            }
        }

    }

    function excluiItem(array, item){
        let indice = array.indexOf(item);
        return array.splice(indice, 1);
    }

}
