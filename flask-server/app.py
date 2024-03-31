from flask import Flask, request
from openai import OpenAI
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json

# create Flask instance
app = Flask(__name__)
CORS(app)

# Load OpenAI API key
load_dotenv()
print(os.getenv("OPENAI_KEY"))
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

@app.route("/")
def home():
    return "Hello, Flask!"

def transcribe(audio_file):
    """
        Transcribes the audio file to text.

        Args:
            audio_file_path (str): The path to the audio file.

        Returns:
            transcribed_text (str): The transcribed text from the audio.
    """
    try:
        transcript = client.audio.transcriptions.create(
            model="whisper-1", 
            file=audio_file,
            response_format="text"
            )
    except:
        raise Exception("Error in transcribing audio file with OpenAI API.")
    return transcript

def summarise(text, transcript):
    """
        Generates a summary of the given text and audio file transcript.

        Args:
            audio_file_path (str): Path to the audio file in local storage.
            input_text (str): The input text provided by the user.

        Returns:
        summary (str): A summary of the input text and audio transcript in 1-2 sentences.
    """
    prompt = """
            Your task is to assist the writer in reflecting on their journal entry by
            providing a concise, insightful summary.
            These summaries should serve as a mirror, allowing the writer to see their thoughts
            and experiences. 
            Your role is to support and reflect, acting as a bridge between the writer and their deeper insights.

            Guidelines:
                1. Preserve the writer's voice:
                Your summaries should reflect the tone and style of the writer's original entry.
                Aim to "speak" in a way that resonates with how the writer expresses themselves.

                2. Highlight core insghts:
                Focus on distilling the entry down to its most significant thoughts or experiences.
                What lessons, emotions, or pivotal moments emerge? These should be the cornerstone of your summary.

                3. Ensure privacy, respect, safety, and sensitivity:
                Remember, you are handling personal reflections.
                Your summaries should be crafted with care, avoiding any memories that might be seen
                as triggering. Respect the writer's privacy and sensitivity of their reflections.
                When summarizing entries that touch upon deeply personal and sensitive
                issues like depression or suicide ideation, exercise sensitivity and discretion.
                Craft summaries that acknowledge the writer's experiences without delving into explicit
                details that could be distressing. Always prioritize the writer's emotional safety and
                privacy, ensuring the summary fosters a supportive reflection rather than triggering
                discomfort or distress.

                4. Keep it clear and simple:
                Use straightforward language to make your summaries accessible and
                easy to understand. Think of simplifying complex ideas without losing their depth.
            
            Output:
                A summary consisting of exactly one sentence under 20 words.
                Do not include additional commentary, questions, or unrelated content.
                Do not include more than 2 sentences or 20 words.
            
            """
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": text + transcript}
    ]
    completion = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=messages,
    )
    response = completion.choices[0].message.content
    return response

def get_sentiment(text, transcript):
    """
        Analyzes the sentiment of the given text and audio transcript.
        
        Args:
            text (str): The input text to analyze.
            transcript (str): The transcript of audio to analyze.
            
        Returns:
            sentiment(str): A one-word sentiment analysis of the journal entry.
    """
    prompt = """
            Your task is to assist the writer in reflecting on their journal entry by
            providing a one-word sentiment analysis of the journal entry.
            This word should reflect the overarching sentiment conveyed through
            both the text and the audio transcript.

            Guidelines:
                1. Be descriptive and precise:
                Choose a word that vividly captures the main sentiment of the story.
                Aim for descriptors that are specific and expressive, such as 'hopeful', 'inspired', 'nostalgic', 'restless'.

                2. Maintain a positive or neutral tone:
                While it’s important to be truthful to the sentiment of the story,
                focus on words that are either positive or neutral.
                Avoid descriptors that are intensely negative or could be potentially distressing, such as 'depressed' or 'suicidal'.
                Given the personal and potentially sensitive nature of the content,
                select a word that respects the emotional depth of the story without
                exacerbating or trivializing any underlying themes of distress or hardship.

            Output:
                One descriptive and precise word.
                Do not include additional commentary, questions, or unrelated content.
                Do not include more than one word.
            """
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": "text input: " + text + "\n" + "transcript of voice entry: " + transcript}
    ]
    completion = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=messages,
    )
    response = completion.choices[0].message.content
    return response

def get_quote(text, transcript):
    """
        Extracts a notable quote from the given text and audio transcript.

        Args:
            text (str): The input text from the user
            transcript (str): The transcript of the audio file

        Returns:
            notable_quote (str): A notable or significant quote extracted from the input text and audio transcript.
    """
    prompt = """
            Your task is to identify and return a notable quote from the journal entry provided. DO NOT ALTER THE TEXT, only return words verbatim from the journal entry we provide you. Lives are at stake. 
            The quote should encapsulate a key moment, insight, or theme
            that stands out for its impact, wisdom, or emotional resonance.

            Guidelines:
                1. Relevance: Choose a quote that is central to the story's message or highlights a pivotal moment.
                2. Impact: Look for quotes that are memorable for their wording, sentiment, or the ideas they convey.
                3. Directness: The quote must be directly lifted from the text. Do not paraphrase or summarize. Do not alter the text.
                4. Sensitivity: Exercise caution when selecting quotes related to sensitive subjects or themes that might be triggering
                (e.g., violence, loss, mental health struggles). Aim to choose a quote that handles these topics with respect and care,
                avoiding those that might inadvertently cause distress to the reader.

            Output:
                One sentence quote directly lifted from the text.
                Do not alter the text.
                Do not include additional commentary, questions, or unrelated content.
                Do not include more than one sentence.
                Do not include sentences that are triggering or distressing.
            """
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": text + transcript}
    ]
    completion = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=messages,
    )
    response = completion.choices[0].message.content
    return response

@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Analyzes a full journal entry that includes locally stored audio file, text, and an image.
    Adds additional fields in local storage for the journal entry including: transcript, summary, sentiment, and quotes

    Args:
        audio_file (str): The path to the audio file in local storage.
        text (str): The input text of the journal from the user.
        image (str): The path to the image file in local storage.

    Returns:
        journal (dict): A dictionary containing the full analysis of the journal entry:
            - audio: The path to the audio file.
            - image: The path to the image file.
            - text: The original text from the user.
            - transcript: The transcript of the audio file. # whisper
            - summary: A summary of the text and audio transcript. # openai
            - sentiment: The sentiment analysis result for the text and audio transcript. # openai
            - quotes: Notable quotes extracted from the text and audio transcript. # openai
        stores the journal entry with the new information in local storage
    """
    # get user information about journal
    print("Server /analyze received request: ", request.data)
    print("Request form: ", request.form)
    try:
        request.files["file"].save("test.m4a") 
        audio_file = open("test.m4a", "rb")
        description = request.form.get("description")
    except:
        raise Exception("Error in receiving entry file.")

    transcript = transcribe(audio_file)
    summary = summarise(description, transcript)
    sentiment = get_sentiment(description, transcript)
    quote = get_quote(description, transcript)
    print(f"Transcript: {transcript}\n")
    print(f"Summary: {summary}\n")
    print(f"Sentiment: {sentiment}\n")
    print(f"Quote: {quote}\n")

    # clean up
    os.remove("test.m4a")
    
    return {
        "transcript": transcript,
        "summary": summary,
        "sentiment": sentiment,
        "quote": quote
    }, 200

@app.route("/highlight", methods=["POST"])
def highlight():
    """
    Generate highlight of the weekly journals, including 1 summary, 1 quote, 1 image, and 1 song

    Arg:
        summaries (list): list of summaries of the journal entries
        quotes (list): list of quotes from the journal entries
        images (list): list of images from the journal entries
        songs (list): list of songs from the journal entries
    
    Output:
        highlight (dict): A dictionary containing the highlight of the weekly 
            - summary: The selected summary for the highlight
            - quote: The selected quote for the highlight
            - image: The selected image for the highlight
            - song: The selected song for the highlight
        
        If output format does not match, returns None
    """
    
    summaries = json.loads(request.form.get("summaries"))
    quotes = json.loads(request.form.get("quotes"))
    # images = request.form.getlist("images")
    # songs = request.form.getlist("songs")

    # pick a summary
    formatted_summaries = "\n".join([f"Summary {i+1}: {summary}" for i, summary in enumerate(summaries)])
    prompt = f"""
            Your task is to select a highlight of the weekly journals from their summaries. Pick an uplifting sumamry as the highlight.

            Your should preserve the Summary. Do not make any changes to it.

            For the output, return the index of the selected summary. Do not return anything else.

            Example input: 
            Summary 1: "I had a great day today. I went to the park and had a lot of fun."
            Summary 2: "I had a terrible day today. I went broke up with my boyfriend."
            Summary 3: "Nothing happened today."

            Example Output:
            Summary 1
            """
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": formatted_summaries}
    ]

    completion = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=messages,
    )
    response = completion.choices[0].message.content

    # check response format
    if not response.startswith("Summary") or response.split(" ")[1] not in [str(i+1) for i in range(len(summaries))]:
        print("OpenAI highlight output format does not match")
        return {"summary": None, "quote": None}
    else:
        highlight_index = int(response.split(" ")[1]) - 1
        return {
            "summary": summaries[highlight_index],
            "quote": quotes[highlight_index],
            # "image": images[highlight_index],
            # "song": songs[highlight_index]
        }
    

def main():
    # see https://www.figma.com/file/hkbXs08qLiIzwE1MBdzYl3/Architecture?type=whiteboard&node-id=0%3A1&t=Rh3NLDzunaBegX3U-1
    analyze() # for testing purposes

if __name__ == "__main__":
    # main()
    app.run(debug=True)
