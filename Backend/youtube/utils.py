import re
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from youtube_transcript_api import YouTubeTranscriptApi
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def transcribe(youtube_url):
    video_id = youtube_url.split("v=")[1]

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([t["text"] for t in transcript])
        return transcript_text, video_id

    except Exception as e:
        print(f"Error: {e}")
        return None


def convert_markup(text):
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    return text


def generate_pdf(yt_url, summarization, filename):
    try:
        pdf = SimpleDocTemplate(filename, pagesize=letter)
        styles = getSampleStyleSheet()

        title_style = styles['Title']
        custom_style = ParagraphStyle(
            name='CustomStyle',
            fontSize=12,
            spaceAfter=12,
            textColor=colors.black,
        )

        content = []
        content.append(
            Paragraph(
                "<b>Summary of YouTube Video</b>", title_style
            )
        )
        content.append(
            Paragraph(
                f"YouTube Link: <a href='{yt_url}'>{yt_url}</a>", custom_style
            )
        )
        content.append(Spacer(1, 12))

        for line in summarization.split('\n\n'):
            formatted_line = convert_markup(line)
            content.append(Paragraph(formatted_line, custom_style))

        pdf.build(content)
        return True

    except Exception as e:
        print(f"An error occurred while generating the PDF: {str(e)}")
        return False
