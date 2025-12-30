def lengthOfLastWord(s: str) -> int:
    """Return the length of the last word in s.

    A word consists solely of non-space characters. Trailing spaces are
    ignored before counting so inputs like "hello World   " still produce 5.

    Args:
        s: Input string that may contain spaces and letters.

    Returns:
        Integer length of the final word; 0 if the string has no words.
    """

    i = len(s) - 1
    # Skip trailing spaces so we start on a letter.
    while i >= 0 and s[i] == " ":
        i -= 1
    count = 0
    # Count the final block of non-space characters.
    while i >= 0 and s[i] != " ":
        count += 1
        i -= 1
    return count


ans = lengthOfLastWord("fly me to the moon")
print(ans)