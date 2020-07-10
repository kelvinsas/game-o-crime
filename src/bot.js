var lugares = ['PRACA',  'CINEMA', 'PREFEITURA', 'TEATRO', 'HOSPITAL', 'RESTAURANTE'];
var armas = ['FACA', 'REVOLVER', 'TESOURA', 'PA', 'VENENO', 'PE DE CABRA'];
var pessoas = ['POLICIAL', 'MEDICO', 'PREFEITO', 'GARCOM', 'MORDOMO', 'ZELADOR', 'ATOR'];


export default function createBot() {

    const state = {
        meuPalpite: { lugar : '',arma: '',pessoa: '' },
        itensEliminados:[],
    }

    function start(jogador, palpites, playerId){
        lugares = ['PRACA',  'CINEMA', 'PREFEITURA', 'TEATRO', 'HOSPITAL', 'RESTAURANTE'];
        armas = ['FACA', 'REVOLVER', 'TESOURA', 'PA', 'VENENO', 'PE DE CABRA'];
        pessoas = ['POLICIAL', 'MEDICO', 'PREFEITO', 'GARCOM', 'MORDOMO', 'ZELADOR', 'ATOR'];
        state.itensEliminados = jogador.itens;
        eliminaItensExpostos(palpites, playerId);
    }

    function eliminaItensExpostos(palpites, play){
        Object.keys(palpites).forEach(function(key){
            if( palpites[key].jogador === play){
                
                if(!existeItem(state.itensEliminados, palpites[key].item)){
                    state.itensEliminados.push(palpites[key].item)
                }
            }
        });
    }

    function palpitar(){
        const palpite = selecionaItem();
        return palpite;
    }
    
    function selecionaItem(){
        state.itensEliminados.forEach(item => {
            excluiItem(lugares, item);
            excluiItem(pessoas, item);
            excluiItem(armas, item);   
        });

        return {
            lugar: sorteiaUm(lugares),
            arma: sorteiaUm(armas),
            pessoa: sorteiaUm(pessoas),
        }
    }

    function excluiItem(array, item){
        let indice = array.indexOf(item);
        if(indice > -1){
            return array.splice(indice, 1);
        }   
        return null;
    }

    function sorteiaUm(array){
        let indice = Math.floor(Math.random() * array.length);
        return array[indice];
    }

    function existeItem(array, item){
        let indice = array.indexOf(item);
        if(indice > -1){
            return true;
        }else{   
            return false;
    
        }
    }
    
    return {
        start,
        palpitar,
    }

}    
/*
const bot = (jogador,meusItens, palpites) => {

    itensEliminados = meusItens;
    eliminaItensEspostos(palpites, jogador);
    palpite();
    
    return meuPalpite;
}

async function palpite(){
    selecionaLugar(itensEliminados);
    selecionaPessoa(itensEliminados);
    selecionaArma(itensEliminados);

}

function selecionaLugar(meusItens){
    meusItens.forEach(item => {
         excluiItem(lugares, item);   
    });
    meuPalpite.lugar = sorteiaUm(lugares);
}

function selecionaPessoa(meusItens){
    meusItens.forEach(item => {
        excluiItem(pessoas, item);   
   });
   meuPalpite.pessoa = sorteiaUm(pessoas);
}

function selecionaArma(meusItens){
    meusItens.forEach(item => {
        excluiItem(armas, item);   
   });

   meuPalpite.arma = sorteiaUm(armas);
}

function eliminaItensEspostos(palpites, play){
    Object.keys(palpites).forEach(function(key){
        if( palpites[key].jogador === play){
            
            if(!existeItem(itensEliminados, palpites[key].item)){
                itensEliminados.push(palpites[key].item)
            }
        }
    });
}

function sorteiaUm(array){
    let indice = Math.floor(Math.random() * array.length);
    return array[indice];
}

function sorteiaItem(){
    console.log('Sorteando Itens ...');
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
    if(indice > -1){
        return array.splice(indice, 1);
    }   
    return null;
}

function existeItem(array, item){
    let indice = array.indexOf(item);
    if(indice > -1){
        return true;
    }else{   
        return false;

    }
}

module.exports = {bot};*/