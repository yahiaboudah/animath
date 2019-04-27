from datetime import timedelta
import json as json
import srt

SCENE_PATH = 'C:\\Users\\HP\\Desktop\\Banana61\\00Videos\\'
SCENE_NAME = 'simple nn'

def import_json(file_path):
    with open(file_path,'r') as f:
        a = f.read()
    j = json.loads(a)
    return j

def get_srt(json_obj):
    subs = []
    prev_running_time = 0
    running_time = 0
    for i in range(1,len(json_obj)):
        duration = json_obj[i]['Duration']
        running_time += duration
        st = timedelta(seconds=prev_running_time)
        et = timedelta(seconds=running_time)
        subs.append(srt.Subtitle(index=i, start=st, end=et, content=json_obj[i]['Line']))
        prev_running_time = running_time
    a = srt.compose(subs)
    return a

def write_srt(name,contents):
    with open(name,'w') as f:
        f.write(contents)


j = import_json(SCENE_PATH+SCENE_NAME+'.json')
srtobj = get_srt(j)
write_srt(SCENE_PATH+SCENE_NAME+'.srt',srtobj)
