const fs=require('node:fs'),path=require('node:path'),E=require('./docs/engine.js');
const check=process.argv.includes('--check'),entries=[],traceDir=path.join(__dirname,'data');
function near(a,b,label){if(typeof a==='number'&&typeof b==='number'){if(!Number.isFinite(a)||Math.abs(a-b)>1e-9*Math.max(1,Math.abs(a),Math.abs(b)))throw Error('Mismatch '+label);}
else if(a&&b&&typeof a==='object'&&typeof b==='object'){if(JSON.stringify(Object.keys(a))!==JSON.stringify(Object.keys(b)))throw Error('Shape '+label);for(const k of Object.keys(a))near(a[k],b[k],label+'.'+k);}else if(a!==b)throw Error('Mismatch '+label);}
if(!check)fs.mkdirSync(traceDir,{recursive:true});
for(const [scenario,preset] of Object.entries(E.presets))for(const delay of [0,6,20]){
 const settings={...preset,scenario,delay},run=new E.Experiment(settings);while(run.tick<E.STEPS)run.step();
 entries.push({settings,metrics:run.controllers.map(c=>({method:c.kind,...c.metrics}))});
 if(delay===preset.delay){const dest=path.join(traceDir,scenario+'.csv'),csv=E.csv(run);
  if(check){const saved=fs.readFileSync(dest,'utf8').trim().split(/\r?\n/),now=csv.trim().split('\n');if(saved.length!==now.length||saved[0]!==now[0]||saved[1]!==now[1])throw Error('Trace metadata '+scenario);
   for(let i=2;i<now.length;i++)near(saved[i].split(',').map(Number),now[i].split(',').map(Number),'trace '+scenario+':'+i);}
  else fs.writeFileSync(dest,csv);}
}
const result={schema:1,dt_s:E.DT,duration_s:E.DT*E.STEPS,entries},dest=path.join(__dirname,'benchmarks.json');
if(check)near(JSON.parse(fs.readFileSync(dest,'utf8')),result,'benchmarks');else fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n');
console.log(`${entries.length} configurations / ${entries.length*4} controller trajectories reproduced`);
