import DataBus from './databus'
import Enemy from './npc/enemy'

let databus = new DataBus()

/**
 * 
 * web socket 
 */
const ws = new WebSocket('ws://localhost:4001');
ws.onopen = function (e) {
    console.log('open:', e)
}
ws.onmessage = function (e) {
    if (!e.data) return

    const data = JSON.parse(e.data)
    //创建飞机
    if (data.enemy && data.enemy.time && data.enemy.speed && data.enemy.x) {
        let enemy = databus.pool.getItemByClass('enemy', Enemy)
        // 时间戳，速度，x%位置
        enemy.init(data.enemy.time, data.enemy.speed, data.enemy.x)
        databus.enemys.push(enemy)
    }
}
ws.onclose = function (e) {
    console.log('close:', e)
}
ws.onerror = function (e) {
    console.error('error:', e)
}

