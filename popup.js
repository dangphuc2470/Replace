// Load and display replacements when popup opens
document.addEventListener('DOMContentLoaded', () => {
  loadReplacements();
  
  // Add button click handler
  document.getElementById('addBtn').addEventListener('click', addReplacement);
  
  // Enter key handlers
  document.getElementById('realText').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addReplacement();
  });
  
  document.getElementById('fakeText').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addReplacement();
  });
  
  // Clear all button
  document.getElementById('clearAll').addEventListener('click', clearAll);
});

// Load replacements from storage
async function loadReplacements() {
  const result = await chrome.storage.sync.get(['replacements']);
  const replacements = result.replacements || [];
  
  displayReplacements(replacements);
}

// Display replacements in the list
function displayReplacements(replacements) {
  const listElement = document.getElementById('replacementList');
  const emptyState = document.getElementById('emptyState');
  
  listElement.innerHTML = '';
  
  if (replacements.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  replacements.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'replacement-item';
    div.innerHTML = `
      <div class="replacement-text">
        <span class="text-label">Văn bản thật (sẽ được gửi)</span>
        <span class="text-value real">${escapeHtml(item.real)}</span>
      </div>
      <div class="replacement-text">
        <span class="text-label">Văn bản giả (hiển thị)</span>
        <span class="text-value fake">${escapeHtml(item.fake)}</span>
      </div>
      <div class="replacement-row">
        <button class="btn-delete" data-index="${index}">Xóa</button>
      </div>
    `;
    
    listElement.appendChild(div);
  });
  
  // Add delete handlers
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      deleteReplacement(index);
    });
  });
}

// Add new replacement
async function addReplacement() {
  const realText = document.getElementById('realText').value.trim();
  const fakeText = document.getElementById('fakeText').value.trim();
  
  if (!realText || !fakeText) {
    alert('Vui lòng nhập cả văn bản thật và văn bản giả!');
    return;
  }
  
  const result = await chrome.storage.sync.get(['replacements']);
  const replacements = result.replacements || [];
  
  // Check if replacement already exists
  const exists = replacements.some(item => item.real === realText);
  if (exists) {
    alert('Văn bản thật này đã tồn tại!');
    return;
  }
  
  replacements.push({ real: realText, fake: fakeText });
  
  await chrome.storage.sync.set({ replacements });
  
  // Clear inputs
  document.getElementById('realText').value = '';
  document.getElementById('fakeText').value = '';
  
  // Reload display
  loadReplacements();
  
  // Notify content scripts to reload replacements
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: 'reloadReplacements' }).catch(() => {});
    });
  });
}

// Delete replacement
async function deleteReplacement(index) {
  const result = await chrome.storage.sync.get(['replacements']);
  const replacements = result.replacements || [];
  
  replacements.splice(index, 1);
  
  await chrome.storage.sync.set({ replacements });
  
  loadReplacements();
  
  // Notify content scripts
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: 'reloadReplacements' }).catch(() => {});
    });
  });
}

// Clear all replacements
async function clearAll() {
  if (!confirm('Bạn có chắc muốn xóa tất cả các thay thế?')) {
    return;
  }
  
  await chrome.storage.sync.set({ replacements: [] });
  
  loadReplacements();
  
  // Notify content scripts
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: 'reloadReplacements' }).catch(() => {});
    });
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
