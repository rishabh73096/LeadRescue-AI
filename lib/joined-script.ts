// Scripts where letters join into one shape (Devanagari, Bengali, Tamil, Arabic...). Animating them
// letter by letter would break the shapes, so the toast reveals those a word at a time.
const JOINED = /[\u0600-\u06FF\u0750-\u077F\u0900-\u0DFF\u1780-\u17FF]/;

export const joinsLetters = (text: string) => JOINED.test(text);
