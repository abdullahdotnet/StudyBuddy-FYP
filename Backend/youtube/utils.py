from youtube_transcript_api import YouTubeTranscriptApi

def transcribe(youtube_url):
    video_id = youtube_url.split("v=")[1]
    
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([t["text"] for t in transcript])
        return transcript_text
    
    except Exception as e:
        print(f"Error: {e}")
        return None