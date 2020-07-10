import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import createGame from './game.js'


const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

//servidor estatico http
app.use(express.static('public'));

const game = createGame();

game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`)
    if(command.to ){
        if(command.playerId !== ''){
            sockets.to(command.playerId).emit(command.type, command)
        }
    }else{
        sockets.emit(command.type, command)
    }    
})

sockets.on('connection', (socket) => {
    const playerId = socket.id

    socket.on('REGISTRA',(req) =>{
        game.addPlayer(req);
        console.log(`> Player Resistred: ${req.nome}`)
        if(!game.state.sorteio){
           game.sorteia();
        }
        if(!game.state.start){
            const jogadores = game.state.jogadores;
            var nomes = [];
            Object.keys(jogadores).forEach(function(jogador){
                nomes.push(jogadores[jogador].nome)
            });
            const itens = game.state.jogadores[1].itens;
            console.log(`> Emitting ITENS para: ${playerId}`)
            socket.emit('ITENS', {itens, nomes}).to(playerId);
        }

    })

    socket.on('START',(req) =>{
        game.start();
    })


    console.log(`> Player connected: ${playerId}`)

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${playerId}`)
        game.removePlayer(playerId);
    })

    socket.on('PALPITE',(req) =>{
        game.testaPalpite(req)
    })

})





server.listen(3000, () => {
    console.log('> Server listening on port: 3000');
});