import Sprite from '../base/sprite'
import DataBus from '../databus'
import Bullet from '../player/bullet'


const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = '../images/other.png'
const PLAYER_WIDTH = 80
const PLAYER_HEIGHT = 80


let databus = new DataBus()


export default class Other extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)
    this.id = ''
  }

  init(id, x_, y_) {
    this.id = id
    this.x = parseInt(x_ * screenWidth)
    this.y = parseInt(y_ * screenHeight)
  }

  // 每一帧更新位置
  update(x_, y_) {
    this.x = parseInt(x_ * screenWidth) 
    this.y = parseInt(y_ * screenHeight) 
  }

    /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    let bullet = databus.pool.getItemByClass('bullet', Bullet)

    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      10
    )

    databus.bullets.push(bullet)
  }

}
