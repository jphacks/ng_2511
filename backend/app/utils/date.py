def parse_date(date_digits: int | str) -> tuple[int, int, int]:
    """8桁(YYYYMMDD)の日付を (year, month, day) に分解する。

    Args:
        date_digits: 例 20251011 または "20251011"

    Returns:
        (year, month, day) のタプル

    Raises:
        ValueError: 8桁でない、または整数化できない場合
    """
    s = str(date_digits)
    if len(s) != 8 or not s.isdigit():
        raise ValueError("Date must be an 8-digit number (YYYYMMDD)")

    year = int(s[:4])
    month = int(s[4:6])
    day = int(s[6:])

    return (year, month, day)
