/* Original teaching implementation; no external code copied. */
(function(root){
  'use strict';
  const DT=0.2,STEPS=1800,GAIN=0.55,LOSS=0.025,KD=0.8,FILTER=2,KB=0.12;
  const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
  const presets={
    steady:{delay:6,power:1,kp:0.16,ki:0.008,estimate:1},
    windup:{delay:6,power:0.5,kp:0.16,ki:0.008,estimate:1},
    cold:{delay:6,power:1,kp:0.16,ki:0.008,estimate:1},
    delay:{delay:20,power:1,kp:0.35,ki:0.02,estimate:1},
    mismatch:{delay:6,power:1,kp:0.16,ki:0.008,estimate:1.8}
  };
  function environment(time,scenario){return {target:scenario==='windup'?(time<120?34:22):24,
    ambient:scenario==='cold'&&time>=120&&time<210?4:14,gain:GAIN,loss:LOSS};}
  function advance(temp,input,env,dt=DT){
    const equilibrium=env.ambient+env.gain*input/env.loss;
    return equilibrium+(temp-equilibrium)*Math.exp(-env.loss*dt);
  }
  class Delay{
    constructor(steps){if(!Number.isInteger(steps)||steps<0)throw new RangeError('Delay must be a nonnegative step count');this.queue=Array(steps).fill(0);this.head=0;}
    push(value){if(!this.queue.length)return value;const old=this.queue[this.head];this.queue[this.head]=value;this.head=(this.head+1)%this.queue.length;return old;}
  }
  class Controller{
    constructor(kind,steps){this.kind=kind;this.line=new Delay(steps);this.temp=18;this.previous=18;
      this.integral=0;this.slope=0;this.switchOn=false;this.mae=0;this.late=0;this.energy=0;this.count=0;this.lateCount=0;this.raw=0;this.command=0;this.applied=0;}
    step(env,s,time){
      const error=env.target-this.temp;
      const slope=(this.temp-this.previous)/DT;this.previous=this.temp;
      this.slope+=(1-Math.exp(-DT/FILTER))*(slope-this.slope);
      if(this.kind==='switch'){
        if(this.temp<env.target-0.35)this.switchOn=true;
        if(this.temp>env.target+0.35)this.switchOn=false;
        this.raw=this.switchOn?s.power:0;
      }else{
        const feedforward=this.kind==='feedforward'?s.estimate*LOSS*(env.target-env.ambient)/GAIN:0;
        this.raw=s.kp*error+this.integral-KD*this.slope+feedforward;
      }
      this.command=clamp(this.raw,0,s.power);
      if(this.kind!=='switch')this.integral+=DT*(s.ki*error+(this.kind==='pid'?0:KB*(this.command-this.raw)));
      // Back-calculation corrects command saturation, not transport delay.
      this.applied=this.line.push(this.command);this.temp=advance(this.temp,this.applied,env);
      const deviation=Math.abs(this.temp-env.target);
      this.mae+=deviation;this.count++;if(time>=240){this.late+=deviation;this.lateCount++;}
      this.energy+=this.applied*DT;
    }
    get metrics(){return {mae:this.count?this.mae/this.count:0,lateMae:this.lateCount?this.late/this.lateCount:null,heaterSeconds:this.energy};}
  }
  class Experiment{
    constructor(settings){
      if(!settings||!Object.hasOwn(presets,settings.scenario))throw new RangeError('Unknown scenario');
      for(const [key,lo,hi] of [['delay',0,20],['power',.3,1],['kp',.08,.45],['ki',.002,.025],['estimate',.5,1.8]])
        if(typeof settings[key]!=='number'||!Number.isFinite(settings[key])||settings[key]<lo||settings[key]>hi)throw new RangeError('Invalid '+key);
      if(Math.abs(settings.delay/DT-Math.round(settings.delay/DT))>1e-8)throw new RangeError('Delay must be a multiple of DT');
      this.settings={...settings};this.tick=0;this.rows=[];
      this.delaySteps=Math.round(settings.delay/DT);this.delay=this.delaySteps*DT;
      this.controllers=['switch','pid','antiwindup','feedforward'].map(kind=>new Controller(kind,this.delaySteps));}
    step(){if(this.tick>=STEPS)return;const time=this.time,env=environment(time,this.settings.scenario);
      this.controllers.forEach(c=>c.step(env,this.settings,time));this.tick++;
      const row=[this.time,env.target,env.ambient,env.gain,env.loss,this.delay,this.settings.power,
        this.settings.kp,this.settings.ki,KD,FILTER,KB,this.settings.estimate];
      this.controllers.forEach(c=>row.push(c.temp,c.raw,c.command,c.applied,c.integral));this.rows.push(row);return row;}
    get time(){return this.tick*DT;}
  }
  const header=['time_s','target_c','ambient_c','heat_gain_c_per_s','loss_per_s','delay_s','power_limit','kp','ki','kd','derivative_filter_s','back_calculation_gain','feedforward_estimate_factor'];
  ['switch','pid','antiwindup','feedforward'].forEach(kind=>['temp_c','raw_command','limited_command','applied_command','integral_term'].forEach(field=>header.push(kind+'_'+field)));
  function csv(run){
    if(run.tick!==STEPS)throw new Error('Complete the experiment before exporting');
    return '# '+JSON.stringify({schema:1,project:'greenhouse-control-lab',settings:run.settings,dt_s:DT,duration_s:run.time,complete:true})+'\n'+header.join(',')+'\n'+run.rows.map(row=>row.join(',')).join('\n')+'\n';
  }
  const api={csv,DT,STEPS,GAIN,LOSS,KD,FILTER,KB,clamp,presets,environment,advance,Delay,Controller,Experiment,header};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GreenhouseLab=api;
})(typeof globalThis!=='undefined'?globalThis:this);
