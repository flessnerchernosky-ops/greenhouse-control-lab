"""Optional Pillow assets built from the recorded windup experiment, not mock results."""
import csv,json
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent
font_candidates=[Path('C:/Windows/Fonts/segoeui.ttf'),Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')]
def font(size):
    path=next((p for p in font_candidates if p.exists()),None)
    return ImageFont.truetype(str(path),size) if path else ImageFont.load_default(size=size)
with (ROOT/'data'/'windup.csv').open(encoding='utf-8') as stream:
    meta=json.loads(next(stream)[2:]);rows=[{k:float(v) for k,v in r.items()} for r in csv.DictReader(stream)]
COLORS=['#e9c36e','#ee8c79','#7ad8aa','#bba2f2'];KINDS=['switch','pid','antiwindup','feedforward'];NAMES=['THERMOSTAT','PID','ANTI-WINDUP','FEEDFORWARD + AW']
frames=[]
for index in range(0,len(rows),15):
    row=rows[index];im=Image.new('RGB',(1000,600),'#102a25');d=ImageDraw.Draw(im)
    d.text((35,22),'GREENHOUSE / CONTROL STUDIO',font=font(24),fill='#eaf2df')
    d.text((35,63),f"Same weather. Four strategies. / {row['time_s']:.0f} / 360 s",font=font(15),fill='#a8c8b3')
    for j,(kind,name,color) in enumerate(zip(KINDS,NAMES,COLORS)):
        x=35+j*239;d.rounded_rectangle((x,105,x+220,242),12,fill='#1a3830',outline='#3f5b4c')
        d.text((x+14,121),name,font=font(13),fill=color);d.text((x+14,151),f"{row[kind+'_temp_c']:.1f} C",font=font(31),fill='#f6f6e8')
        d.text((x+14,204),f"Heating {100*row[kind+'_applied_command']:.0f}%",font=font(14),fill='#b4c8b9')
    left,right,top,bottom=65,955,280,515
    sx=lambda t:left+t/360*(right-left);sy=lambda v:bottom-(v-14)/22*(bottom-top)
    for value in [14,22,30,34]:
        d.line((left,sy(value),right,sy(value)),fill='#355147');d.text((26,sy(value)-8),str(value),font=font(12),fill='#abc6b8')
    shown=rows[:index+1:4]
    for k in [-1,0,1,2,3]:
        points=[(sx(r['time_s']),sy(r['target_c'] if k<0 else r[KINDS[k]+'_temp_c'])) for r in shown]
        if len(points)>1:d.line(points,fill='#eaf2df' if k<0 else COLORS[k],width=2)
    for t in [0,120,240,360]:d.text((sx(t)-12,526),str(t)+' s',font=font(13),fill='#b0c9b8')
    d.text((35,567),'50% heater limit / Target 34 C -> 22 C at 120 s / Actual model trace',font=font(14),fill='#a8c8b3')
    frames.append(im)
frames[0].save(ROOT/'docs'/'preview.gif',save_all=True,append_images=frames[1:],duration=70,loop=0,optimize=False)
im=Image.new('RGB',(1280,640),'#f1f4e9');d=ImageDraw.Draw(im)
d.rounded_rectangle((34,34,1246,606),24,outline='#c7d9c8',width=2)
d.text((70,65),'CONTROL STUDIO / OPEN EXPERIMENTS',font=font(18),fill='#147e67')
d.text((70,150),'Greenhouse',font=font(82),fill='#142c2c');d.text((70,245),'Control Lab',font=font(82),fill='#142c2c')
d.text((74,375),'Temperature x heater usage',font=font(29),fill='#5c7565')
d.text((74,473),'4 controllers / 5 scenes / Bilingual playground',font=font(23),fill='#147e67')
d.text((74,555),'No hardware. Reproducible experiments. MIT.',font=font(16),fill='#5c7565')
d.polygon([(885,225),(1030,115),(1175,225),(1175,460),(885,460)],outline='#147e67',width=3)
for x in [960,1030,1100]:d.line((x,180 if x!=1030 else 115,x,460),fill='#85ad96',width=2)
d.line((885,225,1175,225),fill='#85ad96',width=2);d.line((885,340,1175,340),fill='#85ad96',width=2)
d.ellipse((1147,91,1192,136),outline='#147e67',width=3)
im.save(ROOT/'docs'/'social-preview.png')
print('120 data-derived animation frames; 1280x640 repository cover.')
