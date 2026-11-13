import {Easing, interpolate, Img, staticFile} from 'remotion';

export const C = {paper:'#efe9dc', ink:'#20252a', red:'#ca4639', muted:'#797970', lavender:'#b6a7df', white:'#f6f5fa'};
export const font = '"Microsoft YaHei", "Segoe UI", sans-serif';
export const ease = (f:number, a:number, b:number) => interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.2,.75,.2,1)});

export const Paper = () => <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:.15,backgroundImage:`url(${staticFile('paper.png')})`,backgroundSize:'480px 480px',mixBlendMode:'multiply'}}/>;

export const Mark = ({size=100}:{size?:number}) => <Img src={staticFile('mark.svg')} style={{width:size,height:size}}/>;

export const Cursor = ({x,y,down=false}:{x:number;y:number;down?:boolean}) => <svg width="48" height="62" viewBox="0 0 48 62" style={{position:'absolute',left:x,top:y,filter:'drop-shadow(0 3px 2px #0007)',scale:down?.9:1}}><path d="M4 3L39 34L23 36L32 55L23 59L14 40L4 51Z" fill="#f6f5fa" stroke="#20252a" strokeWidth="3"/></svg>;

export const SourceLine = () => <div style={{position:'absolute',left:0,right:0,bottom:62,textAlign:'center',color:'#fff8e9',fontFamily:'"Segoe UI",sans-serif',fontSize:48,fontWeight:600,textShadow:'0 2px 6px #000'}}>Tu me dois encore de l’argent.</div>;
