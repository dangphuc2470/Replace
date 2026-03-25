// Store replacements in memory
let replacements = [];

// Load replacements from storage
async function loadReplacements() {
    const result = await chrome.storage.sync.get(['replacements']);
    replacements = result.replacements || [];
    console.log('Text Replacer: Loaded', replacements.length, 'replacements');
}

// Initialize
loadReplacements();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'reloadReplacements') {
        loadReplacements();
    }
});

// Function to replace fake values with real values before submission
function replaceFakeWithReal(element) {
    if (!element || !element.value) return;

    const currentValue = element.value;

    // Replace fake text with real text for submission
    for (const replacement of replacements) {
        if (currentValue.includes(replacement.fake)) {
            element.value = currentValue.replace(new RegExp(escapeRegExp(replacement.fake), 'g'), replacement.real);
            return;
        }
    }
}

// Function to replace text in text nodes (for display elements)
function replaceTextInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        let replaced = false;

        for (const replacement of replacements) {
            if (text.includes(replacement.real)) {
                text = text.replace(new RegExp(escapeRegExp(replacement.real), 'g'), replacement.fake);
                replaced = true;
            }
        }

        if (replaced) {
            node.textContent = text;
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Don't process input/textarea elements
        if (node.tagName !== 'INPUT' && node.tagName !== 'TEXTAREA' && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
            for (const child of node.childNodes) {
                replaceTextInNode(child);
            }
        }
    }
}

// Escape special regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// No need to process inputs while typing - users type fake values themselves

// Process all text nodes in the document
function processTextNodes() {
    if (document.documentElement) {
        replaceTextInNode(document.documentElement);
    }
}

// Intercept form submissions to replace fake with real values
function interceptFormSubmissions() {
    document.addEventListener('submit', (e) => {
        const form = e.target;
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input:not([type]), textarea');

        inputs.forEach(input => {
            replaceFakeWithReal(input);
        });
    }, true);
}

// Intercept before form submission using beforeinput
function setupBeforeSubmitHooks() {
    // Hook into form submissions via event capturing
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button, input[type="submit"], [type="submit"]');
        if (button) {
            const form = button.closest('form');
            if (form) {
                const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input:not([type]), textarea');
                inputs.forEach(input => {
                    replaceFakeWithReal(input);
                });
            }
        }
    }, true);
}

// Observe DOM changes for text node replacements
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Process text nodes in added elements
                    replaceTextInNode(node);
                } else if (node.nodeType === Node.TEXT_NODE) {
                    replaceTextInNode(node);
                }
            });
        } else if (mutation.type === 'characterData') {
            replaceTextInNode(mutation.target);
        }
    }
});

// Start observing
if (document.documentElement) {
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
    });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    });
}

// Initial processing
processTextNodes();
interceptFormSubmissions();
setupBeforeSubmitHooks();

// Periodic check for new text nodes
setInterval(() => {
    processTextNodes();
}, 1000);

console.log('Text Replacer: Content script loaded');
