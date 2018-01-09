import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance)
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame = 0
    this.score = 0
    this.bullets = []
    this.enemys = []
    this.animations = []
    this.gameOver = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey() {
    for (let i = 0; i < this.enemys.length; i++) {
      const enemy = this.enemys[i];
      // 是否出边界
      if (enemy.y > window.innerHeight + enemy.height) {
        this.enemys.splice(i, 1)
        enemy.visible = false
        this.pool.recover('enemy', enemy)
      }
    }

  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {

    let temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
}
