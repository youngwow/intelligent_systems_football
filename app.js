const Agent = require('./agent'); // Импорт агента
const VERSION = 7; // Версия сервера
let teamName = "teamA"; // ИМЯ команды
let agent = new Agent(); // Создание экземпляра агента
require('./socket')(agent, teamName, VERSION) //Настройка сокета

let time = 3000

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo(){
    while(true){
        agent.socketSend("move", `15 0`) // Размещение игрока на поле
        await sleep(time)
        agent.socketSend("move", `0 0`)
        await sleep(time)
        agent.socketSend("move", `-15 -15`)
        await sleep(time)
        agent.socketSend("move", `-15 15`)
        await sleep(time)
    }
}

demo()

