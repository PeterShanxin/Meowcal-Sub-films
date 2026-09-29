import React from 'react';
import {acting} from './motion';

export const FurDefs = () => <defs>
  <linearGradient id="ivory" x1=".1" y1="0" x2=".8" y2="1"><stop stopColor="#fff8e8"/><stop offset=".5" stopColor="#e6dece"/><stop offset="1" stopColor="#a7b1ba"/></linearGradient>
  <linearGradient id="tabby" x1=".1" y1=".2" x2=".9" y2=".7"><stop stopColor="#d5b797"/><stop offset=".42" stopColor="#a18b79"/><stop offset="1" stopColor="#536274"/></linearGradient>
  <linearGradient id="chest" x2=".6" y2="1"><stop stopColor="#eee2cc"/><stop offset="1" stopColor="#a49f9b"/></linearGradient>
  <linearGradient id="inkfur" x2="1" y2="1"><stop stopColor="#3e495a"/><stop offset="1" stopColor="#19212f"/></linearGradient>
  <linearGradient id="copper" x2=".8" y2="1"><stop stopColor="#c48a5c"/><stop offset="1" stopColor="#805c4b"/></linearGradient>
  <radialGradient id="iris"><stop stopColor="#b9c3a5"/><stop offset=".65" stopColor="#90a994"/><stop offset="1" stopColor="#52695f"/></radialGradient>
</defs>;

const Whiskers: React.FC<{dark?: boolean}> = ({dark = false}) => <g stroke={dark ? '#6b7180' : '#ece3d0'} opacity=".7" strokeWidth="1.2" fill="none" strokeLinecap="round">
  <path d="M117 139Q76 126 48 133M117 145Q78 142 53 151M117 150Q86 152 65 165M185 139Q227 125 249 132M186 145Q224 139 252 147M184 151Q221 151 241 164"/>
</g>;

/** The keyboard and all four contact points stay fixed while the neck settles. */
export const CeramicBobtail: React.FC<{frame: number}> = ({frame}) => {
  const a = acting(frame);
  return <g>
    <ellipse cx="241" cy="261" rx="200" ry="18" fill="#232f3a" opacity=".24"/>
    <path d="M282 124C342 96 402 128 408 189C411 227 377 251 318 251H137C88 251 78 222 108 193C150 155 214 133 282 124Z" fill="url(#ivory)" transform={`translate(0 252) scale(1 ${1 + a.breath}) translate(0 -252)`}/>
    <path d="M285 126C349 100 397 133 397 180C389 217 350 237 321 238C295 211 313 170 285 126Z" fill="url(#copper)"/>
    <path d="M352 136C380 140 397 162 397 187C390 204 370 218 349 223C336 200 348 178 335 160Z" fill="url(#inkfur)"/>
    <path d="M272 174C286 193 273 215 250 239" fill="none" stroke="#9d9e9a" strokeWidth="2" opacity=".6"/>
    <path d="M376 205Q406 198 417 220Q428 240 408 248Q390 253 379 239" fill="url(#inkfur)"/>
    <path d="M293 229C329 214 365 223 367 246Q370 260 351 261H286Q275 254 293 229Z" fill="url(#ivory)"/>
    <path d="M332 246v10m11-11v12" stroke="#a0a7aa" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M144 185C170 191 179 217 165 249Q156 263 130 263H84C63 261 67 244 84 239L117 232L120 197Z" fill="url(#ivory)"/>
    <path d="M93 249l-1 10m13-10v11" stroke="#9da4a6" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M180 188Q199 218 184 245Q180 256 165 260" fill="none" stroke="#b4b5af" strokeWidth="2"/>
    <g transform={`rotate(${a.head * 5} 166 199)`}>
      <path d="M80 101C75 76 68 36 81 17C105 20 131 48 144 66Q167 63 187 70C208 38 229 26 241 35C247 57 240 87 232 111C243 134 234 165 215 177L220 183L206 182C182 209 124 209 96 187L85 190L87 177C56 156 60 123 80 101Z" fill="url(#ivory)"/>
      <path d="M80 100C75 68 75 40 82 22C109 30 130 54 142 70L126 116L106 130L84 125Z" fill="url(#copper)"/>
      <path d="M184 71C207 42 230 29 239 37Q246 79 232 111L207 123L192 102Z" fill="url(#inkfur)"/>
      <path d="M84 32L94 88L122 71Q102 44 84 32Z" fill="#d2a99d"/>
      <g transform={`rotate(${-a.ear * 8} 213 94)`}><path d="M232 44Q213 55 199 78L224 95Z" fill="#9b9298"/><path d="M229 52L205 79L222 86" fill="#c3a8a7"/></g>
      <path d="M73 121L85 113M70 131L82 124M224 126L236 120M228 135L238 129" stroke="#fff7e8" strokeWidth="1.2" opacity=".8"/>
      <g transform={`translate(${a.eye * -3} 0)`}>
        {[112,193].map((x,i)=><g key={x} transform={`translate(${x} ${123+i*2}) scale(1 ${Math.max(.06,a.lids)})`}>
          <path d="M-20 0Q-6-13 15-3Q16 10 0 11Q-14 10-20 0" fill="url(#iris)" stroke="#56605f" strokeWidth="1.5"/>
          <ellipse cx="-1" cy="1" rx="3.6" ry="10" fill="#16212c"/><circle cx="-5" cy="-4" r="2.1" fill="#fff8e6"/>
        </g>)}
      </g>
      <path d="M92 119Q108 111 126 119M174 120Q190 114 207 122" fill="none" stroke="#576168" strokeWidth="2" strokeLinecap="round"/>
      <path d="M117 148C126 134 142 137 150 144C160 138 177 139 185 151C179 168 162 169 151 160C136 169 123 163 117 148Z" fill="#f4eee0"/>
      <path d="M141 143Q152 139 162 144L152 153Z" fill="#bc9994"/><path d="M152 153v7m0-1q-7 7-13 4m13-4q6 7 13 3" fill="none" stroke="#827e7f" strokeWidth="1.3"/>
      <path d="M131 145h1m3 8h1m-9 0h1m43-7h1m4 8h1m-8-1h1" stroke="#b1aba5" strokeWidth="2" strokeLinecap="round"/>
      <Whiskers dark/>
      <path d="M79 21Q72 57 81 99M88 180Q114 203 146 202" fill="none" stroke="#fff9ed" strokeWidth="2" opacity=".8"/>
    </g>
  </g>;
};

export const CeramicViewerBack: React.FC<{frame:number}> = ({frame}) => {
  const a = acting(frame);
  return <g>
    <ellipse cx="190" cy="330" rx="136" ry="21" fill="#080c17" opacity=".5"/>
    <path d="M196 284C290 355 385 324 358 252" fill="none" stroke="#667386" strokeWidth="28" strokeLinecap="round"/>
    <path d="M302 326l6-25m22 14l-6-25m28 4l-23-12" stroke="#333d51" strokeWidth="10"/>
    <path d="M93 181Q178 145 254 187C279 207 297 296 270 328Q180 361 77 326C51 297 68 231 93 181Z" fill="url(#tabby)"/>
    <path d="M176 195Q198 250 181 325M134 206Q151 230 148 248M221 210Q212 237 220 260" stroke="#485365" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <g transform={`rotate(${a.head * -1.5} 177 207)`}>
      <path d="M82 119C67 84 65 31 78 21Q111 31 134 69Q178 54 219 74Q246 28 269 31Q282 73 267 126C290 164 269 203 237 215Q172 245 102 213C65 195 52 157 82 119Z" fill="url(#tabby)"/>
      <path d="M80 30L98 103L128 74Z" fill="#798290"/><path d="M225 77L263 40L257 115Z" fill="#8a9cad"/>
      <path d="M148 63L163 135L173 62M187 63L196 127L212 71M74 137L121 155L73 166M86 184L129 184L108 206M275 142L240 157L276 171M263 195L230 191L245 214" fill="#3e4a5e" opacity=".85"/>
      <path d="M268 35Q283 84 267 126Q295 174 259 202" fill="none" stroke="#c4d8ee" strokeWidth="3"/>
      <path d="M73 131L62 129M70 145L56 143M273 138L284 133M277 148L288 143" stroke="#b3bdc5" strokeWidth="1.3"/>
    </g>
    <path d="M79 320Q148 339 222 329" fill="none" stroke="#b0b5b8" strokeWidth="2" opacity=".35"/>
  </g>;
};

export const CeramicViewerFace: React.FC<{frame:number}> = ({frame}) => {
  const a = acting(frame,true);
  return <g>
    <ellipse cx="162" cy="355" rx="130" ry="19" fill="#0b1020" opacity=".4"/>
    <path d="M105 187C55 225 54 288 44 350Q151 379 267 350C254 264 244 218 211 192Z" fill="url(#tabby)"/>
    <path d="M126 216L108 254L132 248L117 278L143 267L158 301L180 268L206 279L193 250L214 247L194 216Z" fill="url(#chest)"/>
    <path d="M87 233L107 248M74 259L100 269M229 244L208 257M241 273L218 284" stroke="#455063" strokeWidth="10" strokeLinecap="round"/>
    <path d="M82 291L73 342Q64 359 93 361H120Q134 357 124 342L123 293M191 293L187 342Q178 359 205 361H234Q252 356 239 342L229 293" fill="url(#tabby)"/>
    <path d="M91 347v10m12-10v12m106-12v11m12-10v10" stroke="#4c5664" strokeWidth="1.5"/>
    <g transform={`rotate(${a.head * 6.5} 161 218)`}>
      <path d="M63 110Q49 73 57 25Q62 15 76 25Q110 44 129 70Q163 62 196 72Q222 36 248 25Q260 25 259 43L250 115C271 148 255 184 233 203L239 207L224 207Q159 243 98 207L83 208L89 199C52 177 43 140 63 110Z" fill="url(#tabby)"/>
      <path d="M64 33L74 102L117 76Q89 47 64 33Z" fill="#a49393"/><path d="M69 42L80 89L105 76Z" fill="#cfb0a8"/>
      <g transform={`rotate(${-a.ear * 7} 228 101)`}><path d="M244 37L207 77L240 110Z" fill="#a8a7ac"/><path d="M242 48L217 79L237 95Z" fill="#c7b8b3"/></g>
      <path d="M129 70L137 113L150 88L163 119L176 89L188 113L197 74L179 78L165 91L152 77Z" fill="#475365"/>
      <path d="M57 136L91 145L60 152M63 169L99 172L76 186M257 139L223 147L254 154M245 180L214 177L232 195" fill="#404e61"/>
      <path d="M98 170Q125 151 154 169Q183 150 214 175L213 195Q160 230 103 197Z" fill="url(#chest)"/>
      {[110,202].map((x,i)=><g key={x} transform={`translate(${x} ${137+i*1}) scale(1 ${Math.max(.05,a.lids)})`}>
        <path d="M-23 0Q-3-18 20-3Q21 14-2 15Q-18 12-23 0" fill="url(#iris)" stroke="#414f5b" strokeWidth="2"/>
        <ellipse cx={2+a.eye*6} cy="1" rx="4.6" ry="14" fill="#182431"/><path d="M1-3h5" stroke="#eff8ff" strokeWidth="3" strokeLinecap="round"/><circle cx="11" cy="8" r="1.5" fill="#d9e6e5"/>
      </g>)}
      <path d="M85 125Q103 116 125 125M181 125Q202 115 222 128" stroke="#445264" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M142 172Q157 167 172 173L158 184Z" fill="#ad8e8d"/><path d="M145 173Q157 169 169 174" stroke="#dac0b8" strokeWidth="1.3" fill="none"/>
      <path d="M158 183v11m0-1q-9 8-18 4m18-4q8 9 17 4" fill="none" stroke="#6a737c" strokeWidth="1.4" strokeLinecap="round"/>
      <g transform="translate(5 29)"><Whiskers/></g>
      <path d="M119 179h1m9 9h1m-15 1h1m72-8h1m-5 9h1m11-1h1" stroke="#8e9498" strokeWidth="2" strokeLinecap="round"/>
      <path d="M258 40L250 114Q273 153 249 182" fill="none" stroke="#d6e8fa" strokeWidth="2.5"/>
      <path d="M100 205Q120 219 145 222M77 33L94 47" fill="none" stroke="#e7d3b6" strokeWidth="1.4" opacity=".7"/>
      <path d="M68 115l-5 4m8 3l-7 5m7 6l-5 3m177-12l6 4m-6 3l6 5m-9 3l6 4M129 202l3 4m5-4l3 5m6-3l2 4m20-5l-1 4m7-6l-1 4" fill="none" stroke="#e4ded1" strokeWidth=".9" opacity=".55"/>
    </g>
  </g>;
};
