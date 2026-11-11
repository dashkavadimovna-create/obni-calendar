/* Obni visual editor. Uses the original calendar renderer and event storage unchanged. */
(() => {
'use strict';
const NS='http://www.w3.org/2000/svg', STORAGE='obni_design_v1';
const P='#582269',Y='#f5d43e',C='#fff4df',L='#d6b9df';
const el=id=>document.getElementById(id), clone=x=>JSON.parse(JSON.stringify(x));
const uid=()=> 'd'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const number=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
const wrap=body=>`<svg xmlns="${NS}" viewBox="0 0 200 200" width="200" height="200"><g stroke="${P}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
const art={
 snow:wrap(`<g fill="none"><path d="M100 22v156M32 61l136 78M32 139l136-78M78 35l22 20 23-20M78 165l22-20 23 20M37 84l29-8-4-28M137 153l-4-28 29-8M37 116l29 8-4 28M137 47l-4 28 29 8"/></g><circle cx="100" cy="100" r="13" fill="${Y}"/>`),
 tree:wrap(`<path fill="${L}" d="M99 29L59 77h18l-33 46h22l-32 44h132l-32-44h22l-34-46h19Z"/><path d="M100 153v31"/><path d="M100 16l5 10 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2Z" fill="${Y}"/><g fill="${Y}" stroke="none"><circle cx="89" cy="83" r="6"/><circle cx="114" cy="114" r="7"/><circle cx="76" cy="144" r="6"/></g>`),
 garland:wrap(`<path d="M14 52q86 88 172 0" fill="none"/><g fill="${Y}"><path d="M38 74l-7 24q10 24 21 0l-7-24Z"/><path d="M83 99l-7 24q10 24 21 0l-7-24Z"/><path d="M128 94l-7 24q10 24 21 0l-7-24Z"/><path d="M169 71l-7 24q10 24 21 0l-7-24Z"/></g><path d="M26 156q55-16 110 0" stroke="${L}" fill="none" stroke-dasharray="2 12"/>`),
 candle:wrap(`<ellipse cx="100" cy="174" rx="62" ry="10" fill="${L}" stroke="none"/><path d="M73 79h54v91H73Z" fill="${C}"/><ellipse cx="100" cy="80" rx="27" ry="8" fill="${Y}"/><path d="M99 80V62"/><path d="M100 17q-35 34-2 47q30-12 2-47Z" fill="${Y}"/><path d="M79 85v28q9 13 14-1V91" fill="${L}"/><path d="M45 39l-8-9m118 9 8-9M32 66H21m147 0h11" fill="none"/>`),
 bow:wrap(`<path d="M92 88Q32 20 25 66q-8 56 64 36L49 165l33-6 16 18 8-73 29 67 13-26 31 1-66-49q72 17 63-34-8-44-65 23Z" fill="${L}"/><path d="M83 86q18-10 32 0l-3 22q-12 10-27-1Z" fill="${Y}"/><path d="M45 71l35 17m44 0 31-18" fill="none"/>`),
 flower:wrap(`<g fill="${L}"><path d="M99 89Q43 19 87 17q32-3 20 65Q142 7 166 44q17 29-50 49Q194 77 184 119q-8 33-72-12Q162 173 119 185q-34 5-20-69Q58 193 31 154q-19-30 54-51Q5 116 16 74q10-32 74 17Z"/></g><circle cx="100" cy="101" r="23" fill="${Y}"/><path d="M93 96l3 3m12 5 2-3"/>`),
 butterfly:wrap(`<path d="M93 94Q33 9 19 52q-15 45 64 55Q7 112 40 156q29 26 57-43Q133 187 166 155q27-43-54-50Q194 86 175 46q-21-36-68 47Z" fill="${L}"/><path d="M100 88v45M98 88L83 66m20 22 15-23" fill="none"/><g fill="${Y}" stroke="none"><circle cx="53" cy="67" r="12"/><circle cx="149" cy="65" r="12"/><circle cx="63" cy="134" r="8"/><circle cx="142" cy="132" r="8"/></g>`),
 branch:wrap(`<path d="M51 177Q117 108 141 22" fill="none"/><g fill="${L}"><path d="M76 145Q17 131 42 99q35-3 34 46Z"/><path d="M94 119q50 7 49-31-31-18-49 31Z"/><path d="M113 85Q65 67 83 42q30-4 30 43Z"/><path d="M129 55q49 3 42-31-28-15-42 31Z"/></g><g fill="${Y}" stroke="none"><circle cx="53" cy="161" r="7"/><circle cx="155" cy="67" r="6"/></g>`),
 lemon:wrap(`<path d="M27 122Q15 57 101 51q49 0 67 44l10 9-12 14q-29 59-100 43-30-7-39-25l-11-8Z" fill="${Y}"/><path d="M101 51q19-42 54-27-3 36-54 27Z" fill="${L}"/><path d="M46 119q-4-33 33-44" fill="none" stroke="${C}" stroke-width="7"/><g stroke-width="2"><path d="M112 121h1m19 8h1m-30 13h1"/></g>`),
 berries:wrap(`<path d="M53 70q16 33 53 71 38-39 47-71-45-36-100 0Z" fill="${L}"/><path d="M83 59L69 32l32 15 15-27 4 31 30-9-26 26Z" fill="${Y}"/><g fill="${Y}" stroke="none"><ellipse cx="76" cy="81" rx="3" ry="6"/><ellipse cx="105" cy="84" rx="3" ry="6"/><ellipse cx="132" cy="81" rx="3" ry="6"/><ellipse cx="93" cy="109" rx="3" ry="6"/><ellipse cx="117" cy="109" rx="3" ry="6"/></g><path d="M31 163q45-14 83 4" fill="none" stroke-dasharray="1 12"/>`),
 sun:wrap(`<g fill="none"><path d="M100 14v18m0 136v18M14 100h18m136 0h18M39 39l13 13m96 96 13 13M39 161l13-13m96-96 13-13"/></g><path d="M156 100q0 58-56 57-59-1-57-57 0-57 57-56 55 1 56 56Z" fill="${Y}"/><path d="M76 96h1m46 0h1m-37 23q14 15 28-1" fill="none"/><circle cx="68" cy="110" r="5" fill="${L}" stroke="none"/><circle cx="133" cy="110" r="5" fill="${L}" stroke="none"/>`),
 leaf:wrap(`<path d="M104 175Q12 125 40 65l25 10-2-41 31 22 18-38 16 40 32-12-8 38 26-2q2 65-74 93Z" fill="${Y}"/><path d="M102 183L106 65m-1 70-41-30m43 10 33-27" fill="none"/>`),
 rain:wrap(`<g fill="${L}"><path d="M56 23q-52 65-10 78 49 7 10-78Z"/><path d="M143 66q-54 68-10 82 48 7 10-82Z"/><path d="M65 120q-32 40-7 49 31 6 7-49Z"/></g><path d="M44 75v7m88 39v7" stroke="${C}" stroke-width="6"/>`),
 mushroom:wrap(`<path d="M86 97q7 42-4 71 21 15 43-1-14-40-9-70Z" fill="${C}"/><path d="M28 96q8-73 73-74 66-1 76 74-73 28-149 0Z" fill="${L}"/><g fill="${Y}" stroke="none"><circle cx="72" cy="63" r="12"/><circle cx="126" cy="54" r="11"/><circle cx="142" cy="88" r="9"/><circle cx="46" cy="89" r="8"/></g><path d="M54 181q48-13 95 0" fill="none"/>`),
 star:wrap(`<path d="M100 20l20 52 56 5-43 36 15 55-48-29-48 29 15-55-43-36 56-5Z" fill="${Y}"/><path d="M93 60l-8 26-28 4" fill="none" stroke="${C}" stroke-width="5"/>`)
};
const categories={
 'Зима':[['snow','Снежинка'],['tree','Елочка'],['garland','Гирлянда'],['candle','Свеча'],['bow','Бантик'],['star','Звезда']],
 'Весна':[['flower','Цветок'],['butterfly','Бабочка'],['branch','Веточка'],['bow','Бантик']],
 'Лето':[['lemon','Лимон'],['berries','Ягоды'],['sun','Солнце'],['flower','Цветок']],
 'Осень':[['leaf','Лист'],['rain','Капли'],['mushroom','Гриб'],['candle','Свеча']],
 'Мои украшения':[]
};
let state={version:1,months:{},assets:[],templates:[]}, storageFailed=false, unreadableDesign=null;
try{const saved=localStorage.getItem(STORAGE);if(saved)state=validateState(JSON.parse(saved));}catch{storageFailed=true;try{unreadableDesign=localStorage.getItem(STORAGE);}catch{}}
let designMode=false, currentMonth=null, selected=null, activeCategory='Зима', baseSources=new Map(), canvas=null;
let history=new Map(), gesture=null, points=new Map(), toastTimer, valueBefore=null;
const originalRender=render;
const toolbar=document.createElement('nav');toolbar.className='mode-tabs';toolbar.setAttribute('aria-label','Режим конструктора');
toolbar.innerHTML='<button type="button" id="scheduleMode" aria-pressed="true">Расписание</button><button type="button" id="designMode" aria-pressed="false">✦ Дизайн</button>';
document.querySelector('.top').after(toolbar);
const panel=document.createElement('section');panel.className='panel design-panel';panel.hidden=true;
panel.innerHTML=`<h2>Маленькие детали, твой стиль</h2><p class="design-intro">Выбери украшение и размести его на афише. Карточки встреч закреплены.</p><div class="pair"><div><label for="designMonth">Месяц</label><select id="designMonth"></select></div><div><label for="designYear">Год</label><input id="designYear" type="number" min="2025" max="2100"></div></div><div class="category-tabs" id="designCategories" role="group" aria-label="Категории украшений"></div><div class="sticker-grid" id="stickerLibrary"></div><button class="alt upload-button" id="uploadDecoration">↑ Загрузить PNG или SVG</button><input type="file" id="decorationFile" accept="image/png,image/svg+xml,.png,.svg" hidden><p class="design-note">До 2 МБ на файл. PNG оптимизируется для афиши. Свои украшения остаются в этом браузере и входят в резервную копию.</p><details open><summary>Слои <span id="layerCount"></span></summary><p class="design-note">Верхний слой - первый в списке. Заблокированный слой можно выбрать здесь и разблокировать.</p><div class="layer-list" id="designLayers"></div></details><details><summary>Точное положение</summary><div class="pair"><div><label for="designX">По горизонтали</label><input type="number" id="designX" step="1"></div><div><label for="designY">По вертикали</label><input type="number" id="designY" step="1"></div></div><p class="design-note">Координаты на афише 1080 × 1350. Можно двигать стрелками на клавиатуре.</p></details><details open><summary>Мои шаблоны</summary><div class="template-row"><input id="templateName" maxlength="60" aria-label="Название шаблона" placeholder="Например, уютная зима"><button id="saveTemplate" class="alt">Сохранить</button></div><label for="templateSelect">Сохраненное оформление</label><select id="templateSelect"></select><div class="template-buttons"><button id="applyTemplate" class="alt">Применить</button><button id="exportDesign" class="outline">Копия дизайна</button><button id="restoreDesign" class="outline">Восстановить</button></div><input type="file" id="designFile" accept="application/json,.json" hidden><p class="design-note">Шаблон переносит украшения и оформление в другой месяц. Встречи остаются своими. «Копия дизайна» сохраняет оформление всех месяцев, свои украшения и шаблоны.</p></details>`;
document.querySelector('.layout').append(panel);
const tools=document.createElement('div');tools.className='design-tools';tools.hidden=true;
tools.innerHTML=`<div class="tool-row"><button id="designUndo" class="alt" aria-label="Отменить действие">↶</button><button id="designRedo" class="alt" aria-label="Повторить действие">↷</button><button id="duplicateDecoration" class="alt">Дубль</button><button id="lockDecoration" class="alt">Закрепить</button><button id="deleteDecoration" class="danger">Удалить</button><button id="raiseDecoration" class="outline" aria-label="На слой вперед">Вперед ↑</button><button id="lowerDecoration" class="outline" aria-label="На слой назад">Назад ↓</button><button id="designExportPNG" class="alt">PNG ↓</button></div><p class="selection-label" id="selectedDecoration">Коснись украшения или заголовка месяца</p><div class="quick-values"><div><label for="designScale">Размер <output id="scaleValue">100%</output></label><input type="range" id="designScale" min="20" max="400" value="100"></div><div><label for="designRotation">Поворот <output id="rotationValue">0°</output></label><input type="range" id="designRotation" min="-180" max="180" value="0"></div></div>`;
document.querySelector('.preview h2').after(tools);
const help=document.createElement('p');help.className='design-mobile-hint';help.hidden=true;help.textContent='Один палец - двигать. Два пальца - менять размер и поворачивать. Круг сверху - поворот, круг в углу - размер. Прокручивай страницу за пределами афиши.';el('poster').after(help);
const toastNode=document.createElement('div');toastNode.className='design-toast';toastNode.setAttribute('role','status');toastNode.setAttribute('aria-live','polite');toastNode.hidden=true;document.body.append(toastNode);
function toast(message){toastNode.textContent=message;toastNode.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastNode.hidden=true,4200);}
function persist(){if(storageFailed){toast('Сохранение приостановлено: прежний дизайн поврежден. Скачай полную резервную копию перед восстановлением.');return false;}try{localStorage.setItem(STORAGE,JSON.stringify(state));return true;}catch{toast('Память браузера заполнена. Скачай резервную копию - изменения пока доступны на этой странице.');return false;}}
function monthDesign(){return state.months[key()];}
function hist(){if(!history.has(key()))history.set(key(),{past:[],future:[]});return history.get(key());}
function remember(before){const after=JSON.stringify(monthDesign());if(JSON.stringify(before)===after)return;const h=hist();h.past.push(before);if(h.past.length>40)h.past.shift();h.future=[];persist();}
function change(action){finishGesture();const before=clone(monthDesign());action();remember(before);paint();}
function current(){return monthDesign()?.items.find(i=>i.id===selected);}
function setMode(on){finishGesture();designMode=on;document.querySelector('.app').classList.toggle('design-mode',on);document.querySelector('.controls').hidden=on;panel.hidden=!on;tools.hidden=!on;help.hidden=!on;el('scheduleMode').setAttribute('aria-pressed',String(!on));el('designMode').setAttribute('aria-pressed',String(on));el('poster').classList.toggle('design-active',on);el('poster').setAttribute('tabindex',on?'0':'-1');el('poster').setAttribute('aria-label',on?'Афиша. Выбери украшение для перемещения':'Предпросмотр расписания');paint();}
el('scheduleMode').onclick=()=>setMode(false);el('designMode').onclick=()=>setMode(true);
function bbox(node,fallback){try{const b=node.getBBox();if(b.width&&b.height)return {x:b.x,y:b.y,width:b.width,height:b.height};}catch{}return fallback;}
function collectSources(svg){
 baseSources=new Map();const deco=svg.querySelector('[data-base-decor]');
 if(deco){
  const parts=[];
  [...deco.children].forEach((node,index)=>{
   if(node.localName==='g'&&node.children.length>1){
    [...node.children].forEach(child=>{const wrapper=node.cloneNode(false);wrapper.append(child.cloneNode(true));parts.push({html:wrapper.outerHTML,b:bbox(child,{x:index?940:25,y:130,width:130,height:130})});});
   }else parts.push({html:node.outerHTML,b:bbox(node,{x:index?940:25,y:130,width:130,height:130})});
  });
  const groups=[];
  for(const part of parts){const cx=part.b.x+part.b.width/2,cy=part.b.y+part.b.height/2;let group=part.b.width<350?groups.find(g=>g.b.width<350&&Math.abs(g.b.x+g.b.width/2-cx)<120&&Math.abs(g.b.y+g.b.height/2-cy)<140):null;
   if(!group){groups.push({html:part.html,b:{...part.b}});continue;}const x=Math.min(group.b.x,part.b.x),y=Math.min(group.b.y,part.b.y),right=Math.max(group.b.x+group.b.width,part.b.x+part.b.width),bottom=Math.max(group.b.y+group.b.height,part.b.y+part.b.height);group.b={x,y,width:right-x,height:bottom-y};group.html+=part.html;
  }
  groups.forEach((g,index)=>baseSources.set('decor-'+index,{...g,label:'Декор '+(index+1)}));deco.remove();
 }
 const title=svg.querySelector('[data-month-title]');if(title){baseSources.set('month',{html:title.innerHTML,b:{x:125,y:180,width:830,height:150},label:'Заголовок месяца'});title.remove();}
}
function defaults(){return [...baseSources].map(([builtin,s])=>({id:uid(),builtin,label:s.label,x:s.b.x+s.b.width/2,y:s.b.y+s.b.height/2,scale:1,rotation:0,locked:false,w:s.b.width,h:s.b.height}));}
render=function(){
 const monthChanged=currentMonth!==key();
 if(monthChanged){finishGesture();selected=null;currentMonth=key();const saved=state.months[key()];if(saved){el('theme').value=saved.theme;el('columns').value=String(saved.columns);}}
 originalRender();canvas=el('poster').querySelector('svg');canvas.setAttribute('data-poster','true');collectSources(canvas);
 if(!state.months[key()])state.months[key()]={theme:el('theme').value,columns:Number(el('columns').value),items:defaults()};
 paint();return canvas.outerHTML;
};
function shape(i){
 if(i.builtin){const s=baseSources.get(i.builtin);if(!s)return '';return `<g transform="translate(${-s.b.x-s.b.width/2} ${-s.b.y-s.b.height/2})">${s.html}</g>`;}
 const asset=i.asset?state.assets.find(a=>a.id===i.asset):null;
 if(asset)return `<image href="${escapeXML(asset.data)}" x="${-i.w/2}" y="${-i.h/2}" width="${i.w}" height="${i.h}" preserveAspectRatio="xMidYMid meet"/>`;
 return `<g transform="translate(-100 -100)">${(art[i.art]||art.star).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g>`;
}
function paintCanvas(transformOnly=false){
 if(!canvas)return;let root=canvas.querySelector('[data-decoration-layer]');if(!root){root=document.createElementNS(NS,'g');root.setAttribute('data-decoration-layer','true');canvas.append(root);}
 if(transformOnly&&root.children.length===monthDesign().items.length){const item=current();if(item){const group=[...root.children].find(n=>n.getAttribute('data-design-item')===item.id);if(group)group.setAttribute('transform',`translate(${item.x} ${item.y}) rotate(${item.rotation}) scale(${item.scale})`);}}else root.innerHTML=monthDesign().items.map(i=>`<g data-design-item="${escapeXML(i.id)}" data-locked="${i.locked}" transform="translate(${i.x} ${i.y}) rotate(${i.rotation}) scale(${i.scale})">${shape(i)}</g>`).join('');
 el('poster').querySelector('.design-overlay')?.remove();
 const item=current();if(!designMode||!item)return;
 const overlay=document.createElementNS(NS,'svg');overlay.setAttribute('viewBox','0 0 1080 1350');overlay.classList.add('design-overlay');overlay.setAttribute('aria-hidden','true');
 const w=item.w*item.scale,h=item.h*item.scale,stroke=item.locked?'#a494a5':P;
 overlay.innerHTML=`<g transform="translate(${item.x} ${item.y}) rotate(${item.rotation})"><rect x="${-w/2-9}" y="${-h/2-9}" width="${w+18}" height="${h+18}" rx="10" fill="none" stroke="${stroke}" stroke-width="4" stroke-dasharray="9 7"/>${item.locked?'':`<path d="M0 ${-h/2-9}v-42" stroke="${P}" stroke-width="3"/><circle class="edit-handle" data-handle="rotate" cx="0" cy="${-h/2-56}" r="25" fill="${Y}" stroke="${P}" stroke-width="3"/><path d="M-9 ${-h/2-55}a10 10 0 1 1 12 8" fill="none" stroke="${P}" stroke-width="3"/><circle class="edit-handle" data-handle="scale" cx="${w/2+9}" cy="${h/2+9}" r="26" fill="${C}" stroke="${P}" stroke-width="3"/><path d="M${w/2} ${h/2}l18 18m-13 0h13v-13" fill="none" stroke="${P}" stroke-width="3"/>`}</g>`;
 el('poster').append(overlay);
}
function updateInspector(){
 el('designMonth').value=el('month').value;el('designYear').value=el('year').value;const i=current(),h=hist();el('designUndo').disabled=!h.past.length;el('designRedo').disabled=!h.future.length;
 for(const id of ['duplicateDecoration','lockDecoration','deleteDecoration','raiseDecoration','lowerDecoration','designScale','designRotation','designX','designY'])el(id).disabled=!i|| (i.locked&&id!=='lockDecoration');
 el('selectedDecoration').textContent=i?(i.label+(i.locked?' · закреплено':'')):'Коснись украшения или заголовка месяца';
 el('lockDecoration').textContent=i?.locked?'Открепить':'Закрепить';
 el('scaleValue').textContent=i?Math.round(i.scale*100)+'%':'100%';el('rotationValue').textContent=i?Math.round(i.rotation)+'°':'0°';
 if(i){el('designScale').value=Math.round(i.scale*100);el('designRotation').value=i.rotation;el('designX').value=Math.round(i.x);el('designY').value=Math.round(i.y);}
}
function paint(){paintCanvas();updateInspector();paintLayers();paintTemplates();}
function paintLayers(){const layers=monthDesign().items;el('layerCount').textContent='· '+layers.length;const container=el('designLayers');container.replaceChildren();[...layers].reverse().forEach(i=>{const b=document.createElement('button');b.type='button';b.className='layer-button';b.setAttribute('aria-pressed',String(i.id===selected));const name=document.createElement('span');name.textContent=i.label;const meta=document.createElement('small');meta.textContent=i.locked?'Закреплено':'Выбрать';b.append(name,meta);b.onclick=()=>{selected=i.id;paint();};container.append(b);});}
function paintTemplates(){const select=el('templateSelect'),old=select.value;select.replaceChildren();const empty=new Option(state.templates.length?'Выбери шаблон':'Пока нет шаблонов','');select.add(empty);state.templates.forEach(t=>select.add(new Option(t.name,t.id)));if(state.templates.some(t=>t.id===old))select.value=old;el('applyTemplate').disabled=!select.value;}
el('templateSelect').onchange=()=>el('applyTemplate').disabled=!el('templateSelect').value;
function library(){
 const cats=el('designCategories');cats.replaceChildren();for(const name of Object.keys(categories)){const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('aria-pressed',String(name===activeCategory));b.onclick=()=>{activeCategory=name;library();};cats.append(b);}
 const grid=el('stickerLibrary');grid.replaceChildren();const choices=activeCategory==='Мои украшения'?state.assets.map(a=>({asset:a.id,label:a.label,data:a.data})):categories[activeCategory].map(([id,label])=>({art:id,label}));
 if(!choices.length){const p=document.createElement('p');p.className='empty-library';p.textContent='Здесь будут твои PNG и SVG. Загрузи украшение с прозрачным фоном.';grid.append(p);}
 choices.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='sticker-card';b.setAttribute('aria-label','Добавить: '+c.label);if(c.data){const img=document.createElement('img');img.src=c.data;img.alt='';b.append(img);}else b.innerHTML=art[c.art];const name=document.createElement('span');name.textContent=c.label;b.append(name);b.onclick=()=>add(c);grid.append(b);});
}
function add(choice){if(monthDesign().items.length>=100){toast('На одной афише можно разместить до 100 украшений.');return;}change(()=>{const asset=choice.asset?state.assets.find(a=>a.id===choice.asset):null;const ratio=asset?asset.width/asset.height:1;const w=ratio>=1?200:200*ratio,h=ratio>=1?200/ratio:200;const i={id:uid(),label:choice.label,art:choice.art||null,asset:choice.asset||null,x:540,y:300,w,h,scale:1,rotation:0,locked:false};monthDesign().items.push(i);selected=i.id;});toast('Украшение добавлено. Перетащи его на афише.');if(window.innerWidth<=800)poster.scrollIntoView({behavior:'smooth',block:'center'});}
function undo(redo=false){finishGesture();const h=hist(),from=redo?h.future:h.past,to=redo?h.past:h.future;if(!from.length)return;to.push(clone(monthDesign()));state.months[key()]=from.pop();selected=null;el('theme').value=monthDesign().theme;el('columns').value=String(monthDesign().columns);persist();render();}
el('designUndo').onclick=()=>undo();el('designRedo').onclick=()=>undo(true);
el('duplicateDecoration').onclick=()=>{const i=current();if(!i||i.locked)return;if(monthDesign().items.length>=100)return toast('Достигнут лимит 100 украшений.');change(()=>{const copy={...clone(i),id:uid(),x:clamp(i.x+25,0,1080),y:clamp(i.y+25,0,1350)};monthDesign().items.push(copy);selected=copy.id;});};
el('deleteDecoration').onclick=()=>{const i=current();if(!i||i.locked)return;change(()=>{monthDesign().items=monthDesign().items.filter(x=>x.id!==selected);selected=null;});};
el('lockDecoration').onclick=()=>{const i=current();if(i)change(()=>{i.locked=!i.locked;});};
function reorder(delta){const i=current();if(!i||i.locked)return;change(()=>{const a=monthDesign().items,n=a.findIndex(x=>x.id===i.id),target=clamp(n+delta,0,a.length-1);a.splice(n,1);a.splice(target,0,i);});}
el('raiseDecoration').onclick=()=>reorder(1);el('lowerDecoration').onclick=()=>reorder(-1);
function normalizedAngle(v){return ((v+180)%360+360)%360-180;}
for(const [id,field,convert] of [['designScale','scale',v=>clamp(v/100,.2,4)],['designRotation','rotation',v=>normalizedAngle(v)],['designX','x',v=>clamp(v,-200,1280)],['designY','y',v=>clamp(v,-200,1550)]]){
 const input=el(id);input.addEventListener('focus',()=>{valueBefore=clone(monthDesign());});input.addEventListener('pointerdown',()=>{valueBefore=clone(monthDesign());});
 if(input.type==='range')input.oninput=()=>{const i=current();if(!i||i.locked)return;if(!valueBefore)valueBefore=clone(monthDesign());i[field]=convert(number(input.value));paintCanvas(true);el('scaleValue').textContent=Math.round(i.scale*100)+'%';el('rotationValue').textContent=Math.round(i.rotation)+'°';};
 input.onchange=()=>{const i=current();if(!i||i.locked)return;const before=valueBefore||clone(monthDesign());i[field]=convert(number(input.value));remember(before);valueBefore=null;paint();};
}
function pos(e){const r=el('poster').getBoundingClientRect();return {x:(e.clientX-r.left)*1080/r.width,y:(e.clientY-r.top)*1350/r.height};}
function pairGeometry(){const a=[...points.values()];return {x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2,d:Math.max(1,Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)),angle:Math.atan2(a[1].y-a[0].y,a[1].x-a[0].x)*180/Math.PI};}
function finishGesture(cancel=false){if(!gesture)return;const before=gesture.before,gestureMonth=gesture.month;gesture=null;points.clear();if(gestureMonth!==key()){state.months[gestureMonth]=before;return;}if(cancel){state.months[key()]=before;}else remember(before);paint();}
const poster=el('poster');
poster.addEventListener('pointerdown',e=>{
 if(!designMode||e.button>0)return;const p=pos(e);const handle=e.target.closest('[data-handle]');const target=e.target.closest('[data-design-item]');
 if(!gesture){if(target)selected=target.getAttribute('data-design-item');else if(!handle){selected=null;paint();return;}const i=current();if(!i)return;if(i.locked){paint();toast('Слой закреплен. Нажми «Открепить», чтобы двигать его.');return;}
 gesture={month:key(),before:clone(monthDesign()),initial:clone(i),start:p,type:handle?.getAttribute('data-handle')||'move'};
 }else if(points.size>=2)return;
 e.preventDefault();points.set(e.pointerId,p);try{poster.setPointerCapture(e.pointerId);}catch{}
 if(points.size===2){gesture.initial=clone(current());gesture.pair=pairGeometry();gesture.type='pinch';}paintCanvas();updateInspector();paintLayers();
});
poster.addEventListener('pointermove',e=>{
 if(!gesture||!points.has(e.pointerId))return;e.preventDefault();points.set(e.pointerId,pos(e));const i=current();if(!i||i.locked)return;const p=points.get(e.pointerId),g=gesture,s=g.initial;
 if(g.type==='pinch'&&points.size>=2){const pair=pairGeometry();i.scale=clamp(s.scale*pair.d/g.pair.d,.2,4);i.rotation=normalizedAngle(s.rotation+pair.angle-g.pair.angle);i.x=clamp(s.x+pair.x-g.pair.x,-200,1280);i.y=clamp(s.y+pair.y-g.pair.y,-200,1550);}
 else if(g.type==='move'){i.x=clamp(s.x+p.x-g.start.x,-200,1280);i.y=clamp(s.y+p.y-g.start.y,-200,1550);}
 else if(g.type==='scale'){const a=Math.max(1,Math.hypot(g.start.x-s.x,g.start.y-s.y)),b=Math.hypot(p.x-s.x,p.y-s.y);i.scale=clamp(s.scale*b/a,.2,4);}
 else if(g.type==='rotate'){const a=Math.atan2(g.start.y-s.y,g.start.x-s.x),b=Math.atan2(p.y-s.y,p.x-s.x);i.rotation=normalizedAngle(s.rotation+(b-a)*180/Math.PI);}
 paintCanvas(true);updateInspector();
},{passive:false});
poster.addEventListener('pointerup',e=>{if(!gesture||!points.has(e.pointerId))return;e.preventDefault();points.delete(e.pointerId);finishGesture();});
poster.addEventListener('pointercancel',()=>finishGesture(true));
poster.addEventListener('lostpointercapture',e=>{if(gesture&&points.has(e.pointerId))finishGesture();});
document.addEventListener('keydown',e=>{if(!designMode||/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName))return;if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo(e.shiftKey);return;}const i=current();if(!i||i.locked)return;const delta=e.shiftKey?10:1;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();change(()=>{if(e.key==='ArrowLeft')i.x-=delta;if(e.key==='ArrowRight')i.x+=delta;if(e.key==='ArrowUp')i.y-=delta;if(e.key==='ArrowDown')i.y+=delta;});}});
// Preserve calendar handlers and add month-specific visual preferences.
for(const id of ['theme','columns']){el(id).onchange=()=>{
 change(()=>{monthDesign()[id]=id==='columns'?Number(el(id).value):el(id).value;if(id==='theme'){
 const own=monthDesign().items.filter(i=>!i.builtin),oldTitle=monthDesign().items.find(i=>i.builtin==='month');originalRender();canvas=el('poster').querySelector('svg');canvas.setAttribute('data-poster','true');collectSources(canvas);const builtins=defaults();if(oldTitle){const title=builtins.find(i=>i.builtin==='month');if(title)Object.assign(title,{x:oldTitle.x,y:oldTitle.y,scale:oldTitle.scale,rotation:oldTitle.rotation,locked:oldTitle.locked});}monthDesign().items=[...builtins,...own];selected=null;
 }});render();
};}
// The original month/year change handlers already call the wrapped renderer.
el('saveTemplate').onclick=()=>{const name=el('templateName').value.trim();if(!name){toast('Дай шаблону название.');el('templateName').focus();return;}const t={id:uid(),name,design:clone(monthDesign())};state.templates.push(t);persist();paintTemplates();el('templateSelect').value=t.id;el('applyTemplate').disabled=false;el('templateName').value='';toast('Шаблон сохранен. Его можно применить в другом месяце.');};
el('applyTemplate').onclick=()=>{const t=state.templates.find(t=>t.id===el('templateSelect').value);if(!t)return;if(!confirm('Применить шаблон «'+t.name+'»? Оформление этого месяца изменится, встречи останутся. Действие можно отменить.'))return;const before=clone(monthDesign());state.months[key()]=clone(t.design);state.months[key()].items.forEach(i=>i.id=uid());selected=null;el('theme').value=t.design.theme;el('columns').value=String(t.design.columns);remember(before);render();toast('Шаблон применен');};
function safeSVG(text){
 const doc=new DOMParser().parseFromString(text,'image/svg+xml'),root=doc.documentElement;
 if(root.localName!=='svg'||doc.querySelector('parsererror'))throw Error('Не удалось прочитать SVG');
 const tags=new Set(['svg','g','path','circle','ellipse','rect','line','polyline','polygon','defs','linearGradient','radialGradient','stop','clipPath','mask','pattern','title','desc','text','tspan','use']);
 const attrs=new Set(['xmlns','viewBox','width','height','x','y','x1','x2','y1','y2','cx','cy','r','rx','ry','d','points','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-dasharray','stroke-dashoffset','fill-rule','clip-rule','opacity','fill-opacity','stroke-opacity','transform','id','offset','stop-color','stop-opacity','gradientUnits','gradientTransform','patternUnits','patternTransform','clip-path','mask','text-anchor','font-family','font-size','font-weight','letter-spacing','preserveAspectRatio','href']);
 for(const n of [root,...root.querySelectorAll('*')]){if(!tags.has(n.localName))throw Error('В SVG есть неподдерживаемые элементы. Загрузи PNG или простой SVG без скриптов и внешних изображений.');for(const a of [...n.attributes]){if(!attrs.has(a.name)||/^on/i.test(a.name))throw Error('SVG содержит неподдерживаемые настройки. Сохрани украшение как PNG.');if(a.name==='href'&&!/^#[\w.-]+$/.test(a.value))throw Error('В SVG запрещены внешние ссылки');if(/url\s*\(/i.test(a.value)&&!/^url\(#[\w.-]+\)$/.test(a.value))throw Error('В SVG запрещены внешние ресурсы');}}
 const vb=(root.getAttribute('viewBox')||'').trim().split(/[\s,]+/).map(Number);let width=vb.length===4?vb[2]:parseFloat(root.getAttribute('width')),height=vb.length===4?vb[3]:parseFloat(root.getAttribute('height'));
 if(!(width>0&&height>0&&width<100000&&height<100000))throw Error('SVG должен иметь размер или viewBox');
 root.setAttribute('xmlns',NS);return {data:'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(root)))),width,height};
}
function validateAsset(a){if(!a||typeof a.id!=='string'||!/^[\w-]{1,100}$/.test(a.id)||typeof a.label!=='string'||a.label.length>100||typeof a.data!=='string'||a.data.length>3000000||!(a.width>0&&a.height>0))throw Error('Неверное украшение');if(a.data.startsWith('data:image/svg+xml;base64,')){const text=decodeURIComponent(escape(atob(a.data.split(',')[1])));return {...safeSVG(text),id:a.id,label:a.label};}if(!/^data:image\/png;base64,[A-Za-z0-9+/=\r\n]+$/.test(a.data))throw Error('Нужен PNG или SVG');return {id:a.id,label:a.label,data:a.data,width:a.width,height:a.height};}
function validateDesign(d,assets){if(!d||!['base','season'].includes(d.theme)||![2,3].includes(Number(d.columns))||!Array.isArray(d.items)||d.items.length>100)throw Error('Неверное оформление');const ids=new Set();const items=d.items.map(i=>{if(!i||typeof i.id!=='string'||!/^[\w-]{1,100}$/.test(i.id)||ids.has(i.id)||typeof i.label!=='string'||i.label.length>100||![i.x,i.y,i.scale,i.rotation,i.w,i.h].every(Number.isFinite)||i.scale<.2||i.scale>4||i.w<=0||i.h<=0||i.w>10000||i.h>10000||Math.abs(i.x)>10000||Math.abs(i.y)>10000||Math.abs(i.rotation)>360||typeof i.locked!=='boolean')throw Error('Неверный слой');ids.add(i.id);if(i.builtin&&i.builtin!=='month'&&!/^decor-\d{1,2}$/.test(i.builtin))throw Error('Неверный базовый слой');if(!i.builtin&&!i.asset&&!art[i.art])throw Error('Неизвестное украшение');if(i.asset&&!assets.some(a=>a.id===i.asset))throw Error('Не найдено свое украшение');return {id:i.id,label:i.label,builtin:i.builtin||null,art:i.art||null,asset:i.asset||null,x:i.x,y:i.y,scale:i.scale,rotation:i.rotation,locked:i.locked,w:i.w,h:i.h};});return {theme:d.theme,columns:Number(d.columns),items};}
function validateState(value){if(!value||value.version!==1||!value.months||typeof value.months!=='object'||Array.isArray(value.months)||!Array.isArray(value.assets)||!Array.isArray(value.templates))throw Error('Неверная копия дизайна');const assets=value.assets.map(validateAsset);if(new Set(assets.map(a=>a.id)).size!==assets.length)throw Error('Повтор украшений');const months={};for(const [k,v] of Object.entries(value.months)){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(k))throw Error('Неверный месяц');months[k]=validateDesign(v,assets);}const templates=value.templates.map(t=>{if(!t||typeof t.id!=='string'||!/^[\w-]{1,100}$/.test(t.id)||typeof t.name!=='string'||!t.name.trim()||t.name.length>60)throw Error('Неверный шаблон');return {id:t.id,name:t.name,design:validateDesign(t.design,assets)};});return {version:1,months,assets,templates};}
function readImage(data){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Не удалось открыть PNG'));img.src=data;});}
function dataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Не удалось прочитать файл'));r.readAsDataURL(file);});}
el('uploadDecoration').onclick=()=>el('decorationFile').click();
el('decorationFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>2*1024*1024)throw Error('Выбери файл до 2 МБ');let asset;if(/\.svg$/i.test(f.name)||f.type==='image/svg+xml')asset=safeSVG(await f.text());else if(/\.png$/i.test(f.name)||f.type==='image/png'){const data=await dataURL(f);if(!String(data).startsWith('data:image/png;'))throw Error('Выбери PNG или SVG');const image=await readImage(data),ratio=Math.min(1,1024/Math.max(image.naturalWidth,image.naturalHeight)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(image.naturalWidth*ratio));c.height=Math.max(1,Math.round(image.naturalHeight*ratio));c.getContext('2d').drawImage(image,0,0,c.width,c.height);asset={data:c.toDataURL('image/png'),width:c.width,height:c.height};}else throw Error('Поддерживаются PNG и SVG');asset.id=uid();asset.label=f.name.replace(/\.(png|svg)$/i,'').slice(0,80)||'Мое украшение';state.assets.push(asset);persist();activeCategory='Мои украшения';library();add({asset:asset.id,label:asset.label});}catch(err){toast(err.message||'Не удалось загрузить украшение');}e.target.value='';};
function backup(full=true){return full?{format:'obni-backup',version:2,events:db,design:state,...(unreadableDesign?{unreadableDesign}: {})}:{format:'obni-design',version:1,design:state};}
function saveJSON(value,name){downloadBlob(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),name);}
el('exportDesign').onclick=()=>saveJSON(backup(false),'obni-design-'+key()+'.json');
el('export').onclick=()=>saveJSON(backup(true),'obni-backup-'+key()+'.json');
el('restoreDesign').onclick=()=>el('designFile').click();
// Restore is validated in full before changing either storage key. Legacy event-only copies remain compatible.
async function restoreFile(file,designOnly){if(!file)return;try{
 if(file.size>15*1024*1024)throw Error('Копия слишком большая (максимум 15 МБ)');const parsed=JSON.parse(await file.text());let newEvents=null,newState=null;
 if(parsed.format==='obni-backup'&&parsed.version===2){newEvents=validateDB(parsed.events);newState=validateState(parsed.design);}else if(parsed.format==='obni-design'&&parsed.version===1){newState=validateState(parsed.design);}else if(!designOnly)newEvents=validateDB(parsed);else throw Error('Это не копия дизайна');
 if(designOnly)newEvents=null;
 if(!confirm(newState?(newEvents?'Восстановить встречи и дизайн из копии? Совпадающие месяцы будут заменены. Перед восстановлением скачается копия текущих данных.':'Восстановить оформление из копии? Совпадающие месяцы дизайна будут заменены, встречи сохранятся. Перед восстановлением скачается копия текущих данных.'):'Загрузить старую копию встреч? Совпадающие месяцы будут заменены, оформление сохранится. Перед восстановлением скачается копия текущих данных.'))return;
 saveJSON(backup(true),'obni-before-restore-'+Date.now()+'.json');const oldState=state,oldEvents=db;const oldDesignRaw=localStorage.getItem(STORAGE),oldEventRaw=localStorage.getItem(KEY);
 let merged=clone(state);if(newState){const assetMap=new Map();for(const a of newState.assets){const existing=merged.assets.find(x=>x.id===a.id);let id=a.id;if(existing&&existing.data!==a.data){id=uid();}assetMap.set(a.id,id);if(!merged.assets.some(x=>x.id===id))merged.assets.push({...a,id});}const remap=d=>{const copy=clone(d);copy.items.forEach(i=>{if(i.asset)i.asset=assetMap.get(i.asset)||i.asset;});return copy;};for(const [k,d]of Object.entries(newState.months))merged.months[k]=remap(d);for(const t of newState.templates){const copy={...t,design:remap(t.design)};const index=merged.templates.findIndex(x=>x.id===t.id);if(index<0)merged.templates.push(copy);else if(JSON.stringify(merged.templates[index])!==JSON.stringify(copy))merged.templates.push({...copy,id:uid(),name:(copy.name+' (копия)').slice(0,60)});}}
 const mergedEvents=newEvents?{...db,...newEvents}:db;
 try{localStorage.setItem(STORAGE,JSON.stringify(merged));if(newEvents)localStorage.setItem(KEY,JSON.stringify(mergedEvents));}catch(err){try{if(oldDesignRaw===null)localStorage.removeItem(STORAGE);else localStorage.setItem(STORAGE,oldDesignRaw);if(oldEventRaw===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,oldEventRaw);}catch{}state=oldState;db=oldEvents;throw Error('Не хватило памяти для восстановления. Текущие данные сохранены.');}
 state=merged;db=mergedEvents;storageFailed=false;unreadableDesign=null;history.clear();selected=null;currentMonth=null;resetEditing();render();library();toast('Копия восстановлена');
 }catch(err){toast(err.message||'Не удалось прочитать копию');}}
el('designFile').onchange=async e=>{await restoreFile(e.target.files[0],true);e.target.value='';};
el('fileInput').onchange=async e=>{await restoreFile(e.target.files[0],false);e.target.value='';};
// Include design in an explicit draft save without replacing the calendar's own storage.
const originalSave=el('save').onclick;el('save').onclick=()=>{if(!persist())return;originalSave();};
months.forEach((m,i)=>el('designMonth').add(new Option(m,i)));
el('designMonth').onchange=()=>{el('month').value=el('designMonth').value;el('month').dispatchEvent(new Event('change'));};
el('designYear').onchange=()=>{el('year').value=el('designYear').value;el('year').dispatchEvent(new Event('change'));};
el('designExportPNG').onclick=()=>el('download').onclick();
render();library();if(storageFailed)toast('Сохраненный дизайн не удалось прочитать. Он не перезаписан. Сохрани резервную копию и проверь данные.');
// No initial write: opening a month must never overwrite a malformed stored design.
})();
