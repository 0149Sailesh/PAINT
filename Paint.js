 	const TOOL_LINE = 'line';
     const TOOL_RECTANGLE = 'rectangle';
     const TOOL_CIRCLE = 'circle';
    const TOOL_PENCIL = 'pencil';
    const TOOL_ERASER = 'eraser';
class Point{
	constructor(x,y){
		this.x=x;
		this.y=y;
	}
}
function getMouseCoordsOnCanvas(e,canvas){
	let rect= canvas.getBoundingClientRect();
	let x= e.clientX-rect.left;
	let y= e.clientY-rect.top;
	return new Point(x,y);
}

class Paint{
	constructor(canvasId){
		this.canvas= document.getElementById(canvasId);
		this.context=canvas.getContext('2d');

	}
	set selectColor(color){
		this.color=color;
		this.context.strokeStyle=this.color;
	}
	set activeTool(tool){
		this.tool=tool;
		
	}
	init(){
		this.canvas.onmousedown = e => this.onMouseDown(e);
	}
	onMouseDown(e){
		this.savedData= this.context.getImageData(0,0,this.canvas.width,this.canvas.height)
		this.canvas.onmousemove= e => this.onMouseMove(e);
		document.onmouseup= e =>this.onMouseUp(e);
		this.startPos= getMouseCoordsOnCanvas(e,this.canvas);
		if(this.tool==TOOL_PENCIL){
			this.context.beginPath();
			this.context.moveTo(this.startPos.x,this.startPos.y)
		}
		if(this.tool==TOOL_ERASER){
			this.context.clearRect(this.startPos.x,this.startPos.y,7,7);
		}
	}
	onMouseMove(e){
this.currentPos= getMouseCoordsOnCanvas(e,this.canvas);

switch(this.tool){
	case TOOL_LINE:
	case TOOL_RECTANGLE:
	case TOOL_CIRCLE:
	this.drawShape();
	break;
	case TOOL_PENCIL:
	this.drawLine();
	break;
	case TOOL_ERASER:
	{
		this.context.clearRect(this.currentPos.x,this.currentPos.y,3,3);
	}
	break;
	default:
	break;

}
	}
	onMouseUp(e){
		this.canvas.onmousemove=null;
		document.onmouseup= null;
	}
	drawShape(){
		this.context.putImageData(this.savedData,0,0);
		this.context.beginPath();
		if(this.tool==TOOL_LINE){
		this.context.moveTo(this.startPos.x,this.startPos.y);
		this.context.lineTo(this.currentPos.x,this.currentPos.y);
		}
		else if(this.tool==TOOL_RECTANGLE){
			this.context.rect(this.startPos.x,this.startPos.y,this.currentPos.x-this.startPos.x,this.currentPos.y-this.startPos.y);
		}
		else if(this.tool==TOOL_CIRCLE){
			let distance=findDistance(this.startPos,this.currentPos);
			this.context.arc(this.startPos.x,this.startPos.y,distance,0,2 *Math.PI,false);
		}
		this.context.stroke();
		
	}
	drawLine(){
		
		
		this.context.lineTo(this.currentPos.x,this.currentPos.y);
		this.context.stroke();
	}
}


// paint class is used for all drawings
var paint= new Paint("canvas");

//Default tool
paint.activeTool=TOOL_PENCIL;
paint.init();

document.querySelectorAll("[data-tool]").forEach(
item =>{
	item.addEventListener("click",e =>{
		
		let selectedTool= item.getAttribute("data-tool");
		paint.activeTool=selectedTool;
		
	});
}
		)
	document.querySelectorAll("[data-color]").forEach(
		item =>{
			item.addEventListener("click", e => {
				
				paint.selectColor=item.getAttribute("data-color");
			});
		}
		)
	function findDistance(coord1,coord2){
		var exp1=Math.pow(coord2.x-coord1.x,2);
		var exp2=Math.pow(coord2.y-coord1.y,2);

		var distance=Math.sqrt(exp1+exp2);
		return distance;
	} 