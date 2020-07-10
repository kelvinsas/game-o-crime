const lugares = ['PRACA',  'CINEMA', 'PREFEITURA', 'TEATRO', 'HOSPITAL', 'RESTAURANTE'];
const armas = ['FACA', 'REVOLVER', 'TESOURA', 'PA', 'VENENO', 'PE DE CABRA'];
const pessoas = ['POLICIAL', 'MEDICO', 'PREFEITO', 'GARCOM', 'MORDOMO', 'ZELADOR', 'ATOR'];
export default function createInterfacepalpite(document, socket) {
    const app = document.getElementById('app');

    // element lugares

    const selectLugares = document.getElementById('selectLugar');

    selectLugares.setAttribute('name', 'selectLugares');
    createOptions(lugares, selectLugares);

    // element armas

    const selectArmas = document.getElementById('selectArma');

    selectArmas.setAttribute('name', 'selectArmas');
    createOptions(armas, selectArmas);

    //element pessoas

    const selectPessoas = document.getElementById('selectPessoa');

    selectPessoas.setAttribute('name', 'selectPessoas');
    createOptions(pessoas, selectPessoas);

    //element enviar
    const buttonEnviar = document.getElementById('btnEnvia');
    buttonEnviar.setAttribute('disabled', true);

    //element avatares
    const divAvatares = document.getElementById('avatares');  

    //element timer
    const progresTimer = document.getElementById('timer');


    //element notificaçao
    const divNotificacao = document.createElement('div');
    divNotificacao.setAttribute('class', 'notificacao')

    //element checks pessoas
    const checkPessoas = document.getElementById('checkPessoas');
    
    //element checks pessoas
    const checkLugares = document.getElementById('checkLugares');
    
    //element checks pessoas
    const checkArmas = document.getElementById('checkArmas');

    //element checks pessoas
    const btnSair = document.getElementById('sair');

    //renderiza na pagina

    app.appendChild(divNotificacao);
    createCheck(pessoas, checkPessoas);
    createCheck(armas, checkArmas);
    createCheck(lugares, checkLugares);

    //acao enviar
    buttonEnviar.onclick = function(){
        const lugar = selectLugares.value;
        const pessoa = selectPessoas.value;
        const arma = selectArmas.value;
        console.log(`> Enviando Palpite Lugar: ${lugar} Arma: ${arma} Pessoa: ${pessoa}`)
        socket.emit('PALPITE', {playerId:socket.id, palpite:{lugar, arma, pessoa}});
        buttonEnviar.disabled = true;
    }


    btnSair.onclick = function(){
        localStorage.removeItem(['nome', 'playerId']);
        sessionStorage.removeItem('logged_crime');
        document.location.href = './index.html'

    }

    socket.on('ITENS', (res) => {
        console.log(`> Seus Itens ${res.itens}`)
        createAvata(res.nomes, divAvatares)
        checkItem(res.itens)
        start();

    })

    
    socket.on('PALPITE_ERRADO', (res) => {
        console.log(`> O Jogador ${res.adversario} tem um dos iten [ ${res.palpite.lugar}, ${res.palpite.arma}, ${res.palpite.pessoa} ]`);
        if(res.playerId !== socket.id){
            notificacao(` O Jogador ${res.adversario} tem um dos iten [ ${res.palpite.lugar}, ${res.palpite.arma}, ${res.palpite.pessoa} ]`, 10000);
        }

    })

    socket.on('VEZ', (res) => {
        console.log(`> Vez do jogador :${res.playerName}`)
        handleTimer();

        if(res.playerId === socket.id){
            buttonEnviar.disabled = false;        
            notificacao(`Sua vez`, 2000);
        }else{
            buttonEnviar.disabled = true;
            
        }  
        
        selectAvatar(res.playerName);
    })

    socket.on('ITEM_ERRADO', (res) => {
        if(res.playerId === socket.id){
            notificacao(`Item errado! ${res.adversario} posue o item ${res.item}`, 5000);
            console.log(`> Item errado! ${res.adversario} posue o item ${res.item}`)
        }  
    })

    socket.on('PASSOU_AVEZ', (res) => {
        
        if(res.playerId === socket.id){
            notificacao(`Você passou a vez!`, 5000);
            
            console.log(`> Passou a vez!`)
        }  
    })

    socket.on('FIM', (res) => {
        
        if(res.playerId === socket.id){
            notificacao(`Parabens voce ganou o jogo!`, 20000);

            console.log(`> Parabens voce ganou o jogo!`)
        }  
        console.log(`> Fim de jogo`)
    })

    function start(){
        var init = 5;
        var end = 0;
        var modal = document.getElementById('modal-start');
        var span = document.querySelector('div#modal-start div span');

        modal.style.display = 'flex';

        var progress = setInterval(function(){ 
            span.innerHTML = '';
            let text = document.createTextNode(init);
            span.appendChild(text);
            
            if(init <= end){
                clearInterval( progress );
                socket.emit('START', true);
                modal.style.display = 'none';
            }
            init = init - 1; 

         }, 1000);
    }

    function selectAvatar(nome){
        
        let avata = document.getElementById(nome);
        var avatares = document.querySelectorAll(".avata");
        for(let i = 0; i < avatares.length; i++){
            avatares[i].setAttribute('class', 'btn btn-info avata');
        }

        avata.setAttribute('class', 'btn btn-info avata active');


    }

    function checkItem(itens){
        var label = document.querySelectorAll('.form-check-label');
        for(let i = 0; i < label.length; i++){
            label[i].setAttribute('class', 'form-check-label');
        }

        var checks = document.querySelectorAll('.form-check-check');
        for(let i = 0; i < checks.length; i++){
            checks[i].checked = false;
        }
        for (let index in itens){
            let check = document.getElementById(`check-${itens[index]}`);
            let label = document.getElementById(`label-${itens[index]}`);
            label.setAttribute('class', 'form-check-label text-danger');
            check.checked = true;

        }
    }

        //funcao para renderizar opcoes do select
        function createAvata(jogadores, element){
            element.innerHTML = '';
            for (let index in jogadores){
                let button = document.createElement('button');
                button.setAttribute('class', 'btn btn-info avata');
                button.setAttribute('id', `${jogadores[index]}`)
                let text = document.createTextNode(jogadores[index]);
                button.appendChild(text);
                element.appendChild(button);
    
            }

           
        }

    //funcao para renderizar opcoes do select
    function createOptions(list, element){

        for (let index in list){
            var opt = document.createElement("option");
                opt.value = list[index];
                opt.text = list[index];
                element.add(opt, element.options[list[index]]);
        }
    }

    function createCheck(list, element){
        element.innerHTML = '';
        for (let index in list){
            // Elementos          
            let div = document.createElement("div");  
            let input = document.createElement("input");
            let label = document.createElement("label");           
            let text = document.createTextNode(list[index]);

            // Atributos
            div.setAttribute('class', 'form-check');
            input.setAttribute('class', 'form-check-input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', `check-${list[index]}`);
            label.setAttribute('class', 'form-check-label');
            label.setAttribute('id', `label-${list[index]}`);
            label.setAttribute('for', `check-${list[index]}`);

            //Renderiza
            label.appendChild(text);
            div.appendChild(input);
            div.appendChild(label);

            element.appendChild(div);

        }
    }

    function handleTimer(){
        progresTimer.style.width = `0%`
        var init = 1000;
        var time = 20000;
        var progress = setInterval(function(){ 
            let fracao = (100*init)/time;
            if(init >= time){
                clearInterval( progress );
            }
            progresTimer.style.width = `${fracao}%`
            init = init + 1000; 

         }, 1000);
   
    }

    function notificacao(texto, timeout){
        divNotificacao.innerHTML = '';
        let text = document.createTextNode(texto);
        let spanNotificacao = document.createElement('span');
        spanNotificacao.setAttribute('class', 'text-notificacao');
        spanNotificacao.appendChild(text);
        divNotificacao.appendChild(spanNotificacao);
        divNotificacao.style.display = 'flex';
        divNotificacao.onclick = function(){
            divNotificacao.style.display = 'none';
        }
        setTimeout(()=>{
            divNotificacao.style.display = 'none';
        },timeout)
    }


}    