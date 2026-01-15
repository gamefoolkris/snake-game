function canClick(el) {
	const rect = el.getBoundingClientRect();

	const inViewport =
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth);

	if (!inViewport) return false;

	const x = rect.left + rect.width / 2;
	const y = rect.top + rect.height / 2;
	const topEl = document.elementFromPoint(x, y);
	return el.contains(topEl) || topEl === el;
}
const easingFunctions = {
	linear: t => t,
	easeInQuad: t => t*t,
	easeOutQuad: t => t*(2 - t),
	easeInOutQuad: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
	easeInCubic: t => t*t*t,
	easeOutCubic: t => (--t)*t*t + 1,
	easeInOutCubic: t => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2) + 1,
	easeInQuart: t => t*t*t*t,
	easeOutQuart: t => 1 - (--t)*t*t*t,
	easeInOutQuart: t => t < 0.5 ? 8*t*t*t*t : 1 - 8*(--t)*t*t*t,
	easeInQuint: t => t*t*t*t*t,
	easeOutQuint: t => 1 + (--t)*t*t*t*t,
	easeInOutQuint: t => t < 0.5 ? 16*t*t*t*t*t : 1 + 16*(--t)*t*t*t*t,
	easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
	easeOutSine: t => Math.sin(t * Math.PI / 2),
	easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
	easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
	easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
	easeInOutExpo: t => {
		if (t === 0) return 0;
		if (t === 1) return 1;
		if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
		return (2 - Math.pow(2, -20 * t + 10)) / 2;
	},
	easeInCirc: t => 1 - Math.sqrt(1 - t*t),
	easeOutCirc: t => Math.sqrt(1 - (--t)*t),
	easeInOutCirc: t => {
		if (t < 0.5) {
			return (1 - Math.sqrt(1 - 4 * t * t)) / 2;
		} else {
			const t2 = 2 * t - 2;
			return (Math.sqrt(1 - t2 * t2) + 1) / 2;
		}
	}
};
function tween(start, end, steps, fss = 2, fes = 2, easing = 'linear') {
	if (steps < fss + fes + 1) {
		throw new Error("Not enough steps for fixed start/end steps.");
	}

	const easeFn = easingFunctions[easing];
	if (!easeFn) {
		throw new Error(`Easing function "${easing}" not found.`);
	}

	const result = [];
	const tweenSteps = steps - fss - fes;

	for (let i = 0; i < fss; i++) {
		result.push(start);
	}

	for (let i = 1; i <= tweenSteps; i++) {
		const t = i / (tweenSteps + 1);
		const easedT = easeFn(t);
		result.push(start + (end - start) * easedT);
	}

	for (let i = 0; i < fes; i++) {
		result.push(end);
	}

	return result;
}

function dec(x) {
	let y = new Decimal(x);
	return y;
}
function div(x, y) {
	return x.dividedBy(y);
}
function arrToCol(col) {
	return "rgb(" + col[0] + ", " + col[1] + ", " + col[2] + ")";
}
function snakeColor(tile) {
	let r = tween(color[1][0], color[0][0], Math.max(trail.length, 10), 0, 0);
	let g = tween(color[1][1], color[0][1], Math.max(trail.length, 10), 0, 0);
	let b = tween(color[1][2], color[0][2], Math.max(trail.length, 10), 0, 0);
	return "rgb(" + r[trail.length - tile - 1] + ", " + g[trail.length - tile - 1] + ", " + b[trail.length - tile - 1] + ")";
}
function getArc(x, y, radius, startAngle, endAngle) {
	return {
		x: x + radius * Math.cos(endAngle),
		y: y + radius * Math.sin(endAngle)
	};
}
function blendCol(start, end, per) {
	let r387 = tween(start[0], end[0], 100, 0, 0)[per];
	let g387 = tween(start[1], end[1], 100, 0, 0)[per];
	let b387 = tween(start[2], end[2], 100, 0, 0)[per];
	return [r387, g387, b387];
}
function colToArr(col) {
	return col.slice(4, -1).split(',').map(Number);
}
var gameloop = null;
const keybinds = {
	"up": [38, 87],
	"down": [40, 83],
	"left": [37, 65],
	"right": [39, 68],
	"pause": [27, 80]
}
const storage = {
	"load": function() {
		let dat269 = {
			"highscore": 0
		}
		if(!localStorage.getItem("snake-game186083020")) {
			storage.save(dat269);
			return dat269;
		} else {
			let sto269 = JSON.parse(localStorage.getItem("snake-game186083020"));
			if(typeof(sto269) == "object") {
				let broke269 = false;
				if(!Number.isInteger(sto269.highscore)) {
					broke269 = true;
					sto269.highscore = 0;
				}
				storage.save(sto269);
				return sto269;
			}
		}
	},
	"save": function(dat269) {
		let broke269 = false;
		if(typeof(dat269) == "object") {
			if(!Number.isInteger(dat269.highscore)) {
				broke269 = true
				dat269.highscore = 0;
			}
			localStorage.setItem("snake-game186083020", JSON.stringify(dat269));
		}
	}
}
var data = storage.load();
var paused = 0;
var countdown = null;
var frame = 0;
var overlay = document.getElementById("blur");
var background = ["hsl(130, 100%, 35%)", "hsl(120, 100%, 50%)"];
var color = [[0, 62, 182], [62, 108, 222]];
const outline = 3;
setInterval(function() {
	if(paused) return;
	if(countdown != null) return;
	if(running !== true) return;
	frame++;
}, 1000/60);

var canv = document.getElementById("gc");
var ctx = canv.getContext("2d");
var UIcanv = document.getElementById("UIcanv");
var UIctx = UIcanv.getContext("2d");
document.addEventListener("keydown",keyPush);
var running = false;

function def() {
	canSpawn=false;

	px=py=10;

	gs=tc=20;

	ax=ay=15;

	xv=yv=0;

	pxv=pyv=0;

	trail=[];
	
	newTrail=[];
	
	dead=false;

	tail = 5;

	score = 0;
	
	trail.push({x:px-4,y:py});
	trail.push({x:px-3,y:py});
	trail.push({x:px-2,y:py});
	trail.push({x:px-1,y:py});
	trail.push({x:px,y:py});
	
	newHigh = false;
	
	gameloop = setInterval(game,1000/9);
	
	frame = 0;
}

upBtn = document.getElementById("up");

downBtn = document.getElementById("down");

leftBtn = document.getElementById("left");

rightBtn = document.getElementById("right");
function safeTiles() {
	let y = 0;
	let tiles = [];
	let badTiles = [];
	for(let i of trail) {
		badTiles.push(`${i.x},${i.y}`);
	}
	if(badTiles.length < 399) {
		badTiles.push(`${px + pxv},${py + pyv}`);
	}
	for(let y = 0; y < 20; y++) {
		for(let x = 0; x < 20; x++) {
			if(!badTiles.includes(`${x},${y}`)) tiles.push(`${x},${y}`);
		}
	}
	return tiles;
}
function showScore() {
	score = tail - 5;
	if(score > data.highscore) {
		data.highscore = score;
		newHigh = true;
		storage.save(data);
	}
	
	if(py === 0) {
		if((`${score}`.length > 2 && px <= 5) || (px <= 4)) {
			UIctx.globalAlpha = 0.5;
		}
	}
	if(ay === 0) {
		if((`${score}`.length > 2 && ax <= 5) || (ax <= 4)) {
			UIctx.globalAlpha = 0.25;
		}
	}

	UIctx.textAlign = "left";
	UIctx.font = "bold 22px Arial";
	let col = "white";
	let step = Date.now() / 1000 * 60;
	if(newHigh) {
		col = UIctx.createLinearGradient(((200/120)*(step%120)) - 200, 0, 600 + ((200/120)*(step%120)), 0);
		col.addColorStop(0, "#bbffff");
		col.addColorStop(0.125, "#00ffff");
		col.addColorStop(0.25, "#bbffff");
		col.addColorStop(0.375, "#00ffff");
		col.addColorStop(0.5, "#bbffff");
		col.addColorStop(0.625, "#00ffff");
		col.addColorStop(0.75, "#bbffff");
		col.addColorStop(0.875, "#00ffff");
		col.addColorStop(1, "#bbffff");
	}
	UIctx.fillStyle = col;
	UIctx.strokeStyle = "black";
	UIctx.lineWidth = 3;
	UIctx.strokeText(`Score: ${score}`, 5, 20);
	UIctx.fillText(`Score: ${score}`, 5, 20);
	
	UIctx.globalAlpha = 1;
	
	if(py === 0) {
		if((`${data.highscore}`.length > 1 && px >= 12) || (px >= 13)) {
			UIctx.globalAlpha = 0.5;
		}
	}
	if(ay === 0) {
		if((`${data.highscore}`.length > 1 && ax >= 12) || (ax >= 13)) {
			UIctx.globalAlpha = 0.25;
		}
	}
	UIctx.textAlign = "right";
	UIctx.strokeText(`Highscore: ${data.highscore}`, 400 - 5, 20);
	UIctx.fillText(`Highscore: ${data.highscore}`, 400 - 5, 20);
	
	UIctx.globalAlpha = 1;
}

function circle(x, y, rad, s) {
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, Math.PI * 2);
	if(s) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = s;
		ctx.stroke();
	}
	ctx.fill();
}
function semiCirc(x, y, rad, direct, sThick, sType) {
	let ln = {};
	let arc = {
		"u": {
			"sa": Math.PI,
			"ea": 2 * Math.PI
		},
		"d": {
			"sa": 0,
			"ea": Math.PI
		},
		"l": {
			"sa": 0.5 * Math.PI,
			"ea": 1.5 * Math.PI
		},
		"r": {
			"sa": 1.5 * Math.PI,
			"ea": 0.5 * Math.PI
		}
	}
	ctx.beginPath();
	
	ctx.arc(x, y, rad, arc[direct].sa, arc[direct].ea);
	ln = getArc((x, y, rad, arc[direct].sa, arc[direct].ea));
	
	if(sThick) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = sThick;
		ctx.stroke();
	}
	ctx.fill();
}
function rect(x, y, width, height, stroke, sides) {
	if(stroke) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = stroke;
		ctx.beginPath();
		if (sides && (sides.includes("u") || sides.includes("d") || sides.includes("l") || sides.includes("r"))) {
			if(sides.includes("u")) {
				ctx.moveTo(x, y);
				ctx.lineTo(x + width, y);
			}
			if(sides.includes("d")) {
				ctx.moveTo(x, y + height);
				ctx.lineTo(x + width, y + height);
			}
			if(sides.includes("l")) {
				ctx.moveTo(x, y);
				ctx.lineTo(x, y + height);
			}
			if(sides.includes("r")) {
				ctx.moveTo(x + width, y);
				ctx.lineTo(x + width, y + height);
			}
		} else {
			ctx.moveTo(x, y)
			ctx.lineTo(x, y + height);
			ctx.lineTo(x + width, y + height);
			ctx.lineTo(x + width, y);
			ctx.lineTo(x, y);
		}
		ctx.stroke();
	}
	ctx.fillRect(x, y, width, height);
}
function eyes(pupil) {
	let head = trail[trail.length - 1];
	let pupRad = 4;
	ctx.fillStyle = "White";
	circle((head.x * 20) + 10, (head.y * 20) + 10, 7, 2);
	ctx.fillStyle = "Black";
	if(pupil) {
		if(pupil === "shrink") {
			pupRad = 2;
		}
		if(!isNaN(pupil)) {
			pupRad = pupil;
		}
		if(Array.isArray(pupil) && pupil[0].toLowerCase() === "dead" && !isNaN(pupil[1])) {
			let cx = (head.x + 0.5) * 20;
			cx += xv;
			let cy = (head.y + 0.5) * 20;
			cy += yv;
			let rad = pupil[1] / Math.sqrt(2);
			let prevAlph = ctx.globalAlpha;

			let c1x = cx - rad;
			let c1y = cy - rad;

			let c2x = cx + rad;
			let c2y = cy + rad;

			let c3x = cx + rad;
			let c3y = cy - rad;

			let c4x = cx - rad;
			let c4y = cy + rad;

			ctx.beginPath();

			ctx.moveTo(c1x, c1y);
			ctx.lineTo(c2x, c2y);

			ctx.moveTo(c3x, c3y);
			ctx.lineTo(c4x, c4y);

			ctx.lineWidth = 2;
			ctx.globalAlpha = 0.25 * pupil[1];
			ctx.stroke();
			
			ctx.globalAlpha = 1 - ctx.globalAlpha;
			circle(cx, cy, 2);

			ctx.globalAlpha = prevAlph;
			
			return;
		}
	}
	if(xv == 1) {
		circle((head.x * 20) + 12.5, (head.y * 20) + 10, pupRad);
	} else if(xv == -1) {
		circle((head.x * 20) + 7.5, (head.y * 20) + 10, pupRad);
	} else if(yv == 1) {
		circle((head.x * 20) + 10, (head.y * 20) + 12.5, pupRad);
	} else if(yv == -1) {
		circle((head.x * 20) + 10, (head.y * 20) + 7.5, pupRad);
	} else {
		circle((head.x * 20) + 11.25, (head.y * 20) + 11.25, pupRad);
	}
}
function showHead() {
	let head = trail[trail.length - 1];
	let x1 = head.x * 20;
	let y1 = head.y * 20;
	let x2 = x1 + 10;
	let y2 = y1 + 10;
	let gs2 = gs / 2;
	let rad = 10;
	let sides = {
		"u": ["0", "0", "l", "r"],
		"d": ["0", "0", "l", "r"],
		"l": ["u", "d", "0", "0"],
		"r": ["u", "d", "0", "0"],
		"c": ["0", "0", "0", "0"]
	}
	ctx.fillStyle = arrToCol(color[1]);
	if(pyv == -1) { // up
		rect(x1, y2, gs, gs2, outline, sides.u);
		semiCirc(x2, y2, rad, "u", outline);
	}
	if(pyv == 1) { // down
		rect(x1, y1, gs, gs2, outline, sides.d);
		semiCirc(x2, y2, rad, "d", outline);
	}
	if(pxv == -1) { // left
		rect(x2, y1, gs2, gs, outline, sides.l);
		semiCirc(x2, y2, rad, "l", outline);
	}
	if(pxv == 1) { // right
		rect(x1, y1, gs2, gs, outline, sides.r);
		semiCirc(x2, y2, rad, "r", outline);
	}
	if(pxv + pyv === 0) { // still
		rect(x1, y1, gs2, gs, outline, sides.r);
		semiCirc(x2, y2, rad, "r", outline);
	}
}
function showTail() {
	let id = 0;
	let tile = trail[id];
	let sha = color[(trail.length - id) % 2];
	let grad = colToArr(snakeColor(id));
	let col = blendCol(grad, sha, 50);
	col = arrToCol(col);
	let size = dec(tween(1, 0.8, tail)[trail.length - 1]);
	let shr = dec(1).minus(size).times(10);
	let x1 = tile.x * 20;
	let y1 = tile.y * 20;
	let x2 = x1 + 10;
	let y2 = y1 + 10;
	let gs2 = gs / 2;
	let rad = size.times(10);
	let txv = trail[1].x - tile.x;
	let tyv = trail[1].y - tile.y;
	ctx.fillStyle = col;
	if(tyv == -1) { // up
		semiCirc(x2, y2, flo(rad), "d", outline);
		rect(x1 + flo(shr), y1, gs - flo(shr.times(2)), gs2, outline, ["l", "r"]);
	}
	if(tyv == 1) { // down
		semiCirc(x2, y2 + flo(shr), flo(rad), "u", outline);
		rect(x1 + flo(shr), y1 + flo(shr.plus(9)), gs - flo(shr.times(2)), gs2, outline, ["l", "r"]);
	}
	if(txv == -1) { // left
		semiCirc(x2 - flo(shr), y2, flo(rad), "r", outline);
		rect(x1, y1 + flo(shr), gs2, gs - flo(shr.times(2)), outline, ["u", "d"]);
	}
	if(txv == 1) { // right
		semiCirc(x2 + flo(shr), y2, flo(rad), "l", outline);
		rect(x1 + flo(shr.plus(10)), y1 + flo(shr), gs2, gs - flo(shr.times(2)), outline, ["u", "d"]);
	}
}
function showTrailC(id) {
	let tile = trail[id];
	let size = dec(tween(1, 0.8, tail, 2, 2)[trail.length - id - 1]);
	let shr = dec(1).minus(size).times(10);
	let sha = color[(trail.length - id) % 2];
	let grad = colToArr(snakeColor(id));
	let col = blendCol(grad, sha, 50);
	col = arrToCol(col);
	let x1 = (tile.x + 0.5) * 20;
	let y1 = (tile.y + 0.5) * 20;
	let rad = size.times(10);
	ctx.fillStyle = col;
	circle(x1, y1, flo(rad), outline);
}
function showTrailT(id) {
	let tile = trail[id];
	let size = dec(tween(1, 0.8, tail, 2, 2)[trail.length - id - 1]);
	let shr = dec(1).minus(size).times(10);
	let sha = color[(trail.length - id) % 2];
	let grad = colToArr(snakeColor(id));
	let col = blendCol(grad, sha, 50);
	col = arrToCol(col);
	let x1 = tile.x * 20;
	let y1 = tile.y * 20;
	let x2 = x1 + 10;
	let y2 = y1 + 10;
	let xv1 = trail[id + 1].x - tile.x;
	let yv1 = trail[id + 1].y - tile.y;
	let xv2 = trail[id - 1].x - tile.x;
	let yv2 = trail[id - 1].y - tile.y;
	let gs2 = gs / 2;
	let rects = {
		"u": {
			"x": x1 + flo(shr),
			"y": y1,
			"w": gs - flo(shr.times(2)),
			"h": gs2,
			"s": ["0", "0", "l", "r"]
		},
		"d": {
			"x": x1 + flo(shr),
			"y": y2,
			"w": gs - flo(shr.times(2)),
			"h": gs2,
			"s": ["0", "0", "l", "r"]
		},
		"l": {
			"x": x1,
			"y": y1 + flo(shr),
			"w": gs2,
			"h": gs - flo(shr.times(2)),
			"s": ["u", "d", "0", "0"]
		},
		"r": {
			"x": x1 + flo(shr.plus(10)),
			"y": y1 + flo(shr),
			"w": gs2,
			"h": gs - flo(shr.times(2)),
			"s": ["u", "d", "0", "0"]
		}
	}
	let p1 = null;
	let p2 = null;
	
	if(yv1 == -1) { // up
		p1 = "u";
	} else if(yv1 == 1) { // down
		p1 = "d";
	} else if(xv1 == -1) { // left
		p1 = "l";
	} else if(xv1 == 1) { // right
		p1 = "r";
	}
	
	if(yv2 == -1) { // up
		p2 = "u";
	} else if(yv2 == 1) { // down
		p2 = "d";
	} else if(xv2 == -1) { // left
		p2 = "l";
	} else if(xv2 == 1) { // right
		p2 = "r";
	}
	
	if(p1 || p2) {
		ctx.fillStyle = col;
		let straight = false;
		if(p1 == "u" && p2 == "d") straight = true;
		if(p1 == "d" && p2 == "u") straight = true;
		if(p1 == "l" && p2 == "r") straight = true;
		if(p1 == "r" && p2 == "l") straight = true;
		let s1 = [...rects[p1].s];
		if(straight == false) {
			s1.splice(s1.indexOf(p2), 1);
		}
		
		rect(
			rects[p1].x, 
			rects[p1].y, 
			rects[p1].w, 
			rects[p1].h,
			outline,
			s1
		);
		let s2 = [...rects[p2].s];
		if(straight == false) {
			s2.splice(s2.indexOf(p1), 1);
		}
		rect(
			rects[p2].x,
			rects[p2].y,
			rects[p2].w,
			rects[p2].h,
			outline,
			s2
		);
	}
}
function apple() {
	ctx.fillStyle = "red";
	let pulse = tween(8, 6, 60, 0, 0, "easeInOutCirc");
	pulse = pulse.concat(tween(6, 8, 60, 0, 0, "easeInOutCirc"));
	let size = pulse[frame % pulse.length];
	circle((ax + 0.5) * gs, (ay + 0.5) * gs, size, outline);
}
function showBG() {
	ctx.fillStyle = background[0];

	for(var x=0; x<20; x++) {
		if(((x-1) % 2) + 1 === 1) {
			for(var i=0; i<20; i++) {
				ctx.fillStyle=background[(20 - i - 1) % 2];
				rect(i*20,x*20,gs,gs);
			}
		} else {
			for(var i=0; i<20; i++) {
				ctx.fillStyle=background[(20 - i) % 2];
				rect(i*20,x*20,gs,gs);
			}
		}
	}
}
function showTrail() {
	showTail();
	for(var i=1;i<trail.length - 1;i++) {
		showTrailC(i);
	}
	for(var i=1;i<trail.length - 1;i++) {
		showTrailT(i);
	}
}
var pauseIMG = new Image();
pauseIMG.src = img.paused;
var CDimg = [new Image(), new Image(), new Image(), new Image()];
CDimg[0].src = numbers[0];
CDimg[1].src = numbers[1];
CDimg[2].src = numbers[2];
CDimg[3].src = numbers[3];
for(let i = 0; i < 4; i++) {
	CDimg[i].src = numbers[i];
	CDimg[i].width = 56;
	CDimg[i].height = 72;
}

function display() {
	UIctx.clearRect(0, 0, UIcanv.width, UIcanv.height);
	showBG();
	apple();
	showTrail();
	showHead();
	eyes();
	showScore();
	if(paused) {
		UIctx.drawImage(pauseIMG, 0, 0, UIcanv.width, UIcanv.height);
		overlay.style.opacity = 1;
	} else if(countdown != null) {
		if(countdown <= Date.now()) {
			countdown = null;
			overlay.style.opacity = 0;
		} else {
			UIctx.drawImage(
				CDimg[Math.ceil((countdown - Date.now()) / 1000)],
				200 - 56,
				200 - 72,
			);
			overlay.style.opacity = 1;
		}
	}
	showUI();
}

function game() {
	if(paused || countdown > 0 || dead || xv + yv === 0) {
		display();
		return;
	}
	
	px += xv;
	py += yv;

	if(px<0) {
		die();
		dead = true;
	}
	if(px>tc-1) {
		die();
		dead = true;
	}
	if(py<0) {
		die();
		dead = true;
	}
	if(py>tc-1) {
		die();
		dead = true;
	}
	
	newTrail = [...trail];

	if(running) {
		newTrail.push({x:px,y:py});
		while(newTrail.length>tail) {
			newTrail.shift();
		}
	}
	
	for(let i = 0; i < newTrail.length - 1; i++) {
		if(running && newTrail[i].x == px && newTrail[i].y == py && !paused && (xv !== 0 || yv !== 0)) {
			die();
			dead = true;
		}
	}
	
	if(!dead) {
		if(running) {
			trail = newTrail;
		}
		pxv = xv;
		pyv = yv;
	}
	
	display();

	if(ax==px && ay==py) {
		sfx.eat();
		tail++;
		let posTiles = safeTiles();
		let ap = posTiles[Math.floor(Math.random() * posTiles.length)].split(",");
		ax = eval(ap[0]);
		ay = eval(ap[1]);
		display();
	}
	if(dead) {
		showBG();
		apple();
		showTrail();
		showHead();
		eyes(3);
		showScore();
		setTimeout(function() {
			showBG();
			apple();
			showTrail();
			showHead();
			eyes("shrink");
			showScore();
		}, 50)
	}
	showScore();
}

function dir() {
	if(pyv == -1) {
		return "u";
	}
	if(pyv == 1) {
		return "d";
	}
	if(pxv == -1) {
		return "l";
	}
	if(pxv == 1) {
		return "r";
	}
	return "s";
}

function up() {
	if(dir() == "d" || paused || countdown > 0) {
		setTimeout(function() {
			if(dir() == "d" || paused || countdown > 0) return;
			if(dir() !== "u") sfx.up();
			xv = 0;
			yv = -1;
		}, 1000/10);
		return;
	}
	if(dir() !== "u") sfx.up();
	xv = 0;
	yv = -1;
}

function down() {
	if(dir() == "u" || paused || countdown > 0) {
		setTimeout(function() {
			if(dir() == "u" || paused || countdown > 0) return;
			if(dir() !== "d") sfx.down();
			xv = 0;
			yv = 1;
		}, 1000/10);
		return;
	}
	if(dir() !== "d") sfx.down();
	xv = 0;
	yv = 1;
}

function left() {
	if(dir() == "r" || paused || countdown > 0) {
		setTimeout(function() {
			if(dir() == "r" || paused || countdown > 0) return;
			if(dir() !== "l") sfx.left();
			xv = -1;
			yv = 0;
		}, 1000/10);
		return;
	}
	if(dir() !== "l") sfx.left();
	xv = -1;
	yv = 0;
}

function right() {
	if(dir() == "l" || paused || countdown > 0) {
		setTimeout(function() {
			if(dir() == "l" || paused || countdown > 0) return;
			if(dir() !== "r") sfx.right();
			xv = 1;
			yv = 0;
		}, 1000/10);
		return;
	}
	if(dir() !== "r") sfx.right();
	xv = 1;
	yv = 0;
}

function pause() {
	if(dir() == "s") return;
	if(paused) {
		countdown = Date.now() + 3000;
		paused = 0;
	} else {
		countdown = null;
		paused = 1;
	}
}

function getKey(code) {
	for(let i in keybinds) {
		if(keybinds[i].includes(code)) {
			return i[0];
		}
	}
}

gameControl.on('connect', function(gamepad) {
	const funcs = {
		"up": function() {
			if(!(running === false || countdown != null || dead)) up();
		},
		"down": function() {
			if(!(running === false || countdown != null || dead)) down();
		},
		"left": function() {
			if(!(running === false || countdown != null || dead)) left();
		},
		"right": function() {
			if(!(running === false || countdown != null || dead)) right();
		},
		"play1": function() {
			if(canClick(document.getElementById("playArea"))) {
				tar362 = dec(35);
				sfx.hover();
			}
		},
		"play2": function() {
			if(canClick(document.getElementById("playArea"))) {
				tar362 = dec(30);
				playArea.click();
			}
		},
		"pause": function() {
			if(!(running === false || countdown != null || dead)) pause();
		}
	}
	gamepad.before('up0', funcs.up);
	gamepad.before('down0', funcs.down);
	gamepad.before('left0', funcs.left);
	gamepad.before('right0', funcs.right);
	gamepad.before('up1', funcs.up);
	gamepad.before('down1', funcs.down);
	gamepad.before('left1', funcs.left);
	gamepad.before('right1', funcs.right);
	gamepad.before('button12', funcs.up);
	gamepad.before('button13', funcs.down);
	gamepad.before('button14', funcs.left);
	gamepad.before('button15', funcs.right);
	gamepad.before('button0', funcs.play1);
	gamepad.after('button0', funcs.play2);
	gamepad.before('button1', funcs.pause);
});

function keyPush(evt) {
	const dis = (running === false || countdown != null);
	const code = evt.keyCode;
	let key = evt.key;
	key = key.toUpperCase();

	if(getKey(code) == "u" && !dis) {
		up();
	}
	if(getKey(code) == "d" && !dis) {
		down();
	}
	if(getKey(code) == "l" && !dis) {
		left();
	}
	if(getKey(code) == "r" && !dis) {
		right();
	}
	if(getKey(code) == "p" && !dis) {
		pause();
	}
	if(key === "\\") {
		kill();
	}
}
upBtn.onclick = function() {
	if(running === false || countdown != null) return;
	up();
}
downBtn.onclick = function() {
	if(running === false || countdown != null) return;
	down();
}
leftBtn.onclick = function() {
	if(running === false || countdown != null) return;
	left();
}
rightBtn.onclick = function() {
	if(running === false || countdown != null) return;
	right();
}

var title = document.getElementById("title");
var pBtn = document.getElementById("play");
var pBtnArea = document.getElementById("playArea");
var pBG = document.getElementById("playBG");
var pFG = document.getElementById("playFG");
var trans = document.getElementById("trans");
var gameElem = document.getElementById("game");
var cZone = document.getElementById("comfort");
function comfort() {
	if(window.innerWidth > window.innerHeight) {
		cZone.style.width = "95vh";
		cZone.style.height = "95vh";
		return;
	}
	if(window.innerHeight > window.innerWidth) {
		cZone.style.width = "95vw";
		cZone.style.height = "95vw";
		return;
	}
	cZone.style.width = "95vh";
	cZone.style.height = "95vh";
}
setInterval(comfort, 50);
pBtnArea.onclick = function() {
	sfx.play();
	def();
	trans.style.display = "inline-block";
	URL.revokeObjectURL(trans.src);
	trans.src = URL.createObjectURL(blob817(img.transition));
	setTimeout(function() {
		gameElem.style.display = "inline-block";
		title.style.display = "none";
		pBtnArea.style.display = "none";
		cZone.style.backgroundColor = "hsl(0, 0%, 27%)";
		setTimeout(function() {
			URL.revokeObjectURL(trans.src);
			trans.style.display = "none";
			running = true;
		}, 3889)
	}, 3444);
};

async function init() {
	while(verifiedIMG !== true) {
		await wait(10);
	}
	await wait(50);
	
	URL.revokeObjectURL(title.src);
	title.src = URL.createObjectURL(blob817(img.titleAnim));
	await wait(4022);
	
	URL.revokeObjectURL(title.src);
	title.src = img.titleScreen;
	await wait(300);
	
	title.style.transform = "translate(-50%, 0)";
	title.style.top = "21px";
	title.style.width = "40%";
	await wait(300);
	
	title.style.imageRendering = "auto";
	await wait(1500);
	
	pBtn.style.display = "inline-block";
	await wait(50);
	
	pBG.style.opacity = "1";
	pFG.style.opacity = "1";
	pBtnArea.style.display = "inline-block";
}
init();
const dieAnim = {
	"stage1": function() {
		sfx.die();
		clearInterval(gameloop);
		(function() {
			let interval7362 = setInterval(function() {
				if(trail.length > 2) {
					trail.shift();
					if(tail - trail.length < 2) {
						showBG();
						apple();
						showTrail();
						showHead();
						eyes("shrink");
						showScore();
					};
					if(tail - trail.length == 2) {
						showBG();
						apple();
						showTrail();
						showHead();
						eyes(["dead", 2]);
						showScore();
					};
					if(tail - trail.length >= 3) {
						showBG();
						apple();
						showTrail();
						showHead();
						eyes(["dead", 4]);
						showScore();
					};
				} else {
					showBG();
					apple();

					let head = trail[trail.length - 1];
					let x1 = (head.x + 0.5) * 20;
					let y1 = (head.y + 0.5) * 20;
					let rad = 10;
					ctx.fillStyle = arrToCol(color[1]);
					circle(x1, y1, rad, outline);
					eyes(["dead", 4]);

					showScore();
					clearInterval(interval7362);
					interval7362 = null;
				}
			}, 1430 / (tail - 1));
			let waitUntil = setInterval(function() {
				if(interval7362 === null) {
					clearInterval(waitUntil);
					setTimeout(dieAnim.stage2, 500);
				};
			}, 100);
		})();
	},
	"stage2": function() {
		URL.revokeObjectURL(trans.src);
		trans.src = URL.createObjectURL(blob817(img.transition));
		trans.style.display = "inline-block";
		setTimeout(dieAnim.stage3, 3444);
	},
	"stage3": function() {
		gameElem.style.display = "none";
		title.style.display = "inline-block";
		pBtn.style.display = "inline-block";
		pBtnArea.style.display = "inline-block";
		cZone.style.backgroundColor = "hsl(0, 0%, 0%)";
		setTimeout(dieAnim.stage4, 3889);
	},
	"stage4": function() {
		URL.revokeObjectURL(trans.src);
		trans.style.display = "none";
	}
}
function die() {
	clearInterval(gameloop);
	setTimeout(function() {
		gameloop = null;
	}, 2500);

	showBG();
	apple();
	showTrail();
	showHead();
	eyes("shrink");
	showScore();
	dieAnim.stage1();
}
// ~~~ JIGGLY BUTTON ~~
var pBtnSize = dec(30);
var tar362 = dec(30);
var mom362 = dec(0);
var res362 = dec(0.4782969);
var pre362 = dec(30);
var inv362 = true;
var count362 = 0;
setInterval(function() {
	pBtn.style.width = pBtnSize.toString() + "%";
}, 1000/30);
setInterval(function() {
	if(pre362.toString() !== tar362.toString()) {
		res362 = dec(0.4782969);
		inv362 = true;
	}
	pre362 = tar362;
	let dis362 = tar362.minus(pBtnSize).abs();
	if(tar362.gt(pBtnSize)) {
		if(!inv362) res362 = res362.times(0.9);
		if(inv362) res362 = res362.dividedBy(0.9);
		if(res362.gte(1)) inv362 = false;
		mom362 = mom362.plus(dis362);
	}
	if(tar362.toNumber() < pBtnSize.toNumber()) {
		if(!inv362) res362 = res362.times(0.9);
		if(inv362) res362 = res362.dividedBy(0.9);
		if(res362.gte(1)) inv362 = false;
		mom362 = mom362.minus(dis362);
	}
	if(count362 > 0) {
		if(dis362.toNumber() < 0.05) {
			if(count362 >= 4) {
				count362 = 0;
				res362 = dec(1);
				mom362 = dec(0);
				pBtnSize = tar362;
			} else {
				count362++;
			}
		} else {
			count362 = 0;
		}
	} else {
		if(dis362.toNumber() < 0.05) {
			count362++;
		}
	}
	res362 = dec(Math.max(res362.toNumber(), 0.4782969));
	mom362 = mom362.times(res362);
	pBtnSize = pBtnSize.plus(mom362);
}, 1000/30);
pBtnArea.onmouseenter = function() {
	tar362 = dec(35);
	sfx.hover();
};
function pBtnLeave() {
	if(tar362.toNumber() != 34.9) tar362 = dec(30);
}
pBtnArea.onmouseleave = pBtnLeave
pBtnArea.onmousedown = function() {
	tar362 = dec(30);
};
pBtnArea.onmouseup = function() {
	tar362 = dec(34.9);
	setTimeout(function() {tar362 = dec(30)}, 3000);
};

function kill() { // if you can't reload due to extreme performance issues with loops, this will send you to a blank page faster than reloading will. Activated by pressing [\]
	window.location.href = "about:blank";
	window.location.replace("about:blank");
	document.body.innerHTML = "";
}