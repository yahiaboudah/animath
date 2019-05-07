import pathlib

B61 = pathlib.Path.home() / 'Desktop' / 'zBanana61'

def make_folder(path_obj):
    path_obj.mkdir(parents = True,exist_ok = True)

def create_topic(new_topic_name):
    make_folder(B61 / new_topic_name)

def create_video(topic = 'topic',video= 'video'):
    new_video = B61 / topic / video
    scenes = new_video / 'Scenes'
    product = new_video / 'Product'
    final_product = new_video / 'Final'
    make_folder(new_video)
    make_folder(scenes)
    make_folder(product)
    make_folder(final_product)

def create_scene(topic = '',video = '',order = 1,experiment = False):
    if not experiment:
        new_scene = B61 / topic / video / 'Scenes' /  ('Scene '+str(order))
        graphics = new_scene / 'Graphics'
        aefiles = new_scene / 'AE Files'
        proxies = new_scene / 'Proxies'
        videos = new_scene / 'Videos'
        audio = new_scene / 'Audio'
        make_folder(new_scene)
        make_folder(graphics)
        make_folder(aefiles)
        make_folder(proxies)
        make_folder(videos)
        make_folder(audio)

topic = 'neural nets'
video = 'feedforward'

create_topic(topic)
create_video(topic = topic,video= video)
create_scene(topic = topic, video = video, order = 1)
