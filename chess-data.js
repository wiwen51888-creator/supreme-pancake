(()=>{
'use strict';
const tiers=[["袋鼠","管理员企鹅","高松灯企鹅","汤圆","奶蛙","说的道理","东雪莲","尼古喵喵","叮咚鸡","小松绿","仲町阿拉蕾","向晚","李老八","峰月律","山泥若","古振兴"],["奶龙","牛来","千早爱音","八幡海铃","张顺飞","四时小路","若叶睦","宫永野乃花","嘉然","珈乐","孙笑川","长崎素世","灰泽满","星瞳"],["阿梓","贝拉","冬马和纱","薇欧拉","高松灯","炫狗","露早","三角初华","要乐奈","明前奶绿","耄耋","诗歌剧"],["电棍","七海","牛妈妈","小木曾雪菜","千石由乃","椎名立希","闹吃","乃琳","祐天寺若麦","凑友希那"],["乔希","炫神","永雏塔菲","柚恩","丰川祥子","东北雨姐","藤都子","踩背象"]];
const version3Tiers=[["袋鼠","管理员企鹅","高松灯企鹅","汤圆","奶蛙","说的道理","东雪莲","尼古喵喵","叮咚鸡","小松绿","仲町阿拉蕾","向晚","李老八","灰泽满","山泥若","古振兴"],["奶龙","牛来","千早爱音","八幡海铃","耄耋","四时小路","若叶睦","宫永野乃花","嘉然","珈乐","孙笑川","长崎素世","峰月律","星瞳"],["阿梓","贝拉","冬马和纱","凑友希那","高松灯","牛妈妈","露早","三角初华","要乐奈","明前奶绿","张顺飞","诗歌剧"],["电棍","七海","炫狗","小木曾雪菜","藤都子","椎名立希","闹吃","乃琳","祐天寺若麦","薇欧拉"],["乔希","炫神","永雏塔菲","柚恩","丰川祥子","东北雨姐","千石由乃","踩背象"]];
window.CHESS_VERSION3_POOL=Object.fromEntries(TURN_ROSTER.map(c=>[c.id,[24,20,18,12,10][version3Tiers.findIndex(t=>t.includes(c.name))]]));
const previousTiers=[["奶蛙","汤圆","袋鼠","高松灯企鹅","管理员企鹅","说的道理","东雪莲","小松绿","千早爱音","八幡海铃","仲町阿拉蕾","尼古喵喵","耄耋","叮咚鸡","向晚","李老八"],["奶龙","牛来","灰泽满","明前奶绿","张顺飞","古振兴","若叶睦","四时小路","长崎素世","孙笑川","嘉然","珈乐","宫永野乃花","山泥若"],["七海","贝拉","冬马和纱","凑友希那","星瞳","高松灯","牛妈妈","阿梓","要乐奈","三角初华","峰月律","露早"],["电棍","炫狗","小木曾雪菜","藤都子","椎名立希","闹吃","踩背象","乃琳","祐天寺若麦","诗歌剧"],["乔希","炫神","永雏塔菲","柚恩","丰川祥子","东北雨姐","薇欧拉","千石由乃"]];
window.CHESS_PREVIOUS_POOL=Object.fromEntries(TURN_ROSTER.map(c=>[c.id,[24,20,18,12,10][previousTiers.findIndex(t=>t.includes(c.name))]]));
const legacyTiers=[["奶蛙","汤圆","袋鼠","高松灯企鹅","管理员企鹅","说的道理","东雪莲","长崎素世","小松绿","千早爱音","八幡海铃","仲町阿拉蕾","孙笑川","尼古喵喵","耄耋","叮咚鸡"],["奶龙","牛来","牛妈妈","灰泽满","明前奶绿","向晚","李老八","张顺飞","古振兴","若叶睦","阿梓","要乐奈","三角初华","四时小路"],["七海","贝拉","珈乐","嘉然","乃琳","冬马和纱","凑友希那","宫永野乃花","祐天寺若麦","星瞳","高松灯","山泥若"],["电棍","炫狗","峰月律","千石由乃","露早","小木曾雪菜","藤都子","椎名立希","闹吃","踩背象"],["乔希","炫神","永雏塔菲","柚恩","丰川祥子","东北雨姐","薇欧拉","诗歌剧"]];
window.CHESS_LEGACY_POOL=Object.fromEntries(TURN_ROSTER.map(c=>[c.id,[24,20,18,12,10][legacyTiers.findIndex(t=>t.includes(c.name))]]));
const roleStats={先锋:[920,53,36,1.12,1],强攻:[700,74,19,.98,1],游击:[660,65,14,.78,1],术士:[680,70,18,1.10,3.2],控场:[745,58,25,1.10,2.4],支援:[745,57,24,1.13,3]};
const supportSlots={'高松灯企鹅':2,'灰泽满':2,'高松灯':1,'若叶睦':2,'千石由乃':2,'尼古喵喵':2,'奶龙':2,'峰月律':2};
const traits={
 "先锋": {
  "steps": [
   2,
   4
  ],
  "mod": "hp",
  "values": [
   0.06,
   0.1
  ],
  "text": "先锋生命提高6 / 10%"
 },
 "强攻": {
  "steps": [
   2,
   4
  ],
  "mod": "attack",
  "values": [
   0.05,
   0.08
  ],
  "text": "强攻攻击提高5 / 8%"
 },
 "游击": {
  "steps": [
   2,
   4
  ],
  "mod": "haste",
  "values": [
   0.06,
   0.1
  ],
  "text": "游击攻速提高6 / 10%"
 },
 "术士": {
  "steps": [
   2,
   4
  ],
  "mod": "spell",
  "values": [
   0.08,
   0.12
  ],
  "text": "术士技能伤害提高8 / 12%"
 },
 "控场": {
  "steps": [
   2,
   4
  ],
  "mod": "armor",
  "values": [
   6,
   10
  ],
  "text": "控场护甲提高6 / 10"
 },
 "支援": {
  "steps": [
   2,
   4
  ],
  "mod": "healing",
  "values": [
   0.08,
   0.12
  ],
  "text": "支援治疗与护盾提高8 / 12%"
 }
};
const relationships=[
 {"id":"mygo","name":"MyGO","members":["高松灯","千早爱音","要乐奈","长崎素世","椎名立希"],"steps":[3,5],"text":"成员攻击提高8 / 18%。成员普攻命中额外回复2 / 3能量。","factualBasis":"五人为 MyGO!!!!! 成员。","sourceUrls":["https://bang-dream.com/artist/mygo/","https://anime.bang-dream.com/bandorichan/character/mygo/"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"attack":[0.08,0.18]}},
 {"id":"avemujica","name":"Mujica","members":["三角初华","若叶睦","八幡海铃","祐天寺若麦","丰川祥子"],"steps":[3,5],"text":"成员技能伤害提高10 / 20%。成员首次低于50%生命时，获得10 / 16能量和4 / 6%最大生命护盾；同名角色共享次数。","factualBasis":"五人为 Ave Mujica 成员。","sourceUrls":["https://anime.bang-dream.com/bandorichan/character/avemujica/"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"spell":[0.1,0.2]}},
 {"id":"crychic","name":"CRYCHIC","members":["高松灯","长崎素世","椎名立希","若叶睦","丰川祥子"],"steps":[3,5],"text":"成员生命提高6 / 12%。首位成员低于50%生命时，所有在场成员获得4 / 7%最大生命护盾；每场一次。","factualBasis":"此五人为 CRYCHIC 的成员；官方活动解答明确列全。","sourceUrls":["https://bang-dream.com/news/2067/"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"hp":[0.06,0.12]}},
 {"id":"yumemita","name":"梦限大","members":["仲町阿拉蕾","宫永野乃花","峰月律","藤都子","千石由乃"],"steps":[3,5],"text":"成员技能伤害提高8 / 18%。成员初始能量增加10 / 18；首次施法获得4 / 6%最大生命护盾，同名角色共享首次施法次数。","factualBasis":"五人为梦限大みゅーたいぷ成员，对应主唱、两吉他、键盘、DJ&Mp。","sourceUrls":["https://bang-dream.com/artist/yumemita/nakamachi-arale/"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"spell":[0.08,0.18]}},
 {"id":"asoul","name":"A-SOUL","members":["向晚","贝拉","珈乐","嘉然","乃琳"],"steps":[3,5],"text":"成员攻击提高8 / 16%，成员治疗和护盾提高8 / 16%。成员施法后，为生命比例最低的另一位成员回复1.8 / 2.6%最大生命；同组4秒冷却。","factualBasis":"2020官方首曲 Quiet 演唱名单为这五名角色。","sourceUrls":["https://www.bilibili.com/video/BV1YK411V7N3/"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"attack":[0.08,0.16],"healing":[0.08,0.16]}},
 {"id":"eoe","name":"EOE","members":["露早","柚恩"],"steps":[2],"text":"成员攻击提高8%。成员受击后，为另一位成员回复3能量；同组4秒冷却。","factualBasis":"露早与柚恩均为 EOE 五人组合成员；官方首曲列出完整五人。","sourceUrls":["https://www.bilibili.com/video/av983711178/"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"attack":[0.08]}},
 {"id":"virtuareal","name":"VirtuaReal","members":["七海","阿梓","灰泽满","小松绿","四时小路","明前奶绿"],"steps":[3,5],"text":"成员技能伤害提高8 / 18%。每种成员首次施法，为能量最低的另一位成员回复6 / 10能量；同名副本共享次数。","factualBasis":"按作者本轮指定，将明前奶绿纳入游戏的VirtuaReal组合阵容。","sourceUrls":["https://zh.wikipedia.org/wiki/VirtuaReal","https://www.bilibili.com/opus/1157600201512321064","https://www.sina.cn/news/detail/5328523237786056.html","https://virtualyoutuber.fandom.com/wiki/List_of_VirtuaReal_Songs"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"spell":[0.08,0.18]}},
 {"id":"vr28","name":"287","members":["小松绿","四时小路"],"steps":[2],"text":"成员技能伤害提高8%。每种成员首次施法，为另一位成员提供5%最大生命护盾；同名副本共享次数。","factualBasis":"官方同一新人公告列小松绿与四时小路；属于28期，粉丝常写287。","sourceUrls":["https://www.sina.cn/news/detail/5328523237786056.html","https://bacharu.io/vtuber/viridis"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"spell":[0.08]}},
 {"id":"xiaohai","name":"梓鲨","members":["七海","阿梓"],"steps":[2],"text":"成员攻击提高6%。第一位成员施法时，两位成员各回复4%最大生命；每场一次。","factualBasis":"公开音乐组合小海梓成员为七海、阿梓、小可；两名在本游戏。","sourceUrls":["https://virtualyoutuber.fandom.com/wiki/List_of_VirtuaReal_Songs","https://www.bilibili.com/video/BV1b34y1b7fU/"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"attack":[0.06]}},
 {"id":"whitealbum","name":"白色相簿","members":["冬马和纱","小木曾雪菜"],"steps":[2],"text":"成员攻击提高8%。成员施法后，为另一位成员回复5能量；同组4秒冷却。","factualBasis":"WHITE ALBUM2 官方剧情记载轻音同好会与学园祭演出关系。","sourceUrls":["https://whitealbum2.jp/story/"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"attack":[0.08]}},
 {"id":"studio6324","name":"6324","members":["李老八","孙笑川","张顺飞"],"steps":[2,3],"text":"成员攻击提高8 / 16%。成员施法后，另一位成员下次普攻伤害提高10 / 16%；同组5秒冷却，同类取最高值。","factualBasis":"李老八即李赣；李赣、孙笑川的抽象工作室经历有专访，旧成员报道和三人直播片段支持张顺飞也参与过6324。描述历史直播阵容，不描述当前私交。","sourceUrls":["https://www.chuapp.com/?a=index&c=Article&id=285712","https://www.bilibili.com/video/BV1xx4y1e7km/","https://read01.com/zh-sg/Q3emNAm.html"],"category":"team","nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"aura":{"attack":[0.08,0.16]}},
 {"id":"niufamily","name":"妈妈！牛来！","members":["牛来","牛妈妈"],"steps":[2],"text":"首位成员低于40%生命且另一位存活时，获得8%最大生命护盾；另一位回复3%最大生命。整组每场仅一次。","factualBasis":"牛妈妈是电影《牛来》中牛来的母亲。","sourceUrls":["https://bkso.baidu.com/item/%E7%89%9B%E6%9D%A5/59676341?fromModule=lemma_inlink"],"category":"team"},
 {"id":"starandtaffy","name":"虚环同台","members":["星瞳","永雏塔菲","七海"],"steps":[2,3],"text":"成员技能伤害提高6 / 12%。不同成员交替施法时，后施法者下次普攻伤害提高10 / 16%；同组5秒冷却，同类取最高值。","factualBasis":"按作者指定，游戏的虚环同台羁绊包含星瞳、永雏塔菲、七海。","sourceUrls":["https://www.weibo.com/p/1005057618923072/home?mod=data"],"category":"team","nameAliases":[],"nameBasis":"可验证的是两位在虚环展位同台，未取得星菲是广泛CP称呼的可靠证据，改为明确的同台羁绊标题。","nameSourceUrls":["https://www.sina.cn/news/detail/5318249174271871.html"],"aura":{"spell":[0.06,0.12]}},
 {"id":"green_names","name":"绿意同框","members":["小松绿","明前奶绿"],"steps":[2],"category":"theme","effect":"care","text":"成员治疗和护盾提高6%。成员施法后，回复同伴1.5%最大生命。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"两人的公开名字均含绿；小松绿有植物/园艺人设，明前奶绿本人设定为花店店员。按绿色与植物关联组队，未查到两人现实同团或固定搭档的证据。","sourceUrls":["https://bacharu.io/vtuber/viridis","https://www.sina.cn/news/detail/5329426401206287.html","https://www.bilibili.com/opus/709069976572526628"],"values":[0.015],"cooldown":6,"aura":{"healing":[0.06]}},
 {"id":"animal_zoo","name":"动物园开门","members":["炫神","电棍","山泥若"],"steps":[2,3],"category":"theme","effect":"pulse","text":"成员攻击提高6 / 12%。成员施法后，使同伴下次普攻伤害提高8 / 13%。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"动物园是观众把带有动物外号的英雄联盟主播共同称呼的圈内词，公开报道明确列这三人；不是正式战队或真实动物分类。","sourceUrls":["https://egameinsider.com/p/vpzvz18eb4a0/","https://wiki.ottohub.cn/%E7%94%B5%E6%A3%8D"],"values":[0.08,0.13],"cooldown":6,"aura":{"attack":[0.06,0.12]}},
 {"id":"penguin_chorus","name":"咕咕嘎嘎","members":["高松灯企鹅","管理员企鹅"],"steps":[2],"category":"theme","effect":"tempo","text":"成员生命提高8%。成员施法后，为同伴回复4能量。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"高松灯企鹅与终末地管理员企鹅属于两个不同角色来源的二创形象，公开作品共同使用咕咕嘎嘎拟声梗；不是同一只企鹅或官方亲属。","sourceUrls":["https://www.bilibili.com/video/BV1zAC4B7ERC/","https://moegirl.uk/index.php?title=%E5%92%95%E5%92%95%E5%98%8E%E5%98%8E&variant=zh-hans","https://www.douyin.com/video/7618809337615792634"],"values":[4],"cooldown":6,"aura":{"hp":[0.08]}},
 {"id":"milk_laugh","name":"奶系狂笑","members":["奶龙","奶蛙"],"steps":[2],"category":"theme","effect":"care","text":"成员生命提高8%。成员施法后，回复同伴1.5%最大生命。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"两者在公开表情包帖子中被并列传播，大笑是可核对的共同表现。奶蛙常被当作奶龙衍生迷因，但未找到足以确认奶蛙官方创作者及衍生授权的可靠来源，因此不标官方同系列。","sourceUrls":["https://www.sina.cn/news/detail/5329000809367043.html","https://www.iqiyi.com/a_1odrvw6uqvd.html"],"values":[0.015],"cooldown":6,"aura":{"hp":[0.08]}},
 {"id":"tangyuan_chat","name":"S6第一个王者","members":["炫神","炫狗","汤圆"],"steps":[2,3],"category":"theme","effect":"pulse","text":"成员攻击提高6 / 12%。成员施法后，使同伴下次普攻伤害提高10 / 15%。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"公开直播切片中炫神直接谈论发汤圆表情；炫狗是炫神的别称，而本游戏保留两个独立棋子。该三人组是将同一主播的双形象与汤圆表情做成游戏联动，不是三个现实主播。","sourceUrls":["https://www.bilibili.com/video/BV1t383zzEyT/","https://www.bilibili.com/video/BV14yZSYuETA/"],"nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"values":[0.1,0.15],"cooldown":6,"aura":{"attack":[0.06,0.12]}},
 {"id":"voxel_creators","name":"方块创世者","members":["闹吃","古振兴"],"steps":[2],"category":"theme","effect":"ward","text":"成员生命提高8%。成员施法后，给同伴2%最大生命护盾。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"闹吃按用户此前明确指定对应Notch。Minecraft官方制作名单确认原作者Markus Persson；古振兴本人采访确认迷你世界联合创始人与沙盒创作平台身份。两人为不同方块游戏的创作关联，不推定私人竞争或合作。","sourceUrls":["https://www.minecraft.net/de-de/credits","https://en.wikipedia.org/wiki/Markus_Persson","https://chanye.07073.com/caifang/1911875.html","https://www.sohu.com/a/195352038_234653"],"values":[0.02],"cooldown":6,"aura":{"hp":[0.08]}},
 {"id":"bobo_chicken","name":"钵钵鸡","members":["珈乐","贝拉"],"steps":[2],"category":"pair","effect":"pulse","text":"成员攻击提高3.5%。成员施法后，使同伴下次普攻伤害提高10%。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"公开同人视频用珈乐、贝拉、贝贝珈、钵钵鸡及CP标签，足以确认配对称呼流传。这里只表示观众对虚拟角色的同人组合，不表示配音表演者或现实人物的恋爱关系。","sourceUrls":["https://www.bilibili.com/video/BV1Zw4m1X7Ss/","https://www.bilibili.com/video/av378881341/"],"nameAliases":["贝贝珈","BBJ"],"nameBasis":"钵钵鸡与贝贝珈均有实际投稿同时使用；沿用用户指定且已获证实的钵钵鸡。","nameSourceUrls":["https://www.bilibili.com/video/BV1puSrYQEBT/","https://www.bilibili.com/video/BV1Zw4m1X7Ss/","https://www.taptap.cn/moment/297472102905154267"],"values":[0.1],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"brave_cattle","name":"勇敢牛牛","members":["牛来","牛妈妈","贝拉"],"steps":[3],"category":"theme","effect":"pulse","text":"成员攻击提高8%。成员施法后，使同伴下次普攻伤害提高12%。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"牛来与牛妈妈是电影中的小牛和母牛，贝拉有可核对的勇敢牛牛公开口号。将牛系角色与牛牛梗组合是本游戏主题，不表示贝拉在牛来电影内或是其家庭成员。","sourceUrls":["https://bkso.baidu.com/item/%E7%89%9B%E6%9D%A5/59676341?fromModule=lemma_inlink","https://www.bilibili.com/video/BV1wBbC6MEDU/","https://www.bilibili.com/video/BV1hy4y1T7Tc/"],"values":[0.12],"cooldown":6,"aura":{"attack":[0.08]}},
 {"id":"alley_cats","name":"哈基米","members":["尼古喵喵","耄耋","要乐奈","凑友希那"],"steps":[2,4],"category":"theme","effect":"haste","text":"成员攻速提高5 / 10%。成员施法后，使同伴攻速提高8 / 14%，持续4秒。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"猫元素与猫控组成的跨作品游戏主题。官方角色页写明凑友希那非常喜欢猫；不表示现实社交关系。","sourceUrls":["https://yanineko-anime.com/","https://zh.wikipedia.org/wiki/%E5%9C%86%E5%A4%B4%E7%8C%AB%E7%88%B9","https://anime.bang-dream.com/bandorichan/character/mygo/","https://anime.bang-dream.com/3rd/character/roselia/"],"values":[0.08,0.14],"cooldown":6,"aura":{"haste":[0.05,0.1]}},
 {"id":"viola_miyako","name":"薇藤","members":["薇欧拉","藤都子"],"steps":[2],"category":"theme","effect":"focus","text":"成员技能伤害提高8%。成员施法后，使同伴下次技能伤害提高6%。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"官方确认薇欧拉属于YUME∞MITA动画、藤都子是梦限大键盘手；公开同步视听和薇藤二创直接连接两名角色。羁绊使用作品人物互动与同人称呼，不把薇欧拉并入现实五人乐队成员表。","sourceUrls":["https://anime.bang-dream.com/yumemita/character/viola/","https://bang-dream.com/artist/yumemita/fuji-miyako/","https://www.bilibili.com/video/BV1nL8A6REXN/","https://www.bilibili.com/video/BV1kDgX6LET6/"],"nameAliases":[],"nameBasis":"保留被多位独立创作者直接使用的薇藤，删除原创后缀回响；高：至少三篇独立作者投稿直接标题使用薇藤","nameSourceUrls":["https://www.bilibili.com/video/BV1ro3M6xEu9/","https://www.bilibili.com/video/BV1jA3D6eENN/","https://www.bilibili.com/video/BV1dkuP6aEJg/"],"values":[0.06],"cooldown":6,"aura":{"spell":[0.08]}},
 {"id":"dongbei_voice","name":"东北腔调","members":["东北雨姐","电棍"],"steps":[2],"category":"theme","effect":"pulse","text":"成员生命提高6%。成员施法后，使同伴下次普攻伤害提高8%。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"公开资料记东北雨姐来自辽宁本溪、电棍来自辽宁鞍山。按东北地域和口音表现组合，不能写成同乡同城或已确认的现实搭档。","sourceUrls":["https://zh.wikipedia.org/wiki/%E4%B8%9C%E5%8C%97%E9%9B%A8%E5%A7%90","https://www.gamersky.com/zl/202208/1509331.shtml"],"values":[0.08],"cooldown":6,"aura":{"hp":[0.06]}},
 {"id":"ccb_story","name":"笑传之踩踩背","members":["踩背象","电棍"],"steps":[2],"category":"theme","effect":"ward","text":"成员生命提高6%。成员施法后，给同伴2%最大生命护盾。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"踩背大蓝象来自豌豆笑传相关动画；电棍笑传鬼畜把该大象情节和电棍素材连在一起，CCB是踩踩背的拼音缩写。游戏使用踩背动作与清洁版词义。","sourceUrls":["https://www.bilibili.com/video/BV1wi421i7Zo/","https://moegirl.icu/zh-hant/Ccb"],"values":[0.02],"cooldown":6,"aura":{"hp":[0.06]}},
 {"id":"hachimi_mambo","name":"哈基米曼波","members":["耄耋","诗歌剧"],"steps":[2],"category":"theme","effect":"tempo","text":"成员攻速提高6%。成员施法后，为同伴回复4能量。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"耄耋表情与诗歌剧曼波在同一广义哈基米二创圈传播。曼波的来源对应诗歌剧，哈基米最初源于东海帝王的蜂蜜语音，后来才被用于猫视频；本组不声称诗歌剧是哈基米原始出处或耄耋出自赛马娘。","sourceUrls":["https://news.17173.com/content/02202025/015404938.shtml","https://hachimi.fandom.com/zh/wiki/%E5%93%88%E5%9F%BA%E7%B1%B3%E4%BA%9A%E6%96%87%E5%8C%96%E7%AE%80%E4%BB%8B","https://zh.wikipedia.org/wiki/%E5%9C%86%E5%A4%B4%E7%8C%AB%E7%88%B9"],"values":[4],"cooldown":6,"aura":{"haste":[0.06]}},
 {"id":"tomori_double","name":"灯与凑企鹅","members":["高松灯","高松灯企鹅"],"steps":[2],"category":"theme","effect":"tempo","text":"成员治疗和护盾提高6%。成员施法后，为同伴回复4能量。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"高松灯为MyGO主唱，高松灯企鹅是其头部与企鹅形象结合的观众二创。本游戏双棋子共享原型是明确的衍生关系，不能把两个独立棋子当作两位现实成员。","sourceUrls":["https://anime.bang-dream.com/bandorichan/character/mygo/","https://www.bilibili.com/video/BV1zAC4B7ERC/","https://moegirl.uk/index.php?title=%E5%92%95%E5%92%95%E5%98%8E%E5%98%8E&variant=zh-hans"],"values":[4],"cooldown":6,"aura":{"healing":[0.06]}},
 {"id":"three_yellow","name":"三黄","members":["奶蛙","牛妈妈","袋鼠"],"steps":[3],"category":"theme","effect":"ward","text":"成员生命提高8%。成员施法后，给同伴3%最大生命护盾。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"用户最新明确指定的三黄视觉主题，成员只能是奶蛙、牛妈妈、袋鼠。本条以用户设定和现有游戏形象为依据，不用奶龙替换奶蛙，也不编造现实关系。","sourceUrls":[],"values":[0.03],"cooldown":6,"aura":{"hp":[0.08]}},
 {"id":"pair_asoul_ava_diana","name":"嘉晚饭","members":["向晚","嘉然"],"steps":[2],"category":"pair","effect":"care","text":"成员攻击提高3.5%。成员施法后，回复同伴1.5%最大生命。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2021年4月官方歌舞会，两人合作《挥着翅膀的女孩》。","sourceUrls":["https://www.bilibili.com/video/BV1pZ4y1c7jr/"],"nameAliases":[],"nameBasis":"不同创作者投稿标题直接使用嘉晚饭；删除游戏自加后缀同行。","nameSourceUrls":["https://www.bilibili.com/video/BV1CU4y187te/","https://www.bilibili.com/s/video/BV1g5411R7Jd","https://www.bilibili.com/read/cv27218638/"],"values":[0.015],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_asoul_bella_eileen","name":"乃贝","members":["贝拉","乃琳"],"steps":[2],"category":"pair","effect":"ward","text":"成员攻击提高3.5%。成员施法后，给同伴2%最大生命护盾。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"官方4.1歌舞会双人节目《后会无期》。","sourceUrls":["https://www.bilibili.com/video/BV1pZ4y1c7jr/"],"nameAliases":[],"nameBasis":"不同创作者的标题、录播标签与粉丝站均直接使用乃贝；删除游戏自加后缀和声。","nameSourceUrls":["https://www.bilibili.com/video/BV1KU4y1J742/","https://www.bilibili.com/video/BV1FJ2gBVEw7/","https://www.bilibili.com/opus/817687470240956450"],"values":[0.02],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_asoul_diana_eileen","name":"琳嘉女孩","members":["嘉然","乃琳"],"steps":[2],"category":"pair","effect":"tempo","text":"成员攻击提高3.5%。成员施法后，为同伴回复4能量。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2021年10月28日双人直播的官方剪辑。","sourceUrls":["https://www.bilibili.com/video/BV19R4y1t7pq"],"nameAliases":["琳嘉"],"nameBasis":"琳嘉女孩为完整组合名、琳嘉为常见简称；多个独立投稿明确同时含两位角色及该标签。","nameSourceUrls":["https://www.bilibili.com/video/BV1eYw8zFEpT/","https://www.bilibili.com/video/BV1Lx39zsEm3/","https://www.bilibili.com/read/cv27218638/"],"values":[4],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_asoul_carol_eileen","name":"琳狼","members":["珈乐","乃琳"],"steps":[2],"category":"pair","effect":"care","text":"成员攻击提高3.5%。成员施法后，回复同伴1.5%最大生命。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"官方4.1歌舞会双人节目《冬眠》。","sourceUrls":["https://www.bilibili.com/video/BV1pZ4y1c7jr/"],"nameAliases":["珈特琳"],"nameBasis":"早期社群文章与后续混剪均用琳狼，替换缺乏常用依据的珈乃；珈特琳作为早期别称记录。","nameSourceUrls":["https://www.bilibili.com/list/361755846?bvid=BV1Qu4y1R7yJ&oid=829559498","https://www.bilibili.com/read/mobile?id=13011451","https://moegirl.uk/%E7%8F%88%E4%B9%90"],"values":[0.015],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_mygo_tomori_anon","name":"爱灯","members":["高松灯","千早爱音"],"steps":[2],"category":"pair","effect":"tempo","text":"成员攻击提高3.5%。成员施法后，为同伴回复4能量。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2025年7月30日爱知公演的双人语音名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":[],"nameBasis":"不同作者直接以爱灯命名剪辑或在自己的同人作品中使用；本轮没有取得灯爱独立直达作品的充分证据，不把逆序称作同等常用。","nameSourceUrls":["https://www.bilibili.com/video/BV18H4y1N7fX/","https://www.bilibili.com/video/BV1C4421X79X/","https://www.bilibili.com/opus/929387904488177719"],"values":[4],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_mygo_tomori_taki","name":"灯希","members":["高松灯","椎名立希"],"steps":[2],"category":"pair","effect":"ward","text":"成员攻击提高3.5%。成员施法后，给同伴2%最大生命护盾。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2025年7月限定车内语音的双人名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":["希灯","灯希灯"],"nameBasis":"立希在此CP简称中取希。希灯和灯希灯也直接见于作者标签或标题。","nameSourceUrls":["https://www.bilibili.com/video/BV1GzjRzAEPH/","https://www.bilibili.com/video/BV1AjNzzCEL7/"],"values":[0.02],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_mygo_anon_soyo","name":"爱素","members":["千早爱音","长崎素世"],"steps":[2],"category":"pair","effect":"care","text":"成员攻击提高3.5%。成员施法后，回复同伴1.5%最大生命。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2025年7月1日东京公演的双人语音名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":["素爱"],"nameBasis":"爱素和逆序素爱均有直接同人标题；选爱素仅作为统一显示名，不宣称全网占比。","nameSourceUrls":["https://www.bilibili.com/video/BV1PmgfzQE2f/","https://www.bilibili.com/video/BV1QheMeWEyh/","https://www.bilibili.com/video/BV1enQBYeEcd/"],"values":[0.015],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_mygo_rana_taki","name":"猫希","members":["要乐奈","椎名立希"],"steps":[2],"category":"pair","effect":"pulse","text":"成员攻击提高3.5%。成员施法后，使同伴下次普攻伤害提高8%。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2025年7月12日大阪公演的双人语音名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":[],"nameBasis":"乐奈的猫意象简称与立希的希组成实际投稿标签猫希；希猫仅在其他投稿的合集目录里间接见到，暂不列已核实常见逆称。","nameSourceUrls":["https://www.bilibili.com/video/BV1wRgmz7E7n/","https://www.bilibili.com/video/BV1Zb42187zu/"],"values":[0.08],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_mygo_rana_soyo","name":"猫素","members":["要乐奈","长崎素世"],"steps":[2],"category":"pair","effect":"ward","text":"成员攻击提高3.5%。成员施法后，给同伴2%最大生命护盾。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2025年12月6日公演的双人语音名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":[],"nameBasis":"按作者本轮指定的游戏羁绊名称调整。","nameSourceUrls":[],"values":[0.02],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_ave_uika_sakiko","name":"初祥","members":["三角初华","丰川祥子"],"steps":[2],"category":"pair","effect":"tempo","text":"成员攻击提高3.5%。成员施法后，为同伴回复4能量。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2025年12月14日东京公演的双人语音名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":["祥初"],"nameBasis":"两位不同作者在直接投稿标题中使用初祥；逆序祥初亦见同人活动自用名称。","nameSourceUrls":["https://www.bilibili.com/video/BV1zz1vBkEMh/","https://www.bilibili.com/video/BV1kFT3zqEkm/","https://www.sina.cn/news/detail/5144560042250889.html","https://minorities.vercel.app/"],"values":[4],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_ave_mutsumi_sakiko","name":"睦祥","members":["若叶睦","丰川祥子"],"steps":[2],"category":"pair","effect":"ward","text":"成员攻击提高3.5%。成员施法后，给同伴2%最大生命护盾。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"官方若叶睦人物介绍明确两人为幼时相识的朋友。","sourceUrls":["https://bang-dream.com/artist/avemujica/wakaba-mutsumi/"],"nameAliases":["祥睦"],"nameBasis":"睦祥与祥睦都在不同创作者自己的MAD、漫画或同人计划中直接出现。","nameSourceUrls":["https://www.bilibili.com/opus/1035537561631588352","https://www.sina.cn/news/detail/5144560042250889.html","https://www.bilibili.com/opus/1081268316132081669"],"values":[0.02],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_ave_umiri_nyamu","name":"海喵","members":["八幡海铃","祐天寺若麦"],"steps":[2],"category":"pair","effect":"pulse","text":"成员攻击提高3.5%。成员施法后，使同伴下次普攻伤害提高8%。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2026年1月15日大阪公演的双人语音名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":["海喵海"],"nameBasis":"若麦的喵梦身份在同人简称中取喵。直接同人小说使用海喵海，另一作者的创作说明单独使用海喵；海喵海可记录为无差写法，不等同已统计喵海的普及程度。","nameSourceUrls":["https://www.yamibo.com/novel/266699","https://www.bilibili.com/opus/1081268316132081669"],"values":[0.08],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_ave_nyamu_sakiko","name":"喵祥","members":["祐天寺若麦","丰川祥子"],"steps":[2],"category":"pair","effect":"care","text":"成员攻击提高3.5%。成员施法后，回复同伴1.5%最大生命。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2025年7月26日公演的双人语音名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":["祥喵"],"nameBasis":"创作者漫画公告和另一创作者自己的新作公告都直接使用喵祥；祥喵也为同人企划自用名。","nameSourceUrls":["https://www.sina.cn/news/detail/5144560042250889.html","https://www.bilibili.com/opus/1064916688446685201","https://minorities.vercel.app/"],"values":[0.015],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_ave_uika_nyamu","name":"初喵","members":["三角初华","祐天寺若麦"],"steps":[2],"category":"pair","effect":"pulse","text":"成员攻击提高3.5%。成员施法后，使同伴下次普攻伤害提高8%。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2025年12月限定车内语音的双人名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":[],"nameBasis":"巴哈姆特同人小说标题与作者CP声明直接把初喵映射到三角初华×祐天寺若麦。第二作者的喵初喵仅有小说列表索引；不足以认定常见逆序别称。","nameSourceUrls":["https://forum.gamer.com.tw/C.php?bsn=47099&snA=3763"],"values":[0.08],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_cross_tomori_uika","name":"初灯","members":["高松灯","三角初华"],"steps":[2],"category":"pair","effect":"tempo","text":"成员攻击提高3.5%。成员施法后，为同伴回复4能量。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"2026年3月1日两团联合公演的双人语音名单。","sourceUrls":["https://recommend.jr-central.co.jp/oshi-tabi/bang-dream-10th/"],"nameAliases":[],"nameBasis":"粉丝翻译投稿标题直接使用初灯，另有独立同人作者的创作说明；不以官方同场或角色职业本身证明CP简称。灯初未得到独立直接投稿支持。","nameSourceUrls":["https://www.bilibili.com/video/BV14ZAYzYEU4/","https://www.bilibili.com/opus/1081268316132081669"],"values":[4],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_chicken_dog","name":"叮咚鸡大狗叫","members":["叮咚鸡","炫狗"],"steps":[2],"category":"pair","effect":"haste","text":"成员攻击提高3.5%。成员施法后，使同伴攻速提高10%，持续4秒。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"作者明确指定的同人搭档组合，用于本游戏羁绊。","sourceUrls":[],"nameBasis":"采用作者本轮指定的组合名。","nameAliases":[],"nameSourceUrls":[],"values":[0.1],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_green_star","name":"绿瞳","members":["星瞳","明前奶绿"],"steps":[2],"category":"pair","effect":"care","text":"成员攻击提高3.5%。成员施法后，回复同伴2%最大生命。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"作者明确指定的同人搭档组合，用于本游戏羁绊。","sourceUrls":[],"nameBasis":"采用作者本轮指定的组合名。","nameAliases":[],"nameSourceUrls":[],"values":[0.02],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_otto_shark","name":"棍鲨","members":["七海","电棍"],"steps":[2],"category":"pair","effect":"ward","text":"成员攻击提高3.5%。成员施法后，给同伴2.5%最大生命护盾。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"作者明确指定的同人搭档组合，用于本游戏羁绊。","sourceUrls":[],"nameBasis":"采用作者本轮指定的组合名。","nameAliases":[],"nameSourceUrls":[],"values":[0.025],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_azi_dragon","name":"梓龙","members":["炫神","阿梓"],"steps":[2],"category":"pair","effect":"focus","text":"成员攻击提高3.5%。成员施法后，使同伴下次技能伤害提高8%。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"作者明确指定的同人搭档组合，用于本游戏羁绊。","sourceUrls":[],"nameBasis":"采用作者本轮指定的组合名。","nameAliases":[],"nameSourceUrls":[],"values":[0.08],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"pair_umiri_taki","name":"海希","members":["八幡海铃","椎名立希"],"steps":[2],"category":"pair","effect":"tempo","text":"成员攻击提高3.5%。成员施法后，为同伴回复4能量。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"作者明确指定的同人搭档组合，用于本游戏羁绊。","sourceUrls":[],"nameBasis":"采用作者本轮指定的组合名。","nameAliases":[],"nameSourceUrls":[],"values":[4],"cooldown":4,"aura":{"attack":[0.035]}},
 {"id":"tang","name":"唐","members":["永雏塔菲","千早爱音","奶龙","奶蛙","高松灯企鹅","张顺飞"],"steps":[2,4,6],"category":"theme","trigger":"low","effect":"comeback","text":"成员生命提高3 / 6 / 10%。成员首次低于50%生命时，获得4 / 7 / 12能量和2.5 / 4 / 7%最大生命护盾。每种角色每场一次；同名副本共享次数。","factualBasis":"作者明确指定的游戏梗主题，仅指本作角色组合。","sourceUrls":[],"energyValues":[4,7,12],"shieldValues":[0.025,0.04,0.07],"aura":{"hp":[0.03,0.06,0.1]}},
 {"id":"pair_2992","name":"2992","members":["阿梓","嘉然"],"steps":[2],"category":"pair","effect":"focus","values":[0.08],"cooldown":4,"text":"成员攻击提高3.5%。成员施法后，使同伴下次技能伤害提高8%。4秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"作者本轮明确指定的游戏搭档。","sourceUrls":[],"aura":{"attack":[0.035]}},
 {"id":"repeaters","name":"复读机","members":["说的道理","东雪莲","叮咚鸡"],"steps":[2,3],"category":"theme","effect":"focus","values":[0.08,0.12],"cooldown":6,"text":"成员技能伤害提高6 / 12%。成员施法后，使同伴下次技能伤害提高8 / 12%。6秒同组及施法者冷却，仅作用于另一名不同角色；同类临时增益取最高值。","factualBasis":"根据本作既有的循环声波、咬字与通知技能构建的游戏主题，不表示现实私交。","sourceUrls":[],"aura":{"spell":[0.06,0.12]}},
 {"id":"mimic_identity","name":"模仿者","members":["乔希"],"steps":[1],"category":"signature","effect":"mimic","text":"每次施法随机借用其他角色的招牌技能，以自身属性结算；同一角色连续两次不重复。此项展示角色本身的特色，不额外叠加属性。","factualBasis":"作者指定Xz乔希为随机模仿者，沿用本作已有技能设计。","sourceUrls":[]}
];
for(const g of relationships)traits[g.name]={...g,relationship:true};
const roster=TURN_ROSTER.map(c=>{
 const cost=tiers.findIndex(t=>t.includes(c.name))+1;if(!cost)throw Error('棋子未定费：'+c.name);
 const signature=c.skills[supportSlots[c.name]??3],src=signature.source;
 const skill={...signature,status:{...signature.status},source:src};
 if(src.physical)skill.melee=true;
 // Auto casts have their own power budget. Range does not multiply total damage without a cap.
 skill.power=skill.power?(skill.area==='single'?4.2:3.5):0;skill.heal=skill.heal?4.4:0;skill.shield=skill.shield?3.5:0;
 if(skill.grantEnergy){skill.grantEnergy=35;skill.shield=2;skill.area='row';}
 if(c.role==='支援'&&skill.power){skill.power=2.6;delete skill.teamHeal;skill.teamHealPower=2.4;}
 if(skill.mimic){skill.power=3.5;skill.name='？？？';}
 const [hp,attack,armor,interval,range]=roleStats[c.role],factor=[1,1.14,1.29,1.46,1.65][cost-1];
 const desc=skill.mimic?'随机模仿一名其他棋子的招牌技能，以自身属性结算。':
  (skill.power?'自动锁定敌人；单体 '+Math.round(skill.power*100)+'% 攻击伤害，范围招式按命中人数分摊预算。':skill.heal?'治疗最虚弱的友军，回复 440% 攻击生命。':skill.grantEnergy?'为能量最低的两名队友各回复35能量，并分配总量随攻击成长的护盾。':'保护或强化友军，护盾最多叠至生命上限的 40%。')+
  (skill.teamHealPower?'另将240%攻击的治疗总量均分给受伤友军。':'')+(skill.form?'保留原技能变身，持续 5 秒提升 15% 普攻伤害。':'')+(skill.status?.burn?'附加灼烧。':'')+(skill.status?.slow?'附加减速。':'');
 return {...c,cost,startMana:['术士','支援'].includes(c.role)?30:20,manaHit:['术士','支援'].includes(c.role)?20:16,group:c.original.group,bonds:relationships.filter(g=>g.members.includes(c.name)).map(g=>g.name),hp:Math.round(hp*factor),attack:Math.round(attack*factor),armor,interval,range,skill:{...skill,desc},skills:[c.skills[0],skill]};
});
window.CHESS_RELATIONSHIPS=relationships;window.CHESS_ROSTER=roster;window.CHESS_BY_ID=new Map(roster.map(c=>[c.id,c]));
window.CHESS_RULES={namedAuraLimits:{hp:.24,attack:.24,haste:.18,spell:.28,healing:.24},lightweightText:'同一成员从关系获得的常驻生命/攻击/治疗加成最多24%，攻速18%，技能伤害28%。整场关系额外回能最多32，实际回复与护盾合计最多最大生命22%；搭档与施法主题各触发一组并共享4 / 6秒冷却，其中回能最多18、回复与护盾最多12%。同名副本共享触发与资源预算，常驻关系属性只由一枚最高星同名棋子领取；复制不增加人数。',relationshipLimits:{energy:32,sustain:.22},lightweightLimits:{energy:18,sustain:.12},pool:[24,20,18,12,10],odds:{3:[75,25,0,0,0],4:[65,28,7,0,0],5:[50,33,15,2,0],6:[30,40,25,5,0],7:[20,30,35,13,2],8:[12,20,28,25,15]},xp:{3:4,4:8,5:16,6:24,7:32},stars:[1,1.7,2.8],traits};
})();
