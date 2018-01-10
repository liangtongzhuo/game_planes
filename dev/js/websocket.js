import DataBus from './databus'
import Enemy from './npc/enemy'
import Other from './npc/other'


let databus = new DataBus()

/**
 * 
 * web socket 
 */
const ws = new WebSocket('ws://localhost:4001');
ws.onopen = function (e) {
    console.log('open:', e)
}

/**
 * 服务器发送过来的状态
 * @param {* 事件} e 
 */
ws.onmessage = function (e) {
    if (!e.data) return

    const data = JSON.parse(e.data)
    // 创建飞机
    if (data.enemy && data.enemy.time && data.enemy.speed && data.enemy.x) {
        let enemy = databus.pool.getItemByClass('enemy', Enemy)
        // 时间戳，速度，x%位置
        enemy.init(data.enemy.time, data.enemy.speed, data.enemy.x)
        databus.enemys.push(enemy)
    }

    // 创建其他用户飞机
    if (data.arr) {
        // 根据 id 查找，如果没有再添加
        for (let i = 0; i < data.arr.length; i++) {
            const air = data.arr[i]
            let bool = false

            for (let j = 0; j < databus.others.length; j++) {
                const other = databus.others[j]
                if (other.id === air.id) {
                    other.update(air.aircraft.x, air.aircraft.y)
                    bool = true
                }
            }
            // 创建其他飞机，不是我自己
            if (!bool && air.id !== databus.id) {
                let other = databus.pool.getItemByClass('other', Other)
                // 时间戳，速度，x%位置
                other.init(air.id, air.aircraft.x, air.aircraft.y)
                databus.others.push(other)
            }
        }
    }


}
ws.onclose = function (e) {
    console.log('close:', e)
}
ws.onerror = function (e) {
    console.error('error:', e)
}

const data = {}
// 向服务器发送状态
setInterval(() => {
    // 飞机状态
    data.aircraft = databus.aircraft
    data.id = databus.id
    ws.send(JSON.stringify(data))
}, 1000 / 30);
