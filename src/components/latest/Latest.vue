<template>
  <div class="latest" v-if="songList">
    <div class="scroll-wraper" ref="wraper">
      <div>
        <!--歌单标题区域-->
        <div class="latest-wraper">
          <!--标题图片模拟背景图片-->
          <img v-if="songList.length" class="latest-titleBg" :src="'http://imgcache.qq.com/music/photo/album_300/'+(songList[8].data.albumid%100)+'/300_albumpic_'+songList[8].data.albumid+'_0.jpg'" alt="">
          <!--标题文字图片内容-->
          <div class="latest-title" v-if="songList.length">
            <div class="title-left">
              <img class="left-img" :src="'http://imgcache.qq.com/music/photo/album_300/'+(songList[8].data.albumid%100)+'/300_albumpic_'+songList[8].data.albumid+'_0.jpg'" alt="">
            </div>
            <div class="title-right">
              <div class="right-title">{{songList[8].data.songname}}</div>
              <div class="right-desc">{{songList[8].data.albumname}}</div>
              <div class="right-tip">{{songList[8].data.albumdesc}}</div>
            </div>
          </div>
        </div>
        <!--歌单导航分类-->
        <div class="latest-nav">
          <!--全部歌单-->
          <div class="nav-all">
            <div class="all-btn">
              <span class="btn-txt">全部歌单</span>
              <span class="icon-next btn-icon"></span>
            </div>
          </div>
          <!--分类歌单-->
          <div class="nav-kind">
            <ul class="kind-cont">
              <li class="kind-item kind-a">欧美</li>
              <li class="kind-item kind-b">电子</li>
              <li class="kind-item kind-c">摇滚</li>
            </ul>
          </div>
        </div>
        <!--歌单所有列表循环输出-->
        <div class="latest-list">
          <ul class="list-cont">
            <li class="cont-item" v-for="(item, index) in songList" :key="index">
              <img class="item-img" v-lazy="'http://imgcache.qq.com/music/photo/album_300/'+(item.data.albumid%100)+'/300_albumpic_'+item.data.albumid+'_0.jpg'" :onerror="defaultImg" alt="">
              <p class="item-title">{{item.data.albumname || '我想看看'}}</p>
              <p class="item-desc">{{item.data.albumdesc || '微小而确辛的幸福'}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import {getLatest} from 'api/latest'
import {ERR_OK} from 'api/config'
export default {
  name: 'Singer',
  data () {
    return {
      songList: [],
      defaultImg: 'this.src="' + require('common/images/default.png') + '"'
    }
  },
  methods: {
    getLatestSucc(res) {
      if (res.code === ERR_OK) {
        this.songList = res.songlist
        console.log(this.songList)
      }
    }
  },
  created () {
    getLatest().then(this.getLatestSucc)
  },
  mounted () {
    this.scroll = new Bscroll(this.$refs.wraper, {
      click: true
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.scroll-wraper
  position fixed
  top 81px
  left 0
  right 0
  bottom 0
  overflow hidden
  /*===歌单标题区域=====================================================================================================================================================*/
  .latest-wraper
    position relative
    z-index 1
    width 100%
    overflow hidden
    background rgba(0, 0, 0, .5)
    /*歌单标题背景图*/
    .latest-titleBg
      position absolute
      width 100%
      height 100%
      overflow hidden
      top 0
      left 0
      z-index -1
      filter blur(10px)
    /*歌单标题*/
    .latest-title
      padding 23px 20px 23px 30px
      display flex
      /*标题左边图片*/
      .title-left
        width 120px
        height 120px
        .left-img
          width 100%
          border-radius 25px
          box-shadow 0 0 4px #ccc
      /*标题右边头部信息*/
      .title-right
        flex 1
        padding-left 25px
        color $color-text
        .right-title
          padding-top 18px
          margin-bottom 18px
          font-size 18px
          font-family ''Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif'
        .right-desc
          font-size 16px
          margin-bottom 10px
        .right-tip
          font-size 12px
          color $color-text-l
  /*===歌单导航分类==================================================================================================================================================*/
  .latest-nav
    display flex
    padding 20px 15px
    /*左边按钮导航文字全部歌单*/
    .nav-all
      width 100px
      .all-btn
        padding 5px 5px 5px 5px
        border 1px solid #ccc
        border-radius 10px
        text-align center
        .btn-txt
          font-size 12px
          color #fff
          vertical-align middle
        .btn-icon
          font-size 12px
          vertical-align middle
          color #fff
    /*右边分类选择*/
    .nav-kind
      flex 1
      .kind-cont
        height 100%
        text-align right
        display flex
        justify-content flex-end
        color #fff
        .kind-item
          padding 5px 10px
          font-size 14px
  /*===歌单所有列表循环=====================================================================================================================================================*/
  .latest-list
    padding 0 10px 0 0
    overflow hidden
    .list-cont
      width 100%
      overflow hidden
      .cont-item
        float left
        width 50%
        padding-left 10px
        padding-bottom 20px
        text-align center
        overflow hidden
        .item-img
          width 100%
        .item-title
          color $color-text
          padding-top 5px
          font-size 16px
        .item-desc
          color $color-text-l
          padding-top 3px
          font-size 14px
          no-wrap()
          overflow hidden
</style>
