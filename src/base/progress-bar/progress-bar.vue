<template>
  <div class="progress-bar">
    <div class="bar-inner" ref="barTotalWidth">
      <!--进度条播放宽度-->
      <div class="progress" ref="barPlayWidth"></div>
      <!--小球按钮-->
      <div class="progress-btn-wrapper" ref="barBtn">
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
  watch: {
    percent (newPercent) {
      const barTotal = this.$refs.barTotalWidth
      let moveWidth = newPercent * barTotal.offsetWidth
      this.$refs.barPlayWidth.style.width = `${moveWidth}px`
      this.$refs.barBtn.style.transform = `translateX(${moveWidth}px)`
    }
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
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
