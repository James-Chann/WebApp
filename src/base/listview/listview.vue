<template>
  <div class="listview" ref="wrapper">
    <!--歌手类别区块-->
    <ul ref="singerKindList">
      <li v-for="(group, index) in data" class="list-group" :key="index" :ref="group.title.substr(0, 1)">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="(item, index) in group.items" class="list-group-item" :key="index">
            <img class="avatar" :src="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!--顶部固定栏目区块-->
    <div class="list-fixed" v-show="fixTitle" ref="titHeight">
      <h1 class="fixed-title">{{ fixTitle }}</h1>
    </div>
    <!--字符表导航-->
    <div class="list-shortcut">
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :class="{'current':currentIndex===index}" :key="index" :ref="item+'char'" @click="charClick($event,index)" @touchstart="handleTouchStart" @touchmove="handleTouchMove($event)" @touchend="handleTouchEnd">
          {{item}}
        </li>
      </ul>
    </div>
    <!--loadding组件-->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Bscroll from 'better-scroll'
import Loading from 'base/loading/loading'
export default {
  props: {
    data: {
      type: Array,
      default () {}
    }
  },
  data () {
    return {
      chars: '',
      touchStatus: false,
      timer: null,
      startHeight: 0,
      listHeight: [],
      scrollY: 0,
      diff: -1
    }
  },
  components: {
    Loading
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    charClick (e, index) {
      // this.chars = e.target.innerText
      let singerKindList = (this.$refs.singerKindList).getElementsByClassName('list-group')
      const element = singerKindList[index]
      this.scroll.scrollToElement(element, 300)
    },
    handleTouchStart () {
      this.touchStatus = true
    },
    handleTouchMove (e) {
      if (this.touchStatus) {
        clearTimeout(this.timer)
      }
      setTimeout(() => {
        let myLocation = e.changedTouches[0]
        let realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY)
        let index = this.shortcutList.indexOf(realTarget.innerText)
        if (index >= 0 && index <= this.shortcutList.length - 1) {
          let singerKindList = (this.$refs.singerKindList).getElementsByClassName('list-group')
          const element = singerKindList[index]
          this.scroll.scrollToElement(element, 300)
        }
      }, 160)
      // if (this.touchStatus) {
      //   clearTimeout(this.timer)
      // }
      // setTimeout(() => {
      //   let index = Math.floor((e.touches[0].clientY - this.startHeight) / 18 - 8)
      //   if (index >= 0 && index <= this.shortcutList.length - 1) {
      //     // const element = this.$refs[this.shortcutList[index]][0]
      //     let singerKindList = (this.$refs.singerKindList).getElementsByClassName('list-group')
      //     const element = singerKindList[index]
      //     this.scroll.scrollToElement(element)
      //   }
      // })
    },
    handleTouchEnd () {
      this.touchStatus = false
    },
    // 计算每个字母分类区间的高度
    calculateListHeight () {
      let singerKindList = (this.$refs.singerKindList).getElementsByClassName('list-group')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < singerKindList.length; i++) {
        let item = singerKindList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    // chars () {
    //   if (this.chars) {
    //     const element = this.$refs[this.chars][0]
    //     this.scroll.scrollToElement(element)
    //   }
    // },
    data () {
      this.$nextTick(() => {
        this.calculateListHeight()
      })
    },
    // 计算标题差值
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < 30) ? newVal - 30 : 0
      let fixedTopHeight = -Math.abs(fixedTop)
      this.$refs.titHeight.style.transform = `translateY(${fixedTopHeight}px)`
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    // 计算当前索引
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          this.diff = height2 - this.scrollY
          return i
        }
      }
      return 0
    },
    // 固定标题栏
    fixTitle () {
      if (this.scrollY < 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  // updated () {
  //   this.startHeight = (this.$refs.热char)[0].parentNode.offsetTop
  // },
  mounted () {
    this.scroll = new Bscroll(this.$refs.wrapper, {
      click: true,
      probeType: 3
    })

    this.scroll.on('scroll', (pos) => {
      this.scrollY = Math.abs(Math.round(pos.y))
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    /*===歌手分类区块========================================================================================================================================*/
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 10%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
    /*===字符表导航========================================================================================================================================*/
    .list-shortcut
      position absolute
      z-index 30
      right 0
      top 275px;
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-d
      font-family: Helvetica
      .item
        padding 3px
        line-height 1
        color $color-text-l
        font-size $font-size-small
        &.current
          color: $color-theme
    /*===标题固定栏========================================================================================================================================*/
    .list-fixed
      position absolute
      top 0
      left: 0
      width: 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>