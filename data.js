// ============================================================
// 行程資料檔
// 之後要修改行程內容（時間、地點、住宿），只要改這個檔案裡的文字就好，
// 不會動到版面樣式。中文字串可以直接改，數字（時間、經緯度）請小心修改。
// ============================================================

const TRIP = {
  title: "2026 名古屋・伊勢志摩・知多半島・吉卜力公園",
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
        { kind: "transport", time: "", title: "抵達中部國際空港（Centrair）", note: "入境、領行李後前往機場車站", lat: 34.8584, lng: 136.8051 },
        { kind: "transport", time: "", title: "名鐵 μ-SKY → 名鐵名古屋駅", note: "機場特急直達，約28分（不用換車）", lat: 35.1699, lng: 136.8817 },
        { kind: "note", time: "", title: "飯店 Check-in", note: "飯店就在名古屋車站旁，時差不大不用特別調整", place: "相鐵FRESA INN 名古屋站新幹線口", lat: 35.1678564, lng: 136.8799096 }
      ],
      hotel: {
        name: "相鐵FRESA INN 名古屋站新幹線口",
        note: "名古屋車站旁，隔天南下賢島最方便",
        lat: 35.1678564, lng: 136.8799096
      },
      luggage: "建議在名古屋就把大行李箱用宅配（takuhaibin）直接寄到 Day5 的露櫻藤丘飯店（連住3晚）；伊勢志摩＋離島這幾天只帶一個小旅行包輕裝移動。"
    },
    {
      id: "day1",
      seal: "一",
      dateLabel: "9/20（日）",
      title: "名古屋 → 賢島",
      timeline: [
        { kind: "transport", time: "10:25", title: "近鐵名古屋駅 出發", note: "近鐵特急しまかぜ（志摩之風列車）直達，約1小時35分", place: "近鉄名古屋駅", lat: 35.170915, lng: 136.8815369 },
        { kind: "sight", time: "12:00", title: "抵達賢島駅", note: "真珠養殖觀光船，悠閒感受志摩灣風景", lat: 34.3054114, lng: 136.8216889 },
        { kind: "onsen", time: "傍晚", title: "溫泉旅館泡湯", note: "調整長途移動的疲勞，好好放鬆一晚", place: "賢島寶生苑", lat: 34.3054114, lng: 136.8216889 }
      ],
      hotel: {
        name: "賢島寶生苑",
        note: "車站步行約5分，溫泉旅館",
        lat: 34.3054114, lng: 136.8216889
      },
      luggage: "今天拖行李搭しまかぜ南下賢島；大行李箱請放車廂端的行李置放區，別擋走道。若已宅配大箱，今天就超輕鬆。"
    },
    {
      id: "day2",
      seal: "二",
      dateLabel: "9/21（一）",
      title: "賢島 → 相差 → 鳥羽 → 二見浦",
      timeline: [
        { kind: "transport", time: "08:30", title: "賢島駅 → 鳥羽駅", note: "近鐵特急約29分；行李寄鳥羽駅寄物櫃", lat: 34.3054114, lng: 136.8216889 },
        { kind: "transport", time: "09:15", title: "鳥羽駅 → 相差", note: "かもめ巴士約40分，班次少需先查時刻表", lat: 34.4849, lng: 136.8434 },
        { kind: "food", time: "11:30", title: "海女小屋 まえの浜（前の浜）", note: "相差海女現烤海鮮，需事先預約；吃完在漁村附近走走", lat: 34.3883057, lng: 136.908493 },
        { kind: "transport", time: "13:00", title: "相差 → 鳥羽駅", note: "かもめ巴士約40分", lat: 34.4849, lng: 136.8434 },
        { kind: "sight", time: "14:00", title: "鳥羽水族館", note: "近千種海洋生物，儒艮是招牌明星；站旁步行約10分，約逛2.5h", lat: 34.4815825, lng: 136.8456926 },
        { kind: "transport", time: "17:00", title: "鳥羽駅 → 二見浦駅", note: "JR參宮線約10分；出發前先取回寄物櫃行李", lat: 34.5065, lng: 136.7862 },
        { kind: "food", time: "傍晚", title: "旅館晚餐（海鮮）", note: "二見浦岩戸館用晚餐；若未含晚餐，改在鳥羽先吃海鮮再過來", place: "二見浦岩戸館", lat: 34.5081997, lng: 136.7855235 }
      ],
      hotel: {
        name: "二見浦岩戸館",
        note: "近二見興玉神社，隔天不用早起趕車就能看日出",
        lat: 34.5081997, lng: 136.7855235
      },
      luggage: "換旅館日。白天在鳥羽駅寄物櫃放行李，傍晚搭 JR 前再取出帶去二見浦，就不用拖著跑相差和水族館。"
    },
    {
      id: "day3",
      seal: "三",
      dateLabel: "9/22（二）",
      title: "二見浦 → 伊勢",
      timeline: [
        { kind: "sunrise", time: "清晨", title: "夫婦岩看日出", note: "住宿步行約15-20分；看完在二見浦海邊附近走走", place: "夫婦岩", lat: 34.5089247, lng: 136.7878294 },
        { kind: "food", time: "午餐", title: "二見浦BBQ場", note: "生蠔吃到飽；散步後接近中午來吃，當作午餐", lat: 34.508856, lng: 136.7761429 },
        { kind: "transport", time: "", title: "二見浦駅 → 伊勢市駅", note: "JR參宮線約10分；到站先到 En Hotel Ise 寄放行李，再輕裝出發", lat: 34.4899, lng: 136.707 },
        { kind: "sight", time: "下午", title: "伊勢神宮（外宮→內宮）", note: "外宮前步行參拜；外宮→內宮搭巴士約15分", lat: 34.4550157, lng: 136.7251851 },
        { kind: "sight", time: "傍晚", title: "托福橫町・おかげ橫丁", note: "內宮旁步行即達，老街小吃伴手禮", place: "おかげ横丁", lat: 34.4624294, lng: 136.7228539 },
        { kind: "transport", time: "", title: "內宮 → 伊勢市駅", note: "バス約20分，回外宮／伊勢市駅一帶", lat: 34.4899, lng: 136.707 },
        { kind: "food", time: "晚餐", title: "豚捨 外宮前店", note: "明治年間老店，伊勢牛可樂餅、豚排必點；外宮前、離 En Hotel Ise 很近，吃完散步回飯店", lat: 34.4885142, lng: 136.7074453 }
      ],
      hotel: {
        name: "En Hotel Ise",
        note: "伊勢市駅周邊，走路到車站、商店都方便",
        lat: 34.4920599, lng: 136.7131271
      },
      luggage: "早上退房二見浦岩戸館，行李帶到伊勢後先去 En Hotel Ise 寄放（飯店就在伊勢市駅旁，一般可提早寄放行李），再輕裝去逛外宮、內宮、托福橫町。"
    },
    {
      id: "day4",
      seal: "四",
      dateLabel: "9/23（三）",
      title: "伊勢 → 渡輪 → 日間賀島",
      timeline: [
        { kind: "transport", time: "上午", title: "En Hotel Ise 退房", note: "JR參宮線 伊勢市駅 → 鳥羽駅，約20分", place: "En Hotel Ise", lat: 34.4920599, lng: 136.7131271 },
        { kind: "transport", time: "", title: "抵達鳥羽駅", note: "步行約12分到伊勢灣渡輪乘船處（或搭近鐵到中之郷駅、步行約3分更近）", lat: 34.4849, lng: 136.8434 },
        { kind: "ferry", time: "12:10", title: "鳥羽港搭伊勢灣渡輪", note: "12:10 鳥羽發 → 13:05 抵伊良湖（航程約55分）", lat: 34.4806, lng: 136.8458 },
        { kind: "sight", time: "13:05", title: "伊良湖岬散策・午餐", note: "戀路之濱、伊良湖岬燈塔、道の駅大あさり丼，約2小時（至15:05搭船）", place: "伊良湖岬", lat: 34.5843963, lng: 137.019651 },
        { kind: "ferry", time: "15:05", title: "伊良湖搭名鐵海上觀光船", note: "經篠島往日間賀島、約40分。9/23秋分假日班表：11:05／15:05／16:05", lat: 34.5843963, lng: 137.019651 },
        { kind: "sight", time: "約15:45", title: "抵達日間賀島", note: "章魚造型裝置藝術很好拍，環島悠閒", lat: 34.7051045, lng: 137.0060226 }
      ],
      hotel: {
        name: "大海老",
        note: "島上知名章魚河豚料理民宿，15:00起入住",
        lat: 34.7038953, lng: 136.9980804
      },
      alert: "伊勢灣渡輪時刻已依現行班表（12:10鳥羽發→13:05伊良湖）。名鐵海上觀光船伊良湖線班次少（假日 11:05／15:05／16:05），2026年9月正式時刻約8月中公布，屆時務必再核對並提前訂位。",
      luggage: "上兩趟船＋登離島，最不適合拖大行李的一天。務必輕裝、只帶登船小包；大箱理想上已宅配到名古屋。島上民宿大海老需步行進出。"
    },
    {
      id: "day5",
      seal: "五",
      dateLabel: "9/24（四）",
      title: "日間賀島 → 河和 → 名古屋 → 藤丘",
      timeline: [
        { kind: "sight", time: "上午", title: "日間賀島悠閒半天", note: "環島步行，島上章魚裝置藝術", place: "日間賀島", lat: 34.7051045, lng: 137.0060226 },
        { kind: "ferry", time: "", title: "日間賀島 → 河和港", note: "名鐵海上觀光船，約20分", lat: 34.7781055, lng: 136.9118864 },
        { kind: "transport", time: "", title: "河和港 → 河和駅", note: "步行約7分", lat: 34.7862, lng: 136.935 },
        { kind: "transport", time: "", title: "河和駅 → 名鐵名古屋駅", note: "名鐵特急，約50分", lat: 35.1699, lng: 136.8817 },
        { kind: "sight", time: "下午", title: "名古屋市區逛街", note: "名古屋城 / 大須觀音商店街，自由運用", place: "名古屋城", lat: 35.1847501, lng: 136.8996883 },
        { kind: "transport", time: "", title: "名古屋駅 → 藤が丘駅", note: "地下鐵東山線，約30分", lat: 35.1824617, lng: 137.0213504 }
      ],
      hotel: {
        name: "露櫻GRAND酒店 名古屋藤丘站前",
        note: "藤丘車站前，吉卜力公園進出都方便（連住3晚）",
        lat: 35.18311, lng: 137.0189254
      },
      luggage: "離島退房搭船＋電車回名古屋。若先前有宅配，今天入住露櫻就能拿回大行李；沒宅配就一路拖回，河和換車時留意月台電梯。"
    },
    {
      id: "day6",
      seal: "六",
      dateLabel: "9/25（五）",
      title: "吉卜力公園 Day 1",
      timeline: [
        { kind: "transport", time: "", title: "藤が丘駅 → 愛・地球博記念公園駅", note: "Linimo磁浮列車，約17分", lat: 35.1824617, lng: 137.0213504 },
        { kind: "sight", time: "全天", title: "吉卜力公園", note: "門票已搶到，園區內自由活動", lat: 35.1750406, lng: 137.0887716 }
      ],
      hotel: { name: "露櫻GRAND酒店（連住）", place: "露櫻GRAND酒店 名古屋藤丘站前", note: "", lat: 35.18311, lng: 137.0189254 },
      luggage: "連住露櫻，行李留飯店，輕裝去吉卜力公園（園區有投幣置物櫃可寄小包）。"
    },
    {
      id: "day7",
      seal: "七",
      dateLabel: "9/26（六）",
      title: "吉卜力公園 Day 2",
      timeline: [
        { kind: "transport", time: "", title: "藤が丘駅 → 愛・地球博記念公園駅", note: "Linimo磁浮列車，約17分", lat: 35.1824617, lng: 137.0213504 },
        { kind: "sight", time: "全天", title: "吉卜力公園", note: "第二天，換不同區域慢慢逛", lat: 35.1750406, lng: 137.0887716 }
      ],
      hotel: { name: "露櫻GRAND酒店（連住）", place: "露櫻GRAND酒店 名古屋藤丘站前", note: "", lat: 35.18311, lng: 137.0189254 },
      luggage: "同樣連住露櫻，行李留飯店輕裝出門；園區走一整天，穿好走的鞋。"
    },
    {
      id: "day8",
      seal: "終",
      dateLabel: "9/27（日）",
      title: "藤丘 → 機場",
      timeline: [
        { kind: "transport", time: "", title: "藤が丘駅6號乘車處 → 中部國際空港", note: "名鐵巴士直達，約55分，班次不多請提前查當日時刻", lat: 35.1824617, lng: 137.0213504 },
        { kind: "note", time: "", title: "搭機返程", note: "國際線建議提前2-3小時到機場", place: "中部国際空港", lat: 34.8584, lng: 136.8051 }
      ],
      hotel: null,
      luggage: "退房露櫻，拖行李搭名鐵巴士直達中部空港，大箱放巴士行李廂；抵達機場後辦理托運。"
    }
  ]
};
