<template>
  <div class="tab">
    <router-link tag="div" to="/recommend" class="tab-item tab-recommend">
      <div class="tab-link">推荐</div>
    </router-link>
    <router-link tag="div" to="/singer" class="tab-item tab-singer">
      <div class="tab-link">歌手</div>
    </router-link>
    <router-link tag="div" to="/rank" class="tab-item tab-rank">
      <div class="tab-link">排名</div>
    </router-link>
    <router-link tag="div" to="/latest" class="tab-item tab-latest">
      <div class="tab-link">歌单</div>
    </router-link>
    <router-link tag="div" to="/search" class="tab-item tab-search">
      <div class="tab-link">搜索</div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Tab'
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
  .tab
    display flex
    width 100%
    height: 35px
    line-height: 35px
    font-size: $font-size-medium
    margin-bottom 2px
  /*===tab栏子项公共样式===============================================================================================================================*/
    .tab-item
      flex 1
      text-align center
      .tab-link
        color: $color-text-l
    &.router-link-active
      .tab-link
        color: $color-text
        border-bottom: 2px solid $color-theme
</style>
