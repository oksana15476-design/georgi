# Makes a vertical Reels video (1080×1920, no music) from rendered carousel slides:
# hook text on top, the slide in the middle, a call to action below, slide-left transitions.
# Music is added in the Instagram app when posting (owner posts Reels by hand).
#   python3 scripts/social/make-reel.py out.mp4 "Hook" "Bottom line" content/social/out/<batch>/<post>/ru-1.jpg:3 …ru-2.jpg:6
import sys,os,subprocess,textwrap
from PIL import Image,ImageDraw,ImageFont
out=sys.argv[1]; hook=sys.argv[2]; bottom=sys.argv[3]; items=sys.argv[4:]  # path:seconds
B='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
tmp=out+'_frames';os.makedirs(tmp,exist_ok=True)
frames=[]
for k,it in enumerate(items):
    path,sec=it.rsplit(':',1)
    c=Image.new('RGB',(1080,1920),'#121a2b');d=ImageDraw.Draw(c)
    f=ImageFont.truetype(B,60);y=120
    for line in textwrap.wrap(hook,26):
        w=d.textlength(line,font=f);d.text(((1080-w)/2,y),line,font=f,fill='white');y+=76
    s=Image.open(path).convert('RGB').resize((1000,1250));c.paste(s,(40,max(y+30,330)))
    fb=ImageFont.truetype(B,46);w=d.textlength(bottom,font=fb);d.text(((1080-w)/2,1690),bottom,font=fb,fill='#ffd166')
    p=f'{tmp}/{k}.png';c.save(p);frames.append((p,float(sec)))
args=['ffmpeg','-y','-loglevel','error']
for p,sec in frames: args+=['-loop','1','-t',str(sec),'-i',p]
fl=[];last='0:v';off=0
for i in range(1,len(frames)):
    off+=frames[i-1][1]-0.4
    nm=f'v{i}';fl.append(f'[{last}][{i}:v]xfade=transition=slideleft:duration=0.4:offset={off:.2f}[{nm}]');last=nm
args+=['-filter_complex',';'.join(fl) if fl else 'null','-map',f'[{last}]' if fl else '0:v','-r','30','-pix_fmt','yuv420p','-c:v','libx264','-preset','medium','-crf','20','-movflags','+faststart',out]
subprocess.run(args,check=True)
print(out,os.path.getsize(out)//1024,'KB')
