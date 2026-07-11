// === Shared Verse Data & Functions ===

// Default verses (used if localStorage is empty)
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

// Get verses from localStorage or return defaults
function getVerses() {
  const stored = localStorage.getItem('peaceVerses');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_VERSES;
    }
  }
  return DEFAULT_VERSES;
}

// Save verses to localStorage
function saveVerses(verses) {
  localStorage.setItem('peaceVerses', JSON.stringify(verses));
}

// === User Interface Logic (only runs on index.html) ===
if (document.getElementById('revealCardBtn')) {
  (function() {
    let currentIndex = 0;
    let verses = getVerses();
    const totalVerses = () => verses.length;

    const startSection = document.getElementById('startSection');
    const revealBtn = document.getElementById('revealCardBtn');
    const verseCardContainer = document.getElementById('verseCardContainer');
    const englishDisplay = document.getElementById('englishDisplay');
    const swahiliDisplay = document.getElementById('swahiliDisplay');
    const verseCounter = document.getElementById('verseCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function updateVerseDisplay() {
      verses = getVerses(); // Refresh from storage
      if (verses.length === 0) {
        englishDisplay.textContent = "No verses available.";
        swahiliDisplay.textContent = "";
        verseCounter.textContent = "0 / 0";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }

      if (currentIndex >= verses.length) currentIndex = verses.length - 1;
      if (currentIndex < 0) currentIndex = 0;

      const verse = verses[currentIndex];
      englishDisplay.textContent = verse.en;
      swahiliDisplay.textContent = verse.sw;
      verseCounter.textContent = `${currentIndex + 1} / ${verses.length}`;

      englishDisplay.classList.remove('fade-in');
      swahiliDisplay.classList.remove('fade-in');
      void englishDisplay.offsetWidth;
      void swahiliDisplay.offsetWidth;
      englishDisplay.classList.add('fade-in');
      swahiliDisplay.classList.add('fade-in');

      prevBtn.disabled = (currentIndex === 0);
      nextBtn.disabled = (currentIndex === verses.length - 1);
    }

    function revealCardAndStart() {
      startSection.classList.add('hidden');
      verseCardContainer.classList.remove('hidden');
      currentIndex = 0;
      updateVerseDisplay();
    }

    revealBtn.addEventListener('click', revealCardAndStart);

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateVerseDisplay();
      }
    });

    nextBtn.addEventListener('click', () => {
      verses = getVerses();
      if (currentIndex < verses.length - 1) {
        currentIndex++;
        updateVerseDisplay();
      }
    });

    window.addEventListener('keydown', function(e) {
      if (startSection.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (currentIndex > 0) {
            currentIndex--;
            updateVerseDisplay();
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          verses = getVerses();
          if (currentIndex < verses.length - 1) {
            currentIndex++;
            updateVerseDisplay();
          }
        }
      }
    });

    // Initialize
    if (verses.length > 0) {
      const first = verses[0];
      englishDisplay.textContent = first.en;
      swahiliDisplay.textContent = first.sw;
      verseCounter.textContent = `1 / ${verses.length}`;
      prevBtn.disabled = true;
      nextBtn.disabled = (verses.length === 1);
    }
  })();
}