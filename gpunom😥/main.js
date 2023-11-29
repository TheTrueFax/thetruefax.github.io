const canvas = document.querySelector("canvas");
if (canvas.getContext) {
const ctx = canvas.getContext("2d");

//Mandelbrot renderer
//
//By: Halifax FX Horsfield
//
//Big thanks to all the sites/videos that helped
//
//Wikipedia's Mandelbrot renderer Was the most help in making this

var vs = 1;
var vx = 0;
var vy = 0;
var sizey = 400;
var sizex = sizey*(2.47/2.24);
var pixperunit = 3;
var widt = sizex/pixperunit;
var heigh = sizey/pixperunit;
var x0;
var y0;
var x;
var xtemp;
var y;
var itr;
var mxitr = 1000;
var col = '';

function render() {

for (var pix = 0; pix < widt * pixperunit; pix+=pixperunit) {
    for (var piy = 0; piy < heigh * pixperunit; piy+=pixperunit) {
        x0 = map(pix / pixperunit,0,widt,(-2 *vs)+vx,(0.47 * vs)+vx);
        y0 = map(piy / pixperunit,0,heigh,(-1.12 *vs)+vy,(1.12 *vs)+vy);
        x = 0;
        y = 0;
        itr = 0;
        while (x*x + y*y <= 2*2 && itr < mxitr) {
            xtemp = x*x - y*y + x0;
            y = 2*x*y + y0;
            x = xtemp;
            itr += 1;
        }
        /*
        let quo = itr / mxitr;
        let colour = constrain(quo,0,1);
        if (quo > 0.5) {
            col = "rgb(" + colour * 255 + ",255," + colour*255 + ")";
        } else {
            col = "rgb(0," + colour*255 + ",0)";
        }
        */
        ctx.fillStyle = pallete(constrain(itr,0,1000),100,50,200);
        ctx.fillRect(pix,piy,pixperunit,pixperunit);
    }
}
}

document.addEventListener("keypress",(e) => {
console.log(e.which)

if (e.which == 119) {
vy-=vs;
} else if (e.which == 97) {
vx-=vs;
} else if (e.which == 115) {
vy+=vs;
} else if (e.which == 100) {
vx+=vs;
} else if (e.which == 114) {
vx-=vs/3;
vs/=2;
} else if (e.which == 102) {
vs*=2;
vx+=vs/3;
}
render();
});

//copy/paste
function Cpy() {
let inp = document.querySelector("#select");

inp.value = '{"vx":' + vx + ',"vy":' + vy + ',"vs":' + vs + ',"ppu":' + pixperunit + ',"ts":' + sizey + ',"valid":true}';
inp.select();
document.execCommand("copy");
navigator.clipboard.writeText(inp.value);

}
function Pst() {
var permissions = [{ "name": "clipboard-read" }];
navigator.permissions.query(permissions[0]);


let inp = document.querySelector("#select");
async function start() {
try { 
const text = await navigator.clipboard.readText();
inp.value = text;

const injson = JSON.parse(inp.value);
if (injson.valid) {
document.body.querySelector("#invvs").style.display = "none";
pixperunit = injson.ppu;
vx = injson.vx;
vy = injson.vy;
vs = injson.vs;

sizey = injson.ts;
sizex = sizey*(2.47/2.24);
widt = sizex/pixperunit;
heigh = sizey/pixperunit;
canvas.width = sizex;
canvas.height = sizey;
sli.max = (sizey / 100) + 1;
document.querySelector("input[type=number]").value = injson.ts;

document.querySelector('#sli').value=pixperunit;
document.querySelector('#lb').textContent = pixperunit.toString() + ' PPU';
render();
} else {
document.body.querySelector("#invvs").style.display = "block";
}
} catch (err) {
document.body.querySelector("#invvs").style.display = "block";
console.error(err.message,err.cause);

}
}
start();


}


//color settings
function pallete(iter,ofr,ofg,ofb) {
let retcol = {"r":0,"g":0,"b":0,"set":function(r,g,b){this.r=r;this.g=g;this.b=b;}};
if (iter == 1000) {
retcol.set(0,0,0);
} else if (iter > 15) {
retcol.set(map(iter,-150,300,0,255) - ofr,map(iter,-150,300,0,255)-ofg,map(iter,-150,300,0,255)-ofb);
} else {
retcol.set(map(iter,0,15,0,255) - ofg,map(iter,0,15,0,255)-ofb,map(iter,0,15,0,255)-ofr);
}

return "rgb(" + retcol.r + "," + retcol.g + "," + retcol.b + ")";
}

//math functions
function map(X,A,B,C,D) {
return (X-A)/(B-A) * (D-C) + C;
}
//(a-b)/(c-b) * (e-d) + d
function constrain(a,b,c) {
let d;
if (a<b) {
d = b;
} else if (a>c) {
d = c;
} else {
d = a;
}
return d;
}
render();
}

var Schange = document.querySelector("#Schange"),sli = document.querySelector("#sli"),cp = document.querySelector("#cp"),ps = document.querySelector("#ps"),rn=document.querySelector("#rn"),rc=document.body.querySelector("#rc"),drop = document.querySelector("#drop"),pall = document.querySelector("#pall");

sli.addEventListener("input",function() {
pixperunit = parseFloat(document.querySelector('#sli').value);
widt = sizex/pixperunit;
heigh = sizey/pixperunit;
document.querySelector('#lb').textContent = document.querySelector('#sli').value + ' PPU';
})

rn.addEventListener("click",function() {
render();
})

rc.addEventListener("click",function() {
pixperunit=3;
widt = sizex/pixperunit;
heigh = sizey/pixperunit;
vs=1;
vx=0;
vy=0;
render();
document.querySelector('#sli').value=pixperunit;
document.querySelector('#lb').textContent = pixperunit.toString() + ' PPU';
})

cp.addEventListener("click",function() {
Cpy();
})

ps.addEventListener("click",function() {
Pst();
})

Schange.addEventListener("input",function(e) {
sizey = e.currentTarget.value;
sizex = sizey*(2.47/2.24);
widt = sizex/pixperunit;
heigh = sizey/pixperunit;
canvas.width = sizex;
canvas.height = sizey;
sli.max = (sizey / 100) + 1;
render();
})
