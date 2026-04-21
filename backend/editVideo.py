import shotstack_sdk as shotstack
from shotstack_sdk.api import edit_api
from shotstack_sdk.model.clip import Clip
from shotstack_sdk.model.track import Track
from shotstack_sdk.model.timeline import Timeline
from shotstack_sdk.model.output import Output
from shotstack_sdk.model.edit import Edit
from shotstack_sdk.model.video_asset import VideoAsset



host = "https://api.shotstack.io/stage"
configuration = shotstack.Configuration(host=host)
configuration.api_key['DeveloperKey'] = "VmyBQ8KwJR0lpBG5tMrBFRuFihJccRAIuJU7yUuD"

with shotstack.ApiClient(configuration) as api_client:
    api_instance = edit_api.EditApi(api_client)

    # 2. Mock ML Data (This would eventually come from your ML team's database/CSV)
    ml_results = [
        {"url": "https://shotstack-assets.s3.amazonaws.com/footage/skateboarding.mp4", "label": "transit", "score": 0.98},
        {"url": "https://shotstack-assets.s3.amazonaws.com/footage/beach-overhead.mp4", "label": "nature", "score": 0.85},
        {"url": "https://shotstack-assets.s3.amazonaws.com/footage/city-timelapse.mp4", "label": "working", "score": 0.72}
    ]

    video_clips = []
    current_start = 0.0

    # 3. Build the Edit Decision List (EDL)
    for data in ml_results:
        # Create the asset
        video_asset = VideoAsset(src=data['url'])
        
        # Create a 5-second clip for each highlight
        clip = Clip(
            asset=video_asset,
            start=current_start,
            length=5.0
        )
        video_clips.append(clip)
        current_start += 5.0 # Move the start time for the next clip

    # 4. Construct the Timeline & Output
    track = Track(clips=video_clips)
    timeline = Timeline(tracks=[track])
    output = Output(format="mp4", resolution="sd")
    
    edit = Edit(timeline=timeline, output=output)

    # 5. Send to Shotstack for Rendering
    try:
        response = api_instance.post_render(edit)
        render_id = response['response']['id']
        print(f"Render started! ID: {render_id}")
        print(f"Check status at: https://api.shotstack.io/stage/render/{render_id}")
    except Exception as e:
        print(f"Error: {e}")