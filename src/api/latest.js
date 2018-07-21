import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getLatest() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: 28
  })

  return jsonp(url, data, options)
}