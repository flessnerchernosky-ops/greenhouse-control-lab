'use strict';
(()=>{
  const E=window.GreenhouseLab,$=id=>document.getElementById(id),colors=['#e7c77b','#ff9c89','#85e1b6','#a9b6ff'];
  const copy={
    delayLabel:['指令等多久才生效？','Command delay'],finish:['运行到底','Finish experiment'],tag1:['四种控制策略','Four control strategies'],tag2:['温度 × 加热用量','Temperature × heater usage'],tag3:['完整数据导出','Complete data export'],    previous:['← 第二期：太空追星','← Episode 2: Star Chase'],eyebrow:['SMART CLIMATE / 温度与加热用量','SMART CLIMATE / TEMPERATURE & HEATER USAGE'],title:['把温度控稳，也把热量用好','Steady temperatures. Thoughtful heating.'],intro:['加热器已经开到最大，为什么还会越控越热？种一片虚构的温室，看看控制器什么时候该“忘掉”旧的欠账。','The heater is already at its limit. Why does it keep heating after the target drops? Grow a fictional greenhouse and discover when a controller should unwind its memory.'],choose:['选择一场天气实验','Choose a weather experiment'],restart:['重来一局 ↻','Restart ↻'],export:['下载这一局 CSV ↓','Download this run as CSV ↓'],settings:['你的温室设置','Your greenhouse settings'],'reset-note':['每次改设置会回到 18°C，点击开始运行。四种方法面对同样的天气与功率限制。','Changing a setting resets to a paused run at 18°C. All four methods face the same weather and heater limit.'],power:['加热器最多开多大？','Heater power limit'],kp:['纠正偏差有多着急？','Correction strength (Kp)'],advanced:['想再调一点专业参数','Explore more control settings'],ki:['累积记忆强度（Ki）','Integral memory strength (Ki)'],estimate:['前馈的散热估计倍数','Feedforward loss estimate factor'],'estimate-note':['1 倍是正确估计，只有前馈方法使用它；其余三种方法不变。','1× is the correct estimate. Only feedforward uses this factor; the other methods are unchanged.'],'time-note':['20 秒播放 360 秒仿真；也可运行到底。切走页面会暂停。','20 seconds plays 360 simulated seconds, or finish instantly. Leaving the page pauses playback.'],'chart-title':['温度有没有追过头？','Did the temperature overshoot?'],'chart-note':['虚线是目标温度，颜色对应四间温室。纵轴自动缩放，请看刻度。','The dashed line is the target. Colors match the four greenhouses. The vertical axis rescales; check its labels.'],results:['把整局成绩一起看','Compare the complete run'],method:['方法','Method'],mae:['整局平均偏离 °C','Whole-run MAE °C'],late:['最后 120 秒平均偏离 °C','Final 120 s MAE °C'],energy:['满功率等效秒','Full-power equivalent seconds'],'metric-note':['平均偏离是每步温差绝对值的平均数（MAE），不是 RMSE。加热用量是实际功率比例×时间之和，不是电费；同一场景跑完再比较。','MAE averages absolute temperature error; it is not RMSE. Heater usage integrates actual power fraction over time, not electricity cost. Compare completed runs within the same scenario.'],'pid-title':['纠正、记忆、看趋势','Correct, remember, watch the trend'],'pid-story':['P 看现在冷多少；I 记住以前一直不够暖；D 看温度升得有多快。记忆能消除偏差，也可能越欠越多。','P reacts to today’s error. I accumulates past errors. D reacts to how fast temperature changes. Memory can remove an offset, but it can also accumulate an impossible demand.'],'aw-title':['别记做不到的欠账','Unwind impossible demands'],'aw-story':['加热器只有 50% 功率上限，想用 200% 也没用。记忆纠偏把“想发的”和“能发的”之间的差补回记忆，避免一直加码。','A heater limited to 50% cannot deliver 200%. Anti-windup feeds the difference between requested and limited commands back into the integral memory.'],'ff-title':['先补上散掉的热','Anticipate current heat loss'],'ff-story':['知道现在室外有多冷，就先估计需要补多少热，再靠反馈纠正。估计错了，额外这一步也可能帮倒忙。','Use the current outdoor temperature to estimate lost heat, then let feedback correct the remaining error. A wrong estimate can make this extra step unhelpful.'],'challenge-label':['你的第一次独立发现','YOUR FIRST INDEPENDENT FINDING'],'challenge-title':['先猜，再用数据回答','Make a guess, then inspect the data'],task1:['选第二关，观察 120 秒目标从 34°C 降到 22°C 后，普通 PID 的加热器是否还在全力工作。','In lesson 2, the target drops from 34°C to 22°C at 120 s. Does ordinary PID keep the heater at its limit?'],task2:['选第三关，比较记忆纠偏与前馈方法。哪一种更快察觉室外变冷？这是同一局内的对照。','In lesson 3, compare anti-windup and feedforward within the same run. Which reacts sooner to colder outdoor air?'],task3:['第四关只把延迟从 20 秒调到 0，保持其他设置不变。记忆纠偏是否也能解决延迟？','In lesson 4, change only delay from 20 s to zero. Does anti-windup also solve transport delay?'],task4:['第一关与第五关只改变散热估计。前馈是否一定比只有记忆纠偏更好？','Lessons 1 and 5 change only the heat-loss estimate. Is feedforward always better than anti-windup alone?'],guide:['中英说明与复现实验 ↗','Bilingual guide and reproducible experiments ↗'],limits:['虚构的一阶热模型，只有加热、没有主动制冷；精确温度测量，无噪声。不是植物生长模型或真实温室性能证明。教学案例并不证明某种方法处处更好。','A fictional first-order thermal model with heating only, exact temperature measurements and no noise. This is neither a plant-growth model nor evidence of real greenhouse performance. Teaching cases do not establish universal superiority.'],integration:['浏览器零依赖。另有 Python 标准库独立热模型与指标校验。原理参考公开文档，代码为本项目编写，AI 协助制作。','No browser dependencies. Python independently checks the thermal model and metrics with its standard library. Original implementation based on public principles, created with AI assistance.'],
    steady:['① 温和的一天','① A mild day'],windup:['② 暖气的欠账','② Heater memory debt'],cold:['③ 冷空气来了','③ A cold front'],delay:['④ 指令来晚了','④ Commands arrive late'],mismatch:['⑤ 估计也会错','⑤ Estimates can be wrong'],
    'steady-copy':['目标 24°C，室外 14°C。先观察普通 PID 如何消除开关控温的来回波动。','Target 24°C, outside 14°C. Watch PID reduce the fluctuations of on/off control.'],'windup-copy':['功率只有 50%，达不到最初的 34°C。120 秒后目标降到 22°C：记忆中的欠账会不会让加热器迟迟停不下来？','With a 50% heater limit, 34°C is unreachable. At 120 s the target falls to 22°C. Does accumulated memory keep the heater running?'],'cold-copy':['120–210 秒室外从 14°C 降到 4°C。前馈只知道当前室外温度，不能预知冷空气何时到来。','Outside falls from 14°C to 4°C during 120–210 s. Feedforward sees the current outdoor temperature; it cannot foresee the cold front.'],'delay-copy':['指令晚 20 秒生效，纠正又很着急。抗积分饱和处理功率限制，却不能消除等待时间。','Commands take 20 s to arrive and feedback is aggressive. Anti-windup handles power limits; it does not remove transport delay.'],'mismatch-copy':['只把前馈的散热估计改成 1.8 倍；其余设置与第一关相同。多了一种方法，并不保证整局更好。','Only the feedforward heat-loss estimate changes to 1.8×; all other settings match lesson 1. An extra method need not improve the whole-run result.'],
    switch:['开关控温','On/off thermostat'],pid:['普通 PID','Ordinary PID'],antiwindup:['PID + 记忆纠偏','PID + anti-windup'],feedforward:['前馈 + 记忆纠偏 PID','Feedforward + anti-windup PID'],memory:['记忆项','Integral term'],demand:['想用 / 发出','Requested / sent'],applied:['实际生效','Actually applied'],target:['目标','Target'],ambient:['室外','Outside'],ceiling:['当前满功率平衡上限','Current equilibrium at power limit'],pause:['暂停','Pause'],resume:['开始 / 继续','Play / resume'],running:['运行中','Running'],paused:['已暂停','Paused'],complete:['本局完成','Run complete'],seconds:['秒','s'],privacy:['记录只下载到你的设备，页面不上传数据。','Records download to your device; the page does not upload them.'],partial:['当前是部分记录，请跑完 360 秒再公平比较。','These are partial results. Complete 360 simulated seconds for a fair comparison.'],none:['先运行一小段，再下载。','Run the simulation briefly before downloading.'],saved:['已下载 %1 个采样点，共 %2 秒仿真。','Downloaded %1 samples covering %2 simulated seconds.'],final:['本局完成。普通 PID 最后 120 秒平均偏离 %1°C，记忆纠偏 %2°C。结合整局误差与加热用量；结论只适用于这一组条件。','Run complete. Final-120-s MAE: ordinary PID %1°C, anti-windup %2°C. Also consider whole-run error and heater usage; this result applies only to these conditions.']
  };
  let lang=new URLSearchParams(location.search).get('lang')==='en'?1:0,scenario='steady',active=true;
  let run,paused=true,previous=null,accumulator=0,downloadText=null;
  const t=(key,...args)=>{let value=copy[key][lang];args.forEach((arg,i)=>value=value.replace('%'+(i+1),arg));return value;};
  const settings=()=>({...Object.fromEntries(['delay','power','kp','ki','estimate'].map(id=>[id,Number($(id).value)])),scenario});
  function createHouses(){
    $('houses').replaceChildren();$('results').replaceChildren();
    for(const [i,c] of run.controllers.entries()){
      const card=document.createElement('article');card.className='house';card.style.setProperty('--color',colors[i]);
      card.innerHTML=`<h3 id="name-${i}"></h3><div class="house-scene"><svg viewBox="0 0 90 80" aria-hidden="true"><path d="M8 32 L45 7 L82 32 V73 H8Z" fill="#203c30" stroke="${colors[i]}" stroke-width="2"/><path d="M45 8V72 M9 32H81" stroke="#46674d"/><path d="M44 65V42 M44 54Q20 30 25 52Q28 62 44 57 M44 47Q68 25 67 44Q63 53 44 50" fill="#85e1b6" stroke="#85e1b6" stroke-width="2"/><path d="M31 68H57L53 77H35Z" fill="#bf9270"/></svg><span class="temp" id="temp-${i}"></span></div><div class="heat-meter"><div class="heat-fill" id="heat-${i}"></div></div><p id="demand-${i}"></p><p id="applied-${i}"></p><p id="memory-${i}"></p>`;
      $('houses').append(card);
      const row=document.createElement('tr');for(let j=0;j<4;j++){const td=document.createElement('td');td.id=`metric-${i}-${j}`;row.append(td);}$('results').append(row);
    }
  }
  function refreshText(){
    document.documentElement.lang=lang?'en':'zh-CN';document.title=t('title')+' · Greenhouse Control Lab';
    document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
    $('zh').setAttribute('aria-pressed',String(!lang));$('en').setAttribute('aria-pressed',String(Boolean(lang)));
    document.querySelectorAll('[data-preset]').forEach(button=>{button.textContent=t(button.dataset.preset);button.setAttribute('aria-pressed',String(active&&scenario===button.dataset.preset));});
    $('scenario-copy').textContent=t(scenario+'-copy');
    $('guide-link').href=`https://github.com/flessnerchernosky-ops/greenhouse-control-lab/blob/main/README${lang?'.en':''}.md`;
    refreshValues();update();draw();
  }
  function refreshValues(){for(const id of ['delay','power','kp','ki','estimate']){
    const value=Number($(id).value);$(id+'-value').textContent=id==='delay'?value+' '+t('seconds'):id==='power'?Math.round(value*100)+'%':id==='ki'?value.toFixed(3):value.toFixed(2)+(id==='estimate'?'×':'');}}
  function restart(){run=new E.Experiment(settings());paused=true;previous=null;accumulator=0;downloadText=null;createHouses();refreshText();}
  function preset(name){scenario=name;active=true;Object.entries(E.presets[name]).forEach(([id,value])=>$(id).value=value);restart();}
  document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>preset(button.dataset.preset)));
  ['delay','power','kp','ki','estimate'].forEach(id=>{
    $(id).addEventListener('input',()=>{active=false;restart();});
  });
  ['zh','en'].forEach((id,i)=>$(id).addEventListener('click',()=>{lang=i;refreshText();try{const url=new URL(location.href);url.searchParams.set('lang',i?'en':'zh');history.replaceState(null,'',url);}catch{ /* Offline file URLs can disallow history changes. */ }}));
  $('restart').addEventListener('click',restart);$('pause').addEventListener('click',()=>{paused=!paused;previous=null;accumulator=0;update();});
  $('finish').addEventListener('click',()=>{while(run.tick<E.STEPS)run.step();paused=true;previous=null;accumulator=0;update();draw();});
  window.addEventListener('blur',()=>{if(run.tick<E.STEPS){paused=true;previous=null;accumulator=0;update();}});
  function update(){
    const finished=run.tick===E.STEPS,env=E.environment(Math.min(run.time,(E.STEPS-1)*E.DT),scenario);
    $('run-state').textContent=t(finished?'complete':paused?'paused':'running');$('timer').textContent=`${run.time.toFixed(0)} / 360 ${t('seconds')}`;
    $('pause').disabled=finished;$('finish').disabled=finished;$('export').disabled=!finished;
    $('progress-fill').style.width=(100*run.tick/E.STEPS)+'%';$('progress-fill').parentElement.setAttribute('aria-valuenow',String(Math.round(100*run.tick/E.STEPS)));$('pause').textContent=t(paused?'resume':'pause');
    $('target').textContent=`${t('target')} ${env.target}°C`;$('ambient').textContent=`${t('ambient')} ${env.ambient}°C`;
    $('ceiling').textContent=`${t('ceiling')} ${(env.ambient+env.gain*run.settings.power/env.loss).toFixed(1)}°C`;
    for(const [i,c] of run.controllers.entries()){
      $('name-'+i).textContent=t(c.kind);$('temp-'+i).textContent=c.temp.toFixed(1)+'°';$('heat-'+i).style.width=(c.applied*100)+'%';
      $('demand-'+i).textContent=`${t('demand')} ${(c.raw*100).toFixed(0)}% / ${(c.command*100).toFixed(0)}%`;
      $('applied-'+i).textContent=`${t('applied')} ${(c.applied*100).toFixed(0)}%`;
      $('memory-'+i).textContent=i?`${t('memory')} ${(c.integral*100).toFixed(0)}%`:'—';
      const m=c.metrics;[t(c.kind),run.tick?m.mae.toFixed(3):'—',m.lateMae===null?'—':m.lateMae.toFixed(3),m.heaterSeconds.toFixed(1)].forEach((value,j)=>$('metric-'+i+'-'+j).textContent=value);
    }
    $('download-state').textContent=downloadText?t('saved',...downloadText):t('privacy');
    $('observation').textContent=finished?t('final',run.controllers[1].metrics.lateMae.toFixed(3),run.controllers[2].metrics.lateMae.toFixed(3)):t('partial');
  }
  function draw(){
    const canvas=$('chart'),rect=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1,w=Math.max(rect.width,1),h=220;
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const rows=run.rows.filter((_,i)=>i%3===0);let lo=14,hi=26;
    for(const row of rows){lo=Math.min(lo,row[1],...Array.from({length:4},(_,j)=>row[13+j*5]));hi=Math.max(hi,row[1],...Array.from({length:4},(_,j)=>row[13+j*5]));}
    lo=Math.floor(lo-1);hi=Math.ceil(hi+1);const left=40,right=w-12,top=12,bottom=h-28,x=v=>left+v/360*(right-left),y=v=>bottom-(v-lo)/(hi-lo)*(bottom-top);
    ctx.font='10px system-ui';for(let i=0;i<4;i++){const v=lo+(hi-lo)*i/3;ctx.fillStyle='#a0b8ad';ctx.fillText(v.toFixed(0)+'°',3,y(v)+3);ctx.strokeStyle='#2a4345';ctx.beginPath();ctx.moveTo(left,y(v));ctx.lineTo(right,y(v));ctx.stroke();}
    for(let j=-1;j<4;j++){ctx.strokeStyle=j<0?'#edf8ee':colors[j];ctx.setLineDash(j<0?[5,5]:[]);ctx.lineWidth=j<0?1:1.7;ctx.beginPath();rows.forEach((row,i)=>{const px=x(row[0]),py=y(j<0?row[1]:row[13+j*5]);if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);});ctx.stroke();}
    ctx.setLineDash([]);ctx.fillStyle='#a0b8ad';for(const time of [0,120,240,360]){ctx.textAlign=time===360?'right':time===0?'left':'center';ctx.fillText(time+' '+t('seconds'),x(time),h-6);}ctx.textAlign='left';
  }
  $('export').addEventListener('click',()=>{
    if(run.tick!==E.STEPS){$('download-state').textContent=t('none');return;}
    const csv='\ufeff'+E.csv(run);
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=`greenhouse-${scenario}-${run.tick}-samples.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);downloadText=[run.tick,run.time.toFixed(1)];update();
  });
  window.addEventListener('resize',draw);
  function frame(now){if(previous===null)previous=now;const elapsed=Math.min(0.1,(now-previous)/1000);previous=now;
    if(!paused&&run.tick<E.STEPS){accumulator+=elapsed*18;while(accumulator>=E.DT&&run.tick<E.STEPS){run.step();accumulator-=E.DT;}}
    if(!paused){update();draw();}requestAnimationFrame(frame);
  }
  preset('steady');requestAnimationFrame(frame);
})();
