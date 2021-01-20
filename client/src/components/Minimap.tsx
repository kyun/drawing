import React from 'react';



function Minimap(props: any) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    draw();
  }, [props]);

  function draw() {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let imageObj = new Image();
      imageObj.src = props.src;
      // imageObj.src = `https://www.vectortiles.com/wp-content/uploads/tetris-seamless-tiles-04.jpg`;
      // imageObj.src = `https://flyghte.files.wordpress.com/2015/09/3dfunnyhiphopcharacters-5-900x900.jpg`;
      imageObj.onload = function () {
        //ctx.drawImage(imageObj1, 100 , 100, imageObj1.width / 4, imageObj1.height / 4, 0, 0, 400, 400);
        ctx?.drawImage(imageObj,0,0,imageObj.width / 4 , imageObj.height / 4 );
      }
    }

  }
  return (
    <div style={{border: '2px solid red', fontSize: '0px'}}>
      <canvas ref={canvasRef} width={200} height={200} />
    </div>
  )
}

export default Minimap;