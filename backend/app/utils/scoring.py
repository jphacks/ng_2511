import os
import time

from dotenv import load_dotenv
from fastapi import HTTPException
from google import genai


def check_response(response: str) -> bool:
    """
    Geminiのレスポンスが-100から100の整数かどうかをチェックする関数
    Args:
        response (str): Geminiからのレスポンス文字列
    Returns:
        bool: レスポンスが-100から100の整数ならTrue、そうでないならFalse
    """
    try:
        # 文字列を整数に変換
        value = int(response)
        return -100 <= value <= 100
    except ValueError:
        # 整数に変換できない文字列の場合
        return False


def generate_diary_score_using_Gemini(diary_body: str) -> int:
    """
    Geminiを使って日記のスコアを生成する関数

    Args:
        diary_body (str): 日記の内容
    Returns:
        int: 生成されたスコア（-100~100）
    """
    # .envファイルの読み込み
    load_dotenv(dotenv_path=".env")

    # API-KEYの設定
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = f"""以下は、ある日の日記です。日記の内容を読み、その内容に基づいて-100から100の範囲で整数のスコアをつけてください。活動的で前向きな内容には高いスコアを、消極的で否定的な内容には低いスコアをつけてください。整数値のみを返し、それ以外は何も含めないことを遵守してください。
    ### 日記:
    {diary_body}"""

    i = 0
    while True:
        i += 1
        response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        is_correct_response = check_response(response.text)
        if is_correct_response != False:
            break
        if i >= 5:
            raise HTTPException(status_code=402, detail="Failed to get response from gemini")
        time.sleep(1)

    return int(response.text)
