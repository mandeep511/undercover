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
      // expanded ai suggested pairs with thought process
      { thoughtProcess: "Repeats 'Bath' from human pair. Pairs with 'Soap' - close relationship (bath uses soap), but different enough that players might describe differently. Some might say 'cleaning' or 'washing', others might say 'bubbly' or 'scented'. Creates confusion when Bath/Shower is also in play.", a: "Bath", b: "Soap", tags: ["household", "cleaning"] },
      { thoughtProcess: "Repeats 'Shower' from human pair but pairs with 'Rain'. Natural association (both involve water falling), but different contexts. Players might describe 'Shower' as bathroom-related, while 'Rain' is weather. Creates misdirection when Bath/Shower pair exists.", a: "Shower", b: "Rain", tags: ["nature", "weather"] },
      { thoughtProcess: "Repeats 'Key' from existing pair. Pairs with 'Lock' - close relationship (keys open locks), but players might describe differently. 'Key' might be described as 'opens things' while 'Lock' as 'security' or 'prevents access'. Good confusion factor.", a: "Key", b: "Lock", tags: ["everyday", "items"] },
      { thoughtProcess: "Repeats 'Cake' from existing pair. Pairs with 'Birthday' - strong association but different concepts. Players with 'Cake' might say 'dessert' or 'sweet', while 'Birthday' players might say 'celebration' or 'party'. Creates interesting descriptions.", a: "Cake", b: "Birthday", tags: ["celebration", "life"] },
      { thoughtProcess: "Repeats 'Watch' from existing pair. Pairs with 'Clock' - very similar (both tell time), but 'Watch' is personal jewelry while 'Clock' is furniture/wall item. Players might describe similarly ('tells time'), creating confusion.", a: "Watch", b: "Clock", tags: ["time", "household"] },
      { thoughtProcess: "Repeats 'Movie' from existing pair. Pairs with 'Theater' - close relationship (movies shown in theaters), but 'Movie' is content while 'Theater' is location. Players might describe 'Movie' as 'entertainment' and 'Theater' as 'building' or 'stage'.", a: "Movie", b: "Theater", tags: ["entertainment", "places"] },
      { thoughtProcess: "Repeats 'Star' from existing pair. Pairs with 'Sun' - both are celestial bodies, but 'Star' is distant while 'Sun' is our star. Players might describe both similarly ('in sky', 'bright'), creating confusion. Good misdirection.", a: "Star", b: "Sun", tags: ["nature", "space"] },
      { thoughtProcess: "Repeats 'River' from existing pair. Pairs with 'Ocean' - both water bodies, but vastly different scales. Players might describe 'River' as 'flowing' or 'narrow', while 'Ocean' as 'vast' or 'deep'. Creates interesting distinction.", a: "River", b: "Ocean", tags: ["nature", "geography"] },
      { thoughtProcess: "Repeats 'Mountain' from existing pair. Pairs with 'Hill' - similar landforms but different sizes. Players might describe both similarly ('elevated land'), creating confusion. Some might say 'tall' for mountain and 'small' for hill, but descriptions could overlap.", a: "Mountain", b: "Hill", tags: ["nature", "geography"] },
      { thoughtProcess: "Repeats 'Guitar' from existing pair. Pairs with 'Piano' - both musical instruments, but guitar is string/portable while piano is keyboard/large. Players might describe both as 'instrument' or 'music', creating confusion. Good close pair.", a: "Guitar", b: "Piano", tags: ["music", "instruments"] },
      { thoughtProcess: "Repeats 'Running' from existing pair. Pairs with 'Walking' - both locomotion methods, very close. Players might describe both similarly ('movement', 'legs'), creating high confusion. Strategic choice to make game harder.", a: "Running", b: "Walking", tags: ["sports", "actions"] },
      { thoughtProcess: "Repeats 'Butter' from existing pair. Pairs with 'Bread' - common food combination but different items. Players with 'Butter' might say 'spread' or 'dairy', while 'Bread' players might say 'carb' or 'baked'. Good distinction.", a: "Butter", b: "Bread", tags: ["food", "everyday"] },
      { thoughtProcess: "Repeats 'Bee' from existing pair. Pairs with 'Honey' - bee produces honey, strong association. Players with 'Bee' might say 'insect' or 'buzz', while 'Honey' players might say 'sweet' or 'food'. Creates interesting descriptions.", a: "Bee", b: "Honey", tags: ["animals", "food"] },
      { thoughtProcess: "Repeats 'Cloud' from human pair. Pairs with 'Sky' - close relationship (clouds are in sky), but 'Cloud' is object while 'Sky' is location. Players might describe both similarly ('blue', 'up'), creating confusion.", a: "Cloud", b: "Sky", tags: ["nature", "weather"] },
      { thoughtProcess: "Repeats 'Hammer' from human pair. Pairs with 'Screwdriver' - both tools, but different functions. Players might describe both as 'tool' or 'fix things', creating confusion. Some might say 'hit' for hammer and 'turn' for screwdriver.", a: "Hammer", b: "Screwdriver", tags: ["tools", "household"] },
      { thoughtProcess: "Repeats 'Onion' from human pair. Pairs with 'Tomato' - both common vegetables, but different flavors and uses. Players might describe both as 'vegetable' or 'cooking', creating confusion. Good close pair.", a: "Onion", b: "Tomato", tags: ["food", "vegetables"] },
      { thoughtProcess: "Repeats 'Paris' from human pair. Pairs with 'France' - Paris is in France, but one is city and other is country. Players with 'Paris' might say 'city' or 'Eiffel Tower', while 'France' players might say 'country' or 'Europe'. Creates distinction.", a: "Paris", b: "France", tags: ["places", "geography"] },
      { thoughtProcess: "Repeats 'Hug' from human pair. Pairs with 'Kiss' - both physical expressions of affection, very close. Players might describe both similarly ('affection', 'love'), creating high confusion. Strategic choice.", a: "Hug", b: "Kiss", tags: ["emotions", "actions"] },
      { thoughtProcess: "Close pair - both are types of footwear. 'Sneakers' is casual/running shoes, 'Boots' are taller/sturdier. Players might describe both as 'shoes' or 'footwear', creating confusion. Some might say 'casual' vs 'winter', but overlap exists.", a: "Sneakers", b: "Boots", tags: ["fashion", "clothing"] },
      { thoughtProcess: "Close pair - both are fruits. 'Banana' is yellow/curved, 'Apple' is round/red. Players might describe both as 'fruit' or 'healthy', creating confusion. Some might say 'yellow' vs 'red', but general descriptions could overlap.", a: "Banana", b: "Apple", tags: ["food", "fruit"] },
      { thoughtProcess: "Far pair - 'Salt' is condiment, 'Sugar' is sweetener. Both white powders used in cooking, but opposite tastes. Players might describe 'Salt' as 'salty' or 'preserves', while 'Sugar' as 'sweet' or 'dessert'. Creates interesting distinction.", a: "Salt", b: "Sugar", tags: ["food", "condiments"] },
      { thoughtProcess: "Close pair - both are vehicles. 'Car' is generic, 'Truck' is larger/cargo vehicle. Players might describe both as 'vehicle' or 'drives', creating confusion. Some might say 'small' vs 'big', but general descriptions overlap.", a: "Car", b: "Truck", tags: ["transport", "vehicles"] },
      { thoughtProcess: "Far pair - 'Book' is object, 'Library' is place. Strong association (books are in libraries), but different concepts. Players with 'Book' might say 'read' or 'pages', while 'Library' players might say 'building' or 'quiet'. Creates distinction.", a: "Book", b: "Library", tags: ["places", "education"] },
      { thoughtProcess: "Close pair - both are beverages. 'Juice' is fruit-based, 'Soda' is carbonated/sweetened. Players might describe both as 'drink' or 'liquid', creating confusion. Some might say 'healthy' vs 'bubbly', but overlap exists.", a: "Juice", b: "Soda", tags: ["food", "drinks"] },
      { thoughtProcess: "Close pair - both are animals. 'Cat' is domestic pet, 'Dog' is also domestic but different behavior. Players might describe both as 'pet' or 'animal', creating confusion. Some might say 'meow' vs 'bark', but general descriptions overlap.", a: "Cat", b: "Dog", tags: ["animals", "pets"] },
      { thoughtProcess: "Far pair - 'Pen' is writing tool, 'Paper' is writing surface. Strong association but different items. Players with 'Pen' might say 'writes' or 'ink', while 'Paper' players might say 'white' or 'draws on'. Creates interesting distinction.", a: "Pen", b: "Paper", tags: ["everyday", "items"] },
      { thoughtProcess: "Close pair - both are types of headwear. 'Hat' is generic, 'Cap' is specific style (baseball cap). Players might describe both as 'head' or 'wears on head', creating confusion. Very close pair.", a: "Hat", b: "Cap", tags: ["fashion", "clothing"] },
      { thoughtProcess: "Close pair - both are types of trees. 'Oak' is hardwood tree, 'Pine' is evergreen/coniferous. Players might describe both as 'tree' or 'wood', creating confusion. Some might say 'hard' vs 'soft', but general descriptions overlap.", a: "Oak", b: "Pine", tags: ["nature", "plants"] },
      { thoughtProcess: "Far pair - 'Window' is opening in wall, 'Door' is entrance. Both are openings in buildings but different functions. Players with 'Window' might say 'looks through' or 'glass', while 'Door' players might say 'enters' or 'opens'. Creates distinction.", a: "Window", b: "Door", tags: ["household", "building"] },
      { thoughtProcess: "Close pair - both are sea creatures. 'Fish' is generic, 'Shark' is specific predator. Players might describe both as 'ocean' or 'swims', creating confusion. Some might say 'small' vs 'dangerous', but general descriptions overlap.", a: "Fish", b: "Shark", tags: ["animals", "ocean"] },
      { thoughtProcess: "Far pair - 'Spoon' is utensil, 'Bowl' is container. Strong association (spoons used with bowls), but different items. Players with 'Spoon' might say 'eats with' or 'small', while 'Bowl' players might say 'holds food' or 'round'. Creates distinction.", a: "Spoon", b: "Bowl", tags: ["household", "kitchen"] },
      { thoughtProcess: "Close pair - both are emotions. 'Angry' is negative, 'Happy' is positive. Opposite emotions but both feelings. Players might describe both as 'emotion' or 'feeling', creating confusion. Strategic choice for misdirection.", a: "Angry", b: "Happy", tags: ["emotions", "concepts"] },
      { thoughtProcess: "Close pair - both are colors. 'Red' and 'Blue' are primary colors but different. Players might describe both as 'color' or 'bright', creating confusion. Some might say 'warm' vs 'cool', but general descriptions overlap.", a: "Red", b: "Blue", tags: ["concepts", "visual"] },
      { thoughtProcess: "Far pair - 'Chair' is furniture, 'Desk' is work surface. Both furniture but different functions. Players with 'Chair' might say 'sits on', while 'Desk' players might say 'works at' or 'flat surface'. Creates distinction.", a: "Chair", b: "Desk", tags: ["household", "furniture"] },
      { thoughtProcess: "Close pair - both are seasons. 'Summer' is hot, 'Winter' is cold. Opposite seasons but both are time periods. Players might describe both as 'season' or 'weather', creating confusion. Some might say 'hot' vs 'cold', but general overlap.", a: "Summer", b: "Winter", tags: ["nature", "time"] },
      { thoughtProcess: "Far pair - 'Flower' is plant, 'Garden' is place. Strong association (flowers grow in gardens), but different concepts. Players with 'Flower' might say 'pretty' or 'blooms', while 'Garden' players might say 'place' or 'grows things'. Creates distinction.", a: "Flower", b: "Garden", tags: ["nature", "places"] },
      { thoughtProcess: "Close pair - both are types of bread. 'Sandwich' uses bread, 'Toast' is cooked bread. Players might describe both as 'bread' or 'food', creating confusion. Some might say 'cold' vs 'warm', but general descriptions overlap.", a: "Sandwich", b: "Toast", tags: ["food", "bread"] },
      { thoughtProcess: "Far pair - 'Candle' is light source, 'Fire' is combustion. Strong association (candles make fire), but different concepts. Players with 'Candle' might say 'wax' or 'birthday', while 'Fire' players might say 'hot' or 'dangerous'. Creates distinction.", a: "Candle", b: "Fire", tags: ["household", "light"] },
      { thoughtProcess: "Close pair - both are weather phenomena. 'Wind' is moving air, 'Storm' is severe weather. Players might describe both as 'weather' or 'air', creating confusion. Some might say 'gentle' vs 'strong', but general overlap.", a: "Wind", b: "Storm", tags: ["nature", "weather"] },
      { thoughtProcess: "Repeats 'Dream' from existing pair. Pairs with 'Nightmare' - opposite dreams, but both are dream types. Players might describe both as 'dream' or 'sleep', creating confusion. Strategic misdirection.", a: "Dream", b: "Nightmare", tags: ["concepts", "life"] },
      { thoughtProcess: "Repeats 'Talent' from existing pair. Pairs with 'Gift' - similar concepts (both natural abilities), but different words. Players might describe both as 'ability' or 'natural', creating confusion. Very close pair.", a: "Talent", b: "Gift", tags: ["concepts", "abilities"] },
      { thoughtProcess: "Close pair - both are types of pasta. 'Spaghetti' is long noodles, 'Pizza' is Italian dish (not pasta but often grouped). Players might describe both as 'Italian food', creating confusion. Strategic choice.", a: "Spaghetti", b: "Pizza", tags: ["food", "italian"] },
      { thoughtProcess: "Far pair - 'Brush' is tool, 'Hair' is body part. Strong association (brushes used on hair), but different items. Players with 'Brush' might say 'tools' or 'cleans', while 'Hair' players might say 'on head' or 'grows'. Creates distinction.", a: "Brush", b: "Hair", tags: ["everyday", "body"] },
      { thoughtProcess: "Close pair - both are times of day. 'Morning' is early, 'Evening' is late. Different times but both are periods. Players might describe both as 'time' or 'day', creating confusion. Some might say 'early' vs 'late', but general overlap.", a: "Morning", b: "Evening", tags: ["time", "concepts"] },
      { thoughtProcess: "Repeats 'Pillow' from existing pair. Pairs with 'Bed' - strong association (pillows on beds), but different items. Players with 'Pillow' might say 'soft' or 'head', while 'Bed' players might say 'sleeps on' or 'furniture'. Creates distinction.", a: "Pillow", b: "Bed", tags: ["household", "bedroom"] },
      { thoughtProcess: "Repeats 'Blanket' from existing pair. Pairs with 'Sheet' - both bedding items, very close. Players might describe both as 'bed' or 'covers', creating confusion. Strategic choice for high confusion.", a: "Blanket", b: "Sheet", tags: ["household", "bedroom"] },
      { thoughtProcess: "Close pair - both are types of meat. 'Chicken' is poultry, 'Beef' is red meat. Players might describe both as 'meat' or 'protein', creating confusion. Some might say 'white' vs 'red', but general descriptions overlap.", a: "Chicken", b: "Beef", tags: ["food", "meat"] },
      { thoughtProcess: "Far pair - 'Ball' is object, 'Game' is activity. Strong association (balls used in games), but different concepts. Players with 'Ball' might say 'round' or 'bounces', while 'Game' players might say 'play' or 'fun'. Creates distinction.", a: "Ball", b: "Game", tags: ["sports", "activities"] },
      { thoughtProcess: "Close pair - both are types of sweets. 'Chocolate' is candy, 'Candy' is generic sweets. Players might describe both as 'sweet' or 'treat', creating confusion. Some might say 'dark' vs 'colorful', but general overlap.", a: "Chocolate", b: "Candy", tags: ["food", "dessert"] },
      { thoughtProcess: "Repeats 'Escalator' from human pair. Pairs with 'Stairs' from existing pair - both vertical transportation, but one is mechanical and other is manual. Players might describe both as 'goes up' or 'steps', creating confusion.", a: "Escalator", b: "Stairs", tags: ["transport", "building"] },
      { thoughtProcess: "Repeats 'Elevator' from human pair. Pairs with 'Ladder' from existing pair - both vertical access, but elevator is mechanical and ladder is manual. Players might describe both as 'climbs' or 'up', creating confusion.", a: "Elevator", b: "Ladder", tags: ["transport", "building"] },
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
