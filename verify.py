"""Independent analytic plant replay and metric audit. Standard library only.
Controllers are not reimplemented here; Node tests check controller semantics.
"""
import csv,json,math
from pathlib import Path
ROOT=Path(__file__).resolve().parent
report=[]
for filename in sorted((ROOT/'data').glob('*.csv')):
 with filename.open(encoding='utf-8-sig',newline='') as stream:
  meta=json.loads(next(stream)[2:]);rows=list(csv.DictReader(stream))
 assert meta['complete'] and meta['dt_s']==.2 and meta['duration_s']==360
 assert len(rows)==1800
 metrics=[]
 for method in ['switch','pid','antiwindup','feedforward']:
  temp=18;mae=late=usage=0;maxdiff=0
  for i,text in enumerate(rows):
   row={k:float(v) for k,v in text.items()};dt=meta['dt_s']
   assert abs(row['time_s']-(i+1)*dt)<1e-9
   assert all(math.isfinite(v) for v in row.values())
   u=row[method+'_applied_command'];assert 0<=u<=row['power_limit']
   assert 0<=row[method+'_limited_command']<=row['power_limit']
   # Integral solution: T0*exp(-a dt)+(ambient+b u/a)*(1-exp(-a dt)).
   decay=math.exp(-row['loss_per_s']*dt)
   temp=temp*decay+(row['ambient_c']+row['heat_gain_c_per_s']*u/row['loss_per_s'])*(1-decay)
   maxdiff=max(maxdiff,abs(temp-row[method+'_temp_c']))
   error=abs(row[method+'_temp_c']-row['target_c']);mae+=error;usage+=u*dt
   if i>=1200:late+=error
  assert maxdiff<1e-8,(filename,method,maxdiff)
  metrics.append({'method':method,'mae':mae/1800,'lateMae':late/600,'heaterSeconds':usage})
  entry=next(e for e in json.loads((ROOT/'benchmarks.json').read_text())['entries'] if e['settings']==meta['settings'])
  expected=next(m for m in entry['metrics'] if m['method']==method)
  for k in ['mae','lateMae','heaterSeconds']:assert math.isclose(metrics[-1][k],expected[k],rel_tol=1e-9,abs_tol=1e-9)
 report.append({'file':filename.name,'samples':len(rows),'plant_tolerance_c':1e-8,'metrics':metrics})
assert len(report)==5
print(json.dumps({'files':len(report),'csv_rows':sum(r['samples'] for r in report),'controller_temperature_samples':sum(r['samples'] for r in report)*4,'plant_and_metrics':'PASS'},indent=2))
