import React from 'react';
import {acting} from './motion';

const p = {ink:'#121927', deep:'#202a3e', shade:'#33415a', blue:'#4e6380', edge:'#8194ab', pale:'#bdc7ce', ivory:'#ebe4ce', white:'#fff3da', gold:'#caac7d', rust:'#a37656', brown:'#705849', leaf:'#637d78'};

const PixelBobtail: React.FC<{frame:number}> = ({frame}) => {
  const a=acting(frame);
  const dy=a.head>.6?1:0;
  const eye=a.eye>.5?-1:0;
  return <g>
    <path d="M8 80H108V84H4V82H8Z" fill="#655e56"/>
    <path d="M38 38H84V40H96V44H104V52H108V68H104V74H96V78H25V74H20V62H24V50H30V44H38Z" fill={p.pale}/>
    <path d="M40 39H81V42H93V46H101V55H102V66H97V71H30V68H25V58H30V49H40Z" fill={p.ivory}/>
    <path d="M72 40H84V42H94V46H101V56H98V67H90V72H77V67H81V57H76V50H72Z" fill={p.rust}/>
    <path d="M90 47H100V53H104V62H100V68H93V63H89V57H90Z" fill={p.shade}/>
    <path d="M104 61H111V63H114V70H111V73H104V70H102V64H104Z" fill={p.ink}/>
    <path d="M28 66H42V75H38V81H11V79H8V75H12V73H27Z" fill={p.ivory}/>
    <path d="M13 74H31V72H37V76H34V78H11V76H13Z" fill={p.white}/>
    <path d="M18 78v3m5-3v3" stroke="#a9aba4"/>
    <path d="M79 69H96V71H104V77H101V81H78V79H75V75H79Z" fill={p.ivory}/>
    <path d="M81 72H95V74H101V77H79V75H81Z" fill={p.white}/>
    <path d="M89 78v3m5-3v3" stroke="#a9aba4"/>
    <g transform={`translate(0 ${dy})`}>
      <path d="M8 13H11V9H15V11H19V15H23V19H39V16H43V12H47V9H51V12H53V31H56V40H54V49H50V54H43V57H21V55H14V51H8V44H5V32H8Z" fill={p.ivory}/>
      <path d="M8 14H11V11H15V14H19V18H23V24H19V30H12V36H8V31Z" fill={p.rust}/>
      <path d="M40 20H44V16H48V12H51V31H54V39H48V36H44V29H40Z" fill={p.ink}/>
      <path d="M11 16H14V19H17V24H13V27H11Z" fill="#d6b2a0"/>
      <path d={`M48 ${17-Math.round(a.ear)}h2v12h-4v-6h2Z`} fill="#a6a1a4"/>
      <path d="M24 21H35V23H40V29H44V39H49V44H45V49H39V52H22V49H16V43H12V38H19V30H24Z" fill={p.white}/>
      {a.lids>.4?<g fill={p.leaf}><path d="M16 36H26V41H18V40H16ZM37 36H47V40H45V42H37Z"/><path d={`M${20+eye} 36h2v6h-2ZM${40+eye} 36h2v6h-2Z`} fill={p.ink}/><path d="M18 36h2v1h-2m20 0h2v1h-2" fill={p.white}/></g>:<path d="M16 39H26M37 40H47" stroke={p.shade}/>}
      <path d="M28 44H35V46H33V48H30V46H28Z" fill="#b29187"/><path d="M32 48v3h-4m4 0h4" stroke="#8d8f8a" fill="none"/>
      <path d="M5 44H19M3 48H18M43 44H59M44 48H61" stroke="#a6ada4" strokeWidth="1"/>
      <path d="M11 14v13M22 20H35" stroke={p.white}/>
    </g>
  </g>;
};

const PixelBack = () => <g>
  <path d="M7 82H66V86H3V84H7Z" fill={p.ink}/>
  <path d="M55 72H72V70H76V62H80V72H77V77H71V80H57Z" fill={p.blue}/>
  <path d="M62 73H66V80H62M73 70H78V73H73" fill={p.shade}/>
  <path d="M17 47H48V51H54V62H58V77H54V82H14V78H10V68H12V56H17Z" fill="#84909c"/>
  <path d="M31 49H44V55H48V67H50V78H46V81H32Z" fill="#647589"/>
  <path d="M27 53h4v22h-4m-10-18h6v5h-6m24-7h5v7h-5" fill={p.shade}/>
  <path d="M13 23V5H16V7H20V10H24V14H41V12H45V8H49V6H52V25H56V39H53V46H48V50H22V48H15V43H10V27H13Z" fill="#a3a5a0"/>
  <path d="M35 15H43V12H47V9H50V27H54V38H51V44H46V47H36Z" fill="#718398"/>
  <path d="M15 10H18V14H22V20H18V23H15ZM47 14H50V25H45V20H43V18H47Z" fill={p.blue}/>
  <path d="M27 14h4v16h-4m8-15h4v15h-4M11 30h12v4H11m2 6h12v4H13M44 30h11v4H44m-1 9h9v3h-9" fill={p.shade}/>
  <path d="M50 8h2v17h3v14h-2v5h-4v3h-5" stroke={p.pale} fill="none"/>
</g>;

export const PixelVlog: React.FC<{frame:number}> = ({frame}) => <svg viewBox="0 0 320 180" width="100%" height="100%" shapeRendering="crispEdges">
  <rect width="320" height="180" fill="#c9c3aa"/>
  <path d="M0 0H103V124H0Z" fill="#a9ae98"/>
  <path d="M9 0V122M39 0V122M70 0V122M101 0V122M0 34H103M0 70H103M0 108H103" stroke="#d1c8af" strokeWidth="2"/>
  <rect x="135" width="166" height="113" fill="#788d88"/><rect x="139" width="158" height="105" fill="#91a9aa"/>
  <path d="M139 61H297V106H139Z" fill="#b7c3b6"/>
  <path d="M259 19h11v3h4v4h3v10h-3v4h-4v3h-11v-3h-4v-4h-3V26h3v-4h4Z" fill="#e8dec0"/>
  <path d="M148 99v-5h6v-7h6v-7h6v-7h6v-8h6v-8h6v-7h6v-8h6v-6h5v6h6v8h6v7h6v8h6v8h6v7h6v7h6v7h6v5Z" fill="#809b9c"/>
  <path d="M182 57v-7h8v-9h6v-6h5v8h6v8h7v6h-8v-3h-7v4h-6v-5h-5v4Z" fill="#d6ddc9"/>
  <path d="M219 96v-4h7v-4h9v-4h8v-4h8v-4h9v-4h8v4h9v4h8v4h10v4h3v17h-79Z" fill="#5d7a7f"/>
  <path d="M232 94v11m20-20v20m20-21v21m18-12v12" stroke="#a1afa1" strokeWidth="2"/>
  <path d="M217 0V107M137 66H299" stroke="#657f7e" strokeWidth="3"/>
  <path d="M219 0V107M137 68H299" stroke="#e0d4b9"/>
  <path d="M132 109H305V115H132Z" fill="#919c89"/>
  <path d="M0 124H320V180H0Z" fill="#839182"/>
  <path d="M17 93H21V89H25V101H21v9h-4ZM33 78H38V72H44V81H41V86H36v18h-3ZM45 99H50V93H57V104H52V108H45Z" fill="#58746b"/>
  <path d="M33 89v40M21 104h4v8h8m2 3h11v-8" fill="none" stroke="#4f6c67" strokeWidth="2"/>
  <path d="M20 123H51V143H48V148H24V143H21Z" fill="#aa9474"/><path d="M21 123H50V127H21Z" fill="#637368"/>
  <path d="M56 132H280V136H288V140H297V145H307V151H319V165H28V161H36V153H42V145H50V137H56Z" fill="#bca27d"/>
  <path d="M28 165H319V171H28Z" fill="#7f7562"/><path d="M57 144H282M49 156H305" stroke="#d1b88e"/>
  <path d="M106 81H234V85H237V135H101V84H106Z" fill={p.shade}/>
  <path d="M109 84H232V131H105V88H109Z" fill="#547b81"/><path d="M109 84H230V89H217V94H205V99H194V104H180V109H165V114H150V119H135V124H108Z" fill="#688c8d"/>
  <path d="M101 134H237V138H243V141H249V145H255V148H262V153H80V148H85V144H91V140H96V137H101Z" fill="#b8c4c0"/>
  {Array.from({length:4},(_,r)=>Array.from({length:17},(_,c)=><rect key={`${r}-${c}`} x={106+c*7-r*4} y={137+r*3} width="5" height="2" fill="#5d7b80"/>))}
  <path d="M145 149H186V151H145Z" fill="#7b9597"/>
  <g transform="translate(96 71)"><PixelBobtail frame={frame}/></g>
  <path d="M35 151H53V159H51V162H37V159H35Z" fill="#e1d8bd"/><path d="M36 150H52V153H36Z" fill="#698370"/>
  <rect y="163" width="320" height="17" fill="#253a44"/>
  <text x="160" y="175" textAnchor="middle" fontFamily="Yu Gothic, Microsoft YaHei, sans-serif" fontSize="9" fontWeight="600" fill="#fff3da" shapeRendering="auto">ここが、いちばん暖かい。</text>
</svg>;

export const PixelRoom: React.FC = () => <svg viewBox="0 0 480 270" width="100%" height="100%" shapeRendering="crispEdges">
  <defs><pattern id="pdither" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#788498" opacity=".09"/></pattern></defs>
  <rect width="480" height="270" fill={p.deep}/>
  <path d="M0 0H206V182H0Z" fill="#30394a"/><path d="M206 0H258V170H206Z" fill="#293347"/>
  <path d="M0 185H75V181H156V177H237V173H318V169H399V165H480V270H0Z" fill="#344059"/>
  <path d="M0 219H85V215H170V211H255V207H340V203H425V199H480M80 182v25h-5v27h-5v36m183-98v28h5v25h5v25h5v20m102-103v22h15v24h15v24h15v24h8v9" fill="none" stroke="#42516b"/>
  <rect x="24" y="20" width="116" height="137" fill="#0e192b"/><rect x="28" y="24" width="108" height="126" fill="#59718b"/>
  <path d="M28 24H136V71H28Z" fill="#344967"/><path d="M28 71H136V93H28Z" fill="#455d77"/>
  <path d="M99 44h9v3h3v9h-3v3h-9v-3h-3v-9h3Z" fill="#c3cece"/>
  <path d="M105 44h5v3h2v9h-5v-3h-4v-6h2Z" fill="#344967"/>
  <path d="M28 124v-5h8v-9h8v-7h8v7h7v7h9v-8h7v-11h7v-13h8v13h7v10h7v10h7v-7h8v-9h8v9h9v39H28Z" fill="#344b61"/>
  <path d="M28 139h10v-3h12v-4h12v6h12v4h11v-10h15v3h14v-7h11v5h11v17H28Z" fill="#203849"/>
  <path d="M79 24V153M27 88H137" stroke="#8494a3" strokeWidth="2"/>
  <rect x="18" y="16" width="133" height="3" fill="#8393a3"/>
  <path d="M18 19H46V29H45V66H43V114H41V155H16V135H17V86H18ZM121 19H150V51H152V91H154V133H156V156H129V116H127V76H124V43H121Z" fill="#596376"/>
  <path d="M24 21H27V152H23V89H24M36 21H39V113H37V152H34V89H36M130 21H133V73H136V122H138V152H134V123H132V74H130M142 21H145V73H148V122H151V152H147V124H145V75H142" fill="#727b88"/>
  <path d="M160 58H188V60H191V71H194V83H197V96H200V103H153V96H155V83H157V71H160Z" fill="#8f8276"/>
  <path d="M163 60H186V70H189V82H192V94H195V100H157V95H160V81H162Z" fill="#dbca9f"/>
  <path d="M168 61V100M176 61V100M184 65V100" stroke="#b7a789"/>
  <path d="M175 105h2v86h-2m-10 1h23v2h-23" fill="#9c978e"/>
  <path d="M161 106H190V128H196V151H203V179H149V151H154V128H161Z" fill="#b4a183" opacity=".09"/>
  <rect x="427" y="27" width="35" height="48" fill="#8393a4"/><rect x="429" y="29" width="31" height="44" fill="#bbc3bd"/>
  <path d="M433 69v-8h5v-9h5v-7h6v8h5v16Z" fill="#788d8e"/><rect x="436" y="36" width="6" height="6" fill="#a8987f"/>
  <path d="M194 220H431V223H441V226H436V229H200V227H192Z" fill={p.ink}/>
  <path d="M207 171H423V168H435V171H440V175H446V179H421V182H358V185H289V188H196V184H199V180H203V175H207Z" fill="#8d9caa"/>
  <path d="M196 188H289V185H358V182H421V179H446V213H415V216H350V219H283V222H196Z" fill="#536782"/>
  <path d="M205 193H283V219H205ZM316 191H381V215H316ZM383 185H438V211H383Z" fill="#293c55"/>
  {Array.from({length:14},(_,i)=><rect key={i} x={209+i*5} y={193} width="1" height="24" fill="#6e819b"/>)}
  <path d="M310 190v28m71-32v29m-171 7v14h-3v-14m225-10v13h3v-13" stroke="#8193a7"/>
  <path d="M260 162v8h-3v4m122-12v6h3v3" stroke={p.ink} strokeWidth="3"/>
  <rect x="412" y="165" width="15" height="7" fill={p.ink}/><rect x="424" y="167" width="1" height="1" fill="#92c6ac"/>
  <path d="M208 170H222V174H208" fill={p.ivory}/>
  <path d="M214 233H365V230H373V235H383V241H394V249H405V260H184V255H193V247H205V238H214Z" fill="#58687d"/>
  <path d="M216 238H365V236H369V242H382V250H393V255H202V249H210V242H216Z" fill="#697b8d"/><path d="M219 240H361V239H367V244H379V248H386V252H209V249H216V244H219Z" fill="#58687d"/>
  <path d="M65 164H128V170H161V175H178V200H186V248H55V186H61V170H65Z" fill="#61738d"/>
  <path d="M69 168H125V174H157V179H174V199H169V202H60V185H66Z" fill="#78879c"/>
  <g transform="translate(103 109)"><PixelBack/></g>
  <path d="M56 190H97V194H135V198H174V202H188V206H192V260H186V270H52V245H50V201H53V194H56Z" fill="#4e6584"/>
  <path d="M55 195H96V199H134V203H173V207H187V212H54Z" fill="#8598ab"/>
  <path d="M53 212H94V216H133V220H178V224H186V267H53Z" fill="#59718e"/>
  <path d="M44 200H53V204H60V214H62V242H65V270H42V238H40V208H44ZM184 201H196V207H201V223H205V249H209V260H194V270H189V233H186Z" fill="#3b526f"/>
  <path d="M77 212H105V216H125V241H128V270H81V250H79Z" fill="#b7b6a9"/>
  <path d="M79 221H125M80 230H126M81 240H127M83 251H128M83 261H128" stroke="#74838c" strokeWidth="2"/>
  <rect width="480" height="270" fill="url(#pdither)"/>
</svg>;

const PixelFace: React.FC<{frame:number}> = ({frame}) => {
  const a=acting(frame,true);
  const turn=Math.round(a.head*2),eye=Math.round(a.eye*2);
  return <g>
    <path d="M21 135H90V139H98V143H17V139H21Z" fill={p.ink}/>
    <path d="M36 73H76V79H83V90H88V105H91V124H95V135H24V126H27V104H30V89H36Z" fill="#829098"/>
    <path d="M62 77H76V83H81V101H86V129H90V135H65Z" fill="#5d7189"/>
    <path d="M44 81H69V90H72V96H68V102H64V108H59V114H54V107H49V101H44V94H40V88H44Z" fill="#c8c9b9"/>
    <path d="M32 90h10v5H32m-3 7h11v5H29m48-10h7v5h-7m1 7h8v5h-8" fill={p.shade}/>
    <path d="M34 117H47V130H50V139H27V135H31V125H34ZM69 117H82V130H86V139H63V133H68Z" fill="#a4ada9"/>
    <path d="M33 135v4m5-4v4m31-4v4m5-4v4" stroke="#5d7189"/>
    <g transform={`translate(${turn} 0)`}>
      <path d="M19 38V8H23V10H27V14H32V18H36V23H45V21H64V23H74V19H79V15H83V11H88V9H92V38H96V44H100V60H96V70H91V77H82V82H72V86H44V83H34V80H27V75H22V69H17V57H14V45H17V38Z" fill="#a6ada7"/>
      <path d="M65 23H74V20H79V16H84V12H89V40H94V47H97V59H94V69H88V75H81V80H72V83H63Z" fill="#798d9e"/>
      <path d="M22 14H26V19H31V24H36V30H27V36H23Z" fill="#c5b7a8"/>
      <path d="M85 20H89V37H80V30H76V27H81V23H85Z" fill="#a8a7a5"/>
      <path d="M45 23H49V35H53V31H57V39H61V31H65V36H69V24H73V43H64V40H61V46H56V40H51V43H45Z" fill={p.shade}/>
      <path d="M17 48H31V52H17M20 61H34V65H20M85 48H98V52H85M83 63H93V67H83" fill={p.shade}/>
      <path d="M38 64H50V62H65V64H79V68H82V76H77V80H69V83H46V80H36V76H32V69H38Z" fill="#cfcebb"/>
      {a.lids>.4?<>
        <path d="M30 48H45V50H49V57H46V60H34V58H31Z" fill="#aabca7"/><path d="M67 49H82V52H85V58H81V61H70V58H67Z" fill="#aabca7"/>
        <path d={`M${38+eye*2} 49h3v12h-3ZM${74+eye*2} 50h3v12h-3Z`} fill={p.ink}/><path d="M39 49h2v2h-2m36 1h2v2h-2" fill={p.white}/>
        <path d="M30 47H44V49H49M66 48H80V50H85" stroke={p.shade} fill="none"/>
      </>:<path d="M31 56H47M68 57H84" stroke={p.shade} strokeWidth="2"/>}
      <path d="M52 65H64V68H61V72H56V69H52Z" fill="#b89b92"/><path d="M58 72v5h-6m6 0h6" stroke="#738189" fill="none"/>
      <path d="M9 66H29V68H37M6 74H25V73H37M78 69H96V66H111M79 74H96V76H113" stroke="#dedccc" fill="none"/>
      <path d="M24 11v23M27 16h3M89 12h3v26h4v6h3v16h-3v10h-5v6h-9v5h-9" stroke="#d0d9cf" fill="none"/>
      <rect x="42" y="68" width="1" height="1" fill="#8d9694"/><rect x="45" y="72" width="1" height="1" fill="#8d9694"/><rect x="72" y="72" width="1" height="1" fill="#8d9694"/>
    </g>
  </g>;
};

export const PixelReaction: React.FC<{frame:number}> = ({frame}) => <svg viewBox="0 0 480 270" width="100%" height="100%" shapeRendering="crispEdges">
  <rect width="480" height="270" fill={p.deep}/><rect x="24" y="20" width="108" height="130" fill="#4e647e"/><rect x="78" y="20" width="3" height="130" fill="#8192a4"/>
  <path d="M21 16H49V150H21ZM113 16H139V155H120V99H117Z" fill="#414f65"/>
  <path d="M96 105H112V99H132V102H161V106H190V110H219V114H248V118H277V122H306V131H314V208H321V270H91V161H94Z" fill="#607894"/>
  <path d="M103 110H126V107H154V111H184V115H213V119H242V123H271V127H300V132" stroke="#8e9dad" fill="none"/>
  <path d="M168 236H225V230H291V233H317V241H334V270H161Z" fill="#8492a2"/>
  <g transform="translate(167 30) scale(1.58)"><PixelFace frame={frame}/></g>
  <path d="M89 198H96V193H106V199H113V210H119V231H125V252H132V270H95V239H91Z" fill="#4c6684"/>
  <path d="M376 5H410V22H415V50H422V79H429V111H437V145H445V181H453V218H461V254H468V270H419V242H414V213H407V181H400V149H393V119H387V88H381V58H376Z" fill="#101b2e"/>
  <path d="M376 6V58h5v30h6v31h6v30h7v32h7v32h7v29h5v28" stroke="#a9bfcd" fill="none"/>
</svg>;
