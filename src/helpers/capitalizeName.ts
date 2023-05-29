function capitalizeName(str: string) {
  // Split the string into an array of words
  const words = str.split(' ');

  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);
    return firstLetter + restOfWord;
  });

  const capitalizedString = capitalizedWords.join(' ');

  return capitalizedString;
}
export default capitalizeName;
