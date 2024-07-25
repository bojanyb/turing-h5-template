import nobility from '/@/assets/images/nobility/nobility.png';
import rank from '/@/assets/images/nobility/rank.png';
// 参数 - 贵族说明
const nobilityList = [
  {
    titImg: nobility,
    title: '什么是贵族',
    content: '贵族是平台的特殊身份，贵族分别为：游侠->骑士->子爵->伯爵->公爵->亲王->国王->皇帝->神；',
  },
  {
    titImg: nobility, // 或收到礼物分成
    title: '如何成为贵族？',
    content: '在贵族页面开通贵族后即可成为贵族，享受贵族特权；',
  },
  {
    titImg: nobility,
    title: '如何获得成长值？',
    content:
      '任何用户的充值数量或收到礼物米粒的分成即可额外获得成长值，成长值累计达到对应贵族等级要求即可获得对应贵族称号与特权，1元=100米粒=1成长值；',
  },
  {
    titImg: nobility,
    title: '贵族的升级/降级/保级',
    content: '贵族有效期内，根据成长值自动进行贵族的升级/降级/保级。1元=100米粒=1成长值；',
  },
  {
    title: '升级',
    content: '玩家的成长值达到更高等级的成长值，则贵族等级升级，获得该等级对应的专属特权；',
  },
  {
    title: '降级',
    content:
      '玩家的成长值低于目前达到该等级所需的成长值，则根据玩家当前贵族等级对应衰减值扣除成长值。若成长值低于当前贵族等级标定所需成长值，则降级到对应成长值的贵族等级，获得降级后等级的专属特权；',
  },
  {
    title: '保级',
    content:
      '玩家在30天内达到当前贵族等级要求的保级成长值，即可在接下来的30天周期内保持该等级，继续享用该等级的专属特权。保级特权在升级/降级后失效；',
    contentImg: rank,
  },
];

export default nobilityList;
