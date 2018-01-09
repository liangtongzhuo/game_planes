import Animation from '../base/animation'
import DataBus from '../databus'
// 飞机
const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH = 60
const ENEMY_HEIGHT = 60
// 爆炸
const EXPLO_IMG_PREFIX = 'images/explosion'
const EXPLO_FRAME_COUNT = 19


let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initExplosionAnimation()
  }

  init(time, speed, x) {
    this.x = x * window.innerWidth
    this.y = -this.height
    this.speed = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新子弹位置
  update() {
    this.y += this.speed

    // 对象回收
    databus.removeEnemey()

  }
}
