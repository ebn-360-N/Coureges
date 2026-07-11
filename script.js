// ============================================
// PEACE VERSES - SHARED SCRIPT
// Connects Admin Panel & User Interface
// ============================================

// Default verses (fallback if localStorage is empty)
const DEFAULT_VERSES = [
  { en: "“There is only one you in this world.”", sw: "Kuna wewe mmoja tu duniani kote." },
  { en: "“Your uniqueness is your superpower.”", sw: "Upekee wako ndio nguvu yako kuu." },
  { en: "“Don't compare yourself to others; you are a masterpiece.”", sw: "Usijilinganishe na wengine; wewe ni kazi bora ya sanaa." },
  { en: "“Be yourself; everyone else is already taken.”", sw: "Kuwa wewe mwenyewe; kila mtu mwingine tayari amechukuliwa." },
  { en: "“Your difference is your beauty.”", sw: "Tofauti yako ndio urembo wako." },
  { en: "“You were born to stand out, not to fit in.”", sw: "Umezaliwa kuangaza, siyo kufanana na wote." },
  { en: "“No one can play your role better than you.”", sw: "Hakuna anayeweza kucheza nafasi yako vizuri kuliko wewe." },
  { en: "“Your voice matters because no one speaks like you.”", sw: "Sauti yako ni muhimu kwa sababu hakuna anayesema kama wewe." },
  { en: "“The world needs the original you, not a copy.”", sw: "Ulimwengu unahitaji wewe halisi, siyo nakala." },
  { en: "“Celebrate who you are — flaws and all.”", sw: "Sherehekea ulivyo — na makosa yako pamoja na yote." },
  { en: "“You are not a drop in the ocean; you are the entire ocean in a drop.”", sw: "Wewe si tone baharini; wewe ni bahari nzima ndani ya tone." },
  { en: "“Your story is written by no one else but you.”", sw: "Hadithi yako imeandikwa na mtu mwingine yeyote isipokuwa wewe." }
];

// Shared storage key (same for both pages)
const STORAGE_KEY = 'adminPeaceVerses';

// Get verses from localStorage
function getVerses() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing verses from localStorage:', e);
    }
  }
  // Return default verses
  return JSON.parse(JSON.stringify(DEFAULT_VERSES)); // Deep copy
}

// Save verses to localStorage
function saveVerses(verses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verses));
    // Dispatch storage event for same-page updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(verses),
      oldValue: localStorage.getItem(STORAGE_KEY)
    }));
    return true;
  } catch (e) {
    console.error('Error saving verses:', e);
    return false;
  }
}

// Reset to default verses
function resetToDefaults() {
  saveVerses(JSON.parse(JSON.stringify(DEFAULT_VERSES)));
  return getVerses();
}

// ============================================
// USER INTERFACE LOGIC
// ============================================
if (document.getElementById('revealCardBtn')) {
  (function() {
    let currentIndex = 0;
    let verses = getVerses();
    let totalVerses = verses.length;

    const startSection = document.getElementById('startSection');
    const revealBtn = document.getElementById('revealCardBtn');
    const verseCardContainer = document.getElementById('verseCardContainer');
    const englishDisplay = document.getElementById('englishDisplay');
    const swahiliDisplay = document.getElementById('swahiliDisplay');
    const verseCounter = document.getElementById('verseCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function refreshVerses() {
      verses = getVerses();
      totalVerses = verses.length;
    }

    function updateVerseDisplay() {
      refreshVerses();
      
      if (totalVerses === 0) {
        englishDisplay.innerHTML = '<div style="color: #ab8b6e; font-style: italic; padding: 2rem;">No verses available yet. Please add verses from admin panel.</div>';
        swahiliDisplay.textContent = '';
        verseCounter.textContent = '0 / 0';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }

      // Ensure index is within bounds
      if (currentIndex >= totalVerses) {
        currentIndex = totalVerses - 1;
      }
      if (currentIndex < 0) {
        currentIndex = 0;
      }

      const verse = verses[currentIndex];
      
      // Update content
      englishDisplay.textContent = verse.en;
      swahiliDisplay.textContent = verse.sw;
      verseCounter.textContent = `${currentIndex + 1} / ${totalVerses}`;

      // Re-trigger fade animation
      englishDisplay.classList.remove('fade-in');
      swahiliDisplay.classList.remove('fade-in');
      void englishDisplay.offsetWidth; // Force reflow
      void swahiliDisplay.offsetWidth;
      englishDisplay.classList.add('fade-in');
      swahiliDisplay.classList.add('fade-in');

      // Update button states
      prevBtn.disabled = (currentIndex === 0);
      nextBtn.disabled = (currentIndex === totalVerses - 1);
    }

    function revealCard() {
      startSection.classList.add('hidden');
      verseCardContainer.classList.remove('hidden');
      currentIndex = 0;
      updateVerseDisplay();
    }

    function nextVerse() {
      refreshVerses();
      if (currentIndex < totalVerses - 1) {
        currentIndex++;
        updateVerseDisplay();
      }
    }

    function prevVerse() {
      if (currentIndex > 0) {
        currentIndex--;
        updateVerseDisplay();
      }
    }

    // Event Listeners
    revealBtn.addEventListener('click', revealCard);
    prevBtn.addEventListener('click', prevVerse);
    nextBtn.addEventListener('click', nextVerse);

    // Keyboard Navigation
    window.addEventListener('keydown', function(e) {
      if (startSection.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (!prevBtn.disabled) prevVerse();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          refreshVerses();
          if (!nextBtn.disabled) nextVerse();
        }
      }
    });

    // Listen for storage changes (from admin panel in another tab)
    window.addEventListener('storage', function(e) {
      if (e.key === STORAGE_KEY) {
        console.log('Verses updated from admin panel!');
        refreshVerses();
        if (!startSection.classList.contains('hidden')) {
          updateVerseDisplay();
        }
      }
    });

    // Also listen for custom storage events (same tab updates)
    window.addEventListener('storage', function(e) {
      if (e.key === STORAGE_KEY) {
        refreshVerses();
        if (!startSection.classList.contains('hidden')) {
          updateVerseDisplay();
        }
      }
    });

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      if (startSection.classList.contains('hidden')) {
        const swipeThreshold = 75;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            // Swipe left = next
            nextVerse();
          } else {
            // Swipe right = previous
            prevVerse();
          }
        }
      }
    }

    // Initialize display
    if (verses.length > 0) {
      englishDisplay.textContent = verses[0].en;
      swahiliDisplay.textContent = verses[0].sw;
      verseCounter.textContent = `1 / ${totalVerses}`;
      prevBtn.disabled = true;
      nextBtn.disabled = (totalVerses === 1);
    } else {
      englishDisplay.innerHTML = '<div style="color: #ab8b6e; font-style: italic; padding: 2rem;">Loading verses...</div>';
      swahiliDisplay.textContent = '';
      verseCounter.textContent = '0 / 0';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    }

    console.log('🌿 Peace Verses User Interface Loaded');
    console.log(`📖 ${totalVerses} verses available`);
  })();
}

// ============================================
// ADMIN PANEL LOGIC
// ============================================
if (document.getElementById('verseListContainer')) {
  (function() {
    console.log('🕊️ Admin Panel Loaded');

    // Render verse list in admin
    function renderAdminVerseList() {
      const container = document.getElementById('verseListContainer');
      const verses = getVerses();
      
      // Update verse count
      const verseCountElement = document.getElementById('verseCount');
      if (verseCountElement) {
        verseCountElement.textContent = verses.length;
      }
      
      if (verses.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:2rem; color:#ab8b6e;">No verses yet. Add your first verse below! ✨</div>';
        return;
      }
      
      container.innerHTML = verses.map((verse, index) => `
        <div class="verse-item" data-index="${index}">
          <label>📝 English (Verse ${index + 1})</label>
          <input type="text" class="en-input" value="${escapeHtml(verse.en)}" data-index="${index}" placeholder="Enter English verse...">
          <label>🌍 Swahili</label>
          <input type="text" class="sw-input" value="${escapeHtml(verse.sw)}" data-index="${index}" placeholder="Enter Swahili translation...">
          <div class="verse-actions">
            <button onclick="window.moveVerseUp(${index})" class="btn-small" ${index === 0 ? 'disabled' : ''}>↑ Up</button>
            <button onclick="window.moveVerseDown(${index})" class="btn-small" ${index === verses.length - 1 ? 'disabled' : ''}>↓ Down</button>
            <button onclick="window.duplicateVerse(${index})" class="btn-small">📋 Copy</button>
            <button onclick="window.deleteVerse(${index})" class="btn-small danger">🗑 Delete</button>
          </div>
        </div>
      `).join('');
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Collect all edited verses
    function collectAdminEdits() {
      const enInputs = document.querySelectorAll('.en-input');
      const swInputs = document.querySelectorAll('.sw-input');
      const verses = [];
      
      enInputs.forEach((input, i) => {
        verses.push({ 
          en: input.value.trim(), 
          sw: swInputs[i] ? swInputs[i].value.trim() : '' 
        });
      });
      
      return verses;
    }

    // Save all verses
    window.saveAllVerses = function() {
      const updatedVerses = collectAdminEdits();
      
      // Validation
      for (let i = 0; i < updatedVerses.length; i++) {
        if (!updatedVerses[i].en || !updatedVerses[i].sw) {
          showMessage('⚠️ Please fill in both English and Swahili for verse ' + (i + 1), 'error');
          return;
        }
      }
      
      if (updatedVerses.length === 0) {
        showMessage('⚠️ Cannot save empty verse list. Add at least one verse.', 'error');
        return;
      }
      
      if (saveVerses(updatedVerses)) {
        showMessage('✅ All verses saved successfully! User page will update automatically.', 'success');
        renderAdminVerseList();
      } else {
        showMessage('❌ Error saving verses. Please try again.', 'error');
      }
    };

    // Add new verse
    window.addNewVerse = function() {
      const enInput = document.getElementById('newEnglish');
      const swInput = document.getElementById('newSwahili');
      const en = enInput.value.trim();
      const sw = swInput.value.trim();
      
      if (!en || !sw) {
        showMessage('⚠️ Both English and Swahili fields are required.', 'error');
        return;
      }
      
      const verses = collectAdminEdits();
      verses.push({ en, sw });
      
      if (saveVerses(verses)) {
        enInput.value = '';
        swInput.value = '';
        renderAdminVerseList();
        showMessage('✨ New verse added successfully!', 'success');
      }
    };

    // Delete verse
    window.deleteVerse = function(index) {
      if (!confirm('Are you sure you want to delete verse ' + (index + 1) + '?')) return;
      
      const verses = collectAdminEdits();
      verses.splice(index, 1);
      
      if (saveVerses(verses)) {
        renderAdminVerseList();
        showMessage('🗑️ Verse deleted successfully.', 'success');
      }
    };

    // Duplicate verse
    window.duplicateVerse = function(index) {
      const verses = collectAdminEdits();
      const verseToCopy = verses[index];
      verses.splice(index + 1, 0, { 
        en: verseToCopy.en + ' (copy)', 
        sw: verseToCopy.sw + ' (nakala)' 
      });
      
      if (saveVerses(verses)) {
        renderAdminVerseList();
        showMessage('📋 Verse duplicated successfully.', 'success');
      }
    };

    // Move verse up
    window.moveVerseUp = function(index) {
      if (index === 0) return;
      const verses = collectAdminEdits();
      [verses[index - 1], verses[index]] = [verses[index], verses[index - 1]];
      
      if (saveVerses(verses)) {
        renderAdminVerseList();
        showMessage('⬆️ Verse moved up.', 'success');
      }
    };

    // Move verse down
    window.moveVerseDown = function(index) {
      const verses = collectAdminEdits();
      if (index >= verses.length - 1) return;
      [verses[index], verses[index + 1]] = [verses[index + 1], verses[index]];
      
      if (saveVerses(verses)) {
        renderAdminVerseList();
        showMessage('⬇️ Verse moved down.', 'success');
      }
    };

    // Reset to defaults
    window.resetToDefaults = function() {
      if (!confirm('⚠️ This will delete all changes and restore default verses. Continue?')) return;
      
      const defaults = resetToDefaults();
      if (defaults) {
        renderAdminVerseList();
        showMessage('🔄 Reset to default verses successfully.', 'success');
      }
    };

    // Show messages
    function showMessage(text, type) {
      const area = document.getElementById('messageArea');
      if (!area) return;
      
      area.innerHTML = `<div class="message ${type}">${text}</div>`;
      
      setTimeout(() => { 
        if (area) area.innerHTML = ''; 
      }, 4000);
    }

    // Keyboard shortcuts for admin
    window.addEventListener('keydown', function(e) {
      // Ctrl+S to save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        window.saveAllVerses();
      }
    });

    // Initialize admin panel
    renderAdminVerseList();
    
    // Add reset button if it exists
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', window.resetToDefaults);
    }
  })();
}

console.log('📦 Peace Verses System Ready');
console.log('🔑 Storage Key:', STORAGE_KEY);
console.log('📖 Current verses:', getVerses().length);
