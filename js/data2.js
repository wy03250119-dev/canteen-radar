/* =====================================================
 * 食堂雷达 —— 豆包「饭搭子」数据集（南校区）合并模块
 * 数据来源：豆包 AI 编程生成的「饭搭子-校园食堂点评」应用
 * 本文件在 data.js 之后加载，把南校区数据并入主数据。
 * ===================================================== */

const DOUBAO_CANTEENS = [
  { id:'bc1', name:'一食堂·南门', campus:'南校区', emoji:'🏫', floors:'1层 · 南门教学楼对面', distance:120, hours:[6.5,21.5], rating:4.5, ratingCount:2410, avgPrice:14, tags:['小碗菜','盖饭'], desc:'南门教学楼对面，小碗菜和盖饭是早八人的补给站。' },
  { id:'bc2', name:'二食堂·东门', campus:'南校区', emoji:'🏢', floors:'1-2层 · 东门宿舍区旁', distance:280, hours:[7,22], rating:4.6, ratingCount:2630, avgPrice:16, tags:['黄焖鸡','麻辣香锅'], desc:'东门宿舍区旁，黄焖鸡窗口永远排队前三，晚市到十点。' },
  { id:'bc3', name:'三食堂·北区', campus:'南校区', emoji:'🍜', floors:'1层 · 北区宿舍3栋楼下', distance:420, hours:[6.5,20.5], rating:4.5, ratingCount:2180, avgPrice:14, tags:['手工面','饺子'], desc:'北区宿舍楼下，番茄鸡蛋面是清淡党的白月光。' },
  { id:'bc4', name:'风味美食街', campus:'南校区', emoji:'🎪', floors:'下沉广场B1', distance:520, hours:[10,22.5], rating:4.2, ratingCount:3050, avgPrice:16, tags:['夜宵','奶茶','烧烤'], desc:'下沉广场B1，夜宵宇宙中心，但炸物窗口近期风评下滑。' },
  { id:'bc5', name:'清真食堂·西区', campus:'南校区', emoji:'🕌', floors:'1层 · 西区操场边', distance:600, hours:[7,20], rating:4.4, ratingCount:1750, avgPrice:14, tags:['拉面','夹馍'], desc:'西区操场边，牛肉拉面2分钟出餐，赶课首选。' },
];

const DOUBAO_WINDOWS = [
  { id:'bw1',  canteenId:'bc1', name:'川香小碗菜', emoji:'🌶️', rating:4.6, tags:['川菜','招牌'], peak:[[11,13],[17,19]], base:36 },
  { id:'bw2',  canteenId:'bc1', name:'平价盖饭', emoji:'🍛', rating:4.4, tags:['家常','经济'], peak:[[11,13],[17,19]], base:30 },
  { id:'bw3',  canteenId:'bc2', name:'麻辣香锅', emoji:'🥘', rating:4.6, tags:['川渝','辣'], peak:[[11,13],[17,19.5]], base:50 },
  { id:'bw4',  canteenId:'bc2', name:'黄焖鸡米饭', emoji:'🍲', rating:4.7, tags:['鲁菜','排队王'], peak:[[11,13],[17,19]], base:55 },
  { id:'bw5',  canteenId:'bc2', name:'东北大锅菜', emoji:'🍳', rating:4.2, tags:['东北菜'], peak:[[11,13],[17,19]], base:34 },
  { id:'bw6',  canteenId:'bc3', name:'手工面档', emoji:'🍜', rating:4.5, tags:['面食'], peak:[[11,13],[17,19]], base:42 },
  { id:'bw7',  canteenId:'bc3', name:'饺子云吞', emoji:'🥟', rating:4.3, tags:['面食','清淡'], peak:[[11,13],[17,19]], base:32 },
  { id:'bw8',  canteenId:'bc4', name:'烧烤炸串', emoji:'🍢', rating:4.1, tags:['烧烤','夜宵'], peak:[[17.5,22]], base:45 },
  { id:'bw9',  canteenId:'bc4', name:'奶茶轻食', emoji:'🧋', rating:4.4, tags:['饮品','轻食'], peak:[[12,14],[18,20]], base:30 },
  { id:'bw10', canteenId:'bc4', name:'韩式拌饭', emoji:'🍚', rating:4.3, tags:['韩式'], peak:[[11,13],[17,19]], base:38 },
  { id:'bw11', canteenId:'bc5', name:'兰州拉面', emoji:'🍜', rating:4.5, tags:['清真','出餐快'], peak:[[11,13],[17,19]], base:40 },
  { id:'bw12', canteenId:'bc5', name:'清真小炒', emoji:'🍳', rating:4.2, tags:['清真'], peak:[[11,13],[17,19]], base:30 },
];

/* 菜品构造器：把豆包数据映射为食堂雷达 schema，并推导避雷数/评价数 */
const _bd = (id, windowId, canteenId, name, emoji, price, rating, t, p, v, rec, tags, trend, delta, heat, wait, desc) => {
  const avoid = (rating < 3.5 || trend === 'down')
    ? Math.max(10, Math.round((4 - rating) * 35 + (trend === 'down' ? 15 : 0)))
    : Math.min(8, Math.max(0, Math.round(10 - rating)));
  const outTags = tags.slice();
  if (outTags.includes('必吃')) outTags[outTags.indexOf('必吃')] = '招牌';
  if (outTags.includes('新品')) outTags[outTags.indexOf('新品')] = '新菜';
  if (rating < 3.5 && !outTags.includes('踩雷预警')) outTags.push('踩雷预警');
  return {
    id, windowId, canteenId, name, emoji, price, rating,
    ratingCount: Math.round(rec * 3 + heat * 4),
    avoid, rec, tags: outTags,
    m: { t, p, v, s: Math.max(3.5, Math.min(4.9, Math.round((4.9 - wait / 30) * 10) / 10)) },
    hot: heat, desc: desc || '',
    isNew: outTags.includes('新菜'),
    trend, trendDelta: delta,
  };
};

const DOUBAO_DISHES = [
  _bd('bd1','bw1','bc1','麻婆豆腐盖饭','🍛',13,4.5,4.6,4.3,4.7,128,['下饭','麻辣','性价比高'],'up',0.2,86,8,'嫩豆腐配肉末，花椒麻味正，汤汁拌米饭一绝。'),
  _bd('bd2','bw1','bc1','回锅肉盖饭','🍛',16,4.6,4.7,4.4,4.4,156,['必吃','分量足','咸香'],'stable',0,92,8,'五花肉煸出油，配青蒜郫县豆瓣，锅气足。'),
  _bd('bd3','bw1','bc1','鱼香肉丝盖饭','🍛',14,4.4,4.5,4.3,4.5,98,['酸甜','下饭'],'stable',0,70,8,'胡萝卜丝木耳肉丝，鱼香汁调得正，不辣。'),
  _bd('bd4','bw2','bc1','番茄炒蛋盖饭','🍛',10,4.7,4.7,4.5,4.9,203,['性价比高','不辣','家常'],'up',0.1,95,5,'酸甜口，鸡蛋给得多，10块钱能吃饱。'),
  _bd('bd5','bw2','bc1','红烧排骨饭','🍛',18,4.5,4.6,4.4,4.2,87,['肉多','软烂'],'stable',0,66,5,'排骨炖得脱骨，酱汁浓稠偏甜。'),
  _bd('bd6','bw2','bc1','青椒肉丝盖饭','🍛',12,4.3,4.3,4.4,4.5,76,['家常','实惠'],'stable',0,55,5,'中规中矩，肉丝给得不少。'),
  _bd('bd7','bw3','bc2','麻辣香锅(单人份)','🥘',22,4.6,4.7,4.5,4.3,189,['麻辣','料足','排队久'],'up',0.3,98,15,'自己选菜称重，藕片午餐肉毛肚必点，微辣就够劲。'),
  _bd('bd8','bw3','bc2','冒菜','🥘',18,4.4,4.5,4.3,4.4,92,['热乎','麻辣'],'stable',0,72,15,'比火锅快，汤底是牛油的，适合一个人吃。'),
  _bd('bd9','bw3','bc2','干锅土豆片','🥔',15,3.2,3.4,2.8,3.0,34,['价格偏贵','分量少','最近偏咸'],'down',-0.9,40,15,'近期反馈油偏大、盐放得不稳，分量比以前少。'),
  _bd('bd10','bw4','bc2','黄焖鸡米饭','🍲',16,4.8,4.8,4.7,4.6,267,['必吃','分量足','入味'],'up',0.2,99,6,'鸡腿肉配香菇青椒，汤汁拌饭灵魂，永远排队前三。'),
  _bd('bd11','bw4','bc2','黄焖排骨饭','🍖',19,4.5,4.6,4.4,4.3,103,['肉多'],'stable',0,68,6,'比黄焖鸡贵3块，排骨块大，但没鸡肉入味。'),
  _bd('bd12','bw4','bc2','香辣鸡公煲','🍲',21,3.4,3.5,3.6,3.1,41,['排队久','口味不稳','偏贵'],'down',-0.7,45,25,'高峰时段等20分钟以上，有时咸有时淡。'),
  _bd('bd13','bw5','bc2','地三鲜盖饭','🍆',14,4.3,4.4,4.3,4.4,78,['酱香','下饭'],'stable',0,58,7,'茄子土豆青椒，传统东北味，略油。'),
  _bd('bd14','bw5','bc2','锅包肉饭','🍖',18,4.2,4.3,4.1,4.0,65,['酸甜','偶尔吃'],'stable',0,52,7,'外壳酥脆，但放凉了就软，建议现买现吃。'),
  _bd('bd15','bw6','bc3','重庆小面','🍜',13,4.3,4.4,4.2,4.4,134,['麻辣','筋道'],'stable',0,80,10,'碱水面劲道，花生芽榨菜配齐，油辣子香。'),
  _bd('bd16','bw6','bc3','番茄鸡蛋面','🍜',12,4.7,4.7,4.5,4.8,176,['不辣','汤鲜','性价比高'],'up',0.1,90,10,'番茄熬出沙，汤底酸甜，适合不想吃辣的日子。'),
  _bd('bd17','bw6','bc3','红烧牛肉面','🍜',18,4.5,4.6,4.4,4.3,112,['肉大块','汤浓'],'stable',0,74,10,'牛肉给四五块，炖得烂，汤头厚重。'),
  _bd('bd18','bw6','bc3','酸辣粉','🍜',11,4.2,4.3,4.0,4.4,89,['开胃','酸辣'],'stable',0,60,10,'红薯粉爽滑，醋味足。'),
  _bd('bd19','bw7','bc3','猪肉白菜饺子(15个)','🥟',14,4.3,4.4,4.3,4.3,95,['现包','多汁'],'stable',0,63,6,'现包的饺子，皮薄馅足，蘸醋绝配。'),
  _bd('bd20','bw7','bc3','鲜肉云吞面','🥟',13,4.2,4.2,4.1,4.3,58,['汤清'],'stable',0,48,6,'云吞个小馅鲜，汤底清淡，适合早餐。'),
  _bd('bd21','bw8','bc4','烤肉串套餐(10串)','🍢',20,4.2,4.3,4.2,4.0,121,['夜宵','解馋'],'stable',0,78,12,'牛羊肉串现烤，孜然辣椒面给得猛，晚自习后刚需。'),
  _bd('bd22','bw8','bc4','炸鸡排饭','🍗',15,3.1,3.0,3.5,3.2,47,['最近油不好','偏咸'],'down',-1.1,38,12,'近期反馈炸油反复使用，鸡排颜色发深，慎点。'),
  _bd('bd23','bw8','bc4','烤冷面','🥢',10,4.4,4.5,4.0,4.5,73,['新品','酸甜','夜宵'],'up',0.4,76,7,'本周新上的档口，加肠加蛋12，酸甜口地道。'),
  _bd('bd24','bw9','bc4','珍珠奶茶','🧋',9,4.3,4.3,4.2,4.4,158,['不齁甜','平价'],'stable',0,85,9,'三分糖刚好，珍珠有嚼劲，比连锁便宜一半。'),
  _bd('bd25','bw9','bc4','鸡胸肉沙拉','🥗',14,4.2,4.1,4.2,4.0,52,['健身','轻食','不辣'],'stable',0,44,9,'减脂期午餐，酱汁自选，量够女生吃。'),
  _bd('bd26','bw9','bc4','酸奶水果捞','🍧',12,4.5,4.6,4.2,4.4,69,['新品','清爽','夏天'],'up',0.5,71,5,'本周新品，水果每天现切，酸奶底不腻。'),
  _bd('bd27','bw10','bc4','石锅拌饭','🍚',17,4.3,4.4,4.3,4.2,88,['锅巴香'],'stable',0,67,11,'底部有锅巴，加个溏心蛋完美，辣酱自己加。'),
  _bd('bd28','bw10','bc4','部队火锅(单人)','🍲',25,4.1,4.2,4.0,3.8,44,['新品','略贵','两人更划算'],'up',0.2,56,11,'本月新上，一个人吃有点贵，适合拼单。'),
  _bd('bd29','bw11','bc5','牛肉拉面','🍜',14,4.5,4.6,4.3,4.5,142,['汤清','出餐快'],'stable',0,82,4,'汤是牛骨熬的，面可拉粗细，赶时间首选。'),
  _bd('bd30','bw12','bc5','牛肉夹馍','🥙',8,4.2,4.3,3.9,4.4,61,['早餐','顶饱','便宜'],'stable',0,50,6,'馍酥脆，牛肉给得实在，配拉面是经典套餐。'),
];

const DOUBAO_REVIEWS = [
  { id:'br1', dishId:'bd10', user:'饭搭子_小周', avatar:'🍚', stars:5, time:'10月28日', text:'鸡腿肉真的嫩，香菇吸满汤汁，我每周至少吃三次。', tags:['分量足','入味'], likes:96 },
  { id:'br2', dishId:'bd10', user:'干饭人阿凯', avatar:'🍳', stars:5, time:'10月29日', text:'汤汁拌饭我能吃两碗，建议加一份土豆。', tags:['下饭'], likes:74 },
  { id:'br3', dishId:'bd7', user:'今天吃什么', avatar:'🔥', stars:5, time:'10月28日', text:'必点毛肚、藕片、午餐肉，微辣刚好，重口选中辣。', tags:['料足','排队久'], likes:88 },
  { id:'br4', dishId:'bd4', user:'北区老学姐', avatar:'🥣', stars:5, time:'10月29日', text:'10块钱还要啥自行车，鸡蛋给得比别家多一倍。', tags:['性价比高','不辣'], likes:121 },
  { id:'br5', dishId:'bd16', user:'食堂测评君', avatar:'🌿', stars:5, time:'10月27日', text:'番茄是真的熬出沙了，不是番茄酱兑水，汤我能喝光。', tags:['汤鲜'], likes:95 },
  { id:'br6', dishId:'bd9', user:'赶课的小李', avatar:'😴', stars:2, time:'10月29日', text:'15块就薄薄几片土豆，油得发亮，比上周分量少一半。', tags:['价格偏贵','分量少'], likes:45 },
  { id:'br7', dishId:'bd22', user:'减脂中的阿珍', avatar:'🐟', stars:1, time:'10月28日', text:'鸡排颜色深得不自然，咬开里面一股油耗味，吃完拉肚子。', tags:['踩雷'], likes:102 },
  { id:'br8', dishId:'bd12', user:'重口味学长', avatar:'🍜', stars:2, time:'10月29日', text:'等了25分钟，咸到发苦，上周来吃还不是这样，看厨师心情。', tags:['排队久','口味不稳'], likes:52 },
  { id:'br9', dishId:'bd2', user:'不吃香菜', avatar:'🌙', stars:5, time:'10月28日', text:'回锅肉煸得刚好，青蒜香，锅气在食堂里算顶级。', tags:['咸香'], likes:66 },
  { id:'br10', dishId:'bd29', user:'减脂期小王', avatar:'🧋', stars:5, time:'10月29日', text:'赶课神器，2分钟出餐，汤清不油，加个蛋完美。', tags:['出餐快'], likes:71 },
  { id:'br11', dishId:'bd24', user:'夜宵达人', avatar:'🍢', stars:4, time:'10月28日', text:'三分糖刚好，珍珠不硬，9块钱要什么自行车。', tags:['平价'], likes:43 },
  { id:'br12', dishId:'bd26', user:'南门常客', avatar:'🥟', stars:5, time:'10月29日', text:'新品打卡，西瓜和芒果都很新鲜，酸奶不甜腻。', tags:['新菜','清爽'], likes:58 },
  { id:'br13', dishId:'bd15', user:'美食特种兵', avatar:'🍛', stars:4, time:'10月27日', text:'油辣子香，但我要的微微辣结果还是有点上头。', tags:['太辣'], likes:34 },
  { id:'br14', dishId:'bd19', user:'宿舍长', avatar:'🥙', stars:4, time:'10月28日', text:'现包的饺子就是不一样，一咬一包汤。', tags:['口味好'], likes:29 },
  { id:'br15', dishId:'bd21', user:'随意吃吃', avatar:'🥤', stars:4, time:'10月29日', text:'晚自习后来10串，孜然给得足，就是饭点要等。', tags:['排队久'], likes:38 },
  { id:'br16', dishId:'bd17', user:'饭搭子_小周', avatar:'🍚', stars:4, time:'10月27日', text:'牛肉块是真的大，但18一碗略贵，汤很浓。', tags:['偏贵'], likes:27 },
  { id:'br17', dishId:'bd27', user:'今天吃什么', avatar:'🔥', stars:4, time:'10月28日', text:'底部锅巴焦香，拌开之后每口都有料。', tags:['口味好'], likes:25 },
  { id:'br18', dishId:'bd1', user:'干饭人阿凯', avatar:'🍳', stars:5, time:'10月29日', text:'麻婆豆腐是我在食堂吃过最正宗的，麻味够。', tags:['口味好'], likes:64 },
  { id:'br19', dishId:'bd23', user:'北区老学姐', avatar:'🥣', stars:5, time:'10月29日', text:'烤冷面加肠加蛋才12，酸甜口，比校门口小摊正宗。', tags:['新菜','夜宵'], likes:61 },
  { id:'br20', dishId:'bd8', user:'食堂测评君', avatar:'🌿', stars:4, time:'10月28日', text:'牛油汤底香，一个人吃冒菜比点火锅划算。', tags:['口味好'], likes:30 },
];

/* ---------- 并入主数据 ---------- */
CANTEENS.forEach(c => { if (!c.campus) c.campus = '大学城校区'; });
CAMPUS.campuses = ['大学城校区', '南校区'];
CANTEENS.push(...DOUBAO_CANTEENS);
WINDOWS.push(...DOUBAO_WINDOWS);
DISHES.push(...DOUBAO_DISHES);
SEED_REVIEWS.push(...DOUBAO_REVIEWS);
