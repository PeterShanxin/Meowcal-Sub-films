export const cats = [
  {name:'栗子',breed:'狸花猫',lang:'zh-CN',region:'china',source:'买了猫窝，住了纸箱。',fur:'#a6ada7',shadow:'#798d9e',patch:'#33415a',eyes:'#aabca7'},
  {name:'Momo',breed:'日本短尾猫',lang:'ja-JP',region:'japan',source:'ここが、いちばん暖かい。',fur:'#ebe4ce',shadow:'#bdc7ce',patch:'#a37656',eyes:'#637d78'},
  {name:'Bori',breed:'韩国短毛猫',lang:'ko-KR',region:'korea',source:'분명 방금 채웠는데.',fur:'#e5d9bf',shadow:'#b8b7a8',patch:'#ba8357',eyes:'#768d79'},
  {name:'Bean',breed:'英国短毛猫',lang:'en-US',region:'britain',source:'The box was the actual gift.',fur:'#8c9ead',shadow:'#60758f',patch:'#455c75',eyes:'#d4b26e'},
  {name:'Bleu',breed:'沙特尔猫',lang:'fr-FR',region:'france',source:'Cette place est déjà prise.',fur:'#7895a6',shadow:'#4e6c87',patch:'#3d586f',eyes:'#dba65e'},
  {name:'Fritz',breed:'German Rex',lang:'de-DE',region:'germany',source:'Das Kissen gehört jetzt mir.',fur:'#d3b89d',shadow:'#a28f86',patch:'#8e796c',eyes:'#97ad8f'},
] as const;

export const pairs = [
  {source:3,viewer:0,target:'zh-CN',text:'原来，纸箱才是真正的礼物。'},
  {source:3,viewer:4,target:'fr-FR',text:'Le vrai cadeau, c’était le carton.'},
  {source:2,viewer:5,target:'de-DE',text:'Es war doch gerade noch voll.'},
] as const;

export type PixelShot = {id:string;from:number;duration:number;kind:string;label:string;sample:number;viewer?:number;source?:number;pair?:number};
