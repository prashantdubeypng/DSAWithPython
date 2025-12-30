def convertToTitle(columnNumber: int) -> str:
    """Translate a 1-based Excel column index into its letter title.

    The mapping follows Excel rules where 1 maps to "A", 26 maps to "Z",
    and 27 maps to "AA". We repeatedly convert the index into a base-26-like
    representation that uses letters instead of digits.

    Args:
        columnNumber: Positive integer representing the column position.

    Returns:
        Uppercase string corresponding to the Excel column title.
    """

    result = ""
    while columnNumber > 0:
        columnNumber -= 1
        result = chr(columnNumber % 26 + ord('A')) + result
        columnNumber //= 26
    return result