import os
from io import BytesIO
from urllib.parse import urlparse

import httpx
from google import genai
from google.genai import types as genai_types
from PIL import Image, UnidentifiedImageError
from PIL.Image import Image as PILImage


def load_image_from_uri(img_uri: str) -> Image.Image:
    """ローカルパス or http(s) どちらでも Image を返す"""
    parsed = urlparse(img_uri)
    if parsed.scheme in ("http", "https"):
        with httpx.Client(timeout=15) as client:
            r = client.get(img_uri)
            r.raise_for_status()
        try:
            return Image.open(BytesIO(r.content))
        except UnidentifiedImageError as e:
            raise ValueError(f"URLの画像を開けませんでした: {e}") from e
    else:
        # ローカルファイル
        return Image.open(img_uri)


def generate_image(score: int, img_uri: str) -> PILImage:
    """
    スコアによって現在のユーザーの画像の変化後画像を生成する関数

    Args:
        score (int): 日記スコア
        img_uri (str): 入力画像のuri
    Returns:
        ImageFile: 生成した変化画像
    """

    # API-KEYの設定
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=GEMINI_API_KEY)

    # prompt = f"Based on the score, please change the person's facial expression, background, age, and health status in the image. The score is defined as an integer value ranging from -100 to 100, assigned based on the content of a diary entry. The score for the uploaded image is 0. Active and positive content reflects a high score, while passive and negative content reflects a low score. The given score is{score}"
    prompt = f"Based on the score, please modify the person's facial expression, age, background, and health status in the image. Specifically, the health status score is defined as an integer score ranging from -100 to 100, based on the content of a diary. The score for the uploaded image is 0. Active and positive content reflects a high score, while passive and negative content reflects a low score.When adjusting health status, reflect the score through visible physical changes such as the amount of gray or white hair, facial fullness or thinness, and the presence or depth of wrinkles. A higher score should indicate a healthier, more energetic appearance, while a lower score should show signs of fatigue or aging.The given score is {score}"

    image = load_image_from_uri(img_uri)

    response: genai_types.GenerateContentResponse = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt, image],
    )
    new_img_uri = "test3.png"
    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = Image.open(BytesIO(part.inline_data.data))
            image.save(os.path.join("/app/images", new_img_uri))
    return image


if __name__ == "__main__":
    score = -50
    img_uri = "/app/images/young-woman-walking-through-neighborhood.jpg"
    generate_image(score, img_uri)
