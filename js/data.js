/* =====================================================
 * 食堂雷达 · 校园食堂点评推荐 —— 演示种子数据
 * 数据为虚构（星辰大学 · 大学城校区），仅用于产品原型
 * ===================================================== */

const CAMPUS = {
  name: '星辰大学',
  campus: '大学城校区',
  slogan: '干饭不踩雷，一顿不将就',
};

/* ---------- 食堂 ---------- */
const CANTEENS = [
  { id:'c1', name:'第一食堂', emoji:'🏫', floors:'1-3层', distance:180, hours:[6.5,21], rating:4.4, ratingCount:3210, avgPrice:12, tags:['牛肉面','瓦罐汤','石锅拌饭'], desc:'老牌食堂，三层窗口各有绝活，饭点人多但出餐快。' },
  { id:'c2', name:'第二食堂', emoji:'🏢', floors:'1-2层', distance:260, hours:[6.5,21], rating:4.2, ratingCount:2845, avgPrice:11, tags:['黄焖鸡','馄饨','豌杂面'], desc:'性价比之王，黄焖鸡窗口常年排队，馄饨暖胃。' },
  { id:'c3', name:'第三食堂·风味餐厅', emoji:'🍽️', floors:'3层', distance:420, hours:[7,21.5], rating:4.5, ratingCount:2650, avgPrice:14, tags:['肥牛丼','韩式炸鸡','意面'], desc:'全国风味大杂烩，也是新菜上新最快的地方。' },
  { id:'c4', name:'清真食堂', emoji:'🕌', floors:'1层', distance:350, hours:[6.5,20.5], rating:4.7, ratingCount:1980, avgPrice:13, tags:['大盘鸡','手抓饭','老酸奶'], desc:'全校口碑天花板，大盘鸡和酸奶排队也要吃。' },
  { id:'c5', name:'新食堂·智慧餐厅', emoji:'🤖', floors:'2层', distance:500, hours:[7,20], rating:4.3, ratingCount:1520, avgPrice:13, tags:['称重自助','轻食','烘焙'], desc:'刷脸支付+智能称重，减脂人和面包脑袋的天堂。' },
  { id:'c6', name:'美食广场', emoji:'🎪', floors:'1层', distance:600, hours:[10,23], rating:3.9, ratingCount:4100, avgPrice:15, tags:['夜宵','炸鸡','烤冷面'], desc:'营业到23点的夜宵据点，水准参差不齐，点单前先看避雷榜。' },
];

/* ---------- 窗口 ---------- */
const WINDOWS = [
  { id:'w1',  canteenId:'c1', name:'兰州牛肉面', emoji:'🍜', rating:4.6, tags:['面食','排队王'], peak:[[11,13.5],[17,19.5]], base:50 },
  { id:'w2',  canteenId:'c1', name:'广式烧腊', emoji:'🍖', rating:4.3, tags:['烧腊','甜口'], peak:[[11,13],[17,19]], base:30 },
  { id:'w3',  canteenId:'c1', name:'石锅拌饭', emoji:'🍚', rating:4.5, tags:['韩式','锅气'], peak:[[11.5,13],[17.5,19]], base:38 },
  { id:'w4',  canteenId:'c1', name:'麻辣香锅', emoji:'🥘', rating:4.1, tags:['自选','辣'], peak:[[11,13],[17,19.5]], base:45 },
  { id:'w5',  canteenId:'c1', name:'瓦罐汤', emoji:'🍲', rating:4.7, tags:['汤品','清淡'], peak:[[11,13],[17,19]], base:35 },
  { id:'w6',  canteenId:'c1', name:'自选快餐', emoji:'🍱', rating:3.9, tags:['快餐','经济'], peak:[[11.5,12.5],[17.5,18.5]], base:25 },
  { id:'w7',  canteenId:'c2', name:'黄焖鸡米饭', emoji:'🍲', rating:4.4, tags:['招牌','辣'], peak:[[11,13],[17,19]], base:55 },
  { id:'w8',  canteenId:'c2', name:'麻辣烫', emoji:'🥘', rating:4.0, tags:['自选','晚市慎点'], peak:[[11,13],[17,19]], base:40 },
  { id:'w9',  canteenId:'c2', name:'重庆小面', emoji:'🍜', rating:4.5, tags:['面食','辣'], peak:[[11,13],[17.5,19]], base:42 },
  { id:'w10', canteenId:'c2', name:'铁板饭', emoji:'🍳', rating:4.2, tags:['铁板'], peak:[[11.5,13],[17.5,19]], base:28 },
  { id:'w11', canteenId:'c2', name:'水饺馄饨', emoji:'🥟', rating:4.6, tags:['面食','清淡'], peak:[[11,13],[17,19]], base:35 },
  { id:'w12', canteenId:'c2', name:'自选快餐', emoji:'🍱', rating:3.6, tags:['快餐','经济'], peak:[[11.5,12.5],[17.5,18.5]], base:22 },
  { id:'w13', canteenId:'c3', name:'螺蛳粉', emoji:'🍜', rating:4.3, tags:['风味','辣'], peak:[[11,13],[17,19]], base:40 },
  { id:'w14', canteenId:'c3', name:'烤鱼饭', emoji:'🐟', rating:4.2, tags:['鱼','辣'], peak:[[11.5,13],[17.5,19]], base:32 },
  { id:'w15', canteenId:'c3', name:'日式丼饭', emoji:'🍱', rating:4.6, tags:['日式'], peak:[[11,13],[17,19]], base:45 },
  { id:'w16', canteenId:'c3', name:'韩式炸鸡', emoji:'🍗', rating:4.5, tags:['炸物','甜辣'], peak:[[11,13],[17.5,19.5]], base:38 },
  { id:'w17', canteenId:'c3', name:'披萨意面', emoji:'🍝', rating:4.1, tags:['西式'], peak:[[11.5,13],[17.5,19]], base:25 },
  { id:'w18', canteenId:'c3', name:'奶茶甜品', emoji:'🧋', rating:4.4, tags:['甜品'], peak:[[12,14],[18,20]], base:30 },
  { id:'w19', canteenId:'c4', name:'新疆大盘鸡', emoji:'🍲', rating:4.8, tags:['招牌','量大'], peak:[[11,13],[17,19]], base:55 },
  { id:'w20', canteenId:'c4', name:'羊肉泡馍', emoji:'🍜', rating:4.6, tags:['汤品'], peak:[[11,13],[17,19]], base:35 },
  { id:'w21', canteenId:'c4', name:'手抓饭', emoji:'🍛', rating:4.7, tags:['主食','量大'], peak:[[11,13],[17,19]], base:40 },
  { id:'w22', canteenId:'c4', name:'烤串', emoji:'🍢', rating:4.5, tags:['烧烤'], peak:[[11.5,13],[17.5,20]], base:45 },
  { id:'w23', canteenId:'c4', name:'酸奶铺', emoji:'🍶', rating:4.9, tags:['甜品'], peak:[[12,14],[18,20]], base:30 },
  { id:'w24', canteenId:'c5', name:'智慧称重自助', emoji:'🥗', rating:4.2, tags:['自助','减脂'], peak:[[11.5,13],[17.5,19]], base:25 },
  { id:'w25', canteenId:'c5', name:'轻食沙拉', emoji:'🥗', rating:4.4, tags:['轻食','减脂'], peak:[[11.5,13.5]], base:22 },
  { id:'w26', canteenId:'c5', name:'小碗菜', emoji:'🍱', rating:3.9, tags:['快餐'], peak:[[11.5,12.5],[17.5,18.5]], base:20 },
  { id:'w27', canteenId:'c5', name:'面点烘焙', emoji:'🥐', rating:4.5, tags:['烘焙','甜口'], peak:[[7,9],[11,13]], base:28 },
  { id:'w28', canteenId:'c6', name:'炸鸡汉堡', emoji:'🍔', rating:4.0, tags:['炸物'], peak:[[11.5,13],[17.5,19],[21,22.5]], base:35 },
  { id:'w29', canteenId:'c6', name:'炒饭炒粉', emoji:'🍚', rating:3.8, tags:['主食'], peak:[[11.5,13],[17.5,19]], base:30 },
  { id:'w30', canteenId:'c6', name:'烧烤夜宵', emoji:'🍢', rating:4.2, tags:['夜宵','烧烤'], peak:[[17.5,22.5]], base:40 },
  { id:'w31', canteenId:'c6', name:'水果捞', emoji:'🍧', rating:4.1, tags:['甜品','清爽'], peak:[[12,14],[18,20]], base:20 },
];

/* ---------- 菜品 ---------- */
const DISHES = [
  // 第一食堂
  { id:'d1', canteenId:'c1', windowId:'w1', name:'招牌牛肉面', emoji:'🍜', price:12, rating:4.7, ratingCount:486, avoid:2, rec:210, tags:['招牌','排队王'], m:{t:4.8,p:4.5,v:4.9,s:4.7}, hot:96, desc:'汤清面筋道，牛肉给得实在，阿姨手一点都不抖。' },
  { id:'d2', canteenId:'c1', windowId:'w1', name:'油泼辣子面', emoji:'🍜', price:10, rating:4.5, ratingCount:210, avoid:3, rec:66, tags:['辣','量大'], m:{t:4.6,p:4.7,v:4.8,s:4.6}, hot:70 },
  { id:'d3', canteenId:'c1', windowId:'w1', name:'酸汤水饺', emoji:'🥟', price:11, rating:4.4, ratingCount:155, avoid:1, rec:40, tags:['清淡','酸爽'], m:{t:4.4,p:4.5,v:4.5,s:4.3}, hot:58 },
  { id:'d4', canteenId:'c1', windowId:'w2', name:'叉烧双拼饭', emoji:'🍛', price:15, rating:4.4, ratingCount:302, avoid:4, rec:88, tags:['招牌','甜口'], m:{t:4.4,p:4.6,v:4.2,s:4.6}, hot:75 },
  { id:'d5', canteenId:'c1', windowId:'w2', name:'白切鸡饭', emoji:'🍗', price:13, rating:4.0, ratingCount:180, avoid:6, rec:35, tags:['清淡'], m:{t:4.1,p:4.3,v:4.0,s:4.5}, hot:42 },
  { id:'d6', canteenId:'c1', windowId:'w2', name:'烧鸭腿饭', emoji:'🍗', price:14, rating:4.2, ratingCount:240, avoid:3, rec:52, tags:['量大'], m:{t:4.2,p:4.6,v:4.1,s:4.4}, hot:55 },
  { id:'d7', canteenId:'c1', windowId:'w3', name:'石锅牛肉拌饭', emoji:'🍚', price:14, rating:4.6, ratingCount:320, avoid:2, rec:96, tags:['招牌','锅气'], m:{t:4.7,p:4.4,v:4.5,s:4.2}, hot:80, desc:'锅底有焦脆锅巴，拌开之后酱香直冲脑门。' },
  { id:'d8', canteenId:'c1', windowId:'w3', name:'泡菜五花肉拌饭', emoji:'🍚', price:13, rating:4.3, ratingCount:198, avoid:4, rec:45, tags:['辣'], m:{t:4.4,p:4.5,v:4.3,s:4.4}, hot:60 },
  { id:'d9', canteenId:'c1', windowId:'w4', name:'麻辣香锅(自选)', emoji:'🥘', price:18, rating:4.1, ratingCount:266, avoid:9, rec:70, tags:['自选','辣'], m:{t:4.2,p:4.4,v:3.9,s:3.9}, hot:66 },
  { id:'d10', canteenId:'c1', windowId:'w5', name:'瓦罐土鸡汤', emoji:'🍲', price:9, rating:4.7, ratingCount:388, avoid:1, rec:130, tags:['招牌','清淡'], m:{t:4.8,p:4.5,v:4.9,s:4.5}, hot:88, desc:'汤清味浓，鸡腿肉一抿就脱骨。' },
  { id:'d11', canteenId:'c1', windowId:'w5', name:'莲藕排骨汤', emoji:'🍲', price:8, rating:4.5, ratingCount:210, avoid:2, rec:58, tags:['清淡'], m:{t:4.5,p:4.4,v:4.7,s:4.5}, hot:60 },
  { id:'d12', canteenId:'c1', windowId:'w6', name:'自选快餐', emoji:'🍱', price:12, rating:3.4, ratingCount:520, avoid:42, rec:30, tags:['经济实惠'], m:{t:3.4,p:3.8,v:3.7,s:4.4}, hot:44 },
  { id:'d13', canteenId:'c1', windowId:'w6', name:'梅菜扣肉', emoji:'🥓', price:8, rating:3.2, ratingCount:146, avoid:26, rec:12, tags:['避雷常客'], m:{t:3.1,p:3.5,v:3.4,s:4.2}, hot:25, desc:'肥肉偏多，吃一半容易腻住。' },
  { id:'d14', canteenId:'c1', windowId:'w6', name:'宫保鸡丁', emoji:'🍗', price:7, rating:3.0, ratingCount:188, avoid:31, rec:9, tags:['踩雷预警'], m:{t:3.0,p:3.2,v:3.3,s:4.0}, hot:18, desc:'鸡丁像在迷宫里找，全是花生。' },
  // 第二食堂
  { id:'d15', canteenId:'c2', windowId:'w7', name:'黄焖鸡米饭(中辣)', emoji:'🍲', price:14, rating:4.4, ratingCount:512, avoid:3, rec:240, tags:['招牌','辣'], m:{t:4.5,p:4.5,v:4.4,s:4.4}, hot:92, desc:'汤汁拌饭能吃三碗，记得让阿姨多加青菜。' },
  { id:'d16', canteenId:'c2', windowId:'w7', name:'黄焖排骨饭', emoji:'🍖', price:15, rating:4.2, ratingCount:230, avoid:5, rec:62, tags:['量大'], m:{t:4.2,p:4.5,v:4.1,s:4.3}, hot:58 },
  { id:'d17', canteenId:'c2', windowId:'w8', name:'麻辣烫(午市)', emoji:'🥘', price:13, rating:4.0, ratingCount:390, avoid:11, rec:88, tags:['自选'], m:{t:4.1,p:4.4,v:3.9,s:4.2}, hot:70 },
  { id:'d18', canteenId:'c2', windowId:'w8', name:'麻辣烫(晚市)', emoji:'🥘', price:13, rating:3.1, ratingCount:210, avoid:38, rec:6, tags:['踩雷预警'], m:{t:3.0,p:3.4,v:3.2,s:4.0}, hot:15, desc:'晚市食材发蔫，粉丝发硬，建议中午来。' },
  { id:'d19', canteenId:'c2', windowId:'w9', name:'豌杂面', emoji:'🍜', price:11, rating:4.5, ratingCount:275, avoid:2, rec:95, tags:['招牌','辣'], m:{t:4.6,p:4.4,v:4.7,s:4.6}, hot:76 },
  { id:'d20', canteenId:'c2', windowId:'w9', name:'红油抄手', emoji:'🥟', price:10, rating:4.4, ratingCount:160, avoid:3, rec:44, tags:['辣'], m:{t:4.5,p:4.2,v:4.6,s:4.5}, hot:52 },
  { id:'d21', canteenId:'c2', windowId:'w10', name:'铁板黑椒牛柳饭', emoji:'🍚', price:15, rating:4.3, ratingCount:205, avoid:4, rec:55, tags:['锅气'], m:{t:4.3,p:4.4,v:4.2,s:4.0}, hot:50 },
  { id:'d22', canteenId:'c2', windowId:'w10', name:'铁板意面', emoji:'🍝', price:13, rating:3.9, ratingCount:140, avoid:9, rec:30, tags:['西式'], m:{t:3.8,p:4.0,v:4.0,s:4.2}, hot:35 },
  { id:'d23', canteenId:'c2', windowId:'w11', name:'鲜肉大馄饨', emoji:'🥟', price:10, rating:4.6, ratingCount:298, avoid:1, rec:110, tags:['招牌','清淡'], m:{t:4.7,p:4.5,v:4.7,s:4.5}, hot:82, desc:'皮薄馅大，汤里放紫菜虾皮，家的味道。' },
  { id:'d24', canteenId:'c2', windowId:'w11', name:'韭菜鸡蛋水饺', emoji:'🥟', price:9, rating:4.2, ratingCount:175, avoid:4, rec:46, tags:['清淡','素食友好'], m:{t:4.3,p:4.3,v:4.5,s:4.5}, hot:48 },
  { id:'d25', canteenId:'c2', windowId:'w12', name:'自选快餐', emoji:'🍱', price:11, rating:3.6, ratingCount:430, avoid:35, rec:26, tags:['经济实惠'], m:{t:3.6,p:3.9,v:3.8,s:4.4}, hot:40 },
  { id:'d26', canteenId:'c2', windowId:'w12', name:'红烧狮子头', emoji:'🧆', price:7, rating:3.3, ratingCount:120, avoid:19, rec:8, tags:['避雷常客'], m:{t:3.2,p:3.5,v:3.6,s:4.1}, hot:15, desc:'面多肉少，狮子头名不副实。' },
  // 第三食堂·风味餐厅
  { id:'d27', canteenId:'c3', windowId:'w13', name:'招牌螺蛳粉', emoji:'🍜', price:13, rating:4.3, ratingCount:340, avoid:6, rec:105, tags:['招牌','辣'], m:{t:4.4,p:4.3,v:4.2,s:4.2}, hot:78, desc:'一定要加腐竹加酸笋，酸笋给得大方，闻着臭吃着香。' },
  { id:'d28', canteenId:'c3', windowId:'w14', name:'香辣烤鱼饭', emoji:'🐟', price:16, rating:4.2, ratingCount:180, avoid:8, rec:60, tags:['辣','排队王'], m:{t:4.3,p:4.2,v:4.0,s:3.9}, hot:58 },
  { id:'d29', canteenId:'c3', windowId:'w14', name:'番茄烤鱼饭', emoji:'🐟', price:16, rating:4.1, ratingCount:130, avoid:5, rec:35, tags:['清淡'], m:{t:4.1,p:4.3,v:4.2,s:4.0}, hot:40 },
  { id:'d30', canteenId:'c3', windowId:'w15', name:'肥牛丼', emoji:'🍱', price:16, rating:4.6, ratingCount:262, avoid:2, rec:120, tags:['招牌'], m:{t:4.7,p:4.4,v:4.5,s:4.6}, hot:84, desc:'肥牛现炒，洋葱甜香，米饭粒粒分明。' },
  { id:'d31', canteenId:'c3', windowId:'w15', name:'照烧鸡排丼', emoji:'🍱', price:15, rating:4.4, ratingCount:205, avoid:3, rec:66, tags:['甜口'], m:{t:4.4,p:4.5,v:4.4,s:4.5}, hot:62 },
  { id:'d32', canteenId:'c3', windowId:'w15', name:'鳗鱼饭', emoji:'🍱', price:22, rating:4.5, ratingCount:98, avoid:3, rec:40, tags:['小贵但值'], m:{t:4.6,p:4.0,v:4.0,s:4.3}, hot:38 },
  { id:'d33', canteenId:'c3', windowId:'w16', name:'韩式甜辣炸鸡', emoji:'🍗', price:16, rating:4.5, ratingCount:236, avoid:4, rec:95, tags:['甜口','辣'], m:{t:4.6,p:4.4,v:4.3,s:4.3}, hot:72 },
  { id:'d34', canteenId:'c3', windowId:'w16', name:'芝士年糕拉面', emoji:'🍜', price:14, rating:4.0, ratingCount:150, avoid:8, rec:42, tags:['甜口'], m:{t:4.0,p:4.3,v:4.0,s:4.4}, hot:44 },
  { id:'d35', canteenId:'c3', windowId:'w16', name:'韩式部队锅', emoji:'🍲', price:24, rating:3.3, ratingCount:96, avoid:21, rec:10, tags:['踩雷预警'], m:{t:3.2,p:3.5,v:3.0,s:3.6}, hot:12, desc:'汤底像稀释过的辣酱，年糕发硬。' },
  { id:'d36', canteenId:'c3', windowId:'w17', name:'黑松露奶油意面', emoji:'🍝', price:18, rating:4.7, ratingCount:64, avoid:1, rec:55, tags:['新菜'], m:{t:4.8,p:4.2,v:4.3,s:4.4}, hot:68, isNew:true, desc:'本周新上！奶香浓郁不腻，冲就完了。' },
  { id:'d37', canteenId:'c3', windowId:'w17', name:'玛格丽特披萨', emoji:'🍕', price:16, rating:4.1, ratingCount:88, avoid:4, rec:26, tags:['西式'], m:{t:4.1,p:4.2,v:4.0,s:4.0}, hot:30 },
  { id:'d38', canteenId:'c3', windowId:'w18', name:'杨枝甘露冰粉', emoji:'🍧', price:9, rating:4.8, ratingCount:152, avoid:1, rec:98, tags:['新菜','甜口'], m:{t:4.9,p:4.5,v:4.8,s:4.7}, hot:74, isNew:true, desc:'芒果大块，西柚微苦，夏天救命神器。' },
  { id:'d39', canteenId:'c3', windowId:'w18', name:'豆乳玉麒麟', emoji:'🧋', price:8, rating:4.4, ratingCount:210, avoid:2, rec:70, tags:['甜口'], m:{t:4.5,p:4.2,v:4.5,s:4.7}, hot:55 },
  { id:'d40', canteenId:'c3', windowId:'w18', name:'蛋挞(2只)', emoji:'🥧', price:6, rating:4.3, ratingCount:190, avoid:3, rec:58, tags:['甜口'], m:{t:4.4,p:4.4,v:4.6,s:4.7}, hot:50 },
  // 清真食堂
  { id:'d41', canteenId:'c4', windowId:'w19', name:'大盘鸡(小份)', emoji:'🍲', price:18, rating:4.8, ratingCount:420, avoid:1, rec:210, tags:['招牌','量大'], m:{t:4.9,p:4.9,v:4.7,s:4.3}, hot:99, desc:'两个人吃小份都撑，土豆吸满汤汁比肉还香，要排20分钟。' },
  { id:'d42', canteenId:'c4', windowId:'w19', name:'皮带面', emoji:'🍜', price:6, rating:4.7, ratingCount:260, avoid:1, rec:85, tags:['量大','主食'], m:{t:4.7,p:4.8,v:4.9,s:4.6}, hot:70 },
  { id:'d43', canteenId:'c4', windowId:'w20', name:'羊肉泡馍', emoji:'🍜', price:16, rating:4.6, ratingCount:232, avoid:2, rec:78, tags:['招牌'], m:{t:4.6,p:4.5,v:4.5,s:4.4}, hot:66 },
  { id:'d44', canteenId:'c4', windowId:'w21', name:'羊肉手抓饭', emoji:'🍛', price:15, rating:4.7, ratingCount:288, avoid:1, rec:100, tags:['招牌','量大'], m:{t:4.8,p:4.7,v:4.6,s:4.5}, hot:78, desc:'羊肉给得豪横，胡萝卜甜糯，米饭油亮。' },
  { id:'d45', canteenId:'c4', windowId:'w22', name:'红柳羊肉串(5串)', emoji:'🍢', price:15, rating:4.5, ratingCount:310, avoid:4, rec:115, tags:['排队王'], m:{t:4.6,p:4.4,v:4.3,s:4.0}, hot:73 },
  { id:'d46', canteenId:'c4', windowId:'w22', name:'烤腰子', emoji:'🥓', price:12, rating:3.2, ratingCount:96, avoid:24, rec:7, tags:['踩雷预警'], m:{t:3.0,p:3.4,v:3.1,s:3.9}, hot:10, desc:'处理得不够干净，有腥味。' },
  { id:'d47', canteenId:'c4', windowId:'w23', name:'手工老酸奶', emoji:'🍶', price:6, rating:4.9, ratingCount:356, avoid:0, rec:160, tags:['招牌','甜口'], m:{t:4.9,p:4.7,v:5.0,s:4.9}, hot:95, desc:'加蜂蜜绝了，饭后一碗直接回魂。' },
  { id:'d48', canteenId:'c4', windowId:'w23', name:'酸奶水果捞', emoji:'🍧', price:9, rating:4.6, ratingCount:180, avoid:1, rec:66, tags:['甜口','清爽'], m:{t:4.6,p:4.5,v:4.7,s:4.7}, hot:60 },
  // 新食堂·智慧餐厅
  { id:'d49', canteenId:'c5', windowId:'w24', name:'智慧称重自助', emoji:'🥗', price:15, rating:4.2, ratingCount:310, avoid:8, rec:88, tags:['自助','减脂友好'], m:{t:4.1,p:4.3,v:4.3,s:4.6}, hot:64, desc:'按克计费，拿多少吃多少，适合小鸟胃。' },
  { id:'d50', canteenId:'c5', windowId:'w25', name:'鸡胸肉沙拉', emoji:'🥗', price:13, rating:4.4, ratingCount:142, avoid:3, rec:52, tags:['减脂友好'], m:{t:4.3,p:4.4,v:4.2,s:4.5}, hot:48 },
  { id:'d51', canteenId:'c5', windowId:'w25', name:'全麦牛肉三明治', emoji:'🥪', price:12, rating:4.3, ratingCount:98, avoid:2, rec:46, tags:['新菜','减脂友好'], m:{t:4.3,p:4.3,v:4.3,s:4.5}, hot:42, isNew:true },
  { id:'d52', canteenId:'c5', windowId:'w26', name:'小碗菜自选', emoji:'🍱', price:12, rating:3.9, ratingCount:230, avoid:15, rec:40, tags:['经济实惠'], m:{t:3.9,p:4.0,v:4.0,s:4.4}, hot:38 },
  { id:'d53', canteenId:'c5', windowId:'w26', name:'剁椒鱼头(小碗)', emoji:'🐟', price:8, rating:3.5, ratingCount:104, avoid:12, rec:14, tags:['避雷常客'], m:{t:3.4,p:3.6,v:3.5,s:4.2}, hot:16, desc:'鱼腥味没压住，剁椒只有咸。' },
  { id:'d54', canteenId:'c5', windowId:'w27', name:'现烤可颂', emoji:'🥐', price:7, rating:4.5, ratingCount:170, avoid:1, rec:74, tags:['新菜','甜口'], m:{t:4.6,p:4.4,v:4.6,s:4.6}, hot:56, isNew:true, desc:'上午十点出炉，去晚了就没了。' },
  { id:'d55', canteenId:'c5', windowId:'w27', name:'紫薯包', emoji:'🍠', price:3, rating:4.4, ratingCount:220, avoid:1, rec:60, tags:['甜口','素食友好'], m:{t:4.4,p:4.4,v:4.6,s:4.6}, hot:48 },
  // 美食广场
  { id:'d56', canteenId:'c6', windowId:'w28', name:'脆皮炸鸡汉堡套餐', emoji:'🍔', price:16, rating:4.0, ratingCount:180, avoid:9, rec:50, tags:['炸物'], m:{t:4.0,p:4.2,v:3.9,s:4.2}, hot:46 },
  { id:'d57', canteenId:'c6', windowId:'w28', name:'网红爆浆鸡排', emoji:'🍗', price:12, rating:2.8, ratingCount:140, avoid:55, rec:5, tags:['踩雷预警'], m:{t:2.6,p:3.1,v:2.9,s:3.9}, hot:8, desc:'面衣厚得像教科书，爆浆是我想象出来的。' },
  { id:'d58', canteenId:'c6', windowId:'w29', name:'扬州炒饭', emoji:'🍚', price:10, rating:3.9, ratingCount:150, avoid:7, rec:32, tags:['主食'], m:{t:3.8,p:4.0,v:4.0,s:4.5}, hot:34 },
  { id:'d59', canteenId:'c6', windowId:'w29', name:'干炒牛河', emoji:'🍜', price:12, rating:3.7, ratingCount:120, avoid:11, rec:22, tags:['主食'], m:{t:3.6,p:3.9,v:3.7,s:4.2}, hot:26 },
  { id:'d60', canteenId:'c6', windowId:'w30', name:'烤冷面', emoji:'🥢', price:7, rating:4.2, ratingCount:200, avoid:4, rec:70, tags:['夜宵'], m:{t:4.3,p:4.1,v:4.3,s:4.5}, hot:52 },
  { id:'d61', canteenId:'c6', windowId:'w30', name:'铁板鱿鱼', emoji:'🦑', price:9, rating:3.0, ratingCount:88, avoid:28, rec:6, tags:['踩雷预警'], m:{t:2.9,p:3.2,v:3.1,s:4.0}, hot:9, desc:'端上来是温的，像微波炉二次加热。' },
  { id:'d62', canteenId:'c6', windowId:'w31', name:'水果捞(自选)', emoji:'🍧', price:12, rating:4.1, ratingCount:160, avoid:5, rec:55, tags:['甜口','清爽'], m:{t:4.2,p:4.2,v:4.1,s:4.6}, hot:44 },
];

/* ---------- 种子评价 ---------- */
const SEED_REVIEWS = [
  { dishId:'d41', user:'碳水战士', avatar:'🍚', stars:5, time:'3小时前', text:'分量实在，两个人吃小份都撑，土豆吸满汤汁比肉还香。缺点是要排20分钟。', tags:['量大管饱'], likes:128 },
  { dishId:'d41', user:'干饭人小刘', avatar:'🍳', stars:4, time:'1天前', text:'今天鸡肉有点柴，可能去晚了，平时更香。', tags:['排队久'], likes:12 },
  { dishId:'d47', user:'汤圆不吃汤', avatar:'🥣', stars:5, time:'5小时前', text:'加蜂蜜绝了，饭后一碗直接回魂。', tags:['口味好'], likes:96 },
  { dishId:'d15', user:'干饭魂', avatar:'🔥', stars:5, time:'2小时前', text:'中辣刚好，汤汁拌饭能吃三碗，记得让阿姨多加青菜。', tags:['口味好','量大管饱'], likes:154 },
  { dishId:'d15', user:'早八睡不醒', avatar:'😴', stars:4, time:'1天前', text:'十一点半之后人暴多，建议11点去。', tags:['排队久'], likes:33 },
  { dishId:'d18', user:'深夜食堂观察员', avatar:'🌙', stars:1, time:'昨天 19:40', text:'晚市千万别来！菜叶子发蔫，丸子煮化了。', tags:['踩雷','不新鲜'], likes:67 },
  { dishId:'d57', user:'减肥失败的鱼', avatar:'🐟', stars:1, time:'2天前', text:'面衣厚得像教科书，爆浆是我想象出来的。', tags:['踩雷'], likes:88 },
  { dishId:'d57', user:'不吃香菜', avatar:'🌿', stars:2, time:'3天前', text:'18块的鸡排，15块是面糊，避雷。', tags:['踩雷','偏贵'], likes:40 },
  { dishId:'d10', user:'汤圆不吃汤', avatar:'🥣', stars:5, time:'4小时前', text:'汤清味浓，鸡腿肉一抿就脱骨，冬天暖胃神器。', tags:['口味好','清淡'], likes:85 },
  { dishId:'d1', user:'干饭人小刘', avatar:'🍳', stars:5, time:'6小时前', text:'牛肉给的比面多，阿姨手一点都不抖，辣子油香得很。', tags:['口味好','量大管饱'], likes:120 },
  { dishId:'d13', user:'干饭魂', avatar:'🔥', stars:2, time:'2天前', text:'肥肉偏多，吃一半腻住了，配米饭也救不回来。', tags:['太油'], likes:25 },
  { dishId:'d14', user:'不吃香菜', avatar:'🌿', stars:2, time:'2天前', text:'鸡丁像在迷宫里找，全是花生。', tags:['踩雷'], likes:31 },
  { dishId:'d27', user:'螺蛳粉信徒', avatar:'🍜', stars:4, time:'1天前', text:'一定要加腐竹加酸笋，酸笋给得大方，闻着臭吃着香。', tags:['口味好'], likes:72 },
  { dishId:'d30', user:'干饭人小刘', avatar:'🍳', stars:5, time:'8小时前', text:'肥牛现炒的，洋葱甜香，米饭粒粒分明，一份根本不够。', tags:['口味好'], likes:90 },
  { dishId:'d36', user:'早八睡不醒', avatar:'😴', stars:5, time:'昨天 12:10', text:'新菜首发！奶香浓郁不腻，冲就完了。', tags:['新菜','口味好'], likes:58 },
  { dishId:'d38', user:'不吃香菜', avatar:'🌿', stars:5, time:'1天前', text:'芒果大块，西柚微苦，夏天救命神器。', tags:['口味好'], likes:64 },
  { dishId:'d35', user:'深夜食堂观察员', avatar:'🌙', stars:2, time:'3天前', text:'汤底像稀释过的辣酱，年糕发硬，不如去隔壁吃螺蛳粉。', tags:['踩雷'], likes:29 },
  { dishId:'d44', user:'碳水战士', avatar:'🍚', stars:5, time:'1天前', text:'羊肉给得豪横，胡萝卜甜糯，米饭油亮，清真食堂yyds。', tags:['口味好','量大管饱'], likes:97 },
  { dishId:'d45', user:'干饭魂', avatar:'🔥', stars:5, time:'5小时前', text:'现串现烤，肥瘦相间，撒孜然的时候我在咽口水。', tags:['口味好'], likes:110 },
  { dishId:'d46', user:'深夜食堂观察员', avatar:'🌙', stars:2, time:'4天前', text:'处理得不够干净，有腥味，谨慎尝试。', tags:['踩雷'], likes:22 },
  { dishId:'d61', user:'减肥失败的鱼', avatar:'🐟', stars:2, time:'2天前', text:'端上来是温的，像微波炉二次加热。', tags:['踩雷','不新鲜'], likes:35 },
  { dishId:'d49', user:'减肥失败的鱼', avatar:'🐟', stars:4, time:'3天前', text:'按克计费，拿多少吃多少，适合小鸟胃，再也不怕阿姨手抖。', tags:['清淡'], likes:51 },
  { dishId:'d23', user:'汤圆不吃汤', avatar:'🥣', stars:5, time:'7小时前', text:'皮薄馅大，汤里放紫菜虾皮，家的味道。', tags:['口味好'], likes:76 },
  { dishId:'d54', user:'早八睡不醒', avatar:'😴', stars:5, time:'昨天 10:05', text:'上午十点出炉，去晚了就没了，黄油香能飘到隔壁教室。', tags:['新菜','口味好'], likes:44 },
];

/* ---------- 其他常量 ---------- */
const PREF_TAGS = ['无辣不欢','微辣','不吃辣','甜口','清淡','重口','减脂','素食','不吃香菜','不挑食'];
const REVIEW_TAGS = ['口味好','量大管饱','出餐快','排队久','偏贵','清淡','太油','太咸','太辣','不新鲜','隐藏菜单','踩雷'];
const AVOID_TIPS = [
  { emoji:'🌙', title:'晚市慎点', text:'麻辣烫、铁板类晚市食材容易发蔫，尽量赶午市去。' },
  { emoji:'👥', title:'看排队', text:'排长队的窗口通常不会太差；超过20分钟先掂量出餐速度。' },
  { emoji:'🆕', title:'新菜首周', text:'新菜上线首周评价少，先看避雷榜与安利数再冲。' },
  { emoji:'🌃', title:'夜宵窗口', text:'美食广场21点后只开烧烤与炸鸡，炒饭窗口九点后食材见底。' },
];
