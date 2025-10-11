from google import genai
from google.genai import types
from PIL import Image, ImageFile
from io import BytesIO
import os
from dotenv import load_dotenv

def generate_image(score:int, img_url:str) -> ImageFile:
    """
    スコアによって現在のユーザーの画像の変化後画像を生成する関数
    
    Args:
        score (int): 日記スコア
    Returns:
        str: 生成した変化画像の保存先のurl
    """
    # .envファイルの読み込み
    load_dotenv(dotenv_path=".env")

    # API-KEYの設定
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=GEMINI_API_KEY)

    # prompt = f"Based on the score, please change the person's facial expression, background, age, and health status in the image. The score is defined as an integer value ranging from -100 to 100, assigned based on the content of a diary entry. The score for the uploaded image is 0. Active and positive content reflects a high score, while passive and negative content reflects a low score. The given score is{score}"
    prompt = f"Based on the score, please modify the person's facial expression, age, background, and health status in the image. Specifically, the health status score is defined as an integer score ranging from -100 to 100, based on the content of a diary. The score for the uploaded image is 0. Active and positive content reflects a high score, while passive and negative content reflects a low score.When adjusting health status, reflect the score through visible physical changes such as the amount of gray or white hair, facial fullness or thinness, and the presence or depth of wrinkles. A higher score should indicate a healthier, more energetic appearance, while a lower score should show signs of fatigue or aging.The given score is {score}"

    image = Image.open(img_uri)

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt, image],
    )
    new_img_uri = 'test3.png'
    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = Image.open(BytesIO(part.inline_data.data))
            image.save(os.path.join('/app/images', new_img_uri))
    return image

if __name__ == '__main__':
    score = -50
    img_uri = '/app/images/young-woman-walking-through-neighborhood.jpg'
    generate_image(score, img_uri)

