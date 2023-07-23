import { useDraw } from "@/hooks/useDraw"
import { drawLine } from "@/utils/drawLine";
import { useEffect, useState } from "react";
import { ChromePicker } from 'react-color';
import { io } from "socket.io-client";

const socket = io('http://localhost:3001');

type DrawLineProps = {
  prevPoint: Point | null,
  currentPoint: Point,
  color: string,
}

export default function Home() {

  const [lineColor,setLineColor] = useState<string>('#000');
  const {canvasRef, onMouseDown, clear} = useDraw(createLine);

  useEffect(()=>{

    const ctx = canvasRef.current?.getContext('2d');

    socket.on('draw-line',({currentPoint,prevPoint,color}:DrawLineProps)=>{
      if(!ctx)return;
      drawLine({ctx,currentPoint,prevPoint,color});
    })

    socket.on('clear-canvas',()=>{
      console.log('here client side clear');
      clear();
    });
  },[canvasRef]);

  function createLine({ctx,currentPoint,prevPoint}:Draw) {
    socket.emit('draw-line', {currentPoint,prevPoint,color:lineColor});
    drawLine({ctx,currentPoint,prevPoint,color:lineColor});
  }

  return (
    <div className="w-screen h-screen justify-center flex items-center">
      <div className="flex flex-col mr-5">
        <ChromePicker className="mb-5" color={lineColor} onChange={(e)=>{setLineColor(e.hex)}} />
        <button className="border-black rounded-md border p-2" onClick={()=>{socket.emit('clear-canvas')}}>Clear</button>
      </div>
      <canvas ref={canvasRef} onMouseDown={onMouseDown} height={650} width={650} className='border rounded-md border-black' />
    </div>
  )
}
