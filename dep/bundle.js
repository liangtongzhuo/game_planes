/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_pool__ = __webpack_require__(10);


const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let instance

/**
 * 全局状态管理器
 */
class DataBus {
  constructor() {
    if (instance)
      return instance

    instance = this

    this.pool = new __WEBPACK_IMPORTED_MODULE_0__base_pool__["a" /* default */]()

    this.frame = 0
    this.score = 0
    this.bullets = []
    this.enemys = []
    this.others = []
    this.wreck = []
    this.animations = []
    this.gameOver = false
    this.aircraft = {}
    this.id = parseInt(Math.random() * 1000000)
  }

  // 继续
  restart() {
    this.score = 0
    this.gameOver = false
  }

  /**
   * 边界判断回收敌人，进入对象池
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
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      // 是否出边界
      if (bullet.y <  -bullet.height) {
        this.bullets.splice(i, 1)
        bullet.visible = false
        this.pool.recover('bullet', bullet)
      }
    }
  }

  /**
   * 设置飞机状态
   */
  setAircraft(x, y) {
    this.aircraft.x = x / screenWidth
    this.aircraft.y = y / screenHeight
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DataBus;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * 游戏基础的精灵类
 */
class Sprite {
  constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0) {
    this.img = new Image()
    this.img.src = imgSrc

    this.width = width
    this.height = height

    this.x = x
    this.y = y

    this.visible = true
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if (!this.visible)
      return

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    let spX = sp.x + sp.width / 2
    let spY = sp.y + sp.height / 2

    if (!this.visible || !sp.visible)
      return false

    return !!(spX >= this.x
      && spX <= this.x + this.width
      && spY >= this.y
      && spY <= this.y + this.height)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Sprite;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_sprite__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__databus__ = __webpack_require__(0);



const BULLET_IMG_SRC = 'images/bullet.png'
const BULLET_WIDTH   = 16
const BULLET_HEIGHT  = 30

const __ = {
  speed: Symbol('speed')
}

let databus = new __WEBPACK_IMPORTED_MODULE_1__databus__["a" /* default */]()

class Bullet extends __WEBPACK_IMPORTED_MODULE_0__base_sprite__["a" /* default */] {
  constructor() {
    super(BULLET_IMG_SRC, BULLET_WIDTH, BULLET_HEIGHT)
  }

  init(x, y, speed) {
    this.x = x
    this.y = y

    this[__.speed] = speed

    this.visible = true
  }

  // 每一帧更新子弹位置
  update() {
    this.y -= this[__.speed]

    // 超出屏幕外回收自身
    if ( this.y < -this.height )
      databus.removeBullets()
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bullet;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_animation__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__databus__ = __webpack_require__(0);


// 飞机
const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH = 60
const ENEMY_HEIGHT = 60
// 爆炸
const EXPLO_IMG_PREFIX = 'images/explosion'
const EXPLO_FRAME_COUNT = 19


let databus = new __WEBPACK_IMPORTED_MODULE_1__databus__["a" /* default */]()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

class Enemy extends __WEBPACK_IMPORTED_MODULE_0__base_animation__["a" /* default */] {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initExplosionAnimation()
  }

  init(time, speed, x) {
    this.time = time
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

  // 每一帧
  update() {
    this.y += this.speed

    // 对象回收
    databus.removeEnemey()

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Enemy;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_sprite__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__databus__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__player_bullet__ = __webpack_require__(2);





const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = '../images/other.png'
const PLAYER_WIDTH = 80
const PLAYER_HEIGHT = 80


let databus = new __WEBPACK_IMPORTED_MODULE_1__databus__["a" /* default */]()


class Other extends __WEBPACK_IMPORTED_MODULE_0__base_sprite__["a" /* default */] {
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
    let bullet = databus.pool.getItemByClass('bullet', __WEBPACK_IMPORTED_MODULE_2__player_bullet__["a" /* default */])

    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      10
    )

    databus.bullets.push(bullet)
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Other;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let instance

/**
 * 统一的音效管理器
 */
class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/bgm.mp3'

    this.shootAudio     = new Audio()
    this.shootAudio.src = 'audio/bullet.mp3'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/boom.mp3'

    this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Music;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_libs_symbol__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_libs_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__js_libs_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__js_main__ = __webpack_require__(8);



new __WEBPACK_IMPORTED_MODULE_1__js_main__["a" /* default */]()


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * 对于ES6中Symbol的极简兼容
 * 方便模拟私有变量
 */

let Symbol  = window.Symbol
let idCounter = 0

if (!Symbol) {
  Symbol = function Symbol(key) {
    return `__${key}_${Math.floor(Math.random() * 1e9)}_${++idCounter}__`
  }

  Symbol.iterator = Symbol('Symbol.iterator')
}

window.Symbol = Symbol


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player_index__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__npc_enemy__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__npc_other__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__runtime_background__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__runtime_gameinfo__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__runtime_music__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__databus__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__websocket__ = __webpack_require__(14);










let canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let ctx = canvas.getContext('2d')
let databus = new __WEBPACK_IMPORTED_MODULE_6__databus__["a" /* default */]()

/**
 * 游戏主函数
 */
class Main {
  constructor() {
    this.start()
  }

  // 开始
  start() {
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    
    this.bg = new __WEBPACK_IMPORTED_MODULE_3__runtime_background__["a" /* default */](ctx)
    this.player = new __WEBPACK_IMPORTED_MODULE_0__player_index__["a" /* default */](ctx)
    this.gameinfo = new __WEBPACK_IMPORTED_MODULE_4__runtime_gameinfo__["a" /* default */]()
    this.music = new __WEBPACK_IMPORTED_MODULE_5__runtime_music__["a" /* default */]()

    this.loop()
  }

  // 重新开始
  restart() {
    databus.restart()
  }

  // 全局碰撞检测
  collisionDetection() {

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          this.music.playExplosion()
          bullet.visible = false
          databus.score += 1

          databus.wreck.push(enemy.time)
          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]
      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  //游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.others)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)
  }

  // 游戏逻辑更新主函数
  update() {
    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    this.collisionDetection()
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    // 20帧一发子弹，游戏是否结束 
    if (databus.frame % 20 === 0 && !databus.gameOver) {
      this.player.shoot()
      this.music.playShoot()

      // 其他用户发射
      databus.others.forEach((other)=>{
        other.shoot()
      })
    }

    // 游戏结束
    canvas.removeEventListener('touchstart', this.touchHandler)
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)
      this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)
    }

    window.requestAnimationFrame(
      this.loop.bind(this)
    )
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Main;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_sprite__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bullet__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__databus__ = __webpack_require__(0);




const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH = 80
const PLAYER_HEIGHT = 80

let databus = new __WEBPACK_IMPORTED_MODULE_2__databus__["a" /* default */]()

class Player extends __WEBPACK_IMPORTED_MODULE_0__base_sprite__["a" /* default */] {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight - this.height - 30

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    this.bullets = []

    // 初始化事件监听
    this.initEvent()

    databus.setAircraft(this.x, this.y)
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(x >= this.x - deviation
      && y >= this.y - deviation
      && x <= this.x + this.width + deviation
      && y <= this.y + this.height + deviation)
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if (disX < 0)
      disX = 0

    else if (disX > screenWidth - this.width)
      disX = screenWidth - this.width

    if (disY <= 0)
      disY = 0

    else if (disY > screenHeight - this.height)
      disY = screenHeight - this.height

    this.x = disX
    this.y = disY

    databus.setAircraft(this.x, this.y)
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      if (this.checkIsFingerOnAir(x, y)) {
        this.touched = true

        this.setAirPosAcrossFingerPosZ(x, y)
      }

    }).bind(this))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      if (this.touched)
        this.setAirPosAcrossFingerPosZ(x, y)

    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

      this.touched = false
    }).bind(this))
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    let bullet = databus.pool.getItemByClass('bullet', __WEBPACK_IMPORTED_MODULE_1__bullet__["a" /* default */])

    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      10
    )

    databus.bullets.push(bullet)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const __ = {
  poolDic: Symbol('poolDic')
}

/**
 * 简易的对象池实现
 * 用于对象的存贮和重复使用
 * 可以有效减少对象创建开销和避免频繁的垃圾回收
 * 提高游戏性能
 */
class Pool {
  constructor() {
    this[__.poolDic] = {}
  }

  /**
   * 根据对象标识符
   * 获取对应的对象池
   */
  getPoolBySign(name) {
    return this[__.poolDic][name] || ( this[__.poolDic][name] = [] )
  }

  /**
   * 根据传入的对象标识符，查询对象池
   * 对象池为空创建新的类，否则从对象池中取
   */
  getItemByClass(name, className) {
    let pool = this.getPoolBySign(name)

    let result = (  pool.length
                  ? pool.shift()
                  : new className()  )

    return result
  }

  /**
   * 将对象回收到对象池
   * 方便后续继续使用
   */
  recover(name, instance) {
    this.getPoolBySign(name).push(instance)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Pool;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sprite__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__databus__ = __webpack_require__(0);



let databus = new __WEBPACK_IMPORTED_MODULE_1__databus__["a" /* default */]()

const __ = {
  timer: Symbol('timer'),
}

/**
 * 简易的帧动画类实现
 */
class Animation extends __WEBPACK_IMPORTED_MODULE_0__sprite__["a" /* default */] {
  constructor(imgSrc, width, height) {
    super(imgSrc, width, height)

    // 当前动画是否播放中
    this.isPlaying = false

    // 动画是否需要循环播放
    this.loop = false

    // 每一帧的时间间隔
    this.interval = 1000 / 60

    // 帧定时器
    this[__.timer] = null

    // 当前播放的帧
    this.index = -1

    // 总帧数
    this.count = 0

    // 帧图片集合
    this.imgList = []

    /**
     * 推入到全局动画池里面
     * 便于全局绘图的时候遍历和绘制当前动画帧
     */
    databus.animations.push(this)
  }

  /**
   * 初始化帧动画的所有帧
   * 为了简单，只支持一个帧动画
   */
  initFrames(imgList) {
    imgList.forEach((imgSrc) => {
      let img = new Image()
      img.src = imgSrc

      this.imgList.push(img)
    })

    this.count = imgList.length
  }

  // 将播放中的帧绘制到canvas上
  aniRender(ctx) {
    ctx.drawImage(
      this.imgList[this.index],
      this.x,
      this.y,
      this.width * 1.2,
      this.height * 1.2
    )
  }

  // 播放预定的帧动画
  playAnimation(index = 0, loop = false) {
    // 动画播放的时候精灵图不再展示，播放帧动画的具体帧
    this.visible = false

    this.isPlaying = true
    this.loop = loop

    this.index = index

    if (this.interval > 0 && this.count) {
      this[__.timer] = setInterval(
        this.frameLoop.bind(this),
        this.interval
      )
    }
  }

  // 停止帧动画播放
  stop() {
    this.isPlaying = false

    if (this[__.timer])
      clearInterval(this[__.timer])
  }

  // 帧遍历
  frameLoop() {
    this.index++

    if (this.index > this.count - 1) {
      if (this.loop) {
        this.index = 0
      } else {
        this.index--
        this.stop()
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Animation;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_sprite__ = __webpack_require__(1);


const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/bg.jpg'
const BG_WIDTH     = 512
const BG_HEIGHT    = 512

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
class BackGround extends __WEBPACK_IMPORTED_MODULE_0__base_sprite__["a" /* default */] {
  constructor(ctx) {
    super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)

    this.render(ctx)

    this.top = 0
  }

  update() {
    this.top += 2

    if ( this.top >= screenHeight )
      this.top = 0
  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      -screenHeight + this.top,
      screenWidth,
      screenHeight
    )

    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      this.top,
      screenWidth,
      screenHeight
    )
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BackGround;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'

class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    ctx.fillText(
      score,
      10,
      30
    )
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 255
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameInfo;




/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__databus__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__npc_enemy__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__npc_other__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__runtime_music__ = __webpack_require__(5);






const databus = new __WEBPACK_IMPORTED_MODULE_0__databus__["a" /* default */]()
const music = new __WEBPACK_IMPORTED_MODULE_3__runtime_music__["a" /* default */]()

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
        let enemy = databus.pool.getItemByClass('enemy', __WEBPACK_IMPORTED_MODULE_1__npc_enemy__["a" /* default */])
        // 时间戳，速度，x%位置
        enemy.init(data.enemy.time, data.enemy.speed, data.enemy.x)
        databus.enemys.push(enemy)
    }

    //清空其他用户的飞机状态
    if (data.clone) {
        databus.others = []
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
                let other = databus.pool.getItemByClass('other', __WEBPACK_IMPORTED_MODULE_2__npc_other__["a" /* default */])
                // 时间戳，速度，x%位置
                other.init(air.id, air.aircraft.x, air.aircraft.y)
                databus.others.push(other)
            }
        }
    }

    // 这里判断敌机是否坠毁
    if (data.wreck && data.wreck.length) {
        databus.enemys.forEach(enemy => {
            data.wreck.forEach(wreck_ => {
                // 敌机坠毁
                if (enemy.time === wreck_)
                    enemy.playAnimation()
                    music.playExplosion()
            })
        })
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

    // 飞机击毁消息
    data.wreck = databus.wreck
    databus.wreck = []

    ws.send(JSON.stringify(data))
}, 1000 / 30);


/***/ })
/******/ ]);