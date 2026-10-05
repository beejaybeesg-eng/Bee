/* ===== 内容数据 ===== */
// 城市 / 地点：zh 名称，en 英文，d 简介，lab 标签位置 {us|atl: 'l'|'r'|'b'}
const CITIES = {
  senegambia:{zh:'塞内冈比亚',en:'Senegambia',d:'今塞内加尔、冈比亚一带。格里奥（griot）说唱传统的核心地区，也是班卓琴祖先阿孔丁琴的故乡。',lab:{atl:'l'}},
  windward:{zh:'向风海岸',en:'Windward Coast',d:'今塞拉利昂、利比里亚一带。许多被带到南卡罗来纳的人来自这里，他们懂得种植水稻。',lab:{atl:'l'}},
  goldcoast:{zh:'黄金海岸',en:'Gold Coast',d:'今加纳。阿坎人的鼓语和复杂节奏传统发达。',lab:{atl:'b'}},
  benin:{zh:'贝宁湾',en:'Bight of Benin',d:'今多哥、贝宁、尼日利亚西部。约鲁巴、丰人的宗教和鼓乐对整个美洲影响深远。',lab:{atl:'t'}},
  biafra:{zh:'比夫拉湾',en:'Bight of Biafra',d:'今尼日利亚东南、喀麦隆。伊博人大量被运往弗吉尼亚和加勒比。',lab:{atl:'b'}},
  kongo:{zh:'刚果—安哥拉',en:'West Central Africa',d:'被贩运人数最多的地区。南卡罗来纳和新奥尔良的非洲人有很大比例来自这里，环形舞蹈和逆时针绕圈的仪式就源自刚果文化。',lab:{atl:'l'}},
  salvador:{zh:'巴西 · 约480万',en:'Brazil',d:'大西洋奴隶贸易最大的目的地，约480万人在这里上岸。',lab:{atl:'r'}},
  jamaica:{zh:'加勒比 · 400万以上',en:'Caribbean',d:'甘蔗种植园。英属加勒比约230万人上岸，整个加勒比合计超过400万。',lab:{atl:'r'}},
  chesapeake:{zh:'北美大陆 · 约38.8万',en:'North America',d:'直接运到北美大陆的非洲人约38.8万，只占总数的3.6%左右。',lab:{atl:'r'}},
  pointcomfort:{zh:'波因特康福特',en:'Point Comfort, VA',d:'1619年，“二十多个”非洲人在这里上岸，是英属北美有记录的第一批非洲人。',lab:{us:'r'}},
  charleston:{zh:'查尔斯顿',en:'Charleston, SC',d:'北美最大的奴隶贸易港口。约40%运到北美大陆的非洲人从这里上岸。',lab:{us:'r',atl:'r'}},
  seaislands:{zh:'海岛（嘎勒人）',en:'Sea Islands / Gullah',d:'南卡罗来纳和佐治亚外海的岛屿。与世隔绝，让嘎勒—吉奇人保留了最多的非洲语言、故事和环形呼喊（ring shout）。',lab:{us:'r'}},
  neworleans:{zh:'新奥尔良',en:'New Orleans, LA',d:'法国和西班牙统治过的港口城市。刚果广场的周日鼓乐、爵士乐的诞生地，也是美国最大的奴隶市场。马哈莉雅·杰克逊在这里长大。',lab:{us:'r',atl:'l'}},
  philadelphia:{zh:'费城',en:'Philadelphia, PA',d:'1794年理查德·艾伦在这里建立伯特利教会，后来发展成第一个独立的黑人教派AME。也是地下铁路的重要一站，后来是克拉拉·沃德和迪克西蜂鸟的基地。',lab:{us:'r'}},
  washington:{zh:'华盛顿',en:'Washington, D.C.',d:'1841年诺瑟普在这里被绑架。1963年25万人在这里参加“为工作和自由向华盛顿进军”。',lab:{us:'l'}},
  saratoga:{zh:'萨拉托加泉',en:'Saratoga Springs, NY',d:'所罗门·诺瑟普作为自由人和妻儿生活的地方。',lab:{us:'r'}},
  richmond:{zh:'里士满',en:'Richmond, VA',d:'仅次于新奥尔良的奴隶市场。大量弗吉尼亚人从这里被卖往深南部。',lab:{us:'l'}},
  natchez:{zh:'纳奇兹',en:'Natchez, MS',d:'密西西比河边的奴隶市场“岔路口”（Forks of the Road），深南部第二大奴隶交易地。',lab:{us:'r'}},
  bayouboeuf:{zh:'贝尤博夫',en:'Bayou Boeuf, LA',d:'路易斯安那中部的棉花与甘蔗种植园区。诺瑟普在这里被奴役了12年。',lab:{us:'l'}},
  dorchester:{zh:'多切斯特县',en:'Dorchester County, MD',d:'哈丽特·塔布曼的出生地。她逃到费城后，又十几次回到马里兰带人逃亡。',lab:{us:'r'}},
  southampton:{zh:'南安普敦县',en:'Southampton County, VA',d:'1831年纳特·特纳起义的地点。',lab:{us:'r'}},
  galveston:{zh:'加尔维斯顿',en:'Galveston, TX',d:'1865年6月19日联邦军在这里宣布奴隶获得自由，即“六月节”（Juneteenth）。',lab:{us:'r'}},
  nashville:{zh:'纳什维尔',en:'Nashville, TN',d:'菲斯克大学所在地。1871年菲斯克欢庆歌手从这里出发巡演，把灵歌带进了世界的音乐厅。',lab:{us:'r'}},
  tutwiler:{zh:'图特威勒',en:'Tutwiler, MS',d:'1903年W.C.汉迪在这里的火车站听到一个男人用刀刃滑弦弹唱，他后来说那是“我听过的最奇怪的音乐”。',lab:{us:'l'}},
  delta:{zh:'密西西比三角洲',en:'Mississippi Delta',d:'密西西比河与亚祖河之间的棉花平原。蓝调的故乡，也是大迁徙最大的出发地之一。山姆·库克生于这里的克拉克斯代尔。',lab:{us:'r'}},
  memphis:{zh:'孟菲斯',en:'Memphis, TN',d:'比尔街的蓝调、COGIC教会总部、Stax唱片。1968年马丁·路德·金在这里遇刺。艾瑞莎·富兰克林生于此地。',lab:{us:'l'}},
  sedalia:{zh:'塞达利亚',en:'Sedalia, MO',d:'斯科特·乔普林在这里写下《枫叶拉格》（1899），拉格泰姆的故乡。',lab:{us:'r'}},
  losangeles:{zh:'洛杉矶',en:'Los Angeles, CA',d:'1906年阿苏萨街复兴的发生地。第二次大迁徙后成为西部福音中心。1972年艾瑞莎在瓦茨区录下《Amazing Grace》。',lab:{us:'r'}},
  chicago:{zh:'芝加哥',en:'Chicago, IL',d:'福音音乐的首都。伊利诺伊中央铁路把三角洲的人直接送到南区。多尔西、马哈莉雅、罗伯塔·马丁、斯泰普斯一家都在这里。',lab:{us:'r'}},
  detroit:{zh:'底特律',en:'Detroit, MI',d:'汽车工厂吸引了大量南方移民。摩城唱片、艾瑞莎的父亲C.L.富兰克林的新伯特利浸信会、克拉克姐妹和怀南斯家族都在这里。',lab:{us:'r'}},
  harlem:{zh:'哈莱姆',en:'Harlem, New York',d:'1920年代哈莱姆文艺复兴的中心，阿波罗剧院所在地。1969年哈莱姆文化节就是电影《灵魂之夏》记录的那场音乐节。',lab:{us:'r'}},
  cottonplant:{zh:'棉株镇',en:'Cotton Plant, AR',d:'修女罗塞塔·撒普1915年生于这里。她的母亲是COGIC的布道者，她从小在教会里弹吉他。',lab:{us:'l'}},
  atlanta:{zh:'亚特兰大',en:'Atlanta, GA',d:'多尔西在这附近长大。1954年雷·查尔斯在这里录下《I Got a Woman》。今天被称为“黑人麦加”，是新大迁徙的首选目的地。',lab:{us:'r'}},
  houston:{zh:'休斯顿',en:'Houston, TX',d:'灵魂激动者四重唱早期的基地。碧昂丝在这里的教会唱诗班长大。',lab:{us:'l'}},
  muscleshoals:{zh:'马斯尔肖尔斯',en:'Muscle Shoals, AL',d:'阿拉巴马小镇上的FAME录音室。1967年艾瑞莎在这里录下《I Never Loved a Man》，事业从此转折。',lab:{us:'r'}},
  augusta:{zh:'奥古斯塔',en:'Augusta, GA',d:'“灵魂教父”詹姆斯·布朗长大的地方。',lab:{us:'r'}},
  montgomery:{zh:'蒙哥马利',en:'Montgomery, AL',d:'1955年罗莎·帕克斯拒绝让座，引发381天的公交抵制运动。1965年塞尔玛游行的终点。',lab:{us:'r'}},
  selma:{zh:'塞尔玛',en:'Selma, AL',d:'1965年为争取投票权从这里向蒙哥马利游行，“血腥星期日”震动全国，直接促成了《投票权法》。',lab:{us:'l'}},
  oakland:{zh:'奥克兰',en:'Oakland, CA',d:'二战造船厂吸引了路易斯安那和德州的移民。1969年埃德温·霍金斯歌手团的《Oh Happy Day》从这里打进流行榜。',lab:{us:'r'}},
  newark:{zh:'纽瓦克',en:'Newark, NJ',d:'惠特尼·休斯顿在新希望浸信会的唱诗班长大，母亲西茜·休斯顿是那里的音乐指导。',lab:{us:'r'}},
  fortworth:{zh:'沃斯堡',en:'Fort Worth, TX',d:'柯克·富兰克林的家乡。他把嘻哈节奏带进了福音合唱。',lab:{us:'l'}}
};

const ERAS = [
{
  id:'africa', yr:'1500', years:'约 1400 – 1600', title:'西非之声', sub:'一切声音的源头', view:'atl',
  story:[
    '在被强行带过大西洋之前，西非和中非已经有极其丰富的音乐文明。塞内冈比亚的格里奥（griot）世代用歌声记录家族与王国的历史；约鲁巴、阿坎、刚果等民族的音乐和宗教、劳动、舞蹈分不开，歌唱是集体的事，而不是台上一个人的表演。',
    '后来被贩运到美洲的人，大多来自地图上的六个沿海区域。他们被夺走了家园、语言和乐器，但带走了一种唱歌的方式：一领众和、复杂的节奏、滑动的音高、粗粝而有生命力的音色。这些就是后来灵歌、蓝调、福音和灵魂乐共同的“基因”。'
  ],
  law:[
    {y:'1444',t:'葡萄牙人在葡萄牙拉各斯公开拍卖从西非掳来的非洲人，常被视为欧洲大西洋奴隶贸易的开端。',k:'bad'},
    {y:'约1525',t:'第一艘有记录的奴隶船从非洲直接驶往美洲。此后三百多年，这条航线没有停过。',k:'bad'}
  ],
  music:[
    {n:'呼应 Call & Response',d:'领唱抛出一句，众人回应。后来所有黑人音乐的骨架。',lab:'call'},
    {n:'复节奏 Polyrhythm',d:'几条节奏同时进行，身体本身就是乐器。',lab:'poly'},
    {n:'音色就是表达',d:'嗡鸣、喊叫、假声、喉音都被当作美。不追求“干净”，追求有力量、有质感。'},
    {n:'滑动的音高',d:'音不是固定的点，可以滑上滑下，后来演变成蓝调音。',lab:'blue'},
    {n:'重复中的变化',d:'一个短句反复循环，每次加一点变化，越来越热烈。这就是福音vamp的祖先。',lab:'vamp'}
  ],
  people:[
    {n:'格里奥 Griot',d:'西非世袭的说唱诗人、乐师和历史学家，用歌声保存族谱和史诗。后来黑人教会里会“唱”的布道者，在功能上很像格里奥。',c:'senegambia'},
    {n:'阿孔丁琴 Akonting',d:'塞内冈比亚的葫芦弹拨琴，被认为是美国班卓琴的祖先之一。',c:'senegambia'}
  ],
  listen:[
    {t:'Toumani Diabaté — Kaira',n:'马里科拉琴，格里奥家族的器乐传统'},
    {t:'Ali Farka Touré & Ry Cooder — Talking Timbuktu',n:'西非吉他和美国蓝调放在一起，能直接听出血缘'}
  ],
  films:[
    {t:'根 Roots',y:'1977 / 2016',n:'从冈比亚少年昆塔·肯特被掳讲起，一个家族几代人的史诗'}
  ],
  cities:['senegambia','windward','goldcoast','benin','biafra','kongo'],
  routes:[],
  quiz:{q:'在西非，世代用歌声记录家族和王国历史的说唱诗人叫什么？',o:['格里奥 Griot','牧师 Preacher','吟游诗人 Troubadour','乐长 Choirmaster'],a:0,e:'格里奥是西非的“活历史书”。用歌声讲故事、为社群发声，这个角色后来在黑人教会的布道者和福音领唱身上延续。'}
},
{
  id:'passage', yr:'1526', years:'1500s – 1866', title:'中间航道', sub:'被迫横渡大西洋', view:'atl',
  story:[
    '1500年到1866年间，大约1250万非洲人被装上奴隶船，大约1070万人活着到达美洲。这段横渡叫“中间航道”（Middle Passage），通常要一到三个月，人被锁在甲板下拥挤的船舱里，死亡率极高。船员有时会强迫被奴役者到甲板上“跳舞”，好让他们活着到岸。',
    '注意线条的粗细：绝大多数人被运往巴西（约480万）和加勒比（合计400万以上）的甘蔗种植园；直接运到北美大陆的只有约38.8万人。但北美的奴隶人口因为自然增长而不断扩大，到1860年美国已有近400万被奴役的人。',
    '来自不同民族、说不同语言的人被混在一起。音乐成了他们共同的语言，不同的非洲传统在这里开始融合。'
  ],
  law:[
    {y:'1641',t:'马萨诸塞成为英属北美第一个在法律上承认奴隶制的殖民地。',k:'bad'},
    {y:'1807',t:'英国和美国先后立法禁止从海外输入奴隶，美国的禁令于1808年1月1日生效。但美国国内的奴隶买卖反而更兴旺。',k:'turn'},
    {y:'1866',t:'最后一批有记录的奴隶船驶往古巴，大西洋奴隶贸易基本结束。',k:'turn'}
  ],
  music:[
    {n:'融合 Creolization',d:'不同民族的节奏、旋律和舞蹈混在一起，形成新的、共同的“非裔美洲”音乐语言。'},
    {n:'哀歌与哼吟',d:'船舱里的低声歌唱和呻吟，是后来moan的远祖。',lab:'moan'}
  ],
  people:[
    {n:'奥拉达·艾奎亚诺 Olaudah Equiano',d:'据他自述，约1745年生于今尼日利亚一带（比夫拉湾），少年时被贩卖。1789年出版自传，详细描述了中间航道，推动了英国的废奴运动。',c:'biafra'},
    {n:'菲莉丝·惠特利 Phillis Wheatley',d:'约7岁时从西非被贩运到波士顿，1773年出版诗集，成为第一位出版诗集的非裔美国人。',c:'senegambia'}
  ],
  listen:[
    {t:'Odetta — Sometimes I Feel Like a Motherless Child',n:'灵歌诞生得更晚，但这首歌唱出了被连根拔起的痛'}
  ],
  films:[
    {t:'勇者无惧 Amistad',y:'1997',n:'斯皮尔伯格导演，1839年阿米斯塔德号奴隶船上的起义和审判'}
  ],
  cities:['senegambia','windward','goldcoast','benin','biafra','kongo','salvador','jamaica','chesapeake'],
  routes:[
    {f:'kongo',t:'salvador',k:'forced',w:7},
    {f:'benin',t:'salvador',k:'forced',w:5},
    {f:'biafra',t:'jamaica',k:'forced',w:5},
    {f:'goldcoast',t:'jamaica',k:'forced',w:4},
    {f:'kongo',t:'jamaica',k:'forced',w:3},
    {f:'senegambia',t:'chesapeake',k:'forced',w:1.5},
    {f:'windward',t:'chesapeake',k:'forced',w:1.5}
  ],
  quiz:{q:'直接被运到北美大陆（后来的美国）的非洲人，大约占大西洋奴隶贸易上岸总数的多少？',o:['不到 5%','约 25%','约 50%','超过 70%'],a:0,e:'约38.8万 / 1070万 ≈ 3.6%。绝大多数人去了巴西和加勒比。美国的黑人人口主要来自在北美出生的后代。'}
},
{
  id:'roots', yr:'1619', years:'1619 – 1808', title:'落地生根', sub:'奴隶法典、禁鼓令与黑人教会', view:'us',
  story:[
    '1619年，“二十多个”非洲人在弗吉尼亚的波因特康福特上岸。最初他们的身份还比较模糊，但殖民地很快用一条条法律把“黑人”和“终身、世袭的奴隶”绑在一起。',
    '1739年南卡罗来纳的斯托诺起义中，起义者用鼓声聚集众人。第二年殖民地立法禁止奴隶使用鼓和号角。鼓被拿走了，节奏就转进了身体：拍手、跺脚、拍打身体（patting juba），还有在海岛上保留下来的环形呼喊（ring shout），人们围成圈逆时针移动，边拍边唱。新奥尔良在法国和西班牙统治下规则不同，被奴役者周日可以在城边的刚果广场击鼓跳舞，非洲鼓乐在那里保存得最久。',
    '18世纪的“大觉醒”宗教复兴让许多黑人接受了基督教。他们拿起英国牧师艾萨克·沃茨的赞美诗，用自己的方式来唱：领唱先念出一句，会众用缓慢、拖长、装饰很多的方式回应，这就是“领唱填词”。1794年，理查德·艾伦在费城建立伯特利教会，后来发展成第一个独立的黑人教派：非洲卫理圣公会（AME，1816）。黑人教会从此成为社区、教育和音乐的中心。'
  ],
  law:[
    {y:'1619',t:'第一批有记录的非洲人到达英属弗吉尼亚。',k:'turn'},
    {y:'1662',t:'弗吉尼亚规定孩子的身份随母亲：母亲是奴隶，孩子就是奴隶。奴隶身份从此世袭。',k:'bad'},
    {y:'1705',t:'弗吉尼亚奴隶法典：奴隶被定义为财产，主人杀死“反抗的”奴隶不算犯罪。',k:'bad'},
    {y:'1724',t:'法属路易斯安那《黑人法典》（Code Noir）：规定周日休息，客观上让刚果广场的聚会成为可能。',k:'turn'},
    {y:'1740',t:'南卡罗来纳《黑人法》：禁止奴隶使用鼓、号角等“响亮乐器”，禁止学习写字。',k:'bad'},
    {y:'1787',t:'美国宪法“五分之三条款”：计算人口时，奴隶按五分之三个人计算。',k:'bad'},
    {y:'1794',t:'理查德·艾伦在费城建立伯特利教会，黑人开始拥有自己的教会。',k:'good'}
  ],
  music:[
    {n:'环形呼喊 Ring Shout',d:'围成圈逆时针移动、拍手跺脚、一领众和。被认为是最接近非洲原貌的北美宗教音乐。',lab:'poly'},
    {n:'领唱填词 Lining Out',d:'领唱念一句，会众用缓慢、拖长的方式齐唱。福音里拖长、装饰的唱法来自这里。',lab:'lining'},
    {n:'身体节奏 Patting Juba',d:'鼓被禁后，拍手、拍腿、跺脚成为乐器。'},
    {n:'哼吟 Moan',d:'没有歌词的祷告式哼唱。',lab:'moan'}
  ],
  people:[
    {n:'理查德·艾伦 Richard Allen',d:'生而为奴，赎身后成为牧师。1801年编了第一本由非裔美国人出版的赞美诗集。',c:'philadelphia'},
    {n:'嘎勒—吉奇人 Gullah Geechee',d:'海岛上的黑人社群，至今保留着环形呼喊和非洲词汇。',c:'seaislands'},
    {n:'刚果广场 Congo Square',d:'新奥尔良城边的空地，周日的鼓乐和舞蹈聚会持续到19世纪中叶，被视为爵士乐的远源。',c:'neworleans'}
  ],
  listen:[
    {t:'McIntosh County Shouters — Jonah',n:'佐治亚海岸的环形呼喊，真实录音'},
    {t:'Lined hymn — I Love the Lord, He Heard My Cry',n:'Dr. Watts 式领唱填词，搜索 “lined hymn” 能找到很多教会录音'}
  ],
  films:[
    {t:'尘埃的女儿 Daughters of the Dust',y:'1991',n:'朱莉·达什导演，1902年海岛上的嘎勒家族，画面和语言都极有非洲根源的味道'}
  ],
  cities:['pointcomfort','charleston','seaislands','neworleans','philadelphia'],
  routes:[],
  layer:{legend:[{k:'gold',l:'原十三殖民地（1776）'}],states:{'New Hampshire':'gold','Massachusetts':'gold','Rhode Island':'gold','Connecticut':'gold','New York':'gold','New Jersey':'gold','Pennsylvania':'gold','Delaware':'gold','Maryland':'gold','Virginia':'gold','North Carolina':'gold','South Carolina':'gold','Georgia':'gold'}},
  quiz:{q:'1740年南卡罗来纳立法禁止奴隶使用什么？此后节奏转移到了拍手、跺脚和身体上。',o:['鼓和号角','小提琴','赞美诗集','篝火'],a:0,e:'1739年斯托诺起义用鼓聚众，1740年的《黑人法》随即禁鼓。节奏没有消失，而是进入了身体和人声。'}
},
{
  id:'cotton', yr:'1841', years:'1793 – 1865', title:'棉花王国与灵歌', sub:'《为奴十二年》的年代', view:'us',
  story:[
    '1793年轧棉机发明，棉花利润暴涨。奴隶制没有像一些人期待的那样慢慢消亡，反而向西南急速扩张。大约100万人在“国内奴隶贸易”中被从弗吉尼亚、马里兰卖到密西西比、路易斯安那、阿拉巴马的棉花和甘蔗种植园，许多家庭被永久拆散。新奥尔良、纳奇兹和里士满成了最大的奴隶市场。',
    '所罗门·诺瑟普就是这条路上的一个人。他是生于纽约州的自由人，一位小提琴手。1841年他被以演出工作为诱饵骗到华盛顿，遭绑架，坐船被运到新奥尔良，卖到路易斯安那贝尤博夫一带的种植园，被奴役了12年，1853年才获救。在种植园里他常被叫去为舞会拉琴。这段经历写成了《为奴十二年》。',
    '这一时期诞生了灵歌（spirituals）：《Swing Low, Sweet Chariot》《Go Down, Moses》《Steal Away》《Roll, Jordan, Roll》。摩西带领以色列人出埃及的故事成了对自由的寄托，“约旦河”“迦南”既指天国，也可以指北方和自由。田间的劳动号子和一个人在田里的长声呼喊（field holler）则是后来蓝调的源头。'
  ],
  law:[
    {y:'1793',t:'第一部《逃奴法》：允许奴隶主跨州抓回逃亡者。同年轧棉机问世。',k:'bad'},
    {y:'1820',t:'密苏里妥协：北纬36°30′以北（密苏里除外）禁止奴隶制，国家开始按“自由州/蓄奴州”分裂。',k:'turn'},
    {y:'1831',t:'纳特·特纳起义（弗吉尼亚）。此后南方各州加严法律，禁止黑人识字，限制黑人布道和聚会。',k:'bad'},
    {y:'1850',t:'新《逃奴法》：北方的自由州也必须协助抓捕逃奴，自由黑人也可能被误抓，就像诺瑟普的遭遇。',k:'bad'},
    {y:'1857',t:'德雷德·斯科特案：最高法院裁定黑人不是美国公民。',k:'bad'},
    {y:'1863',t:'林肯签署《解放黑人奴隶宣言》。',k:'good'},
    {y:'1865',t:'第十三修正案：废除奴隶制（但“作为犯罪惩罚”的强制劳动除外）。',k:'good'}
  ],
  music:[
    {n:'灵歌 Spirituals',d:'在祈祷会和“隐秘的林间集会”（hush harbor）中诞生。歌词常有双重意义：天国，也是自由。有些“暗号歌”的说法流传很广，但史学界对具体歌曲是否真用作逃亡指令仍有争议。',lab:'call'},
    {n:'劳动号子 Work Songs',d:'一领众和，配合挥锄、砍伐的节奏，让劳作同步、让时间过得快一点。',lab:'call'},
    {n:'田野呼喊 Field Holler',d:'一个人在田里拖长、滑动、带假声翻转的呼喊，蓝调歌唱的直接祖先。',lab:'falsetto'},
    {n:'舞会小提琴与班卓',d:'被奴役的乐手为白人和黑人的舞会演奏。诺瑟普就是这样一个乐手。'}
  ],
  people:[
    {n:'所罗门·诺瑟普 Solomon Northup',d:'自由人、小提琴手。1841年在华盛顿被绑架，在路易斯安那被奴役12年。1853年出版《为奴十二年》。',c:'bayouboeuf'},
    {n:'哈丽特·塔布曼 Harriet Tubman',d:'1849年从马里兰逃到费城，之后十几次返回南方带领亲友逃亡，被称为“摩西”。据记载她用唱歌给逃亡者传递信号。',c:'dorchester'},
    {n:'弗雷德里克·道格拉斯 Frederick Douglass',d:'从马里兰逃出的废奴领袖。他在1845年的自传里写：奴隶的歌不是快乐的证据，“每一个音都在控诉奴隶制”。',c:'dorchester'},
    {n:'纳特·特纳 Nat Turner',d:'1831年在弗吉尼亚领导起义的传道人。',c:'southampton'}
  ],
  listen:[
    {t:'Roll, Jordan, Roll（《为奴十二年》原声）',n:'片中葬礼上众人合唱的一场，看看灵歌在生活里是什么样子'},
    {t:'Fisk Jubilee Singers — Swing Low, Sweet Chariot（1909）',n:'最早的灵歌录音之一'},
    {t:'Paul Robeson — Go Down, Moses',n:'低沉庄严的音乐会版灵歌'},
    {t:'Mahalia Jackson — Steal Away',n:'福音女王唱灵歌'}
  ],
  films:[
    {t:'为奴十二年 12 Years a Slave',y:'2013',n:'史蒂夫·麦奎因导演，奥斯卡最佳影片。看的时候可以对照地图上的诺瑟普路线'},
    {t:'哈丽特 Harriet',y:'2019',n:'哈丽特·塔布曼的故事，片中有很多用歌声传信的情节'}
  ],
  cities:['saratoga','washington','neworleans','bayouboeuf','natchez','richmond','dorchester','philadelphia','southampton'],
  routes:[
    {f:'washington',t:'neworleans',k:'forced',w:2.5,l:'诺瑟普被贩运（1841）',c:-0.35},
    {f:'neworleans',t:'bayouboeuf',k:'forced',w:2.5},
    {f:'richmond',t:'natchez',k:'forced',w:4,l:'国内奴隶贸易：约100万人'},
    {f:'dorchester',t:'philadelphia',k:'free',w:2.5,l:'地下铁路',lo:[-72,4]}
  ],
  layer:{legend:[{k:'clay',l:'蓄奴州（1860）'},{k:'blue',l:'自由州（1860）'},{k:'',l:'领地'}],states:Object.assign(
    Object.fromEntries(['Delaware','Maryland','Virginia','West Virginia','North Carolina','South Carolina','Georgia','Florida','Alabama','Mississippi','Louisiana','Texas','Arkansas','Tennessee','Kentucky','Missouri','District of Columbia'].map(s=>[s,'clay'])),
    Object.fromEntries(['Maine','New Hampshire','Vermont','Massachusetts','Rhode Island','Connecticut','New York','New Jersey','Pennsylvania','Ohio','Indiana','Illinois','Michigan','Wisconsin','Iowa','Minnesota','California','Oregon','Kansas'].map(s=>[s,'blue'])))},
  quiz:{q:'所罗门·诺瑟普被绑架之前，是靠什么谋生的自由人？',o:['小提琴手','牧师','铁匠','水手'],a:0,e:'诺瑟普是小有名气的小提琴手，绑架者正是以“演出工作”为诱饵把他骗到华盛顿。'}
},
{
  id:'jubilee', yr:'1871', years:'1865 – 1910', title:'自由与隔离', sub:'欢庆歌手、蓝调与五旬节之火', view:'us',
  story:[
    '1865年6月19日，联邦军在德州加尔维斯顿宣布奴隶获得自由，比《解放宣言》晚了两年半，这一天后来成为“六月节”（Juneteenth）。重建时期，黑人获得了公民权和男性投票权，但1877年联邦军撤出南方后，吉姆·克劳隔离法、人头税和私刑迅速吞没了这些权利；1896年最高法院确认了“隔离但平等”。',
    '音乐在这时分出了几条支流。1871年，纳什维尔的菲斯克大学派出“菲斯克欢庆歌手”巡演募款，用整齐的欧洲式和声把灵歌唱进了音乐厅，1873年还为英国维多利亚女王演唱。世俗的一面，蓝调在密西西比三角洲的棉田和小酒馆里成形，拉格泰姆在密苏里，爵士在新奥尔良。',
    '宗教的一面，1906年洛杉矶阿苏萨街的复兴运动点燃了五旬节运动：手鼓、钢琴、拍手、跳动和“被圣灵充满”的狂喜歌唱进入教会。查尔斯·梅森去了阿苏萨街，把这股火带回孟菲斯，1907年把基督教神的教会（COGIC）重组为五旬节教派。福音音乐的“热度”大部分来自这里。'
  ],
  law:[
    {y:'1865',t:'六月节：德州加尔维斯顿宣布奴隶自由。',k:'good'},
    {y:'1868',t:'第十四修正案：在美国出生的人都是公民，享有平等法律保护。',k:'good'},
    {y:'1870',t:'第十五修正案：不得因种族剥夺投票权。',k:'good'},
    {y:'1877',t:'重建结束，联邦军撤出南方。',k:'bad'},
    {y:'1890',t:'密西西比新宪法用人头税和识字测试剥夺黑人投票权，南方各州纷纷效仿。',k:'bad'},
    {y:'1896',t:'普莱西诉弗格森案：“隔离但平等”合法化，吉姆·克劳时代全面到来。',k:'bad'}
  ],
  music:[
    {n:'音乐会灵歌 Jubilee',d:'把灵歌编成四部和声，整齐、庄重，第一次让世界听到黑人宗教歌曲。'},
    {n:'蓝调 Blues',d:'三句式歌词、蓝调音、吉他滑音，个人的苦难被唱出来。',lab:'blue'},
    {n:'五旬节的狂喜 Shout',d:'手鼓、拍手、快节奏，身体被音乐带动。福音热度的来源。',lab:'shout'},
    {n:'哼吟与福音蓝调',d:'盲人街头传道者用吉他和嘶哑的嗓音唱宗教歌，宗教和蓝调的界线很模糊。',lab:'moan'}
  ],
  people:[
    {n:'菲斯克欢庆歌手 Fisk Jubilee Singers',d:'11名学生（大多曾是奴隶）组成的合唱团，募款救活了菲斯克大学，建起了“欢庆堂”。',c:'nashville'},
    {n:'W.C. 汉迪 W.C. Handy',d:'“蓝调之父”。1903年在图特威勒火车站听到滑弦蓝调，后来把蓝调写成乐谱出版。',c:'tutwiler'},
    {n:'斯科特·乔普林 Scott Joplin',d:'“拉格泰姆之王”，《枫叶拉格》（1899）。',c:'sedalia'},
    {n:'威廉·西摩 William J. Seymour',d:'独眼的黑人牧师，领导了1906年阿苏萨街复兴，黑人白人在同一间屋子里敬拜。',c:'losangeles'},
    {n:'查尔斯·梅森 Charles H. Mason',d:'COGIC的创始人，把五旬节运动带回孟菲斯。COGIC后来培养了大量福音歌手。',c:'memphis'},
    {n:'巴迪·博尔登 Buddy Bolden',d:'新奥尔良短号手，被许多人看作第一位爵士乐手。',c:'neworleans'}
  ],
  listen:[
    {t:'Blind Willie Johnson — Dark Was the Night, Cold Was the Ground（1927）',n:'几乎没有歌词的哼吟和滑棒吉他，被放进了旅行者号金唱片'},
    {t:'Scott Joplin — Maple Leaf Rag',n:'拉格泰姆的切分节奏'},
    {t:'Bessie Smith — St. Louis Blues（1925）',n:'汉迪写的曲子，蓝调女皇唱'}
  ],
  films:[
    {t:'紫色 The Color Purple',y:'1985 / 2023',n:'20世纪初的佐治亚乡村。结尾小酒馆的蓝调和教堂的福音合在一起的那场戏，正好就是“世俗与神圣”的关系'},
    {t:'尘埃的女儿 Daughters of the Dust',y:'1991',n:'故事发生在1902年'}
  ],
  cities:['galveston','nashville','tutwiler','memphis','sedalia','neworleans','losangeles'],
  routes:[
    {f:'losangeles',t:'memphis',k:'music',w:2.5,l:'五旬节之火回到孟菲斯（1907）',c:-0.15}
  ],
  layer:{legend:[{k:'clay',l:'1954年前法律强制学校种族隔离的州'}],states:Object.fromEntries(['Alabama','Arkansas','Delaware','Florida','Georgia','Kentucky','Louisiana','Maryland','Mississippi','Missouri','North Carolina','Oklahoma','South Carolina','Tennessee','Texas','Virginia','West Virginia','District of Columbia'].map(s=>[s,'clay']))},
  quiz:{q:'1906年，哪里的复兴运动点燃了五旬节运动，把手鼓、拍手和狂喜歌唱带入黑人教会？',o:['洛杉矶阿苏萨街','芝加哥南区','纳什维尔菲斯克大学','费城伯特利教会'],a:0,e:'阿苏萨街复兴由黑人牧师威廉·西摩领导。COGIC等五旬节教会后来成了福音歌手的摇篮。'}
},
{
  id:'migration', yr:'1932', years:'1910 – 1940', title:'大迁徙与福音诞生', sub:'从三角洲到芝加哥', view:'us',
  story:[
    '1910年到1970年间，约600万非裔美国人离开南方，逃离隔离、私刑和贫困，去北方和西部的城市找工厂工作，这就是“大迁徙”。路线大多沿着铁路：密西西比、路易斯安那的人坐伊利诺伊中央铁路去芝加哥；阿拉巴马、佐治亚的人去底特律、克利夫兰；卡罗来纳、弗吉尼亚的人沿东海岸去费城和纽约哈莱姆。',
    '人们把南方的教会带进了城市。芝加哥南区出现了大量开在店面里的小教会，南方乡村的呼喊、五旬节的节奏，在这里遇到了城市的蓝调和爵士。',
    '托马斯·多尔西原本是蓝调钢琴手“Georgia Tom”，给蓝调之母马·雷尼伴奏。1932年他的妻子在分娩中去世，刚出生的孩子也没能活下来。悲痛中他写下《Take My Hand, Precious Lord》。他把蓝调的和声和节奏写进圣歌，开创了“福音歌曲”这个品类，被称为“福音音乐之父”。很多教会起初嫌它太世俗，但它很快成了黑人教会的声音。1927年，十几岁的马哈莉雅·杰克逊从新奥尔良来到芝加哥；修女罗塞塔·撒普则抱着吉他，把福音唱进了纽约的夜总会和唱片榜。'
  ],
  law:[
    {y:'1915',t:'电影《一个国家的诞生》美化三K党，三K党随后复兴。',k:'bad'},
    {y:'1919',t:'“红色夏天”：芝加哥等几十座城市爆发针对黑人的种族暴力。',k:'bad'},
    {y:'1934',t:'联邦住房管理局开始“红线”划区，黑人社区被拒绝贷款，城市隔离被固化。',k:'bad'},
    {y:'1939',t:'女低音玛丽安·安德森被拒绝在宪法大厅演出，转而在林肯纪念堂前为约7.5万人演唱。',k:'turn'}
  ],
  music:[
    {n:'福音歌曲 Gospel Song',d:'蓝调的和声与节奏 + 圣歌的歌词。多尔西写了几百首，并自己出版、四处推销乐谱。'},
    {n:'福音钢琴',d:'罗伯塔·马丁等人发展出福音特有的钢琴伴奏：丰富的和弦、打击式的节奏、低音行进。'},
    {n:'领唱 + 合唱团',d:'独唱者在合唱团前即兴，合唱团回应。',lab:'call'},
    {n:'转音的萌芽',d:'马哈莉雅等歌手开始在长音上加入大量装饰。',lab:'melisma'}
  ],
  people:[
    {n:'托马斯·A·多尔西 Thomas A. Dorsey',d:'“福音音乐之父”。在亚特兰大附近长大，1916年来到芝加哥，1932年起任朝圣者浸信会音乐总监，1933年参与创立全国福音合唱团大会。',c:'chicago'},
    {n:'马哈莉雅·杰克逊 Mahalia Jackson',d:'“福音女王”。新奥尔良长大，1927年来到芝加哥。她一辈子拒绝唱世俗歌曲。',c:'neworleans'},
    {n:'修女罗塞塔·撒普 Sister Rosetta Tharpe',d:'生于阿肯色，小时候随母亲搬到芝加哥。1938年签约迪卡唱片，用电吉他唱福音，被称为“摇滚乐教母”，影响了猫王、约翰尼·卡什、查克·贝里。',c:'cottonplant'},
    {n:'马·雷尼 Ma Rainey',d:'“蓝调之母”。多尔西曾是她的钢琴手和乐队领队。',c:'chicago'},
    {n:'罗伯塔·马丁 Roberta Martin',d:'芝加哥的钢琴家和合唱团领袖，奠定了福音合唱团的声音和福音钢琴风格。',c:'chicago'}
  ],
  listen:[
    {t:'Mahalia Jackson — Take My Hand, Precious Lord',n:'多尔西的代表作，福音的“国歌”'},
    {t:'Sister Rosetta Tharpe — This Train（1939）',n:'吉他 + 福音 + 摇摆'},
    {t:'Sister Rosetta Tharpe — Strange Things Happening Every Day（1944）',n:'常被称为“第一首摇滚乐”'},
    {t:'Ma Rainey — See See Rider Blues（1924）',n:'多尔西出身的那个蓝调世界'}
  ],
  films:[
    {t:'马·雷尼的黑臀舞 Ma Rainey’s Black Bottom',y:'2020',n:'1927年芝加哥的一次录音，看蓝调歌手和唱片公司的关系'},
    {t:'Say Amen, Somebody',y:'1982',n:'关于多尔西和威利·梅·福特·史密斯的经典福音纪录片'},
    {t:'Sister Rosetta Tharpe: The Godmother of Rock & Roll',y:'2011',n:'BBC纪录片'}
  ],
  cities:['delta','neworleans','chicago','detroit','harlem','philadelphia','atlanta','cottonplant','charleston'],
  lab:{delta:'b'},
  routes:[
    {f:'delta',t:'chicago',k:'free',w:5,l:'伊利诺伊中央铁路'},
    {f:'neworleans',t:'chicago',k:'free',w:2.5,c:0.12},
    {f:'atlanta',t:'detroit',k:'free',w:3.5},
    {f:'charleston',t:'harlem',k:'free',w:3.5,c:-0.15},
    {f:'cottonplant',t:'chicago',k:'free',w:1.5,c:-0.12}
  ],
  layer:{legend:[{k:'clay',l:'主要出发地（南方）'},{k:'blue',l:'主要目的地（北方）'}],states:Object.assign(
    Object.fromEntries(['Mississippi','Alabama','Georgia','Louisiana','South Carolina','Arkansas','North Carolina','Tennessee','Virginia','Texas'].map(s=>[s,'clay'])),
    Object.fromEntries(['Illinois','Michigan','New York','Pennsylvania','Ohio','New Jersey'].map(s=>[s,'blue'])))},
  quiz:{q:'被称为“福音音乐之父”、写下《Take My Hand, Precious Lord》的托马斯·多尔西，原本是做什么的？',o:['蓝调钢琴手','浸信会牧师','歌剧演员','铁路工人'],a:0,e:'他曾是马·雷尼的蓝调钢琴手“Georgia Tom”。正因为懂蓝调，他才能把蓝调的感觉带进圣歌，创造出福音歌曲。'}
},
{
  id:'golden', yr:'1948', years:'1940 – 1955', title:'福音黄金时代', sub:'四重唱、硬福音与灵魂乐的前夜', view:'us',
  story:[
    '二战后到1950年代中期被称为福音的黄金时代。福音成了一个巡演产业：周末在教堂和礼堂里，各个组合同台“斗歌”（battle of the songs）。男声四重唱从早期整齐的“欢庆”和声，转向“硬福音”：两个领唱轮流飙高音、嘶吼、尖叫、跪地，把全场推向“shout”。',
    '灵魂激动者、密西西比五盲童、迪克西蜂鸟、天鹅银调都是当时的明星。女声方面，克拉拉·沃德的转音深深影响了后来的艾瑞莎·富兰克林；马哈莉雅·杰克逊的《Move On Up a Little Higher》（1948）据称卖出上百万张，福音第一次成为全国性的商业现象。第二波大迁徙开始向西：德州和路易斯安那的人去了洛杉矶和奥克兰的造船厂。',
    '1954年，雷·查尔斯把一首福音歌改成情歌《I Got a Woman》：教会的唱腔、呼应和激情，配上世俗的歌词。很多人认为这就是灵魂乐的起点，也有不少教会的人骂他亵渎。'
  ],
  law:[
    {y:'1941',t:'罗斯福第8802号行政令：禁止国防工业的种族歧视。',k:'good'},
    {y:'1948',t:'杜鲁门下令军队取消种族隔离。',k:'good'},
    {y:'1954',t:'布朗诉教育局案：公立学校种族隔离违宪。',k:'good'},
    {y:'1955',t:'14岁的埃米特·提尔在密西西比被残杀，母亲坚持开棺葬礼，震动全国。',k:'bad'}
  ],
  music:[
    {n:'硬福音 Hard Gospel',d:'嘶吼、尖叫、粗粝的喉音，领唱之间的对抗和接力。',lab:'growl'},
    {n:'假声领唱',d:'克劳德·杰特尔轻盈的假声，影响了整个灵魂乐的男高音传统。',lab:'falsetto'},
    {n:'转音 Melisma',d:'克拉拉·沃德的装饰性转音，艾瑞莎从小模仿她。',lab:'melisma'},
    {n:'Vamp 与“开教会”',d:'在歌曲末尾反复推进，直到“开教会”（having church）。',lab:'vamp'}
  ],
  people:[
    {n:'马哈莉雅·杰克逊 Mahalia Jackson',d:'《Move On Up a Little Higher》（1948）让她成为全国明星，后来登上卡内基音乐厅和电视。',c:'chicago'},
    {n:'山姆·库克与灵魂激动者 Sam Cooke',d:'库克生于三角洲的克拉克斯代尔、长在芝加哥，1950年加入德州起家的灵魂激动者任领唱，以温润的嗓音和转音征服了年轻听众。',c:'houston'},
    {n:'克拉拉·沃德 Clara Ward',d:'费城的沃德歌手团领袖。艾瑞莎说她是自己最重要的偶像之一。',c:'philadelphia'},
    {n:'雷·查尔斯 Ray Charles',d:'生于佐治亚，童年失明。1954年在亚特兰大录下《I Got a Woman》。',c:'atlanta'},
    {n:'詹姆斯·克利夫兰 James Cleveland',d:'芝加哥出身，多尔西的后辈，后来在洛杉矶成为“福音之王”，创办了福音音乐工作者大会。',c:'losangeles'}
  ],
  listen:[
    {t:'Mahalia Jackson — Move On Up a Little Higher（1948）',n:'把福音变成全国现象的唱片'},
    {t:'The Soul Stirrers ft. Sam Cooke — Touch the Hem of His Garment（1956）',n:'听库克的转音和“woah-oh-oh”'},
    {t:'The Swan Silvertones — Mary Don’t You Weep（1959）',n:'杰特尔的一句即兴“I’ll be a bridge over deep water”启发了保罗·西蒙'},
    {t:'Ray Charles — I Got a Woman（1954）',n:'把福音变成世俗：灵魂乐的诞生'},
    {t:'The Clara Ward Singers — Surely God Is Able（1949）',n:'女声福音的经典'}
  ],
  films:[
    {t:'灵魂歌王 Ray',y:'2004',n:'杰米·福克斯凭此片获奥斯卡影帝。片中有《I Got a Woman》被批“亵渎”的情节'}
  ],
  cities:['chicago','houston','philadelphia','atlanta','delta','losangeles','oakland','neworleans'],
  routes:[
    {f:'houston',t:'chicago',k:'music',w:2.5,l:'灵魂激动者北上'},
    {f:'houston',t:'losangeles',k:'free',w:3.5,l:'第二次大迁徙：向西'},
    {f:'neworleans',t:'oakland',k:'free',w:3,c:-0.18}
  ],
  layer:{legend:[{k:'clay',l:'主要出发地'},{k:'blue',l:'主要目的地（含西部）'}],states:Object.assign(
    Object.fromEntries(['Mississippi','Alabama','Georgia','Louisiana','South Carolina','Arkansas','North Carolina','Tennessee','Texas'].map(s=>[s,'clay'])),
    Object.fromEntries(['Illinois','Michigan','New York','Pennsylvania','Ohio','New Jersey','California'].map(s=>[s,'blue'])))},
  quiz:{q:'雷·查尔斯1954年的《I Got a Woman》，旋律和感觉来自什么？',o:['一首福音歌曲','一首乡村歌曲','一首百老汇歌曲','一首非洲民歌'],a:0,e:'它改编自福音歌《It Must Be Jesus》。把教会的唱腔放进情歌，就是“灵魂乐”这个名字的由来：有灵魂的世俗音乐。'}
},
{
  id:'soul', yr:'1963', years:'1955 – 1970', title:'灵魂乐与民权', sub:'把教会唱进排行榜，把歌声带上街头', view:'us',
  story:[
    '福音歌手们开始“跨界”。1957年山姆·库克离开灵魂激动者，唱情歌《You Send Me》登上排行榜第一；1964年他写下《A Change Is Gonna Come》，后来成了民权运动的颂歌。灵魂乐本质上就是“世俗化的福音”：一样的呼应、嘶吼、转音、vamp和升调，只是唱的对象从上帝变成了爱情、骄傲和自由。',
    '每座城市有自己的声音：底特律的摩城（1959）精致、流行，打进了白人主流市场；孟菲斯的Stax粗粝、带着南方教会的味道；阿拉巴马小镇马斯尔肖尔斯的录音室，成了艾瑞莎事业的转折点；芝加哥的柯蒂斯·梅菲尔德把福音写进《People Get Ready》。',
    '音乐和运动是同一件事。游行和集会上唱的是改编过的灵歌和福音：《We Shall Overcome》就来自一首1900年的福音圣歌。1963年华盛顿大游行，马哈莉雅·杰克逊在金博士演讲前献唱；演讲中她在他身后喊：“Tell them about the dream, Martin!” 1968年金在孟菲斯遇刺前，最后的嘱托是让乐手在当晚集会上演奏多尔西的《Precious Lord》。几天后，马哈莉雅在他的葬礼上唱了这首歌。'
  ],
  law:[
    {y:'1955',t:'罗莎·帕克斯拒绝让座，蒙哥马利公交抵制运动开始，持续381天。',k:'turn'},
    {y:'1963',t:'约25万人参加华盛顿大游行，金发表《我有一个梦想》。',k:'turn'},
    {y:'1964',t:'《民权法》：禁止公共场所种族隔离和就业歧视。',k:'good'},
    {y:'1965',t:'塞尔玛游行遭暴力镇压后，《投票权法》通过，联邦监督南方选举。',k:'good'},
    {y:'1968',t:'金在孟菲斯遇刺；同年《公平住房法》通过。',k:'bad'}
  ],
  music:[
    {n:'灵魂乐 = 世俗化的福音',d:'把教会唱腔原封不动地搬进流行歌。',lab:'call'},
    {n:'嘶吼与尖叫',d:'詹姆斯·布朗、威尔逊·皮克特直接继承了硬福音四重唱的唱法。',lab:'growl'},
    {n:'升调',d:'一次次升高，把情绪推到顶点。',lab:'mod'},
    {n:'自由之歌 Freedom Songs',d:'把灵歌和福音的歌词改成“自由”，在游行、监狱和教会里唱。',lab:'call'},
    {n:'Vamp',d:'奥蒂斯·雷丁的结尾就是教会里的vamp。',lab:'vamp'}
  ],
  people:[
    {n:'艾瑞莎·富兰克林 Aretha Franklin',d:'“灵魂歌后”。生于孟菲斯，在底特律父亲的教会里长大，14岁录下第一张福音专辑。1967年的《Respect》成为民权和女权的双重颂歌。',c:'detroit'},
    {n:'山姆·库克 Sam Cooke',d:'第一批从福音跨界的巨星，也是最早自己开唱片公司的黑人歌手之一。',c:'chicago'},
    {n:'梅维斯·斯泰普斯 Mavis Staples',d:'斯泰普斯歌手团的主唱。父亲“Pops”为塞尔玛游行者写了《Freedom Highway》。',c:'chicago'},
    {n:'詹姆斯·布朗 James Brown',d:'“灵魂教父”。《Say It Loud – I’m Black and I’m Proud》（1968）。',c:'augusta'},
    {n:'奥蒂斯·雷丁 Otis Redding',d:'Stax的代表，佐治亚人，牧师的儿子。',c:'memphis'},
    {n:'贝里·戈迪 Berry Gordy',d:'1959年用借来的800美元创办摩城唱片。',c:'detroit'},
    {n:'范妮·卢·哈默 Fannie Lou Hamer',d:'密西西比的佃农和投票权斗士，总是用《This Little Light of Mine》开始集会。',c:'delta'}
  ],
  listen:[
    {t:'Sam Cooke — A Change Is Gonna Come（1964）',n:'民权运动的颂歌'},
    {t:'Aretha Franklin — Respect（1967）',n:'呼应、嘶吼、合唱团式伴唱'},
    {t:'The Staple Singers — Freedom Highway（1965）',n:'为塞尔玛游行而写'},
    {t:'The Impressions — People Get Ready（1965）',n:'福音意象 + 灵魂乐'},
    {t:'Otis Redding — Try a Little Tenderness（1966）',n:'结尾是vamp的教科书'},
    {t:'James Brown — Say It Loud – I’m Black and I’m Proud（1968）',n:'呼应变成了口号'}
  ],
  films:[
    {t:'灵魂之夏 Summer of Soul',y:'2021',n:'1969年哈莱姆文化节。马哈莉雅和梅维斯合唱《Precious Lord》的一段必看'},
    {t:'灵魂歌后 Respect',y:'2021',n:'珍妮弗·哈德森饰演艾瑞莎'},
    {t:'塞尔玛 Selma',y:'2014',n:'1965年塞尔玛到蒙哥马利的游行'},
    {t:'追梦女郎 Dreamgirls',y:'2006',n:'以摩城和至上女声组合为原型'}
  ],
  cities:['detroit','memphis','muscleshoals','augusta','chicago','montgomery','selma','washington','harlem'],
  routes:[
    {f:'selma',t:'montgomery',k:'free',w:3,l:'塞尔玛游行（1965）',c:0.6,lo:[0,44]},
    {f:'memphis',t:'detroit',k:'music',w:2,c:0.2},
    {f:'detroit',t:'muscleshoals',k:'music',w:2,l:'艾瑞莎南下录音（1967）',c:0.25}
  ],
  layer:{legend:[{k:'clay',l:'1965《投票权法》下全州受联邦监督'},{k:'gold',l:'灵魂乐唱片重镇所在州'}],states:Object.assign(
    Object.fromEntries(['Alabama','Georgia','Louisiana','Mississippi','South Carolina','Virginia'].map(s=>[s,'clay'])),
    Object.fromEntries(['Michigan','Tennessee','Illinois'].map(s=>[s,'gold'])))},
  quiz:{q:'1963年华盛顿大游行上，谁在马丁·路德·金身后喊出“Tell them about the dream, Martin!”？',o:['马哈莉雅·杰克逊','艾瑞莎·富兰克林','妮娜·西蒙','梅维斯·斯泰普斯'],a:0,e:'马哈莉雅是金最信任的歌手。五年后，她在金的葬礼上唱了他生前最后请求的那首《Precious Lord》。'}
},
{
  id:'modern', yr:'1972', years:'1969 – 今天', title:'当代福音与主流', sub:'从《Oh Happy Day》到流行天后', view:'us',
  story:[
    '1969年，奥克兰的埃德温·霍金斯歌手团在伯克利一座教堂里录的《Oh Happy Day》意外打进美国流行榜前五，拿下格莱美，“当代福音”从此开始。福音开始吸收放克、R&B、爵士，后来还有嘻哈。1972年，艾瑞莎回到教会，在洛杉矶瓦茨区的新圣殿传道浸信会，和詹姆斯·克利夫兰、合唱团一起录下现场专辑《Amazing Grace》，成为她一生最畅销的专辑。',
    '底特律的克拉克姐妹把转音推到了极限，她们的runs几乎是今天所有R&B歌手的教科书。惠特尼·休斯顿在纽瓦克新希望浸信会的唱诗班长大；碧昂丝在休斯顿的教会唱诗班长大。主流流行乐里的高音、转音、即兴ad-lib、合唱团式和声，几乎都来自黑人教会。1990年代，柯克·富兰克林把嘻哈节奏和福音合唱放在一起，《Stomp》（1997）登上了MTV。',
    '同时还出现了“新大迁徙”：从1970年代起，许多黑人家庭从北方城市回流南方，亚特兰大、休斯顿、达拉斯、夏洛特成了新的黑人文化和福音中心。'
  ],
  law:[
    {y:'1983',t:'国会设立马丁·路德·金纪念日（1986年首次放假）。',k:'good'},
    {y:'2008',t:'奥巴马当选第一位黑人总统。',k:'good'},
    {y:'2013',t:'谢尔比县诉霍尔德案：最高法院取消《投票权法》的联邦监督范围公式。',k:'bad'},
    {y:'2020',t:'乔治·弗洛伊德遇害，“黑人的命也是命”运动席卷全国。',k:'turn'},
    {y:'2021',t:'六月节成为联邦法定假日。',k:'good'}
  ],
  music:[
    {n:'当代福音',d:'现代和声、放克贝斯、大型唱诗班，和流行乐几乎没有界限。'},
    {n:'Runs 转音',d:'克拉克姐妹 → 惠特尼、玛丽亚·凯莉 → 碧昂丝和今天的R&B。',lab:'melisma'},
    {n:'唱诗班升调',d:'一次又一次升调的唱诗班高潮。',lab:'mod'},
    {n:'嘻哈福音与新灵魂乐',d:'柯克·富兰克林、劳伦·希尔、D’Angelo把教会、灵魂乐和嘻哈连在一起。',lab:'vamp'}
  ],
  people:[
    {n:'埃德温·霍金斯 Edwin Hawkins',d:'《Oh Happy Day》（1969），当代福音的起点。',c:'oakland'},
    {n:'安德烈·克劳奇 Andraé Crouch',d:'洛杉矶的创作人，把流行和放克带进福音，后来为迈克尔·杰克逊、麦当娜编排唱诗班。',c:'losangeles'},
    {n:'克拉克姐妹 The Clark Sisters',d:'底特律，母亲马蒂·莫斯·克拉克是COGIC的音乐领袖。转音技巧影响了几代歌手。',c:'detroit'},
    {n:'惠特尼·休斯顿 Whitney Houston',d:'母亲西茜·休斯顿是福音和伴唱歌手。她把教会的力量和控制带进了流行乐。',c:'newark'},
    {n:'柯克·富兰克林 Kirk Franklin',d:'把嘻哈和福音合唱结合，让福音重新吸引年轻人。',c:'fortworth'},
    {n:'碧昂丝 Beyoncé',d:'在休斯顿的圣约翰联合卫理公会唱诗班长大。',c:'houston'}
  ],
  listen:[
    {t:'The Edwin Hawkins Singers — Oh Happy Day（1969）',n:'当代福音的起点'},
    {t:'Aretha Franklin — Amazing Grace（1972）',n:'整张现场专辑都值得反复听，福音唱腔的百科全书'},
    {t:'The Clark Sisters — You Brought the Sunshine（1981）',n:'学转音必听'},
    {t:'Andraé Crouch — Soon and Very Soon（1976）',n:'当代福音赞美诗'},
    {t:'Whitney Houston — I Love the Lord（1996）',n:'电影《传教士的妻子》原声'},
    {t:'Kirk Franklin — Stomp（1997）',n:'嘻哈福音'},
    {t:'Lauryn Hill & Tanya Blount — His Eye Is on the Sparrow',n:'《修女也疯狂2》里的经典段落'}
  ],
  films:[
    {t:'奇异恩典 Amazing Grace',y:'2018',n:'1972年艾瑞莎教会录音的纪录片，做福音专辑的人必看'},
    {t:'修女也疯狂2 Sister Act 2',y:'1993',n:'年轻的劳伦·希尔，福音唱诗班 + 流行'},
    {t:'传教士的妻子 The Preacher’s Wife',y:'1996',n:'惠特尼·休斯顿主演，原声是最畅销的福音专辑之一'}
  ],
  cities:['oakland','losangeles','detroit','newark','fortworth','houston','atlanta','chicago','harlem'],
  routes:[
    {f:'chicago',t:'atlanta',k:'free',w:2.5,l:'新大迁徙：回流南方',c:-0.15},
    {f:'detroit',t:'atlanta',k:'free',w:2.5,c:0.12},
    {f:'harlem',t:'atlanta',k:'free',w:2.5,c:0.15}
  ],
  layer:{legend:[{k:'blue',l:'新大迁徙中黑人人口增长最多的南方州'}],states:Object.fromEntries(['Georgia','Texas','North Carolina','Florida','Maryland'].map(s=>[s,'blue']))},
  quiz:{q:'哪个组合的“转音”（runs）被称为当代R&B歌手的教科书？',o:['克拉克姐妹 The Clark Sisters','至上女声 The Supremes','天命真女 Destiny’s Child','菲斯克欢庆歌手 Fisk Jubilee Singers'],a:0,e:'克拉克姐妹来自底特律的COGIC家庭。很多流行天后都公开说自己是听她们学唱的。'}
}
];

const STATE_ZH = {'Alabama':'阿拉巴马','Alaska':'阿拉斯加','Arizona':'亚利桑那','Arkansas':'阿肯色','California':'加利福尼亚','Colorado':'科罗拉多','Connecticut':'康涅狄格','Delaware':'特拉华','District of Columbia':'华盛顿特区','Florida':'佛罗里达','Georgia':'佐治亚','Hawaii':'夏威夷','Idaho':'爱达荷','Illinois':'伊利诺伊','Indiana':'印第安纳','Iowa':'艾奥瓦','Kansas':'堪萨斯','Kentucky':'肯塔基','Louisiana':'路易斯安那','Maine':'缅因','Maryland':'马里兰','Massachusetts':'马萨诸塞','Michigan':'密歇根','Minnesota':'明尼苏达','Mississippi':'密西西比','Missouri':'密苏里','Montana':'蒙大拿','Nebraska':'内布拉斯加','Nevada':'内华达','New Hampshire':'新罕布什尔','New Jersey':'新泽西','New Mexico':'新墨西哥','New York':'纽约州','North Carolina':'北卡罗来纳','North Dakota':'北达科他','Ohio':'俄亥俄','Oklahoma':'俄克拉何马','Oregon':'俄勒冈','Pennsylvania':'宾夕法尼亚','Rhode Island':'罗得岛','South Carolina':'南卡罗来纳','South Dakota':'南达科他','Tennessee':'田纳西','Texas':'得克萨斯','Utah':'犹他','Vermont':'佛蒙特','Virginia':'弗吉尼亚','Washington':'华盛顿州','West Virginia':'西弗吉尼亚','Wisconsin':'威斯康星','Wyoming':'怀俄明'};

const STATE_NOTES = {
  'Mississippi':'三角洲蓝调的故乡，大迁徙最大的出发地之一。',
  'Louisiana':'新奥尔良：刚果广场、爵士的诞生地，马哈莉雅·杰克逊的家乡。诺瑟普在这里被奴役12年。',
  'Illinois':'芝加哥：福音音乐的首都。多尔西、马哈莉雅、斯泰普斯一家。',
  'Michigan':'底特律：摩城、艾瑞莎、克拉克姐妹、怀南斯家族。',
  'Tennessee':'孟菲斯（Stax、COGIC总部、金遇刺地）和纳什维尔（菲斯克欢庆歌手）。',
  'Georgia':'多尔西、詹姆斯·布朗、雷·查尔斯、奥蒂斯·雷丁的故乡。亚特兰大是今天的“黑人麦加”。',
  'Alabama':'蒙哥马利公交抵制、塞尔玛游行，马斯尔肖尔斯录音室。',
  'South Carolina':'查尔斯顿是北美最大的奴隶港口；海岛上的嘎勒人保留了环形呼喊。1740年禁鼓令。',
  'Virginia':'1619年首批非洲人上岸；里士满是第二大奴隶市场；纳特·特纳起义。',
  'Maryland':'哈丽特·塔布曼和弗雷德里克·道格拉斯的出生地。',
  'Pennsylvania':'费城：第一个独立黑人教派AME的诞生地，地下铁路的重要一站。',
  'New York':'哈莱姆文艺复兴、阿波罗剧院。诺瑟普是纽约州的自由人。',
  'Texas':'1865年加尔维斯顿“六月节”。灵魂激动者、碧昂丝、柯克·富兰克林。',
  'California':'1906年阿苏萨街复兴；《Oh Happy Day》；艾瑞莎的《Amazing Grace》现场录音。',
  'Arkansas':'修女罗塞塔·撒普的出生地。',
  'Missouri':'拉格泰姆的故乡；德雷德·斯科特案。',
  'New Jersey':'惠特尼·休斯顿和西茜·休斯顿的纽瓦克。',
  'District of Columbia':'1963年华盛顿大游行；诺瑟普在这里被绑架。',
  'Ohio':'地下铁路的重要通道，许多逃亡者越过俄亥俄河获得自由。',
  'North Carolina':'大迁徙中许多人沿东海岸去了纽约和费城；今天又是回流南方的热门目的地。'
};
