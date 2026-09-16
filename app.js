const seed=[
{name:"BONK",price:.0000124,liq:42000000,vol:8200000,chg:18.4,holders:182000},
{name:"WIF",price:0.71,liq:98000000,vol:15400000,chg:11.2,holders:112000},
{name:"POPCAT",price:.34,liq:21000000,vol:6100000,chg:24.1,holders:76000},
{name:"MOODENG",price:.18,liq:12500000,vol:5300000,chg:31.7,holders:51000}
];
let state=JSON.parse(localStorage.getItem("memeTrader")||"null")||{cash:100,positions:[],history:[],start:100};
function money(x){return "$"+Number(x).toFixed(2)}
function save(){localStorage.setItem("memeTrader",JSON.stringify(state))}
function score(c){let s=35+Math.min(c.chg,40)*.7+Math.min(c.vol/1000000,20)*1.1+Math.min(c.liq/10000000,10)*1.2;return Math.min(99,Math.round(s))}
function renderCoins(){
 coins.innerHTML=seed.sort((a,b)=>score(b)-score(a)).map(c=>`<div class="card"><div class="row"><b>${c.name}</b><span class="muted">${c.holders.toLocaleString()} holders</span></div><div class="score">${score(c)}/100</div><div class="muted">24h ${c.chg}% • Vol ${money(c.vol)} • Liq ${money(c.liq)}</div><div style="margin-top:8px">Price: ${c.price}</div><button class="buy" onclick="buy('${c.name}')">PAPER BUY</button></div>`).join("")
}
function buy(name){let c=seed.find(x=>x.name===name), pct=Math.min(25,Math.max(1,Number(risk.value)||5)), amt=state.cash*pct/100;if(amt<1)return alert("Not enough paper balance.");state.cash-=amt;state.positions.push({name,entry:c.price,amount:amt,qty:amt/c.price});state.history.push({name,side:"BUY",amount:amt,time:new Date().toLocaleString()});save();render()}
function sell(i){let p=state.positions[i],c=seed.find(x=>x.name===p.name);let value=p.qty*c.price;state.cash+=value;state.history.push({name:p.name,side:"SELL",amount:value,time:new Date().toLocaleString()});state.positions.splice(i,1);save();render()}
function render(){
 let equity=state.cash+state.positions.reduce((a,p)=>{let c=seed.find(x=>x.name===p.name);return a+p.qty*c.price},0);
 balance.textContent=money(state.cash);equityEl=document.getElementById("equity");equityEl.textContent=money(equity);pnl.textContent=money(equity-state.start);
 let sells=state.history.filter(x=>x.side==="SELL");winrate.textContent=sells.length?Math.round(sells.filter((x,i)=>x.amount>(state.history.filter(h=>h.name===x.name&&h.side==="BUY").at(-1)?.amount||0)).length/sells.length*100)+"%":"—";
 positions.innerHTML=state.positions.length?state.positions.map((p,i)=>{let c=seed.find(x=>x.name===p.name),v=p.qty*c.price;return `<div class="card row"><div><b>${p.name}</b><div class="muted">Entry ${p.entry} • Now ${c.price}</div></div><div>${money(v)}</div><button class="danger" onclick="sell(${i})">PAPER SELL</button></div>`}).join(""):`<div class="empty">No open positions.</div>`;
 history.innerHTML=state.history.length?state.history.slice().reverse().map(x=>`<div class="card row"><span>${x.side} ${x.name}</span><span>${money(x.amount)} • ${x.time}</span></div>`).join(""):`<div class="empty">No trades yet.</div>`;
 renderCoins()
}
scan.onclick=()=>{seed.forEach(c=>{c.chg+=(Math.random()*8-2);c.vol*=1+(Math.random()-.35)*.25});render()}
render();