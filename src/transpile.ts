import { createToken, Lexer } from "chevrotain";
import { KEYWORD_MAP, REVERSED_KEYWORD_MAP } from "./mappings";

/* =========================
   TOKENS
   ========================= */

// Whitespace (conservé)
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
});

// Commentaires
const LineComment = createToken({
  name: "LineComment",
  pattern: /\/\/[^\n]*/,
});

const BlockComment = createToken({
  name: "BlockComment",
  pattern: /\/\*[\s\S]*?\*\//,
});

// String literals
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:\\.|[^"\\])*"/,
});

// Identifiers (Java-like)
const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

// Everything else (operators, punctuation, etc.)
const Other = createToken({
  name: "Other",
  pattern: /./,
});

const genzTokens = Object.keys(KEYWORD_MAP).map((e) => {
  const name = e.toUpperCase();
  const pattern = new RegExp(e);
  return createToken({
    name: name,
    pattern: pattern,
  });
});

const javaTokens = Object.keys(REVERSED_KEYWORD_MAP).map((e) => {
  const name = e.toUpperCase();
  const pattern = new RegExp(e);
  return createToken({
    name: name,
    pattern: pattern,
  });
});

/* =========================
   LEXER
   ========================= */

const allGenzTokens = [WhiteSpace, LineComment, BlockComment, StringLiteral]
  .concat(genzTokens)
  .concat([Identifier, Other]);

const genzLexer = new Lexer(allGenzTokens);

const allJavaTokens = [WhiteSpace, LineComment, BlockComment, StringLiteral]
  .concat(javaTokens)
  .concat([Identifier, Other]);

const javaLexer = new Lexer(allJavaTokens);

/* =========================
   TRANSPILER
   ========================= */

export function transpileToJava(source: string): string {
  return transpile(source, genzLexer, KEYWORD_MAP);
}

export function transpileToGenZ(source: string): string {
  return transpile(source, javaLexer, REVERSED_KEYWORD_MAP);
}

function transpile(
  source: string,
  lexer: Lexer,
  keywords: Record<string, string>
): string {
  const lexResult = lexer.tokenize(source);

  if (lexResult.errors.length > 0) {
    console.error(lexResult.errors);
    throw new Error("Lexing error");
  }

  return lexResult.tokens
    .map((token) => {
      const replacement = keywords[token.image];
      return replacement ?? token.image;
    })
    .join("");
}
