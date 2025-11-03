/* App State & Data */

const App = {
  // Game state
  state: {
    players: [],
    teams: [],
    currentSession: null,
    settings: {
      difficulty: 'mixed',
      timerSeconds: 30,
      tieBreaker: 'revote',
      minPlayers: 3,
      maxPlayers: 20
    }
  },

  // Word pairs data
  wordPairs: {
    "easy": [
      { "a": "Armchair", "b": "Recliner", "tags": ["household", "furniture"] },
      { "a": "Mason Jar", "b": "Carafe", "tags": ["household", "kitchen"] },
      { "a": "Boulevard", "b": "Avenue", "tags": ["places", "transport"] },
      { "a": "Cottage", "b": "Cabin", "tags": ["places", "household"] },
      { "a": "Content", "b": "Satisfied", "tags": ["emotions", "concepts"] },
      { "a": "Yacht", "b": "Cruise Ship", "tags": ["transport", "vehicles"] },
      { "a": "Husky", "b": "Retriever", "tags": ["animals", "pets"] },
      { "a": "Surgeon", "b": "Anesthesiologist", "tags": ["professions", "people"] },
      { "a": "Hoodie", "b": "Sweatshirt", "tags": ["fashion", "clothing"] },
      { "a": "Landline", "b": "Mobile Phone", "tags": ["technology", "electronics"] }
    ],
    mixed: [
      // human suggested pairs
      { a: "Netflix", b: "YouTube", tags: ["streaming"] },
      { a: "Butterfly", b: "Bird", tags: ["flying"] },
      { a: "Onion", b: "Garlic", tags: ["vegetables"] },
      { a: "Paris", b: "London", tags: ["cities"] },
      { a: "Escalator", b: "Elevator", tags: ["transport"] },
      { a: "Happiness", b: "Love", tags: ["emotions"] },
      { a: "Hug", b: "Handshake", tags: ["greetings"] },
      { a: "Hammer", b: "Nail", tags: ["tools"] },
      { a: "Cloud", b: "Fog", tags: ["nature", "weather"] },
      { a: "Thunder", b: "Lightning", tags: ["nature", "weather", "associated"] },
      { a: "Captain America", b: "Iron Man", tags: ["pop culture", "superheroes"] },
      { a: "Singapore", b: "Hong Kong", tags: ["places", "cities"] },
      { a: "Bath", b: "Shower", tags: ["household", "actions"] },
      // ai suggested pairs
      { a: "Pillow", b: "Blanket", tags: ["household", "bedroom"] },
      { a: "Wine Glass", b: "Champagne Flute", tags: ["household", "kitchen"] },
      { a: "Espresso", b: "Cappuccino", tags: ["food", "drinks"] },
      { a: "Laptop", b: "Tablet", tags: ["technology", "electronics"] },
      { a: "River", b: "Lake", tags: ["nature", "geography"] },
      { a: "Broom", b: "Mop", tags: ["household", "cleaning"] },
      { a: "Key", b: "Credit Card", tags: ["everyday", "items"] },
      { a: "Cake", b: "Pie", tags: ["food", "dessert"] },
      { a: "Tiger", b: "Leopard", tags: ["animals", "mammals"] },
      { a: "Stairs", b: "Ladder", tags: ["household", "transport"] },
      { a: "Painting", b: "Photography", tags: ["art", "hobbies"] },
      { a: "Watch", b: "Bracelet", tags: ["fashion", "accessories"] },
      { a: "Movie", b: "Play", tags: ["entertainment", "art"] },
      { a: "Ketchup", b: "Mustard", tags: ["food", "condiments"] },
      { a: "Hotel", b: "Airbnb", tags: ["travel", "places"] },
      { a: "Bee", b: "Mosquito", tags: ["animals", "insects"] },
      { a: "Headphones", b: "Speakers", tags: ["technology", "audio"] },
      { a: "Butter", b: "Cheese", tags: ["food", "dairy"] },
      { a: "Mountain", b: "Volcano", tags: ["nature", "geography"] },
      { a: "Google", b: "Wikipedia", tags: ["technology", "internet"] },
      { a: "Guitar", b: "Violin", tags: ["music", "instruments"] },
      { a: "Running", b: "Swimming", tags: ["sports", "actions"] },
      { a: "New York", b: "Tokyo", tags: ["places", "cities"] },
      { a: "Batman", b: "Superman", tags: ["pop culture", "superheroes"] },
      { a: "Grapefruit", b: "Pomegranate", tags: ["food", "fruit"] },
      { a: "Star", b: "Planet", tags: ["nature", "space"] },
      { a: "Dream", b: "Goal", tags: ["concepts", "life"] },
      { a: "Hail", b: "Sleet", tags: ["nature", "weather"] },
      { a: "Talent", b: "Skill", tags: ["concepts", "abilities"] },
      { a: "Joke", b: "Story", tags: ["communication", "concepts"] },
    ],
    "hard": [
      { "a": "Moment", "b": "Opportunity", "tags": ["concepts", "abstract", "life"] },
      { "a": "Foundation", "b": "Cornerstone", "tags": ["concepts", "analogy"] },
      { "a": "Germ", "b": "Concept", "tags": ["concepts", "abstract"] },
      { "a": "Cipher", "b": "Credential", "tags": ["technology", "concepts", "security"] },
      { "a": "Archive", "b": "Database", "tags": ["places", "technology", "information"] },
      { "a": "Blueprint", "b": "Agenda", "tags": ["tools", "concepts", "organization"] },
      { "a": "Core", "b": "Drivetrain", "tags": ["analogy", "science", "mechanics"] },
      { "a": "Prism", "b": "Manuscript", "tags": ["household", "concepts", "abstract"] },
      { "a": "Reformatory", "b": "Academy", "tags": ["places", "institutions", "society"] },
      { "a": "Guardian", "b": "Mentor", "tags": ["professions", "people", "society"] }
    ]
  },

  // Utilities
  utils: {
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    normalizeName(name) {
      return name.trim().toLowerCase();
    },

    normalizeWord(word) {
      return word.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
    },

    getRoleDisplay(role) {
      if (role === 'civilian') return '👥 Civilian';
      if (role === 'undercover') return '🕵️ Undercover';
      if (role === 'mrWhite') return '❓ Mr. White';
      return role;
    }
  },

  // UI navigation
  ui: {
    showScreen(screenId) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(screenId).classList.add('active');
    },

    showModal(modalId) {
      document.getElementById(modalId).classList.add('active');
    },

    closeModal() {
      document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    }
  },

  // LocalStorage persistence
  storage: {
    save() {
      try {
        localStorage.setItem('undercover_teams', JSON.stringify(App.state.teams));
        localStorage.setItem('undercover_players', JSON.stringify(App.state.players));
        localStorage.setItem('undercover_settings', JSON.stringify(App.state.settings));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    },

    load() {
      try {
        const teams = localStorage.getItem('undercover_teams');
        const players = localStorage.getItem('undercover_players');
        const settings = localStorage.getItem('undercover_settings');

        if (teams) {
          App.state.teams = JSON.parse(teams);
        }
        if (players) {
          App.state.players = JSON.parse(players);
        }
        if (settings) {
          App.state.settings = { ...App.state.settings, ...JSON.parse(settings) };
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
    }
  }
};

// Global helpers (for HTML onclick handlers)
function showScreen(id) { App.ui.showScreen(id); }
function showModal(id) { App.ui.showModal(id); }
function closeModal() { App.ui.closeModal(); }
function generateId() { return App.utils.generateId(); }
function normalizeName(name) { return App.utils.normalizeName(name); }
function normalizeWord(word) { return App.utils.normalizeWord(word); }
function getRoleDisplay(role) { return App.utils.getRoleDisplay(role); }

// Initialize app - load from localStorage
document.addEventListener('DOMContentLoaded', function () {
  App.storage.load();

  // Initialize selectedTeamId if not exists
  if (!App.state.selectedTeamId) {
    App.state.selectedTeamId = null;
  }

  // Update team selection button visibility if setup screen is visible
  const setupScreen = document.getElementById('setupScreen');
  if (setupScreen && setupScreen.classList.contains('active')) {
    const selectTeamBtn = document.getElementById('selectTeamBtn');
    if (selectTeamBtn) {
      selectTeamBtn.style.display = App.state.teams.length > 0 ? 'block' : 'none';
    }
  }
});
