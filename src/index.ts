import { transpileToJava } from "./transpile";
import * as monaco from "monaco-editor";


monaco.languages.register({ id: "genz-java" });

monaco.languages.setMonarchTokensProvider("genz-java", {
tokenizer: {
    root: [
    [
        /\b(vibe_check|big_yikes|its_giving|fuck_around|find_out|yeet)\b/,
        "keyword",
    ],
    [/\b(class|public|static|void|if|else|return|new)\b/, "keyword"],
    [/\/\/.*/, "comment"],
    [/\/\*/, "comment", "@comment"],
    [/"/, "string", "@string"],
    ],
    string: [
    [/[^\\"]+/, "string"],
    [/\\./, "string.escape"],
    [/"/, "string", "@pop"],
    ],
    comment: [
    [/[^*/]+/, "comment"],
    [/\*\//, "comment", "@pop"],
    [/./, "comment"],
    ],
},
});

const inputEditor = monaco.editor.create(
document.getElementById("editor-input") as HTMLElement,
{
    value: `vibe_check (true) {
its_giving "no cap";
}`,
    language: "genz-java",
    theme: "vs-dark",
    minimap: { enabled: false },
}
);

const outputEditor = monaco.editor.create(
document.getElementById("editor-output") as HTMLElement,
{
    value: "",
    language: "java",
    theme: "vs-dark",
    readOnly: true,
    minimap: { enabled: false },
}
);

document.getElementById("toJava")!.onclick = () => {
outputEditor.setValue(transpileToJava(inputEditor.getValue()));
};
