let mousedown = false;
document.body.addEventListener("mousedown", ()=>mousedown=true);
document.body.addEventListener("mouseup", ()=>mousedown=false);


const spawnSizeUfo = 50;
const startAmount = 50;

function getEyePos(side) {
    if (!side) {// left
        return [window.innerWidth * 0.36,window.innerHeight * 0.305];
    } else { // right
        return [window.innerWidth * 0.67,window.innerHeight * 0.305];
    }
}

function getById(buttons, id) {
    for (let i=0;i<buttons.length;i++) {
        if (buttons[i].id == id) {
            return buttons[i];
        }
    }
}

function hussbutton(id) {
    return {
        i: null,
        alive: true,
        id: id,
        x: -1,
        y: -1,
        xv: Math.random() * 20 - 10,
        yv: Math.random() * 20 - 10,
        clickcount: 0,
        mx: 0,
        my: 0,
        px: 70,
        py: 20,
        mouseStrength: 3,
        gravity: 0.5,
        ww: window.innerWidth,
        wh: window.innerHeight,
        mindist: 200,
        events: [],
        win: null,
        isExploding: false,
        poll() {
            let e = [...this.events];
            this.events = [];
            return e;
        },
        addEvent(data, target) {
            this.events.push({
                ...data,
                target: target,
                from: this.id,
            });
        },
        refreshpos() {
            if (this.win) this.win.moveTo(this.x - 100,this.y + 50)
            if (this.i) {this.i.style = `
            position: absolute;
            left: ${this.x + ((this.isExploding) ? Math.random()*30-15 : 0)}px;
            top: ${this.y + ((this.isExploding) ? Math.random()*30-15 : 0)}px;
            transform: translate(-50%,-50%)`}
        },
        refreshmouse(e) {
            this.mx = e.offsetX;
            this.my = e.offsetY;
        },
        makeExplosion() {
            var gif = document.createElement("img");
            gif.src = "./explosion.gif";
            gif.style = `position:absolute;top:${this.y}px;left:${this.x}px;transform:translate(-50%,-50%);`;
            window.setTimeout(()=>document.body.removeChild(gif), 700);
            document.body.appendChild(gif);
        },
        pollMyEvents() {
            let events = this.poll();
            for (let i=0;i<events.length;i++) {
                if (events[i].type == "explode" && this.alive && !this.isExploding) {
                    let dx = events[i].x - this.x;
                    let dy = events[i].y - this.y - 100; // simulate upwards force
                    let dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < 400) {
                        this.xv += -dx / dist * 20;
                        this.yv += -dy / dist * 20;

                        if (Math.random() < 0.2 && events[i].depth < 2) {
                            this.isExploding=true;
                            window.setTimeout(()=>{
                                this.addEvent({
                                    type: "explode",
                                    depth: events[i].depth + 1,
                                    x: this.x,
                                    y: this.y,
                                }, -1);
                                this.makeExplosion();
                                this.destroy();
                            }, Math.random() * 2000 +1000)
                        }
                    }
                }
            }
        },
        tick() {
            if (!this.alive) return;
            this.pollMyEvents();
            let dx = this.mx - this.x;
            let dy = this.my - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < this.mindist && mousedown) {
                this.xv += -dx / dist * this.mouseStrength;
                this.yv += -dy / dist * this.mouseStrength;
            }

            //this.xv *= 0.98;
            //this.yv *= 0.98;
            this.yv += this.gravity;

            if (this.x + this.xv < this.px) {
                this.x = this.ww - this.px;
            }
            if (this.y + this.yv < this.py) {
                //this.y = this.py;
                this.yv *= -0.7;
                this.xv *= 0.7;
            }

            if (this.x + this.xv > this.ww - this.px) {
                this.x = this.px;
            }
            if (this.y + this.yv > this.wh - this.py - 100) {
                //this.y = this.py;
                if (this.yv <= this.gravity + 0.1) {
                    this.yv=0;
                }
                this.y = this.wh - this.py - 100;
                this.yv *= -0.7;
                this.xv *= 0.7;
            }

            this.x += this.xv;
            this.y += this.yv;
            
            this.refreshpos();
            //window.requestAnimationFrame(() => this.tick());
        },
        destroy() {
            this.alive = false;
            if (this.win) this.win.close()
            if (this.i) document.body.removeChild(this.i);
        },
        init(isUfo) {
            /*this.win = window.open("./window.html", "_blank", "_blank");
            if (!this.win && this.id ==0) {
                alert("Window opening failed, consider allowing it and reloading")
            }
            if (!this.win) {
                this.destroy();
                return;
            }
            this.win.resizeTo(10,10);8*/
            this.i = document.createElement("button");
            this.i.textContent = "CLICK MEEEE!!!";
            document.body.appendChild(this.i);
            
            if (!isUfo) {
                this.x = Math.random() * (window.innerWidth - 100) + 50;
                this.y = Math.random() * (window.innerHeight - 100) + 50;
            } else {
                this.x = window.innerWidth * 0.24;
                this.y = window.innerHeight * 0.23;
            }
            this.refreshpos();
            window.addEventListener("resize", () => {
                this.ww = window.innerWidth;
                this.wh = window.innerHeight;
            });
            document.body.addEventListener("mousemove", (e) => this.refreshmouse(e));  
            this.i.addEventListener("click", (e) => {
                console.log("click!");
                //window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
                this.clickcount += 1;
                this.isExploding=true;
                //window.setTimeout(()=>shootLazers(this.id), 1000)
                this.addEvent({
                    type: "explode",
                    depth: 1,
                    x: this.x,
                    y: this.y,
                }, -1);
                this.makeExplosion();
                this.destroy();
            });  
        }
    };
}

let buttons = [];

for (let i=0; i< startAmount;i++) {
    buttons.push(hussbutton(i));
    buttons[i].init(false);
}

function makeLine(e1, p1, width, color) {
    // position difference from sorce to target
    let diff = [p1[0] - e1[0], p1[1] - e1[1]];

    // angle of lazer in radians
    let dir = -Math.atan2(diff[0], diff[1]) + Math.PI / 2;

    // center of lazer
    let square_pos = [(p1[0] + e1[0]) / 2, (p1[1] + e1[1]) / 2]

    // distance from source to target
    let distance = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]);

    let e = document.createElement("div");
    e.style = `
    background:${color};
    position:absolute;
    left: ${square_pos[0]}px;
    top: ${square_pos[1]}px;
    height: ${width}px;
    transform: translate(-50%,-50%) rotate(${dir}rad);
    width: ${distance}px;
    opacity: 0;
    animation-name: fadeout;
    animation-duration: .5s;
    animation-iteration-count: 1;
    `;

    document.body.appendChild(e);
    
    // delete after 2 seconds
    window.setTimeout(()=>document.body.removeChild(e), 500);
}

function shootLazers() {
    window.setTimeout(shootLazers, Math.random() * 1000 + 1000);
    if (buttons.length == 0) return;
    // select random element
    let selectedElement = {alive:false,isExploding:true};
    let it = 0;
    while (!selectedElement.alive && selectedElement.isExploding && it<100) {
        it++;
        selectedElement = buttons[Math.floor(Math.random() * buttons.length)];
    }
    //let selectedElement;
    //for (let i=0;i<buttons.length;i++) {
    //    if (buttons[i].id == id) {
    //        selectedElement = buttons[i];
    //        break;
    //    }
    //}

    if (!selectedElement.alive) {
        return;
    }
    
    // make super awesome lazer lines
    makeLine(getEyePos(false), [selectedElement.x,selectedElement.y], 10, "red");
    makeLine(getEyePos(true), [selectedElement.x,selectedElement.y], 10, "red");
    makeLine(getEyePos(false), [selectedElement.x,selectedElement.y], 2, "#faa");
    makeLine(getEyePos(true), [selectedElement.x,selectedElement.y], 2, "#faa");

    // force element to explode
    selectedElement.addEvent({
        type: "explode",
        depth: 1,
        x: selectedElement.x,
        y: selectedElement.y,
    }, -1);
    selectedElement.makeExplosion();
    selectedElement.destroy();
}

function sigmaUFO() {
    let ufo = document.body.querySelector("#UFO");
    ufo.style.left = "0px";
    window.setTimeout(() => {
        let x = buttons.length;
        for (let i=x; i< x + spawnSizeUfo;i++) {
            buttons.push(hussbutton(i));
            buttons[i].init(true);
        }
    }, 700);
    window.setTimeout(() => {
        ufo.style.left = "100%";
        ufoing = false;
    }, 1000)
}
let ufoing = false;

function tick() {
    let events = [];
    let newarr = [];
    for (let i=0;i<buttons.length;i++) {
        buttons[i].tick();
        let ev = buttons[i].poll();
        for (let i=0;i<ev.length;i++) {
            events.push(ev[i])
        }
        if (buttons[i].alive) {
            newarr.push(buttons[i]);
        }
    }
    for (let i=0;i<buttons.length;i++) {
        if (!buttons[i].alive) continue;
        for (let x=0;x<events.length;x++) {
            if (!events[x]) continue;
            if (events[x].target == -1 || events[x].target == buttons[x].id) {
                buttons[i].events.push(events[x]);
            }
        }
    }
    if (buttons.length < 5 && !ufoing) {
        ufoing = true;
        sigmaUFO();
    }
    buttons = newarr;
    requestAnimationFrame(tick);
}

tick();
shootLazers();

document.body.oncontextmenu = (e) => {
    e.preventDefault();
}