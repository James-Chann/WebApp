<template>
  <div class="player" v-show="playlist.length>0">
    <!--全屏播放-->
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
        <div class="normal-player" v-show="fullScreen">
            <!--图片背景-->
            <div class="background">
                <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <!--上部区域-->
            <div class="top">
                <div class="back" @click="back">
                <i class="icon-back"></i>
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <!--中部区域-->
            <div class="middle">
              <swiper :options="swiperOption">
                <swiper-slide>
                <div class="middle-l">
                  <div class="cd-wrapper" ref="CDBox">
                      <div class="cd" :class="cdRotate">
                      <img class="image" :src="currentSong.image">
                      </div>
                  </div>
                </div>
                </swiper-slide>
                <swiper-slide>
                <div class="middle-r" ref="lyricCont">
                  <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                      <p class="text" ref="lyricLine" :class="{'current' : currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="index">{{ line.txt }}</p>
                    </div>
                  </div>
                </div>
                </swiper-slide>
                <!-- Optional controls -->
                <div class="swiper-pagination"  slot="pagination"></div>
              </swiper>
            </div>
            <!--下部区域-->
            <div class="bottom">
                <!--下部切换按点-->
                <!-- <div class="dot-wrapper">
                  <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                  <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                </div> -->
                <!--音乐播放进度条-->
                <div class="progress-wrapper">
                  <span class="time time-l">{{ formate(currentPlayTime) }}</span>
                  <div class="progress-bar-wrapper">
                    <progress-bar :percent="progressBarPercent" @dragmove="onDragMove"></progress-bar>
                  </div>
                  <span class="time time-r">{{ formate(currentSong.duration) }}</span>
                </div>
                <!--音乐播放操作区域-->
                <div class="operators">
                <div class="icon i-left">
                    <i :class="modeIcon" @click="selectPlayMode"></i>
                </div>
                <div class="icon i-left" :class="disable">
                    <i class="icon-prev" @click="togglePrev"></i>
                </div>
                <div class="icon i-center" :class="disable">
                    <i :class="isPlay" @click="togglePlay"></i>
                </div>
                <div class="icon i-right" :class="disable">
                    <i class="icon-next" @click="toggleNext"></i>
                </div>
                <div class="icon i-right">
                    <i class="icon icon-not-favorite"></i>
                </div>
                </div>
            </div>
        </div>
    </transition>
    <!--迷你播放盒-->
    <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
            <img :src="currentSong.image" width="40" height="40" :class="miniRotate">
        </div>
        <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
            <i :class="isMiniPlay" @click.stop="togglePlay"></i>
        </div>
        <div class="control">
            <i class="icon-playlist"></i>
        </div>
        </div>
    </transition>
    <audio ref="musicPlay" :src="currentSong.url" @canplay="ready" @error="onError" @timeupdate="updateTime" @ended="musicEnd"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Bscroll from 'better-scroll'

export default {
  data () {
    return {
      musicReady: false,
      currentPlayTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      swiperOption: {
        pagination: '.swiper-pagination'
      }
    }
  },
  components: {
    ProgressBar
  },
  computed: {
    isPlay () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    isMiniPlay () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdRotate () {
      return this.playing ? 'play' : 'play pause'
    },
    miniRotate () {
      return this.playing ? 'play' : 'play pause'
    },
    disable () {
      return this.musicReady ? '' : 'disable'
    },
    progressBarPercent () {
      return this.currentPlayTime / this.currentSong.duration
    },
    modeIcon () {
      return this.mode === 0 ? 'icon-sequence' : this.mode === 1 ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      this.$nextTick(() => {
        this.$refs.musicPlay.play()
        this.getLyrics()
      })
    }
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlay () {
      if (!this.musicReady) {
        return
      }
      this.setPlaying(!this.playing)
      let playBox = this.$refs.musicPlay
      this.playing ? playBox.play() : playBox.pause()
    },
    togglePrev () {
      if (!this.musicReady) {
        return
      }
      if (this.currentIndex === 0) {
        this.setCurrentIndex(this.playlist.length)
      }
      this.setCurrentIndex(this.currentIndex - 1)
      this.setPlaying(true)
      this.musicReady = false
    },
    toggleNext () {
      if (!this.musicReady) {
        return
      }
      if (this.currentIndex === this.playlist.length - 1) {
        this.setCurrentIndex(0)
      }
      this.setCurrentIndex(this.currentIndex + 1)
      this.setPlaying(true)
      this.musicReady = false
    },
    toggleLoop () {
      this.$refs.musicPlay.currentTime = 0
      this.$refs.musicPlay.play()
    },
    ready () {
      this.musicReady = true
    },
    onError () {
      this.musicReady = true
    },
    updateTime (e) {
      this.currentPlayTime = e.target.currentTime
    },
    musicEnd () {
      if (this.mode === 1) {
        this.toggleLoop()
      } else {
        this.toggleNext()
      }
    },
    getLyrics () {
      this.currentSong.getLyric().then((res) => {
        this.currentLyric = new Lyric(res, this.handlerLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      })
    },
    handlerLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let Lyricpos = this.$refs.lyricLine[lineNum - 5]
        this.scroll.scrollToElement(Lyricpos, 1000)
      } else {
        this.scroll.scrollToElement(0, 0, 1000)
      }
    },
    formate (time) {
      time = time | 0
      let minute = (time / 60) | 0
      let second = (time % 60) | 0
      return `${this.pad(minute)}:${this.pad(second)}`
    },
    pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    onDragMove (precent) {
      this.$refs.musicPlay.currentTime = precent * this.currentSong.duration
      if (!this.playing) {
        this.togglePlay()
      }
    },
    selectPlayMode () {
      let selMode = (this.mode + 1) % 3
      this.setMode(selMode)
      let list = null
      if (this.mode === 2) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    enter (el, done) {
      let {x, y, scale} = this.getAnimatePos()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'moveEnter',
        animation: animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.CDBox, 'moveEnter', done)
    },
    afterEnter () {
      animations.unregisterAnimation('moveEnter')
      this.$refs.CDBox.style.animation = ''
    },
    leave (el, done) {
      let {x, y, scale} = this.getAnimatePos()
      let animation = {
        0: {
          transform: `translate3d(0, 0, 0) scale(1)`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        }
      }
      animations.registerAnimation({
        name: 'moveLeave',
        animation: animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.CDBox, 'moveLeave', done)
    },
    afterLeave () {
      animations.unregisterAnimation('moveLeave')
      this.$refs.CDBox.style.animation = ''
    },
    getAnimatePos () {
      const smallLeftWidth = 40
      const smallBottomHeight = 30
      const largeTopHeight = 80
      const largeLeftWidth = (window.innerWidth * 0.8) / 2
      const windowLeftWidth = window.innerWidth / 2
      const windowHeight = window.innerHeight
      let x = -(windowLeftWidth - smallLeftWidth)
      let y = windowHeight - largeTopHeight - largeLeftWidth - smallBottomHeight
      let scale = smallLeftWidth / largeLeftWidth
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  },
  created () {
    this.touch = {}
  },
  mounted () {
    this.scroll = new Bscroll(this.$refs.lyricCont)
    console.log(this.getAnimatePos())
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    color $color-text
    .normal-player
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      z-index 150
      background $color-background
      .background
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        z-index -1
        opacity 0.6
        filter blur(20px)
      .top
        position relative
        margin-bottom 25px
        .back
          position absolute
          top 0
          left 6px
          z-index: 50
          .icon-back
            display block
            padding 9px
            font-size $font-size-large-x
            color $color-theme
            transform rotate(-90deg)
        .title
          width 70%
          margin 0 auto
          line-height 40px
          text-align center
          no-wrap()
          font-size $font-size-large
          color $color-text
        .subtitle
          line-height 20px
          text-align center
          font-size $font-size-medium
          color $color-text
      .middle
        position fixed
        width 100%
        top 80px
        bottom 170px
        white-space nowrap
        overflow hidden
        font-size 0
        .middle-l
          display inline-block
          vertical-align top
          position relative
          width 100%
          height 0
          padding-top 80%
          .cd-wrapper
            position absolute
            left 10%
            top 0
            width 80%
            height 100%
            .cd
              width 100%
              height 100%
              box-sizing border-box
              border 10px solid rgba(255, 255, 255, 0.1)
              border-radius 50%
              &.play
                animation rotate 20s linear infinite
              &.pause
                animation-play-state paused
              .image
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                border-radius 50%
          .playing-lyric-wrapper
            width 80%
            margin 30px auto 0 auto
            overflow hidden
            text-align center
            .playing-lyric
              height 20px
              line-height 20px
              font-size $font-size-medium
              color $color-text-l
        .middle-r
          display inline-block
          vertical-align top
          width 100%
          height 100%
          overflow hidden
          .lyric-wrapper
            width 80%
            margin 0 auto
            overflow hidden
            text-align center
            .text
              line-height 32px
              color $color-text-l
              font-size $font-size-medium
              &.current
                color $color-text
      .bottom
        position absolute
        bottom 50px
        width 100%
        .dot-wrapper
          text-align center
          font-size 0
          .dot
            display inline-block
            vertical-align middle
            margin 0 4px
            width 8px
            height 8px
            border-radius 50%
            background $color-text-l
            &.active
              width 20px
              border-radius 5px
              background $color-text-ll
        .progress-wrapper
          display flex
          align-items center
          width 80%
          margin 0px auto
          padding 10px 0
          .time
            color $color-text
            font-size $font-size-small
            flex 0 0 30px
            line-height 30px
            width 30px
            &.time-l
              text-align left
            &.time-r
              text-align right
          .progress-bar-wrapper
            padding 0 10px
            flex 1
        .operators
          display flex
          align-items center
          .icon
            flex 1
            color $color-theme
            &.disable
              color $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align right
          .i-center
            padding 0 20px
            text-align center
            i
              font-size 40px
          .i-right
            text-align left
          .icon-favorite
            color $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition all 0.4s
        .top, .bottom
          transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity 0
        .top
          transform translate3d(0, -100px, 0)
        .bottom
          transform translate3d(0, 100px, 0)
    .mini-player
      display flex
      align-items center
      position fixed
      left 0
      bottom 0
      z-index 180
      width 100%
      height 60px
      background $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity 0
      .icon
        flex 0 0 40px
        // width: 40px
        padding 0 10px 0 20px
        img
          border-radius 50%
          &.play
            animation rotate 10s linear infinite
          &.pause
            animation-play-state paused
      .text
        display flex
        flex-direction column
        justify-content center
        flex 1
        line-height 20px
        overflow hidden
        .name
          margin-bottom 2px
          no-wrap()
          font-size $font-size-medium
          color $color-text
        .desc
          no-wrap()
          font-size $font-size-small
          color $color-text-d
      .control
        flex 0 0 30px
        // width: 30px
        padding 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size 30px
          color $color-theme-d
        .icon-mini
          font-size 32px
          position absolute
          left 0
          top 0
  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>