//生气、讨厌、害怕、开心、平淡、难过、惊讶
//需要返回leixing，pingfen，pingyu
//根据最久表情（排除平淡表情）判断视频类型，分别为令人气愤，不喜欢，恐怖，搞笑，伤感，悬疑
//如果平淡占总时长百分百，类型为毫无波澜，评分为1，评语为宠辱不惊,闲看庭前花开花落
//最久表情时长占总时长-平淡时长百分之20以上，评分为1，40-2，60-3，80-4，
//赠语：
//开心：1.随富随贫且欢乐,不开口笑是痴人。 2.春风得意马蹄疾，一日看尽长安花。 3.白日放歌须纵酒，青春作伴好还乡。
//讨厌：1.酒逢知己千杯少，话不投机半句多。
//害怕：1.不敢高声语，恐惊天上人。2.何处投荒初恐惧？谁人绕泽正悲吟？
//生气：1.怒发冲冠，凭栏处、潇潇雨歇。2.并刀昨夜匣中鸣，燕赵悲歌最不平。3.公亦尝闻天子之怒乎？
//难过：1.泪眼问花花不语，乱红飞过秋千去。2.酒入愁肠，化作相思泪。3.秋风秋雨愁煞人！
//惊讶：1.月出惊山鸟，时鸣春涧中。2.独见前闻，不惑於事，见微知著者也。3.停杯投箸不能食，拔剑四顾心茫然。
export function biaoqingpingyu(biaoqing,shipinchangdu){
    console.log(biaoqing,shipinchangdu)
    const kaixin_number=biaoqing.kaixin.shijianshuzu.length;
    const pingdan_number=biaoqing.pingdan.shijianshuzu.length;
    const taoyan_number=biaoqing.taoyan.shijianshuzu.length;
    const haipa_number=biaoqing.haipa.shijianshuzu.length;
    const shengqi_number=biaoqing.shengqi.shijianshuzu.length;
    const jingya_number=biaoqing.jingya.shijianshuzu.length;
    const nanguo_number=biaoqing.nanguo.shijianshuzu.length;
    //判断所有表情时长相加长度等不等于视频长度
    const biaoqing_number=kaixin_number+pingdan_number+taoyan_number+haipa_number+shengqi_number+jingya_number+nanguo_number
    const shipinchangdu_int=Math.floor(shipinchangdu)
    console.log(shipinchangdu_int,biaoqing_number,pingdan_number)
    if(biaoqing_number>=shipinchangdu_int){
        //如果平淡占总时长百分百，类型为毫无波澜，评分为1，评语为宠辱不惊,闲看庭前花开花落
if(pingdan_number==shipinchangdu_int){
    return {leixing:"毫无波澜",pingfen:1,pingyu:"宠辱不惊,闲看庭前花开花落"}
}

const maxvalue = Math.max(
    kaixin_number,
    jingya_number,
    nanguo_number,
    shengqi_number,
    taoyan_number,
    haipa_number
  );

  if(kaixin_number==maxvalue){
    const ping=(kaixin_number/Math.floor(shipinchangdu))*5;
    const pingfen=roundFun(ping,1)

    const pingyushuzu=['随富随贫且欢乐,不开口笑是痴人。','春风得意马蹄疾，一日看尽长安花。','白日放歌须纵酒，青春作伴好还乡。']
    const number=2//诗句个数
    const suiji=Math.floor(Math.random()*(number-0+1)+0) 
    return {leixing:"搞笑",pingfen:pingfen,pingyu:pingyushuzu[suiji]}
    
  }
  if(jingya_number==maxvalue){
    const ping=(jingya_number/Math.floor(shipinchangdu))*5;
    const pingfen=roundFun(ping,1)
    const pingyushuzu=['月出惊山鸟，时鸣春涧中。','独见前闻，不惑於事，见微知著者也。','停杯投箸不能食，拔剑四顾心茫然']
    const number=2
    const suiji=Math.floor(Math.random()*(number-0+1)+0) 
    return {leixing:"悬疑",pingfen:pingfen,pingyu:pingyushuzu[suiji]}
  }
  
  if(nanguo_number==maxvalue){
    const ping=(nanguo_number/Math.floor(shipinchangdu))*5;
    const pingfen=roundFun(ping,1)
    const pingyushuzu=['泪眼问花花不语，乱红飞过秋千去。','酒入愁肠，化作相思泪。','秋风秋雨愁煞人！']
    const number=2
    const suiji=Math.floor(Math.random()*(number-0+1)+0) 
    return {leixing:"伤感",pingfen:pingfen,pingyu:pingyushuzu[suiji]}
    
  }
  if(shengqi_number==maxvalue){
    const ping=(shengqi_number/Math.floor(shipinchangdu))*5;
    const pingfen=roundFun(ping,1)
    const pingyushuzu=['怒发冲冠，凭栏处、潇潇雨歇。','并刀昨夜匣中鸣，燕赵悲歌最不平。','公亦尝闻天子之怒乎？']
    const number=2
    const suiji=Math.floor(Math.random()*(number-0+1)+0) 
    return {leixing:"伤感",pingfen:pingfen,pingyu:pingyushuzu[suiji]}
    
  }
  
  if(taoyan_number==maxvalue){
    const ping=(taoyan_number/Math.floor(shipinchangdu))*5;
    const pingfen=roundFun(ping,1)
    const pingyushuzu=['酒逢知己千杯少，话不投机半句多']
    // const number=2
    // const suiji=Math.floor(Math.random()*(number-0+1)+0) 
    return {leixing:"不喜欢",pingfen:pingfen,pingyu:pingyushuzu}
    
  }
  if(haipa_number==maxvalue){
    const ping=(haipa_number/Math.floor(shipinchangdu))*5;
    const pingfen=roundFun(ping,1)
    const pingyushuzu=['不敢高声语，恐惊天上人。','何处投荒初恐惧？谁人绕泽正悲吟？']
     const number=1
     const suiji=Math.floor(Math.random()*(number-0+1)+0) 
    return {leixing:"恐怖",pingfen:pingfen,pingyu:pingyushuzu[suiji]}
    
  }
  



    }else{
        return {leixing:"err",pingfen:5,pingyu:"请观看视频时全程开启表情检查"}
    }
 
    return {leixing:"err",pingfen:0,pingyu:"未知错误"}
 }



 function roundFun(value, n) {
    return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
  }