import React from 'react';

export const SeatedTabby: React.FC<{frame: number}> = ({frame}) => {
  const turn = Math.sin(frame / 75) * 2;
  return <g>
    <path d="M66 243C13 298 64 370 211 363C332 357 340 291 286 240Z" fill="#8b583e"/>
    <path d="M252 310C369 364 417 276 362 236" fill="none" stroke="#a16b46" strokeWidth="30" strokeLinecap="round" transform={`rotate(${Math.sin(frame/43)*3} 266 303)`}/>
    <g transform={`rotate(${turn} 178 229)`}>
      <path d="M80 162L74 55Q83 44 140 98Q190 84 226 99Q272 37 283 53L279 164C310 210 278 271 197 284C91 289 40 226 80 162Z" fill="#b67f51"/>
      <path d="M78 62L111 140L139 102M229 103L254 144L280 63" fill="#80523e"/>
      <path d="M144 97L157 162L173 92M188 92L197 156L212 94" fill="#5c4437"/>
      <path d="M70 181L118 198L63 206M69 217L116 228L83 244M284 176L252 190L293 204M292 222L250 232L279 245" fill="#624637"/>
      <path d="M85 63L82 153M278 63L277 155C301 201 284 232 264 249" fill="none" stroke="#eac39a" strokeOpacity=".75" strokeWidth="4"/>
    </g>
    <path d="M111 286Q154 273 177 287L168 335M211 287Q228 320 219 348" fill="none" stroke="#684835" strokeWidth="13" strokeLinecap="round"/>
  </g>;
};

export const Bobtail: React.FC<{frame:number}> = ({frame}) => {
  const settle=Math.max(0,Math.min(1,(frame-260)/160));
  const blink=frame%220>210;
  return <g transform={`translate(0 ${settle*24})`}>
    <ellipse cx="187" cy="246" rx="135" ry="23" fill="#423b35" opacity=".17"/>
    <path d={`M71 166C85 97 222 83 290 140C334 173 314 ${235-settle*12} 255 240L100 239C55 234 38 209 71 166Z`} fill="#dfd9c7"/>
    <path d="M196 111Q258 100 289 139L276 214L211 220Q171 160 196 111Z" fill="#b37542"/>
    <path d="M225 138Q279 134 296 159L279 217L232 210Z" fill="#333e43"/>
    <path d="M63 165L94 180L79 233Q45 249 24 232L31 211Z" fill="#f0e5ce"/>
    <path d="M256 217Q289 195 318 213L330 234Q291 254 257 241" fill="#f0e5ce"/>
    <circle cx="305" cy="157" r="25" fill="#333e43"/>
    <g transform={`translate(${settle*9} ${settle*7}) rotate(${-settle*9} 88 120)`}>
      <path d="M20 110L15 29Q23 18 68 68L114 65Q145 9 158 22L165 105C189 143 157 188 101 193C42 196 0 165 20 110Z" fill="#f0e5ce"/>
      <path d="M19 33L36 108L77 70Z" fill="#b97943"/>
      <path d="M112 66L154 25L162 105L127 121Z" fill="#333e43"/>
      <path d="M25 45L43 90L61 72M125 72L151 41L151 91" fill="#d5a197"/>
      <path d="M50 119q13-7 23 2M117 118q12-7 23 0" stroke="#443f36" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {!blink&&<><ellipse cx="64" cy="125" rx="5" ry={8-settle*5} fill="#2d3939"/><ellipse cx="129" cy="124" rx="5" ry={8-settle*5} fill="#2d3939"/></>}
      <path d="M89 144L105 144L97 151Z" fill="#ac7870"/>
      <path d="M97 152v7l-7 5m7-5l8 4" stroke="#716153" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M30 148L62 151M29 161L62 158M131 149L166 145M134 158L167 164" stroke="#726b5f" strokeWidth="2"/>
    </g>
  </g>;
};

export const TabbyCloseup: React.FC<{frame:number}> = ({frame}) => {
  const tilt=Math.min(1,Math.max(0,(frame-30)/100))*8;
  const look=Math.min(1,frame/70)*-4;
  return <g transform={`rotate(${tilt} 320 300)`}>
    <path d="M130 435Q253 377 413 430L475 642L102 642Z" fill="#946344"/>
    <path d="M140 216L108 40Q122 17 242 117Q321 97 410 125L511 21Q530 20 522 233C582 367 494 467 346 479C184 491 64 389 140 216Z" fill="url(#tabby-fur)"/>
    <path d="M122 63L165 219L232 128Z" fill="#80513e"/>
    <path d="M420 135L508 46L498 229Z" fill="#714b3e"/>
    <path d="M255 115L277 235L300 108M335 111L352 224L380 116" fill="#614936" opacity=".88"/>
    <path d="M123 264L210 292L116 312M122 341L207 356L151 388M527 273L464 294L544 320M531 362L464 371L505 405" fill="#604431" opacity=".88"/>
    <path d="M202 373Q242 341 293 375Q331 342 383 374L403 428Q282 494 182 422Z" fill="#d6b590"/>
    <g transform={`translate(${look} 0)`}>
      <path d="M190 298Q220 280 251 303Q222 321 193 310Z" fill="#c5cbac"/>
      <path d="M355 307Q391 286 425 312Q394 331 357 320Z" fill="#c5cbac"/>
      <ellipse cx="209" cy="303" rx="7" ry="14" fill="#233631"/>
      <ellipse cx="377" cy="312" rx="7" ry="16" fill="#233631"/>
      <path d="M197 296L211 295M365 304L379 303" stroke="#e4f5df" strokeWidth="4"/>
    </g>
    <path d="M182 278Q218 268 250 282M353 289Q386 277 421 292" stroke="#5c4533" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M271 376L303 379L285 392Z" fill="#9e6c64"/>
    <path d="M285 393L283 410M282 412q-11 7-21 1" stroke="#635143" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <path d="M116 378L219 394M112 414L220 412M347 403L456 394M351 425L464 439" stroke="#d4b28a" strokeWidth="2.5" opacity=".8"/>
    <path d="M111 42L145 222C79 366 182 456 270 470" fill="none" stroke="#edcfa0" strokeOpacity=".65" strokeWidth="5"/>
  </g>;
};
