import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {cancelRender,continueRender,delayRender,staticFile} from 'remotion';

/** Sample one canonical asset at a changing resolution, preserving its layout. */
export const PixelSurface: React.FC<{src:string;width:number;height:number;cell:number}> = ({src,width,height,cell}) => {
  const canvas=useRef<HTMLCanvasElement>(null),done=useRef(false);
  const [handle]=useState(()=>delayRender(`Load ${src}`));
  const [asset,setAsset]=useState<HTMLImageElement|null>(null);
  useEffect(()=>{
    const image=new window.Image();
    image.onload=()=>setAsset(image);
    image.onerror=()=>cancelRender(new Error(`Cannot load ${src}`));
    image.src=staticFile(src);
    return ()=>{image.onload=null;image.onerror=null;};
  },[src]);
  useLayoutEffect(()=>{
    if(!asset||!canvas.current)return;
    const target=canvas.current;
    target.width=Math.max(1,Math.round(width/cell));
    target.height=Math.max(1,Math.round(height/cell));
    const context=target.getContext('2d');
    if(!context){cancelRender(new Error('Canvas 2D is required'));return;}
    context.imageSmoothingEnabled=true;
    context.imageSmoothingQuality='high';
    context.drawImage(asset,0,0,target.width,target.height);
    if(!done.current){done.current=true;continueRender(handle);}
  },[asset,cell,width,height,handle]);
  return <canvas ref={canvas} style={{display:'block',width,height,imageRendering:'pixelated'}}/>;
};
