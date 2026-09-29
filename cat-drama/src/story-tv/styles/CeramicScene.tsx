import React from 'react';
import {CeramicBobtail, CeramicViewerBack, CeramicViewerFace, FurDefs} from './CeramicCats';

export const CeramicVlog: React.FC<{frame:number}> = ({frame}) => <svg viewBox="0 0 960 540" width="100%" height="100%">
  <defs>
    <linearGradient id="vwall" x2="1" y2=".7"><stop stopColor="#c0b59f"/><stop offset=".7" stopColor="#ded7c7"/><stop offset="1" stopColor="#abb5b6"/></linearGradient>
    <linearGradient id="vsky" x2="0" y2="1"><stop stopColor="#718ea5"/><stop offset="1" stopColor="#e0d4bc"/></linearGradient>
    <linearGradient id="vdesk" x2=".4" y2="1"><stop stopColor="#bb9e78"/><stop offset="1" stopColor="#967b61"/></linearGradient>
    <linearGradient id="vlaptop" x2="1" y2="1"><stop stopColor="#cfdae0"/><stop offset="1" stopColor="#798d9c"/></linearGradient>
    <radialGradient id="vlight"><stop stopColor="#fff2cc" stopOpacity=".32"/><stop offset="1" stopColor="#fff2cc" stopOpacity="0"/></radialGradient>
  </defs>
  <FurDefs/>
  <rect width="960" height="540" fill="url(#vwall)"/>
  <path d="M0 0H334V372H0" fill="#a9a490"/>
  <path d="M20 0V372M126 0V372M232 0V372M332 0V372M0 98H332M0 212H332M0 326H332" stroke="#c7beaa" strokeWidth="6"/>
  <path d="M24 0V368M130 0V368M236 0V368" stroke="#6c776f" opacity=".2"/>
  <rect x="407" y="-20" width="489" height="352" fill="#5d6c72"/>
  <rect x="419" width="465" height="317" fill="url(#vsky)"/>
  <circle cx="785" cy="88" r="36" fill="#eee1c6"/>
  <path d="M446 291L596 116L751 291Z" fill="#899b9d"/><path d="M560 159L596 116L634 160L605 147L589 155L579 148Z" fill="#dae0d6"/>
  <path d="M417 304L484 268L556 298L626 272L698 303L778 239L883 291V320H417Z" fill="#72888b"/>
  <path d="M674 276L776 229L883 276L879 286L775 246L679 286Z" fill="#526b76"/><path d="M710 273V317M760 254V318M810 261V318M860 281V318" stroke="#576f79" strokeWidth="5"/>
  <path d="M415 195H890M650 0V321" stroke="#727c79" strokeWidth="9"/>
  <path d="M415 199H890M654 0V320" stroke="#e0d7c3" strokeWidth="2"/>
  <path d="M401 326H905V340H402Z" fill="#8c8d7c"/><path d="M399 325H907" stroke="#e7deca" strokeWidth="4"/>
  <path d="M650 338L825 338L960 460L293 457Z" fill="#fff3ce" opacity=".16"/>
  <path d="M0 374H960V540H0Z" fill="#7d8278"/><path d="M0 381H960" stroke="#515e5f" strokeWidth="6"/>
  <path d="M66 362Q42 255 108 206M71 337Q130 315 145 265M69 322Q5 286 16 253" stroke="#516764" strokeWidth="4" fill="none"/>
  <path d="M82 252Q65 206 108 201Q126 225 82 252M110 303Q104 264 146 256Q165 289 110 303M36 291Q-3 281 10 247Q49 244 36 291" fill="#587567"/>
  <path d="M29 356Q72 349 116 358L107 418Q72 432 39 419Z" fill="#877965"/><ellipse cx="73" cy="358" rx="44" ry="9" fill="#515d56"/>
  <path d="M148 386L851 376L1002 487L59 504Z" fill="url(#vdesk)"/><path d="M59 504L1002 487V509L61 527Z" fill="#695d52"/>
  <path d="M102 478L890 467M158 422L821 415" stroke="#d1b18a" strokeWidth="1" opacity=".3"/>
  <path d="M314 254L702 254Q708 254 710 262L733 411H289Z" fill="#4d5d67"/>
  <path d="M324 264H697L717 400H301Z" fill="#2e404d"/>
  <path d="M329 269H690L706 388H309Z" fill="#577580"/>
  <path d="M329 269H690L309 388Z" fill="#9db9bd" opacity=".14"/>
  <path d="M289 412H733L807 466Q806 473 797 474H214Q205 473 210 467Z" fill="url(#vlaptop)"/>
  <path d="M306 423H717L762 454H258Z" fill="#566d7b"/>
  {Array.from({length:4},(_,r)=>Array.from({length:15},(_,c)=><path key={`${r}-${c}`} d={`M${313+c*26-r*12} ${425+r*7}h21l7 4h-23Z`} fill="#a5b6be" opacity=".8"/>))}
  <path d="M445 455H553L573 468H428Z" fill="#a4b5bf" stroke="#7b929f"/>
  <path d="M214 475H797" stroke="#dce4e2" strokeWidth="1.5"/>
  <g transform="translate(264 155) scale(1.05)"><CeramicBobtail frame={frame}/></g>
  <path d="M66 444h69l-3 40H72Z" fill="#c9c5b7"/><ellipse cx="101" cy="444" rx="35" ry="9" fill="#e6dfcd"/><ellipse cx="101" cy="444" rx="28" ry="6" fill="#6d7e6f"/>
  <ellipse cx="675" cy="130" rx="370" ry="320" fill="url(#vlight)"/>
  <rect y="491" width="960" height="49" fill="#192631" opacity=".83"/>
  <text x="480" y="525" fontFamily="Yu Gothic, Microsoft YaHei, sans-serif" fontSize="27" fontWeight="600" fill="#f5f7ff" textAnchor="middle">ここが、いちばん暖かい。</text>
</svg>;

export const CeramicRoom: React.FC<{frame:number; reaction?:boolean}> = ({frame,reaction = false}) => <svg viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="cwall" x1="0" y1="0" x2="1" y2=".5"><stop stopColor="#303948"/><stop offset=".4" stopColor="#1c2331"/><stop offset="1" stopColor="#101824"/></linearGradient>
    <linearGradient id="cfloor" x2="0" y2="1"><stop stopColor="#30394a"/><stop offset="1" stopColor="#121a29"/></linearGradient>
    <linearGradient id="cseat" x2=".6" y2="1"><stop stopColor="#697a91"/><stop offset=".55" stopColor="#3c4b63"/><stop offset="1" stopColor="#202d41"/></linearGradient>
    <linearGradient id="ccurtain"><stop stopColor="#333c4b"/><stop offset=".5" stopColor="#4c5560"/><stop offset="1" stopColor="#262e3c"/></linearGradient>
    <linearGradient id="ccabinet" x2="0" y2="1"><stop stopColor="#667383"/><stop offset="1" stopColor="#313e50"/></linearGradient>
    <radialGradient id="cglow"><stop stopColor="#f0d0a1" stopOpacity=".26"/><stop offset="1" stopColor="#f0d0a1" stopOpacity="0"/></radialGradient>
    <radialGradient id="ctvlight"><stop stopColor="#b7d0ea" stopOpacity=".18"/><stop offset="1" stopColor="#b7d0ea" stopOpacity="0"/></radialGradient>
    <linearGradient id="csky" x2="0" y2="1"><stop stopColor="#1f304b"/><stop offset="1" stopColor="#809197"/></linearGradient>
    <filter id="csoft"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <FurDefs/>
  <rect width="1920" height="1080" fill="url(#cwall)"/>
  <path d="M0 740L1920 649V1080H0Z" fill="url(#cfloor)"/>
  <path d="M0 740L1920 649" stroke="#607084" opacity=".28" strokeWidth="3"/>
  <path d="M0 878L1920 787M201 730L0 1080M622 710L534 1080M1050 690L1259 1080M1530 670L1920 1000" stroke="#93a1ad" opacity=".065" strokeWidth="2"/>
  <rect x="100" y="85" width="455" height="529" rx="7" fill="#101927" stroke="#596477" strokeWidth="9"/>
  <rect x="115" y="100" width="425" height="496" fill="url(#csky)"/>
  <circle cx="407" cy="208" r="28" fill="#d0d7d4"/><circle cx="415" cy="199" r="27" fill="#344559"/>
  <path d="M115 493L171 399L225 449L306 328L395 429L465 357L540 459V596H115Z" fill="#344858"/>
  <path d="M115 512L184 489L257 525L331 468L402 517L480 482L540 506V596H115Z" fill="#213648"/>
  <path d="M323 94V601M110 360H545" stroke="#4b596c" strokeWidth="10"/>
  <path d="M75 66H181L175 619L64 645Z" fill="url(#ccurtain)"/><path d="M473 65H592L624 644L506 619Z" fill="url(#ccurtain)"/>
  <path d="M99 78L83 621M141 78L131 614M511 77L538 615M560 77L588 618" stroke="#83909a" opacity=".16" strokeWidth="4"/>
  <path d="M67 65H598" stroke="#7b858f" strokeWidth="8" strokeLinecap="round"/>
  <ellipse cx="695" cy="445" rx="340" ry="415" fill="url(#cglow)"/>
  <path d="M700 387L694 764M652 770Q694 757 738 768" stroke="#a79b85" strokeWidth="6" fill="none" strokeLinecap="round"/>
  <path d="M653 269H741L786 405Q699 430 611 405Z" fill="#b3a58f"/><path d="M652 271H741L772 394Q701 414 625 394Z" fill="#ddd0b7"/>
  {Array.from({length:13},(_,i)=><path key={i} d={`M${655+i*7} 274L${626+i*12} 399`} stroke="#b7a993" opacity=".5"/>)}
  <ellipse cx="701" cy="403" rx="76" ry="10" fill="#f1dfb9"/>
  <rect x="1698" y="107" width="139" height="198" rx="3" fill="#8997a8"/><rect x="1705" y="114" width="125" height="184" fill="#d2d3cd"/>
  <path d="M1719 281L1737 208L1790 162L1815 281Z" fill="#7a8990"/><circle cx="1761" cy="160" r="22" fill="#b4a990"/>
  <path d="M900 182H1620V205H900" fill="#0c1524" opacity=".16"/>
  <ellipse cx="1290" cy="503" rx="602" ry="450" fill="url(#ctvlight)"/>
  <ellipse cx="1270" cy="863" rx="523" ry="75" fill="#0a1222" opacity=".7" filter="url(#csoft)"/>
  <path d="M833 691L1736 654L1788 708L787 753Z" fill="#778491"/>
  <path d="M787 753L1788 708V850L787 897Z" fill="url(#ccabinet)"/>
  <path d="M787 753L1788 708" stroke="#a1adba" strokeWidth="3"/>
  <path d="M826 771L1234 752V864L826 882ZM1255 751L1754 729V831L1255 857Z" fill="#263447" stroke="#768396" strokeWidth="2"/>
  {Array.from({length:21},(_,i)=><path key={i} d={`M${844+i*18} ${774-i*.8}v97`} stroke="#5c6b7d" strokeWidth="3" opacity=".65"/>)}
  <path d="M826 897L812 943M1745 852L1766 897" stroke="#263446" strokeWidth="13"/>
  <path d="M1059 646L1032 695M1501 646L1531 676" stroke="#101927" strokeWidth="12"/>
  <path d="M820 917L1471 867L1713 1067L590 1100Z" fill="#566176" opacity=".36"/>
  <path d="M865 935L1451 893L1625 1044L697 1071Z" fill="none" stroke="#c1c5c8" strokeWidth="3" opacity=".14"/>
  <rect x="1645" y="657" width="59" height="28" rx="5" fill="#151f2f" stroke="#8291a3" strokeWidth="1.5"/><circle cx="1694" cy="669" r="2" fill="#55d699"/>
  <path d="M1680 685Q1697 703 1680 721" fill="none" stroke="#111a29" strokeWidth="3"/>
  <path d="M835 675L894 671L901 688L841 692Z" fill="#c0c9d4"/><path d="M839 669L886 666L894 673L841 677Z" fill="#657788"/>
  {!reaction&&<>
    <path d="M259 663Q257 619 307 628L685 696L748 920L229 963Z" fill="#344259"/>
    <path d="M260 662Q393 635 597 700L642 876L254 929Z" fill="url(#cseat)"/>
    <path d="M444 789Q579 766 727 826L717 936L431 949Z" fill="#596b83"/>
    <g transform="translate(390 433) scale(1.27)"><CeramicViewerBack frame={frame}/></g>
    <path d="M222 745Q215 711 253 716L707 771Q752 776 764 820L793 1048L217 1080Z" fill="url(#cseat)"/>
    <path d="M240 750Q473 749 741 809" stroke="#9da9b7" strokeWidth="3" opacity=".45" fill="none"/>
    <path d="M197 790Q180 738 219 737Q248 735 260 777L297 1080H172ZM735 804Q734 765 769 768Q805 773 813 811L864 1035L770 1064Z" fill="#485c76"/>
    <path d="M299 830L509 854L531 1080H312Z" fill="#aaa89f"/>
    <path d="M310 844L519 871M310 875L522 902M311 906L524 933M314 937L527 964M318 968L529 995M322 999L531 1026" stroke="#666f7b" strokeWidth="5" opacity=".6"/>
  </>}
</svg>;

export const CeramicReaction: React.FC<{frame:number}> = ({frame}) => <>
  <div style={{position:'absolute',inset:-30,filter:'blur(18px)',opacity:.5}}><CeramicRoom frame={0} reaction/></div>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute'}}>
    <FurDefs/>
    <defs><linearGradient id="rsofa" x2=".3" y2="1"><stop stopColor="#61768f"/><stop offset="1" stopColor="#253248"/></linearGradient><radialGradient id="rlight"><stop stopColor="#c8ddf5" stopOpacity=".13"/><stop offset="1" stopColor="#c8ddf5" stopOpacity="0"/></radialGradient></defs>
    <path d="M430 404Q450 351 511 371L1190 447Q1290 455 1299 557L1334 1015L356 1080Z" fill="url(#rsofa)"/>
    <path d="M484 399Q686 401 895 434" stroke="#9facba" strokeWidth="4" opacity=".3" fill="none"/>
    <path d="M702 916Q1024 852 1314 940L1393 1080H618Z" fill="#596e8a"/>
    <g transform="translate(650 108) scale(2.53)"><CeramicViewerFace frame={frame}/></g>
    <path d="M397 793Q361 733 410 714Q460 706 492 782L572 1080H399Z" fill="#526984"/>
    <path d="M1483 35L1740 0L1920 1040L1683 1080Z" fill="#0c1422"/><path d="M1483 35L1683 1080" stroke="#b5cce6" strokeWidth="5" opacity=".5"/>
    <ellipse cx="1437" cy="546" rx="650" ry="700" fill="url(#rlight)"/>
  </svg>
</>;
