const Msg = require('./msg')
// Подключение модуля разбора сообщений от сервера
const readline = require('readline')
const { Flags, getPos3Flags } = require('./support.js')
// Подключение модуля ввода из командной строки
class Agent {
    constructor(teamName) {
        this.teamName = teamName // Имя своей команды
        this.position = "l" // По умолчанию левая половина поля
        this.run = false // Игра начата
        this.act = null // Действия
        this.rl = readline.createInterface({ // Чтение консоли
            input: process.stdin,
            output: process.stdout
        })
        this.rl.on('line', (input) => {  // Обработка строки из консоли
            if(this.run) { // Если игра начата
        // ДВижения вперед, вправо, влево, удар по мячу
                if("w" == input) this.act = {n: "dash", v: 100}
                if("d" == input) this.act = {n: "turn", v: 20}
                if("a" == input) this.act = {n: "turn", v: -20}
                if("s" == input) this.act = {n: "kick", v: 100}
        }
        })
        this.x = null
        this.y = null
        this.view_mode = null
        this.stamina = null
        this.speed = null
        this.headAngle = null
        this.kick = null
        this.dash = null

    }
    msgGot(msg) { // Получение сообщения
        let data = msg.toString('utf8') // ПРиведение
        this.processMsg(data) // Разбор сообщения
        this.sendCmd() // Отправка команды
    }
    setSocket(socket) { // Настройка сокета
        this.socket = socket
    }
    socketSend(cmd, value) { // Отправка команды
        this.socket.sendMsg(`(${cmd} ${value})`)
    }
    processMsg(msg){ // Обработка сообщения
        let data = Msg.parseMsg(msg) // Разборр сообщения
        if (!data) throw new Error("Parse error\n" + msg)
        // Первое (hear) - начало игры
        if (data.cmd == "hear") this.run = true
        if (data.cmd == "init") this.initAgent(data.p) // Инициализация 
        this.analyzeEnv(data.msg, data.cmd, data.p) // Обработка
    }
    initAgent(p){
        if(p[0] == "r") this.position = "r" // Правая половина поля 
        if(p[1]) this.id = p[1] // id игрока
    }
    analyzeEnv(msg, cmd, p){ // Анализ сообщения
        // console.log(msg)
        if(cmd == "sense_body"){
            for (let obj of p) {
                if (obj.cmd == 'head_angle') {
                    this.head_angle = obj.p[0]
                }
                if (obj.cmd == 'speed') {
                    this.DirectionOfSpeed = obj.p[1]
                }
            }
        }
        if(cmd == "see"){
            // console.log(p)
            let flagsCoord = []
            let flagsDist = []
            
            for (let i = 1; i < p.length; i++) {
                const obj = p[i]
                const objName = obj.cmd.p
                // console.log(objName)
                if(objName.includes('f')) {
                    const flagName = objName.join('')
                    const flagCoords = Flags[flagName]
                    const flagDist = obj.p[0]
                    flagsCoord.push(flagCoords)
                    flagsDist.push(flagDist)
                    if(flagsCoord.length < 3) {
                        flagsCoord.push(flagCoords)
                        flagsDist.push(flagDist)
                    }
                }
            }
            // console.log(p[0])
            // console.log(flagsCoord, flagsDist)

            if (flagsCoord.length === 3){
                res = getPos3Flags(flagsCoord, flagsDist)
                this.x = res.x
                this.y = res.y
            }
            if ((this.x !== null) && (this.y !== null)){
                // console.log("Координаты игрока:")
                // console.log(this.x, this.y)
            }
            for (let i = 1; i < p.length; i++) {
                const obj = p[i]
                const objName = obj.cmd.p
                if (objName.includes('p')){
                    const anotherTeamName = objName[1]
                    if (this.teamName !== anotherTeamName){
                        const enemyDist = obj.p[0]
                        const enemyAngle = this.DirectionOfSpeed + this.head_angle - obj.p[1]
                        const enemyAngleRad = (enemyAngle * 180) / Math.PI
                        // console.log(enemyDist)
                        const enemyX = this.x + Math.cos(enemyAngleRad) * enemyDist
                        const enemyY = this.y + Math.sin(enemyAngleRad) * enemyDist
                        console.log("Координаты противника:")
                        console.log(enemyX, enemyY)
                    }
                }
            }
            
            
        }
    }
    sendCmd(){
        if(this.run){ // Игра начата 
            if(this.act){ // Есть команда от игрока
                if(this.act.n == "kick") // Пнуть мяч
                    this.socketSend(this.act.n, this.act.v + " 0")
                else // Движение и поворот
                    this.socketSend(this.act.n, this.act.v)
            }
            this.act = null // Сброс команды
        }
    }
}
module.exports = Agent // Экспорт игрока