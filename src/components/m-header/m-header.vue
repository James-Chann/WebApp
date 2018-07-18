<template>
  <div class="header">
    <!--头部图片-->
    <div class="header-icon"></div>
    <!--头部标题-->
    <div class="header-txt">Chicken Music</div>
  </div>
</template>

<script>
export default {
  name: 'MHeader'
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl';
@import '~common/stylus/variable.styl'

  .header
    width 100%
    height 44px
    line-height 44px
    text-align center
    font-size 0
  /*===头部图片==================================================================================================================================================*/
    .header-icon
        display inline-block
        width 30px
        height 32px
        margin-right 9px
        vertical-align middle
        background-size 30px 32px
        bg-image('logo')
  /*===头部标题==================================================================================================================================================*/
    .header-txt
        display inline-block
        color: $color-theme
        font-size: $font-size-large
        vertical-align middle
</style>
