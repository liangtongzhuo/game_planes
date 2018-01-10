import Sprite from '../base/sprite'
import DataBus from '../databus'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = '../images/hero.png'
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

  // 每一帧更新子弹位置
  update(x_, y_) {
    this.x = parseInt(x_ * screenWidth) - this.width / 2
    this.y = parseInt(y_ * screenHeight) -this.height / 2
  }

}
