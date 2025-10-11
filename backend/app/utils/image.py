from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import os
from dotenv import load_dotenv

def generate_image(score:int, img_uri:str) -> str:
    """
    スコアによって現在のユーザーの画像の変化後画像を生成する関数
    
    Args:
        score (int): 日記スコア
    Returns:
        str: 生成した変化画像の保存先のuri
    """
    # .envファイルの読み込み
    load_dotenv(dotenv_path=".env")

    # API-KEYの設定
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = f"スコアに応じて、画像の人の雰囲気と健康状態を変化させてください。スコアの定義は、ある日記内容に基づいて-100から100の範囲で整数のスコアをつけたものです。活動的で前向きな内容は高いスコア、消極的で否定的な内容は低いスコアで反映している。スコアは{score}"

    image = Image.open(img_uri)

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt, image],
    )
    new_img_uri = 'test.png'
    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = Image.open(BytesIO(part.inline_data.data))
            image.save(os.path.join('/app/images', new_img_uri))
    return new_img_uri

if __name__ == '__main__':
    score = 40
    img_uri = '/app/images/young-woman-walking-through-neighborhood.jpg'
    generate_image(score, img_uri)

