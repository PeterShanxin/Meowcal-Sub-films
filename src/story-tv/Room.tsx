import React from 'react';
import {Bobtail, SeatedTabby} from './Cats';

export const TVVlog: React.FC<{frame:number}> = ({frame}) => <svg viewBox="0 0 1200 675" width="100%" height="100%">
  <defs><linearGradient id="vlog-wall" x2="0" y2="1"><stop stopColor="#d0c5a8"/><stop offset="1" stopColor="#a29a81"/></linearGradient><linearGradient id="vlog-floor" x2="0" y2="1"><stop stopColor="#aa9774"/><stop offset="1" stopColor="#6b715d"/></linearGradient></defs>
  <rect width="1200" height="675" fill="url(#vlog-wall)"/>
  <rect x="600" y="46" width="510" height="360" fill="#8bafa9"/>
  <circle cx="910" cy="150" r="65" fill="#dfddba"/>
  <path d="M586 379L775 157L964 379Z" fill="#577a7f"/><path d="M733 209L775 157L818 209L777 193Z" fill="#bec9ba"/>
  <path d="M600 341L733 295L862 339V407H600ZM835 356L982 283L1120 346V407H835Z" fill="#405d61"/>
  <path d="M584 35H1123V411H584ZM755 44V400M933 44V400M593 236H1111" fill="none" stroke="#5b6558" strokeWidth="17"/>
  <path d="M0 455H1200V675H0Z" fill="url(#vlog-floor)"/>
  <path d="M0 532H1200M0 626H1200M122 455L42 675M416 455L393 675M742 455L785 675M1020 455L1110 675" stroke="#586350" strokeWidth="4" opacity=".65"/>
  <path d="M0 26H492V433H0Z" fill="#cbbea0"/>
  <path d="M78 15V440M217 15V440M363 15V440M0 134H485M0 271H485M0 416H485" stroke="#9b937a" strokeWidth="6"/>
  <path d="M83 442C41 408 20 351 42 288M81 441C142 416 176 365 159 316" stroke="#445d46" strokeWidth="10" fill="none"/>
  <path d="M42 331Q-6 314 14 283Q61 274 62 322M56 382Q-7 372 10 338Q61 331 78 365M127 371Q168 302 192 333Q201 383 133 391" fill="#49644b"/>
  <path d="M36 442H151L139 535H58Z" fill="#a36e50"/>
  <path d="M297 443L943 450L1080 551L177 542Z" fill="#766651"/>
  <path d="M177 542L1080 551V570L175 561Z" fill="#504f42"/>
  <path d="M263 559L242 650M987 568L1010 650" stroke="#505040" strokeWidth="23"/>
  <path d="M489 376L835 376L857 488L462 487Z" fill="#283d40"/>
  <path d="M480 386L824 386L840 473L474 472Z" fill="#506d6a"/>
  <path d="M462 487L857 488L922 530L410 529Z" fill="#b0b6a3"/>
  {Array.from({length:4},(_,r)=>Array.from({length:12},(_,c)=><path key={`${r}-${c}`} d={`M${477+c*28-r*10} ${490+r*8}h21l4 5h-22Z`} fill="#596d68"/>))}
  <g transform={`translate(${418+Math.min(1,frame/250)*58} 213) scale(1.18)`}><Bobtail frame={frame}/></g>
  <path d="M0 591H1200V675H0Z" fill="#172d30" opacity=".22"/>
  <text x="600" y="633" textAnchor="middle" fill="#f7f2df" stroke="#1a3033" strokeWidth="3" paintOrder="stroke" fontFamily="Yu Gothic, Microsoft YaHei, sans-serif" fontSize="40" fontWeight="600">ここが、いちばん暖かい。</text>
</svg>;

export const LivingRoom: React.FC<{frame:number}> = ({frame}) => <svg viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="room-wall" x1="0" y1="0" x2="1" y2=".5"><stop stopColor="#385052"/><stop offset=".48" stopColor="#263d42"/><stop offset="1" stopColor="#142b34"/></linearGradient>
    <linearGradient id="floor" x2="0" y2="1"><stop stopColor="#334345"/><stop offset="1" stopColor="#172f35"/></linearGradient>
    <radialGradient id="lamp-glow"><stop stopColor="#e6b577" stopOpacity=".48"/><stop offset="1" stopColor="#d1a265" stopOpacity="0"/></radialGradient>
    <linearGradient id="curtain"><stop stopColor="#395553"/><stop offset=".5" stopColor="#48635c"/><stop offset="1" stopColor="#2d4545"/></linearGradient>
    <linearGradient id="sofa" x2=".2" y2="1"><stop stopColor="#a16c55"/><stop offset=".5" stopColor="#795240"/><stop offset="1" stopColor="#513e37"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#room-wall)"/>
  <path d="M0 700L1920 635V1080H0Z" fill="url(#floor)"/>
  <path d="M0 700L1920 635M770 675L223 1080M1120 662L1300 1080M1440 650L1910 1020M0 878L1920 799" fill="none" stroke="#9aa596" strokeWidth="2" opacity=".14"/>
  <rect x="142" y="85" width="440" height="483" rx="90" fill="#152c36" stroke="#607166" strokeWidth="14"/>
  <path d="M151 424L201 330L256 389L313 267L417 391L454 302L574 399V557H151Z" fill="#345661"/>
  <path d="M150 483L214 454L288 476L354 426L428 473L511 433L575 456V557H150Z" fill="#1b3c48"/>
  <circle cx="477" cy="200" r="33" fill="#acc5b6" opacity=".8"/>
  <path d="M359 92V563M151 337H574" stroke="#586c63" strokeWidth="12"/>
  <path d="M112 66L236 74Q195 341 222 601L100 626Z" fill="url(#curtain)"/><path d="M493 74L619 54L664 614L542 591Q553 334 493 74Z" fill="url(#curtain)"/>
  <path d="M139 98L118 584M196 111L177 574M545 94L582 568M580 95L621 575" stroke="#203b3c" strokeWidth="5" opacity=".35"/>
  <ellipse cx="649" cy="381" rx="314" ry="444" fill="url(#lamp-glow)"/>
  <path d="M663 398L653 729M609 735H705" stroke="#a58c65" strokeWidth="9" strokeLinecap="round"/>
  <path d="M611 268H714L750 420Q656 445 570 415Z" fill="#d7bd8e"/>
  <path d="M592 414Q659 433 734 418" stroke="#f6dbaa" strokeWidth="8"/>
  <rect x="1734" y="84" width="97" height="158" rx="3" fill="#94886c" transform="rotate(4 1780 160)"/>
  <path d="M1750 221V116H1809V221Z" fill="#314a4a"/><circle cx="1777" cy="152" r="17" fill="#ba9670"/>
  <ellipse cx="1260" cy="829" rx="560" ry="107" fill="#0e242d" opacity=".45"/>
  <path d="M827 634L1693 607L1748 679L781 718Z" fill="#ad936c"/>
  <path d="M781 718L1748 679V829L783 862Z" fill="#735f49"/>
  <path d="M807 737L1250 720V836L807 848ZM1272 719L1718 703V807L1272 833Z" fill="#5e5545" stroke="#988166" strokeWidth="4"/>
  <path d="M832 857L817 909M1694 831L1714 882" stroke="#473f33" strokeWidth="17"/>
  <path d="M1040 601L1014 655M1505 593L1536 637" stroke="#172e33" strokeWidth="15"/>
  <path d="M1030 203L1440 199L1700 714L824 756Z" fill="#dceac0" opacity=".035"/>
  <rect x="1574" y="632" width="68" height="35" rx="5" fill="#283c40" stroke="#839187" strokeWidth="2"/><circle cx="1630" cy="649" r="3" fill="#bbd2b1"/>
  <path d="M960 851L1464 827L1690 1043L723 1069Z" fill="#63736a" opacity=".6"/>
  <path d="M1000 866L1439 845L1620 1026L793 1048Z" fill="none" stroke="#9c9a7b" strokeWidth="5" opacity=".4"/>
  <g transform="translate(410 489) scale(1.18)"><SeatedTabby frame={frame}/></g>
  <path d="M224 779Q209 729 262 721L690 749Q754 751 775 784L801 1018L179 1098Z" fill="url(#sofa)"/>
  <path d="M224 779Q499 746 760 811" fill="none" stroke="#bb8565" strokeWidth="6"/>
  <path d="M170 801Q209 773 244 813L270 1043L146 1080Z" fill="#735040"/><path d="M716 796Q744 754 795 789L849 1038L741 1057Z" fill="#865b45"/>
  <path d="M284 862Q466 800 621 871L647 1047L316 1070Z" fill="#314b4c"/>
  <path d="M342 830L353 1047M390 822L404 1045M444 817L462 1044M495 823L514 1040M550 832L575 1040" stroke="#648075" strokeWidth="8" opacity=".55"/>
</svg>;
