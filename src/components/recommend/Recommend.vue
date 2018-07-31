<template>
  <div class="box">
    <div ref="wraper" class="recommend">
      <!--滑动轮播整体-->
      <div>
        <!--轮播图-->
        <div class="recommend-banner">
          <swiper :options="swiperOption" v-if="recommends.length">
            <!-- slides -->
            <swiper-slide v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="recommend-banner-img needsclick" :src="item.picUrl" alt="">
              </a>
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
          <!--轮播图加载组件-->
          <div class="loading-banner" v-if="!recommends.length">
            <loading></loading>
          </div>
        </div>
        <!--热门歌单推荐列表-->
        <div class="recommend-list">
          <!--歌单标题-->
          <h1 class="list-title">热门歌单推荐</h1>
          <!--歌单内容，列表循环-->
          <ul class="list-cont">
            <li class="list-cont-item" @click="detailClickHandler(item)" v-for="(item, index) in songList" :key="index">
              <div class="item-left">
                <img class="left-img" v-lazy="item.imgurl" alt="">
              </div>
              <div class="item-right">
                <h2 class="item-right-name" v-html="item.creator.name"></h2>
                <p class="item-right-desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
          <!--歌单列表加载组件-->
          <div class="loading-song" v-if="!songList.length">
            <loading></loading>
          </div>
        </div>
      </div>
      <!--滑动结束-->
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import Loading from 'base/loading/loading'
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {mapMutations} from 'vuex'
export default {
  name: 'Recommend',
  components: {
    Loading
  },
  data () {
    return {
      recommends: [],
      songList: [],
      swiperOption: {
        pagination: '.swiper-pagination',
        autoplay: 3000,
        speed: 400,
        autoplayDisableOnInteraction: false,
        loop: true
      }
    }
  },
  methods: {
    // 获取轮播数据
    getRecommendSucc (res) {
      if (res.code === ERR_OK) {
        this.recommends = res.data.slider
      }
    },
    // 获取推荐歌单数据
    getDiscListSucc (res) {
      console.log(res)
      if (res.code === ERR_OK) {
        this.songList = res.data.list
      }
    },
    detailClickHandler (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  created () {
    getRecommend().then(this.getRecommendSucc)
    getDiscList().then(this.getDiscListSucc)
  },
  mounted () {
    this.scroll = new Bscroll(this.$refs.wraper, {
      click: true
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
.recommend >>> .swiper-pagination-bullet-active
    width 15px
    border-radius 5px
    background: $color-theme
  .recommend
    position absolute
    top 81px
    left 0
    right 0
    bottom 0
    overflow hidden
  /*===轮播图===================================================================================================================================================*/
    .recommend-banner
      width 100%
      height 0
      padding-bottom 40%
      overflow hidden
      .recommend-banner-img
        width 100%
        display block
      /*轮播图加载组件*/
      .loading-banner
        padding-top 70px
  /*===热门歌单推荐列表===========================================================================================================================================*/
    .recommend-list
      /*歌单标题*/
      .list-title
        height: 55px
        line-height: 55px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme-txt
      /*歌单内容*/
      .list-cont
        .list-cont-item
          display flex
          margin 20px 0
          &:first-child
            margin-top 0
          .item-left
            padding 0 30px 0 20px
            .left-img
              width 70px
              height 70px
          .item-right
            display: flex
            flex-direction: column
            justify-content: center
            flex 1
            line-height: 20px
            overflow: hidden
            .item-right-name
              margin-bottom: 10px
              color $color-text
            .item-right-desc
              color $color-text-d
              font-size 14px
      /*歌单列表加载组件*/
      .loading-song
        padding-top 200px
</style>
