const style_plainToUnicodeSet = {};
//example of key-value pairs to be placed in above object:
// italic sans: {a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', …}
// italic serif: {a: '𝑎', b: '𝑏', c: '𝑐', d: '𝑑', e: '𝑒', …}

const style_unicodeChars = get_style_unicodeChars(); //get data from bottommost function
//for every key-value pair, convert the value from an array of unicode characters to a plainToUnicodeSet
for (let style in style_unicodeChars) {
  const unicodeChars = style_unicodeChars[style];
  style_plainToUnicodeSet[style] = create_plainToUnicodeSet(unicodeChars);
}

function create_plainToUnicodeSet(unicodeChars) {
  const alphanumeric =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const plainToUnicode_object = {};
  for (let i = 0; i < alphanumeric.length; i++) {
    const char = alphanumeric[i];
    const uniChar = unicodeChars[i];
    if (!uniChar) break;
    plainToUnicode_object[char] = uniChar;
  }
  return plainToUnicode_object;
}

function convertToUnicodeText(plainText, style) {
  const ref = style_plainToUnicodeSet[style]; //specify reference object with style
  const chars = plainText.split("");
  const unicodedText = chars
    .map((char) => ref[char] || char) //map through every character of 'plainText'
    //and return the associated unicode char if it exists, otherwise return the original character
    .join(""); //array to string
  return unicodedText;
}

//----------------------------------------------------------------------
//***************** create unicodeToPlain object ************
//----------------------------------------------------------------------
//      key:  all supported unicode characters
//      value: corresponding plain text character
//--------------------------------------------------
// (necessary to select different styles while auto-read-write-clipboard checkbox is checked. Walkthrough of why this object is necessary: You click a style. The clipboard is read and fed into textarea1 as plain text. The text is converted into unicode and fed into textarea2.  You click another style.  The clipboard's unicoded contents MUST BE CONVERTED TO PLAIN TEXT before being fed into textarea1, otherwise the clicked style will not manifest in textarea2.)
//--------------------------------------------------

const unicode_plain = {};

const plainToUnicodeSets = Object.values(style_plainToUnicodeSet);

plainToUnicodeSets.forEach((plain_unicode) => {
  for (let plainChar in plain_unicode) {
    const unicodeChar = plain_unicode[plainChar];
    unicode_plain[unicodeChar] = plainChar;
  }
});

function convertToPlainText(text) {
  let plainedText = "";
  const chars = Array.from(text); //other methods fail to iterate over unicode characters because they break them down into values like \u1233 \u1238 etc
  chars.forEach((char) => {
    const plainedChar = unicode_plain[char];
    plainedText += plainedChar || char;
  });
  return plainedText;
}

// prettier-ignore

function get_style_unicodeChars() {
    return {
        "bold sans":
        [
            "𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇","𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭","𝟬","𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵",
        ],
        "bold serif":
        [
            "𝐚","𝐛","𝐜","𝐝","𝐞","𝐟","𝐠","𝐡","𝐢","𝐣","𝐤","𝐥","𝐦","𝐧","𝐨","𝐩","𝐪","𝐫","𝐬","𝐭","𝐮","𝐯","𝐰","𝐱","𝐲","𝐳","𝐀","𝐁","𝐂","𝐃","𝐄","𝐅","𝐆","𝐇","𝐈","𝐉","𝐊","𝐋","𝐌","𝐍","𝐎","𝐏","𝐐","𝐑","𝐒","𝐓","𝐔","𝐕","𝐖","𝐗","𝐘","𝐙","𝟎","𝟏","𝟐","𝟑","𝟒","𝟓","𝟔","𝟕","𝟖","𝟗",
        ],
        "italic sans":
        [
            "𝘢","𝘣","𝘤","𝘥","𝘦","𝘧","𝘨","𝘩","𝘪","𝘫","𝘬","𝘭","𝘮","𝘯","𝘰","𝘱","𝘲","𝘳","𝘴","𝘵","𝘶","𝘷","𝘸","𝘹","𝘺","𝘻","𝘈","𝘉","𝘊","𝘋","𝘌","𝘍","𝘎","𝘏","𝘐","𝘑","𝘒","𝘓","𝘔","𝘕","𝘖","𝘗","𝘘","𝘙","𝘚","𝘛","𝘜","𝘝","𝘞","𝘟","𝘠","𝘡",
        ],
        "italic serif":
        [
            "𝑎","𝑏","𝑐","𝑑","𝑒","𝑓","𝑔","ℎ","𝑖","𝑗","𝑘","𝑙","𝑚","𝑛","𝑜","𝑝","𝑞","𝑟","𝑠","𝑡","𝑢","𝑣","𝑤","𝑥","𝑦","𝑧","𝐴","𝐵","𝐶","𝐷","𝐸","𝐹","𝐺","𝐻","𝐼","𝐽","𝐾","𝐿","𝑀","𝑁","𝑂","𝑃","𝑄","𝑅","𝑆","𝑇","𝑈","𝑉","𝑊","𝑋","𝑌","𝑍",
        ],
        "italic bold sans":
        [
          "𝙖","𝙗","𝙘","𝙙","𝙚","𝙛","𝙜","𝙝","𝙞","𝙟","𝙠","𝙡","𝙢","𝙣","𝙤","𝙥","𝙦","𝙧","𝙨","𝙩","𝙪","𝙫","𝙬","𝙭","𝙮","𝙯","𝘼","𝘽","𝘾","𝘿","𝙀","𝙁","𝙂","𝙃","𝙄","𝙅","𝙆","𝙇","𝙈","𝙉","𝙊","𝙋","𝙌","𝙍","𝙎","𝙏","𝙐","𝙑","𝙒","𝙓","𝙔","𝙕"
        ],
        "italic bold serif":
        [
          "𝒂","𝒃","𝒄","𝒅","𝒆","𝒇","𝒈","𝒉","𝒊","𝒋","𝒌","𝒍","𝒎","𝒏","𝒐","𝒑","𝒒","𝒓","𝒔","𝒕","𝒖","𝒗","𝒘","𝒙","𝒚","𝒛","𝑨","𝑩","𝑪","𝑫","𝑬","𝑭","𝑮","𝑯","𝑰","𝑱","𝑲","𝑳","𝑴","𝑵","𝑶","𝑷","𝑸","𝑹","𝑺","𝑻","𝑼","𝑽","𝑾","𝑿","𝒀","𝒁"
        ]
    };
}
