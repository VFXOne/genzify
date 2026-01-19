import { transpileToGenZ, transpileToJava } from "./transpile";
import { KEYWORD_MAP, REVERSED_KEYWORD_MAP } from "./mappings";
import './styles.css';
import * as monaco from "monaco-editor"

self.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId, label) {
      if (label === "json") return "./json.worker.js";
      if (label === "css") return "./css.worker.js";
      if (label === "html") return "./html.worker.js";
      if (label === "typescript") return "./ts.worker.js";
      return "./editor.worker.js";
    }
};

monaco.languages.register({ id: "genz-java" });

const genZKeywords = Object.keys(KEYWORD_MAP).filter(k => k !== "@HitsDifferent").join("|");
const javaKeywords = Object.keys(REVERSED_KEYWORD_MAP).filter(k => k !== "@Override").join("|");

monaco.languages.setMonarchTokensProvider("genz-java", {
tokenizer: {
    root: [
    [
        new RegExp(`\\b(${genZKeywords})\\b`),
        "keyword",
    ],
    [
        new RegExp(`\\b(${javaKeywords})\\b`),
        "keyword"
    ],
    [/\/\/.*/, "comment"],
    [/\/\*/, "comment", "@comment"],
    [/"/, "string", "@string"],
    [/[{}()]/, "delimiter"],
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

const defaultCodeTemplate = document.getElementById("default-genz-code") as HTMLTemplateElement;
const defaultCode = defaultCodeTemplate.content.textContent?.trim() || "";

const inputEditor = monaco.editor.create(
    document.getElementById("editor-input") as HTMLElement,
    {
        value: defaultCode,
        language: "genz-java",
        theme: "vs-dark",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        scrollbar: {
            vertical: 'auto',
            horizontal: 'auto'
        },
        automaticLayout: true,
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
        scrollBeyondLastLine: false,
        scrollbar: {
            vertical: 'auto',
            horizontal: 'auto'
        },
        automaticLayout: true
    }
);

// Toggle pour choisir la direction de conversion
const conversionControls = document.getElementById('conversion-controls');
if (conversionControls) {
    conversionControls.innerHTML = ''; // Nettoyer le conteneur

    // Créer le conteneur principal
    const toggleWrapper = document.createElement('div');
    toggleWrapper.className = 'conversion-wrapper';

    // Créer le label "Convert to"
    const convertToLabel = document.createElement('div');
    convertToLabel.className = 'convert-to-label';
    convertToLabel.textContent = 'Convert to';

    // Créer les labels de direction
    const directionLabels = document.createElement('div');
    directionLabels.className = 'direction-labels';

    const javaLabel = document.createElement('span');
    javaLabel.className = 'direction-label java-label';
    javaLabel.textContent = 'Java';

    const genZLabel = document.createElement('span');
    genZLabel.className = 'direction-label genz-label';
    genZLabel.textContent = 'GenZ';

    directionLabels.appendChild(javaLabel);
    directionLabels.appendChild(genZLabel);

    // Créer le toggle
    const toggleElement = document.createElement('div');
    toggleElement.className = 'conversion-toggle';
    toggleElement.innerHTML = `
        <label>
            <input type="checkbox" id="conversion-direction">
            <span class="conversion-slider"></span>
        </label>
    `;

    // Assembler le tout
    toggleWrapper.appendChild(convertToLabel);
    toggleWrapper.appendChild(directionLabels);
    toggleWrapper.appendChild(toggleElement);
    conversionControls.appendChild(toggleWrapper);
}

// État de la conversion
let isConvertingToGenZ = false;

// Fonction pour mettre à jour les languages des éditeurs
function updateEditorLanguages() {
    if (isConvertingToGenZ) {
        // Quand on convertit vers GenZ, l'input est Java et l'output est GenZ
        monaco.editor.setModelLanguage(inputEditor.getModel()!, "java");
        monaco.editor.setModelLanguage(outputEditor.getModel()!, "genz-java");
    } else {
        // Quand on convertit vers Java, l'input est GenZ et l'output est Java
        monaco.editor.setModelLanguage(inputEditor.getModel()!, "genz-java");
        monaco.editor.setModelLanguage(outputEditor.getModel()!, "java");
    }
}

// Fonction pour convertir le code avec throttling
function convertCode() {
    const code = inputEditor.getValue();
    outputEditor.setValue(isConvertingToGenZ ? transpileToGenZ(code) : transpileToJava(code));
}

// Écouter les changements du toggle
document.getElementById('conversion-direction')?.addEventListener('change', (e) => {
    isConvertingToGenZ = (e.target as HTMLInputElement).checked;
    updateEditorLanguages();
    convertCode();
});

// Écouter les changements dans l'éditeur d'entrée
inputEditor.onDidChangeModelContent(() => {
    convertCode();
});

// Function to populate the mappings table
function populateMappingsTable() {
  const tableBody = document.querySelector('#mappings-table tbody');
  if (!tableBody) return;

  // Clear existing rows
  tableBody.innerHTML = '';

  // Add rows for each mapping
  Object.entries(KEYWORD_MAP).forEach(([genz, java]) => {
    const row = document.createElement('tr');

    const genzCell = document.createElement('td');
    genzCell.textContent = genz;

    const javaCell = document.createElement('td');
    javaCell.textContent = java;

    row.appendChild(javaCell);
    row.appendChild(genzCell);
    tableBody.appendChild(row);
  });
}

// Handle tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    const tabId = tab.getAttribute('data-tab');
    if (tabId) {
      const tabElement = document.getElementById(tabId);
      if (tabElement) {
        tabElement.classList.add('active');

        // If this is the mappings tab, populate the table
        if (tabId === 'mappings') {
          populateMappingsTable();
        }
      }
    }
  });
});

convertCode();