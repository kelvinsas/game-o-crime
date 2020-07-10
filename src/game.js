import createSorteio from './sorteio.js'
import createBot from './bot.js'

const lugares = ['PRACA',  'CINEMA', 'PREFEITURA', 'TEATRO', 'HOSPITAL', 'RESTAURANTE']
const armas = ['FACA', 'REVOLVER', 'TESOURA', 'PA', 'VENENO', 'PE DE CABRA']
const pessoas = ['POLICIAL', 'MEDICO', 'PREFEITO', 'GARCOM', 'MORDOMO', 'ZELADOR', 'ATOR']

export default function createGame() {

    const state = {
        jogadores: { 1:{nome:'Jogador 1',io:'',itens:[]},
                     2:{nome:'Jogador 2',io:'',itens:[]},
                     3:{nome:'Jogador 3',io:'',itens:[]},
                     4:{nome:'Jogador 4',io:'',itens:[]}, 
                    },
        crime : {},
        sorteio:false,
        init:false,
        vez: 1,
        win:false, 
    }

    const observers = []
    const palpites = []

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function addPlayer(player){
        state.jogadores[1].io = player.playerId;
        state.jogadores[1].nome = player.nome;
               
    }

    function removePlayer(playerId){
        state.jogadores[1].io = '';
    }

    function sorteia(){
        const resultado = createSorteio();

        Object.keys(state.jogadores).forEach(function(jogador){
            state.jogadores[jogador].itens = resultado.jogadores[jogador];
        });

        state.crime = resultado.crime;
        state.sorteio = true;
        //state.vez = Math.floor(Math.random() * 4, 1)+ 1 //sorteia jogador para iniciar
        
    }


    function start(){

            let jogador = state.jogadores[state.vez];
            let play = state.vez;
            state.start = true;
            notifyAll({
                type: 'VEZ',
                playerId: jogador.io,
                playerName: jogador.nome,
            });

            setTimeout(() =>{
                if(state.vez === play && !state.win){
                    proximoJogador();
                    notifyAll({
                        type: 'PASSOU_AVEZ',
                        playerId: state.jogadores[state.vez-1].io,
                    });
                }
            },21000);
    
    } 
    
    
    function testaPalpite(req){

        if(req.playerId === state.jogadores[state.vez].io){
            console.log(`> Analisando palpite do ${state.jogadores[state.vez].nome}`);

            let crime = state.crime;
            let palpite = req.palpite;

            if(palpite.lugar === crime.lugar && palpite.arma === crime.arma && palpite.pessoa === crime.pessoa){
               
                palpites.push({jogador:state.vez, palpite, certo: true});
                notifyAll({
                    type: 'FIM',
                    playerName: state.jogadores[state.vez].nome,
                    playerId: state.jogadores[state.vez].io,
                });
                console.log(`> Parabens ${state.jogadores[state.vez].nome} você desvendou o crime!`);
                state.win = true;
                
            }else{
                let resposta = encontraIten(palpite);
                if(resposta){
                    palpites.push({jogador:state.vez, palpite, adversario: resposta.jogador, item: resposta.item});
                }   
                notifyAll({
                    type: 'PALPITE_ERRADO',
                    playerId: state.jogadores[state.vez].io,
                    adversario: state.jogadores[resposta.jogador].nome,
                    palpite,
                });
                console.log('> Palpite incorreto. Proximo Jogador'); 
                
                proximoJogador();
               
            }    
        }
        
    }

    function proximoJogador(){
        
        if(state.vez < 4){
            state.vez++;
        }else{
            state.vez = 1;
        }

        let jogador = state.jogadores[state.vez];
        let play = state.vez;   
        notifyAll({
            type: 'VEZ',
            playerId: jogador.io,
            playerName: jogador.nome,
        });
        setTimeout(() =>{
            if(state.vez === play && !state.win){
                proximoJogador();
                notifyAll({
                    type: 'PASSOU_AVEZ',
                    playerId: state.jogadores[state.vez -1].io,
                });
            }
        },21000);

        if(jogador.io === ''){
            const bot = createBot();
            bot.start(jogador, palpites, state.vez);
            setTimeout(() =>{
                testaPalpite({playerId: jogador.io, palpite:bot.palpitar()});
            },15000);
            
        }    
    }

    function encontraIten(palpite){
        let play = (state.vez + 1 <= 4)? state.vez+1 : 1;
        let card = false;

        while(!card){
            let adver = state.jogadores[play];
            let igual = adver.itens.find(item => palpite.lugar === item || palpite.arma === item || palpite.pessoa === item);

            if(igual !== undefined){
                card = true
                console.log ('> O jogador '+adver.nome+' possue '+igual);
                notifyAll({
                    type: 'ITEM_ERRADO',
                    playerName: state.jogadores[state.vez].nome,
                    playerId: state.jogadores[state.vez].io,
                    to:true,
                    adversario:adver.nome,
                    item: igual
                });
                return { jogador: play, item: igual};
            }
            
    
            if(play < 4){
                play++;
            }else{
                play = 1;
            }
               
        }
        return null;
    
    }


    return {
        start,
        state,
        testaPalpite,
        removePlayer,
        addPlayer,
        subscribe,
        sorteia
    }

}

/*
const jogadores= {
            1:{nome:'Jogador 1',io:'ss',itens:[],palpites:[]},
            2:{nome:'Jogador 2',io:'',itens:[],palpites:[]},
            3:{nome:'Jogador 3',io:'',itens:[],palpites:[]},
            4:{nome:'Jogador 4',io:'',itens:[],palpites:[]}, 
        };
var play = Math.floor(Math.random() * 4, 1)+ 1; // sorteia um jogador para comecar
var win = false;                                // variavel que indica fin do jogo
 


start();

function start(){
    console.log('Iniciando Script ...');
    if(win === true){
        win = false;
        crime =[];
        palpites =[];

        play = Math.floor(Math.random() * 4, 1)+ 1;
    }

    const resultado = sorteio.run(); 
 

    /** Atribue itens a jogadores
    Object.keys(jogadores).forEach(function(jogador){
        jogadores[jogador].itens = resultado.jogadores[jogador];
        jogadores[jogador].palpites = [];
    });
    console.log(jogadores)
    /**Atribur o crime 
    crime = resultado.crime;
    console.log(crime);


    /** Fuxo 


    fluxo();
}

async function fluxo(){
    while(!win){
        let jogador = jogadores[play];
        let palpite = [];

        console.log('Qual seu palpite '+(jogador.nome));
        if(jogador.io !== ''){
            palpite = await recebePalpite();
        }else{
             palpite = await bot(play, jogador.itens, palpites); 
            
        }

        console.log(palpite);

        if(palpite.lugar === crime.lugar && palpite.arma === crime.arma && palpite.pessoa === crime.pessoa){
            win = true;
            palpites.push({jogador:play, palpite, certo: true});
            console.log('Parabens '+(jogador.nome)+ ' você desvendou o crime!');
            if(pergunta('Deseja recomecar', ['sim', 'nao']) === 'sim'){
                start();
            }
            
        }else{
            console.log('Palpite incorreto. Proximo Jogador');
            let resposta = naoE(play, palpite);
            if(resposta){
                jogador.palpites.push({play, palpite, adversario: resposta.play, item: resposta.igual});
            }    
            
        }

        if(play < 4){
            play++;
        }else{
            play = 1;
        }
    }

}

async function recebePalpite (){

    var pessoa = await pergunta('Quem cometeu o crime ?', pessoas);
    var arma = await pergunta('Qual foi a arma ?', armas);
    var lugar = await pergunta('Onde aconteceu ?', lugares);
    
    return {lugar, arma, pessoa};

}

function pergunta(quest, itens){
    
   let indice = readlineSync.keyInSelect(itens, quest);
   return itens[indice] ;

}

function naoE(jogador, palpite){
    let play = (jogador + 1 <= 4)? jogador+1 : 1;
    let card = false;

    while(!card){

        let adver = jogadores[play];
        let igual = adver.itens.find(item => palpite.lugar === item || palpite.arma === item || palpite.pessoa === item);

        if(igual !== undefined){
            card = true
            console.log ('O jogador '+adver.nome+' possue '+igual);
            return { jogador: play, item: igual};
        }else{
            return null;
        }
        

        if(play < 4){
            play++;
        }else{
            play = 1;
        }
           
    }

}

*/