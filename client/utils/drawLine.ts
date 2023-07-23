type DrawLineProps = Draw & {
    color: string
}

export const drawLine = ({prevPoint, currentPoint, ctx, color}: DrawLineProps)=>{
    const {x:currx,y:currY} = currentPoint;

    const lineWidth = 5;

    let startPoint = prevPoint || currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currx, currY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, Math.PI * 2, true);
    ctx.fill();
}