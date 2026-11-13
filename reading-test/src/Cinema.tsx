import {ease} from './design';

/** Original two-colour noir illustration. Time is held during the reading test. */
export const Cinema = ({time=0,payoff=false}:{time?:number;payoff?:boolean}) => {
  const breath = Math.sin(time*.65)*3;
  const bill = payoff ? ease(time,0,1.1) : 0;
  return <svg viewBox="0 0 1080 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{display:'block'}}>
    <defs>
      <pattern id="hatch" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)"><path d="M0 0V11" stroke="#f3e8cc" strokeWidth="1" opacity=".11"/></pattern>
      <clipPath id="scene"><rect width="1080" height="1000"/></clipPath>
    </defs>
    <g clipPath="url(#scene)">
      <rect width="1080" height="1000" fill="#193b40"/>
      <circle cx="559" cy="315" r="203" fill="#e8cf92"/>
      <path d="M0 0H180V570L0 730Z M980 0H1080V1000H930V450H980Z" fill="#102d34"/>
      <path d="M0 780L1080 580V1000H0Z" fill="#102d34"/>
      <path d="M705 0H790V600H705Z" fill="#285156"/>
      <path d="M710 70H775V229H710Z M710 265H775V424H710Z" fill="#b4a071" opacity=".5"/>
      <path d="M187 0H205V666H187Z M182 156H270" stroke="#668477" strokeWidth="3"/>
      <path d="M145 180Q230 84 304 180Z" fill="#122c30"/>
      <path d="M183 180L64 640H424L270 180Z" fill="#e4d7ad" opacity=".075"/>
      {Array.from({length:32},(_,i)=>{const x=(i*137+25)%1080;const y=(i*79+time*68)%1020-40;return <path key={i} d={`M${x} ${y}l-7 29`} stroke="#c2d6bf" strokeWidth="1.6" opacity=".2"/>;})}
      <g transform={`translate(0 ${breath})`}>
        <path d="M-90 1010L32 686Q123 613 255 625L381 702L451 1000Z" fill="#c84638"/>
        <path d="M256 625L329 656L413 1000H276L195 728Z" fill="#8d302c"/>
        <path d="M183 525L260 508L293 659L248 710L180 634Z" fill="#dcad80"/>
        <path d="M80 306Q59 196 186 159Q297 133 339 236L326 354L369 395L332 414L327 462Q330 505 280 527L191 507L111 446Z" fill="#f0c995"/>
        <path d="M72 328Q20 196 155 141Q288 93 339 205L333 263Q251 237 192 282Q216 419 181 489L128 529L44 486Z" fill="#17292d"/>
        <path d="M75 284Q77 199 166 177Q265 155 299 208Q222 185 180 214Q122 242 75 284Z" fill="#284045"/>
        <path d="M279 341Q301 328 322 338" stroke="#17292d" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M288 353H321" stroke="#17292d" strokeWidth="4"/>
        <ellipse cx="312" cy="355" rx="5" ry="7" fill="#17292d"/>
        <path d="M318 450L334 445" stroke="#a34030" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="194" cy="427" r="12" fill="#d7ac56"/>
        <path d="M80 682L160 627L237 749L184 790L226 824L158 1000H38Z" fill="#e75a44"/>
        <path d="M20 733L102 696" stroke="#f0b280" strokeWidth="2" opacity=".5"/>
      </g>
      <g transform={`translate(0 ${-breath*.6})`}>
        <path d="M620 1000L644 726Q741 650 875 673L1090 840V1000Z" fill="#cdbb95"/>
        <path d="M762 609L837 600L867 698L781 753L721 691Z" fill="#c99b71"/>
        <path d="M719 263Q808 216 868 318L856 474L873 558L800 629L710 570L690 483L648 463L683 431L681 339Z" fill="#e2b684"/>
        <path d="M677 327L654 268Q711 191 799 213Q911 232 910 368L879 532L834 515L824 364L766 299Z" fill="#17292d"/>
        <path d="M708 257Q783 204 852 280L873 330L822 299L794 254Z" fill="#344348"/>
        <path d="M687 388L721 378" stroke="#192d31" strokeWidth="7" strokeLinecap="round"/>
        <path d="M689 401L716 399" stroke="#192d31" strokeWidth="4"/>
        <ellipse cx="694" cy="402" rx="5" ry="7" fill="#17292d"/>
        <path d="M692 530L718 535" stroke="#8f5544" strokeWidth="5" strokeLinecap="round"/>
        <path d="M738 663L784 749L857 686L829 839L894 1000H702L724 819L680 778Z" fill="#e9ddbd"/>
        <path d="M768 754L794 758L791 809L816 1000H763L760 812Z" fill="#263f40"/>
        <path d="M643 734L713 703L686 801L719 858L652 1000H593Z" fill="#ac9c7d"/>
      </g>
      <g transform={`translate(${(1-bill)*100} ${(1-bill)*310}) rotate(${-10+bill*10} 620 800)`} opacity={bill}>
        <path d="M851 960L719 824L673 807L637 835L697 888L744 1000Z" fill="#cdbb95"/>
        <path d="M721 829L693 779L642 751L595 776L623 824L673 851Z" fill="#e2b684"/>
        <g transform="rotate(-14 616 744)"><rect x="544" y="681" width="177" height="99" rx="3" fill="#b5c6a5"/><rect x="554" y="691" width="157" height="79" rx="2" fill="none" stroke="#617a66" strokeWidth="2"/><text x="633" y="751" textAnchor="middle" fontFamily="Georgia" fontSize="53" fill="#3c5f50">20</text><path d="M566 710V750M698 710V750" stroke="#6d8d71" strokeWidth="4"/></g>
        <path d="M688 781L663 758Q646 751 640 762Q642 774 667 793" fill="#e2b684"/>
      </g>
      <rect width="1080" height="1000" fill="url(#hatch)"/>
      <path d="M0 945Q530 900 1080 945V1000H0Z" fill="#102b31" opacity=".4"/>
    </g>
  </svg>;
};
