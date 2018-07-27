<template>
  <div class="progress-bar">
    <div class="bar-inner" ref="barTotalWidth" @click="changePlay">
      <!--进度条播放宽度-->
      <div class="progress" ref="barPlayWidth"></div>
      <!--小球按钮-->
      <div class="progress-btn-wrapper" ref="barBtn" @touchstart.prevent="barBtnTouchStrat" @touchmove.prevent="barBtnTouchMove" @touchend.prevent="barBtnTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  methods: {
    barBtnTouchStrat (e) {
      this.touchs.initStatus = true
      this.touchs.startX = e.touches[0].pageX
      const barTotal = this.$refs.barTotalWidth
      this.touchs.progressMoveDistance = this.percent * barTotal.offsetWidth
    },
    barBtnTouchMove (e) {
      if (this.touchs.initStatus) {
        let moveDistance = e.touches[0].pageX - this.touchs.startX + this.touchs.progressMoveDistance
        let countMoveDistance = Math.min(Math.max(0, moveDistance), this.$refs.barTotalWidth.offsetWidth)
        console.log(countMoveDistance)
        this.getMoveWidth(countMoveDistance)
        let movePrecent = countMoveDistance / this.$refs.barTotalWidth.offsetWidth
        this.$emit('dragmove', movePrecent)
      }
    },
    barBtnTouchEnd () {
      this.touchs.initStatus = false
    },
    changePlay (e) {
      const rect = this.$refs.barTotalWidth.getBoundingClientRect()
      const setWidth = e.pageX - rect.left
      this.getMoveWidth(setWidth)
      let movePrecent = setWidth / this.$refs.barTotalWidth.offsetWidth
      this.$emit('dragmove', movePrecent)
    },
    getMoveWidth (num) {
      this.$refs.barPlayWidth.style.width = `${num}px`
      this.$refs.barBtn.style.transform = `translateX(${num}px)`
    }
  },
  watch: {
    percent (newPercent) {
      if (!this.touchs.initStatus) {
        const barTotal = this.$refs.barTotalWidth
        let moveWidth = newPercent * barTotal.offsetWidth
        this.getMoveWidth(moveWidth)
      }
    }
  },
  created () {
    this.touchs = {}
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .progress-bar
    height 30px
    .bar-inner
      position    : relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      /*播放进度条*/
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      /*小球播放按钮*/
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
