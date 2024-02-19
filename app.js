const Agent = require('./agent'); // Импорт агента
const VERSION = 7; // Версия сервера
let teamNameFirst = "teamA"; // ИМЯ команды
let teamNameSecond = "teamB"; // Имя команды противника
let agent = new Agent(teamNameFirst); // Создание экземпляра агента
let agentEnemy = new Agent(teamNameSecond); // Создание экзампляра агента противника
const socket = require('./socket');
socket(agent, teamNameFirst, VERSION) // Настройка сокета
socket(agentEnemy, teamNameSecond, VERSION) // Настройка сокета

let time = 1000

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveCircle(){
    
    agent.socketSend("move", `-15 0`) // Размещение игрока на поле
    agentEnemy.socketSend("move", `-15 0`) 
    while(true){
        // agent.socketSend("turn", `-15`)
        // agentEnemy.socketSend("turn", `-15`)
        agent.socketSend("dash", '100')
        // agentEnemy.socketSend("dash", `100`)
        await sleep(time)
    }
}

agentEnemy.position = "r"
moveCircle()

// async function demo(){
//     while(true){
//         agent.socketSend("move", `15 0`) // Размещение игрока на поле
//         await sleep(time)
//         agent.socketSend("move", `0 0`)
//         await sleep(time)
//         agent.socketSend("move", `-15 -15`)
//         await sleep(time)
//         agent.socketSend("move", `-15 15`)
//         await sleep(time)
//     }
// }

// demo()

