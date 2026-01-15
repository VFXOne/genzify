export const KEYWORD_MAP: Record<string, string> = {
    no_cap: "true",
    cap: "false",
    HotTake: "String",
    period: "float",
    fax: "boolean",
    skibidi: "void",
    vibe_check: "if",
    big_yikes: "else",
    on_point: "=",
    ratios: ">",
    smol: "<",
    fresh: "new",
    low_key: "private",
    high_key: "public",
    its_giving: "return",
    fuck_around: "try",
    find_out: "catch",
    Tea: "Exception",
    yeet: "throw",
    cook: "class",
    chad: "interface",
    bestie: "extends",
    simp: "implements",
    delulu: "abstract",
    cancel: "replace",
    "@HitsDifferent": "@Override",
  };
  
export const REVERSED_KEYWORD_MAP = Object.fromEntries(
  Object.entries(KEYWORD_MAP).map(([key, value]) => [value, key])
);