<template>
  <div class="singer">
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'

// const HOT_NAME = '热门'
// const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          console.log(this.singers)
        }
      })
    }
    // _normalizeSinger (list) {
    //   let map = {
    //     hot: {
    //       title: HOT_NAME,
    //       items: []
    //     }
    //   }
    //   list.forEach((item, index) => {
    //     if (index < HOT_SINGER_LEN) {
    //       map.hot.items.push({

    //       })
    //     }
    //   })
    // }
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
