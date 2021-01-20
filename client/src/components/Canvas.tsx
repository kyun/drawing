import React from 'react';
import styled from 'styled-components';
import Minimap from './Minimap';


const Base = styled.div`
  display: flex;
`
const CanvasWrapper = styled.div`
  position: relative;
  width: 800px;
  padding-left: 80px;
  padding-bottom: 80px;
  canvas {
    position: absolute;
    margin: auto;
    top: 0;
    left: 0; 
    right: 0;
  }
`
function Canvas() {
  const originRef = React.useRef<HTMLCanvasElement>(null);
  const boardRef = React.useRef<HTMLCanvasElement>(null);
  const gridRef = React.useRef<HTMLCanvasElement>(null);
  const cursorRef = React.useRef<HTMLCanvasElement>(null);
  const [img, setImg] = React.useState('');
  const [v, setV] = React.useState(1);
  const [edge, setEdge] = React.useState([0, 0]);
  let pos = {
    drawable: false,
    X: -1,
    Y: -1,
  }
  function initCanvas() {
    const origin = originRef.current;
    const ctx = origin?.getContext('2d');
    ctx!.imageSmoothingEnabled = false;
    let imageObj = new Image();
    imageObj.setAttribute('crossOrigin', 'anonymous');
    imageObj.src = `https://upload.wikimedia.org/wikipedia/commons/e/ea/Redmi_note_9s_.webp`;
    imageObj.src = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b9821bf8-6e6a-4855-ba34-35144c74a205/d8l6neu-50154af3-45ee-4a87-ab2e-8facb5c3b6d0.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvYjk4MjFiZjgtNmU2YS00ODU1LWJhMzQtMzUxNDRjNzRhMjA1XC9kOGw2bmV1LTUwMTU0YWYzLTQ1ZWUtNGE4Ny1hYjJlLThmYWNiNWMzYjZkMC5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.9Lf6b5zwgtKGdSsFLPPh3OAirqOZ1j1IyJTsip-AcLQ';

    imageObj.onload = function () {
      console.log('??????')
      ctx?.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
      setImg(origin!.toDataURL('image/png'))
    }
  }

  function syncCanvas() {
    const board = boardRef.current;
    const ctx = board?.getContext('2d');
    ctx!.imageSmoothingEnabled = false;

    let imageObj = new Image();

    // imageObj.setAttribute('crossOrigin', 'anonymous');
    imageObj.src = img;
    imageObj.onload = function () {
      // ctx?.drawImage(imageObj, 0, 0, 50, 50, 0, 0, imageObj.width, imageObj.height);
      ctx?.drawImage(imageObj, v===1 ? 0 : edge[0],v===1? 0: edge[1], 800/v, 800/v, 0, 0, imageObj.width, imageObj.height);

    }
  }
  function generateGrid() {
    if (v === 1) return;

    const grid = gridRef.current;
    const ctx = grid?.getContext('2d');

    ctx!.clearRect(0, 0, 800, 800);

    ctx?.beginPath();
    for (let x = 0; x <= 800; x += (v)){
      ctx?.moveTo(x, 0);
      ctx?.lineTo(x, 800);
    }
    // ctx?.moveTo(800, 0);
    // ctx?.lineTo(799, 800);
    for (let y = 0; y <= 800; y += (v)){
      ctx?.moveTo(0, y);
      ctx?.lineTo(800, y);
    }

    ctx!.strokeStyle = 'rgba(0,0,0,0.16)';
    ctx?.stroke();
  }
  React.useEffect(() => {
    initCanvas();
    generateGrid();
  }, []);

  React.useEffect(() => {
    syncCanvas();
    const grid = gridRef.current;
    const ctx = grid?.getContext('2d');
    ctx!.clearRect(0, 0, 800, 800);

    if (v === 16) {
      const cursor = cursorRef.current;
      const ctx2 = cursor?.getContext('2d');
      ctx2?.clearRect(0, 0, 800, 800);
    }
    generateGrid();

  }, [img, v]);
  function getPosition(e:any){
    return {X: e.offsetX, Y: e.offsetY}
  }
  const drawing = (e: any) => {
    const canvas = boardRef.current;
    const origin = originRef.current;
    const ctx = canvas?.getContext('2d');
    const ctx2 = origin?.getContext('2d');

    if (pos.drawable) {
      pos = { ...pos, ...getPosition(e.nativeEvent) }
      ctx!.fillStyle = '#ffff00';
      ctx2!.fillStyle = "#ff0000";
      ctx?.fillRect(~~((pos.X-1) / 16) * 16, ~~((pos.Y-1) / 16) * 16, 16, 16);
      ctx2?.fillRect(~~((pos.X-1)/16) + edge[0], ~~((pos.Y-1)/16) + edge[1], 1, 1);

      // ctx!.strokeStyle = "rgba(128,128,128,0.5)";
      // ctx!.strokeRect( ~~(pos.X/width) * width, ~~(pos.Y/width)*width, width, width,);

    }
  };
  function finishDraw() {
    const canvas = originRef.current;

    pos = { drawable: false, X: -1, Y: -1 }
    const src = canvas!.toDataURL('image/png');
    setImg(src);
  }
  function initDraw(e:any){
    const canvas = boardRef.current;
    const origin = originRef.current;

    const ctx = canvas?.getContext('2d');
    const ctx2 = origin?.getContext('2d');

    ctx!.beginPath();
    pos = { drawable: true, ...getPosition(e.nativeEvent)}
    ctx!.moveTo(pos.X, pos.Y);

    ctx2!.beginPath();
    ctx2!.moveTo(pos.X, pos.Y);

  } 

  function observe(e:any){
    if(true){
      const cursorW = 200;
      const halfW = cursorW/2;
      const canvas = cursorRef!.current;
      const ctx = canvas!.getContext('2d');
      const { X, Y } = getPosition(e.nativeEvent);
      ctx!.fillStyle = `rgba(255,0,0,0.01)`;
      let newX=X-halfW, newY = Y-halfW;
  
      if(X-halfW < 0){
        newX = 0;
      }else if(X-halfW > 800 - cursorW){
        newX = 800 - cursorW;
      }
      if(Y-halfW < 0){
        newY = 0;
      }else if(Y-halfW > 800 - cursorW){
        newY = 800 - cursorW;
      }
      console.log(newX, newY);
      //setCoords({x:newX, y:newY});
  
      ctx!.clearRect(0,0,800,800);
      ctx!.strokeStyle=(`rgba(0,0,0,0.6)`)
  
      ctx!.fillStyle=(`rgba(0,0,0,0.2)`)
      ctx!.strokeRect( newX,newY, cursorW, cursorW);
      ctx!.fillRect( newX,newY, cursorW, cursorW);
  
    }

  }

  function handleClick(e:any) {
    const cursorW = 200;
      const halfW = cursorW/2;
      const canvas = cursorRef!.current;
      const ctx = canvas!.getContext('2d');
      const { X, Y } = getPosition(e.nativeEvent);
      ctx!.fillStyle = `rgba(255,0,0,0.01)`;
      let newX=X-halfW, newY = Y-halfW;
  
      if(X-halfW < 0){
        newX = 0;
      }else if(X-halfW > 800 - cursorW){
        newX = 800 - cursorW;
      }
      if(Y-halfW < 0){
        newY = 0;
      }else if(Y-halfW > 800 - cursorW){
        newY = 800 - cursorW;
      }
    // console.log(newX / v, newY / v);
    
    if (v === 1) {
      setEdge([newX / v, newY / v]);
      setV(4);
    } else if (v === 4) {
      setEdge((prev) => {
        return [prev[0] + (~~(newX / v)), prev[1] + (~~(newY / v))]
      });
      setV(16);
    }
  }
  return (
    <Base>
      <div>
      <p>{edge[0]},{edge[1]}</p>
      <canvas ref={originRef} width={800} height={800} style={{ display: 'none' }} />
      <button onClick={() => setV(1)}>1</button>

      <button onClick={() => setV(4)}>4</button>
      <button onClick={()=>setV(16)}>16</button>
      </div>
      <CanvasWrapper>
        <canvas ref={boardRef} width={800} height={800} />
        <canvas ref={gridRef} width={800} height={800} />
<canvas ref={cursorRef} onClick={handleClick} onMouseDown={initDraw} onMouseUp={finishDraw}  onMouseMove={v !== 16 ? observe : drawing} width={800} height={800} />
      </CanvasWrapper>
      <Minimap src={img} />
      
    </Base>
  )
}

export default Canvas;