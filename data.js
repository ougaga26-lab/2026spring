// ============================================================
// 行程資料檔
// 之後要修改行程內容（時間、地點、住宿），只要改這個檔案裡的文字就好，
// 不會動到版面樣式。中文字串可以直接改，數字（時間、經緯度）請小心修改。
// ============================================================

const TRIP = {
  title: "名古屋・伊勢志摩・知多半島・吉卜力公園",
  subtitle: "沒有觀光客的關西小旅行",
  dateRange: "2026.09.19 → 09.27",
  stats: [
    { value: "9", label: "天 8 夜" },
    { value: "6", label: "個住宿" },
    { value: "2", label: "段船程" }
  ],

  days: [
    {
      id: "day0",
      seal: "序",
      dateLabel: "9/19（六）",
      title: "抵達名古屋",
      timeline: [
        { kind: "note", time: "", title: "抵達中部國際空港 / 名古屋", note: "搭車前往名古屋車站，時差不大不用特別調整" }
      ],
      hotel: {
        name: "相鐵FRESA INN 名古屋站新幹線口",
        note: "名古屋車站旁，隔天南下賢島最方便",
        lat: 35.170915, lng: 136.8815369
      }
    },
    {
      id: "day1",
      seal: "一",
      dateLabel: "9/20（日）",
      title: "名古屋 → 賢島",
      timeline: [
        { kind: "transport", time: "10:25", title: "近鐵名古屋駅 出發", note: "近鐵特急しまかぜ（志摩之風列車）直達，約1小時35分", lat: 35.170915, lng: 136.8815369 },
        { kind: "sight", time: "12:00", title: "抵達賢島駅", note: "真珠養殖觀光船，悠閒感受志摩灣風景", lat: 34.3054114, lng: 136.8216889 },
        { kind: "onsen", time: "傍晚", title: "溫泉旅館泡湯", note: "調整長途移動的疲勞，好好放鬆一晚" }
      ],
      hotel: {
        name: "賢島寶生苑",
        note: "車站步行約5分，溫泉旅館",
        lat: 34.3054114, lng: 136.8216889
      }
    },
    {
      id: "day2",
      seal: "二",
      dateLabel: "9/21（一）",
      title: "賢島 → 鳥羽 → 伊勢 → 二見浦",
      timeline: [
        { kind: "transport", time: "", title: "賢島駅 → 鳥羽駅", note: "近鐵特急，約29分", lat: 34.3054114, lng: 136.8216889 },
        { kind: "sight", time: "上午", title: "鳥羽水族館", note: "近千種海洋生物，儒艮是招牌明星", lat: 34.4815825, lng: 136.8456926 },
        { kind: "food", time: "午餐", title: "海女小屋", note: "海女奶奶現烤海鮮，巴士/計程車約15-20分", lat: 34.3876089, lng: 136.9123777 },
        { kind: "transport", time: "傍晚", title: "鳥羽駅 → 伊勢市駅", note: "JR參宮線，約20分" },
        { kind: "food", time: "晚餐", title: "Ichigetsuya 居酒屋", note: "本地人推薦的老字號，步行約10分", lat: 34.4954307, lng: 136.7009331 },
        { kind: "transport", time: "", title: "伊勢市駅 → 二見浦駅", note: "JR參宮線，約10分" }
      ],
      hotel: {
        name: "二見浦岩戸館",
        note: "近二見興玉神社，隔天不用早起趕車就能看日出",
        lat: 34.5082, lng: 136.7855
      }
    },
    {
      id: "day3",
      seal: "三",
      dateLabel: "9/22（二）",
      title: "二見浦 → 伊勢",
      timeline: [
        { kind: "sunrise", time: "清晨", title: "夫婦岩看日出", note: "住宿步行約15-20分", lat: 34.5089247, lng: 136.7878294 },
        { kind: "food", time: "", title: "二見浦BBQ場", note: "生蠔吃到飽", lat: 34.508856, lng: 136.7761429 },
        { kind: "transport", time: "", title: "二見浦駅 → 伊勢市駅", note: "JR參宮線，約10分" },
        { kind: "food", time: "午餐", title: "豚捨 外宮前店", note: "明治年間老店，伊勢牛可樂餅、豚排必點", lat: 34.4885142, lng: 136.7074453 },
        { kind: "sight", time: "下午", title: "伊勢神宮（外宮→內宮）", note: "外宮走到內宮可搭巴士約15分", lat: 34.4550157, lng: 136.7251851 },
        { kind: "sight", time: "傍晚", title: "托福橫町", note: "內宮旁步行即達，老街小吃伴手禮", lat: 34.4624294, lng: 136.7228539 }
      ],
      hotel: {
        name: "En Hotel Ise",
        note: "伊勢市駅周邊，走路到車站、商店都方便",
        lat: 34.4915092, lng: 136.7084795
      }
    },
    {
      id: "day4",
      seal: "四",
      dateLabel: "9/23（三）",
      title: "伊勢 → 渡輪 → 日間賀島",
      timeline: [
        { kind: "transport", time: "09:45", title: "En Hotel Ise 退房", note: "JR參宮線約20分 → 10:10抵達鳥羽駅", lat: 34.4915092, lng: 136.7084795 },
        { kind: "transport", time: "10:25", title: "抵達鳥羽港", note: "步行約10分，預留緩衝時間", lat: 34.480432, lng: 136.846764 },
        { kind: "ferry", time: "10:40", title: "搭伊勢灣渡輪", note: "船程約60分，跨越伊勢灣", lat: 34.480432, lng: 136.846764 },
        { kind: "sight", time: "11:40", title: "抵達伊良湖港・伊良湖岬散策", note: "戀路之濱、伊良湖岬燈塔，含午餐約1小時50分", lat: 34.5843963, lng: 137.019651 },
        { kind: "ferry", time: "14:10", title: "搭名鐵海上觀光船", note: "前往日間賀島，約20-30分", lat: 34.5843963, lng: 137.019651 },
        { kind: "sight", time: "14:45", title: "抵達日間賀島", note: "章魚造型裝置藝術很好拍，環島悠閒", lat: 34.7051045, lng: 137.0060226 }
      ],
      hotel: {
        name: "大海老",
        note: "島上知名章魚河豚料理民宿，15:00起入住",
        lat: 34.7038953, lng: 136.9980804
      },
      alert: "此天時刻表為「理論版」，實際班次待2026年9月官方時刻表公布（約8月中）後需再確認微調。"
    },
    {
      id: "day5",
      seal: "五",
      dateLabel: "9/24（四）",
      title: "日間賀島 → 河和 → 名古屋 → 藤丘",
      timeline: [
        { kind: "sight", time: "上午", title: "日間賀島悠閒半天", note: "環島步行，島上章魚裝置藝術" },
        { kind: "ferry", time: "", title: "日間賀島 → 河和港", note: "名鐵海上觀光船，約20分", lat: 34.7781055, lng: 136.9118864 },
        { kind: "transport", time: "", title: "河和駅 → 名鐵名古屋駅", note: "名鐵特急，約50分" },
        { kind: "sight", time: "下午", title: "名古屋市區逛街", note: "名古屋城 / 大須觀音商店街，自由運用", lat: 35.1847501, lng: 136.8996883 },
        { kind: "transport", time: "", title: "名古屋駅 → 藤が丘駅", note: "地下鐵東山線，約30分", lat: 35.1824617, lng: 137.0213504 }
      ],
      hotel: {
        name: "露櫻GRAND酒店 名古屋藤丘站前",
        note: "藤丘車站前，吉卜力公園進出都方便（連住3晚）",
        lat: 35.1824617, lng: 137.0213504
      }
    },
    {
      id: "day6",
      seal: "六",
      dateLabel: "9/25（五）",
      title: "吉卜力公園 Day 1",
      timeline: [
        { kind: "transport", time: "", title: "藤が丘駅 → 愛・地球博記念公園駅", note: "Linimo磁浮列車，約17分", lat: 35.1750406, lng: 137.0887716 },
        { kind: "sight", time: "全天", title: "吉卜力公園", note: "門票已搶到，園區內自由活動", lat: 35.1750406, lng: 137.0887716 }
      ],
      hotel: { name: "露櫻GRAND酒店（連住）", note: "", lat: 35.1824617, lng: 137.0213504 }
    },
    {
      id: "day7",
      seal: "七",
      dateLabel: "9/26（六）",
      title: "吉卜力公園 Day 2",
      timeline: [
        { kind: "transport", time: "", title: "藤が丘駅 → 愛・地球博記念公園駅", note: "Linimo磁浮列車，約17分", lat: 35.1750406, lng: 137.0887716 },
        { kind: "sight", time: "全天", title: "吉卜力公園", note: "第二天，換不同區域慢慢逛", lat: 35.1750406, lng: 137.0887716 }
      ],
      hotel: { name: "露櫻GRAND酒店（連住）", note: "", lat: 35.1824617, lng: 137.0213504 }
    },
    {
      id: "day8",
      seal: "終",
      dateLabel: "9/27（日）",
      title: "藤丘 → 機場",
      timeline: [
        { kind: "transport", time: "", title: "藤が丘駅6號乘車處 → 中部國際空港", note: "名鐵巴士直達，約55分，班次不多請提前查當日時刻", lat: 34.8573624, lng: 136.8107557 },
        { kind: "note", time: "", title: "搭機返程", note: "國際線建議提前2-3小時到機場" }
      ],
      hotel: null
    }
  ]
};
