import { useEffect, useRef, useState } from "react"


export const useDraw = (onDraw: ({ctx, currentPoint, prevPoint}:Draw) => void)=>{

    const [mouseDown,setMouseDown] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<Point | null>(null);

    const onMouseDown = ()=>{
        setMouseDown(true);
    }

    const clear = ()=>{
        const canvas = canvasRef.current;
        if(!canvas)return;

        const ctx = canvas.getContext('2d');
        if(!ctx)return;

        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    useEffect(()=>{

        const handler = (e:MouseEvent)=>{
            if(!mouseDown)return;
            const currentPoint = computePoint(e);
            const ctx = canvasRef.current?.getContext('2d');
    
            if(!ctx || !currentPoint)return;
            
            onDraw({ctx, currentPoint, prevPoint: prevPoint.current});
            prevPoint.current = currentPoint;
        }

        const mouseUpHandler = (e:MouseEvent)=>{
            setMouseDown(false);
            prevPoint.current = null;
        }
    
        canvasRef.current?.addEventListener('mousemove', handler);
        window.addEventListener('mouseup', mouseUpHandler);

        const computePoint = (e:MouseEvent)=>{
            const rect = canvasRef.current?.getBoundingClientRect();
            if(!rect)return;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            return {x,y};
        }

        return ()=>{
            canvasRef.current?.removeEventListener('mousemove', handler); 
            window.removeEventListener('mouseup',mouseUpHandler);
        }
    },[onDraw]);

    return {canvasRef, onMouseDown, clear};
}