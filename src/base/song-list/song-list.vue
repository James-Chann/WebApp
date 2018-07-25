<template>
  <div class="song-list" ref="wrapper">
    <div>
        <ul>
        <li v-for="(item, index) in songs" @click="selectItem(item, index)" class="item" :key="index">
            <div class="content">
            <h2 class="name">{{ item.name }}</h2>
            <p class="desc">{{ getSongDesc(item) }}</p>
            </div>
        </li>
        </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Bscroll from 'better-scroll'
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array
    },
    bgImgHeight: {
      type: Number,
      default: 265
    }
  },
  methods: {
    getSongDesc (song) {
      return `${song.singer}.${song.album}`
    },
    selectItem (item, index) {
      this.$emit('select', item, index)
    }
  },
  mounted () {
    this.scroll = new Bscroll(this.$refs.wrapper, {
      click: true
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    position absolute
    top 205px
    left 0
    right 0
    bottom 0
    overflow hidden
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      padding 0 20px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>