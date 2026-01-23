type Messages = Record<string, Record<string, string>>;

function translate(key: string): string;
function translate(messages: Messages, locale: string, key: string): string;
function translate(a: any, b?: any, c?: any): string {
  if (typeof a === 'string' && b === undefined) {
    // simple fallback when only a key is provided
    return a;
  }
  const messages: Messages = a;
  const locale: string = b;
  const key: string = c;
  if (!messages) return key;
  const lm = messages[locale] || messages['en-US'] || {};
  return lm[key] || key;
}

export default translate;
