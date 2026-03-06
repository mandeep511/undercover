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
      mrWhiteFirstDiscussion: false,
      wordBank: 'general',
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
      { thoughtProcess: "Both are grab-and-go drinks. Smoothie feels fruity and thick, milkshake feels creamy and indulgent.", a: "Smoothie", b: "Milkshake", tags: ["food", "drinks"] },
      { thoughtProcess: "Both are social content habits. Podcast is long-form audio, vlog is personality-led video.", a: "Podcast", b: "Vlog", tags: ["media", "content"] },
      { thoughtProcess: "Both are togetherness moments. Picnic is outdoors and casual; barbecue is flame-centered and hosted.", a: "Picnic", b: "Barbecue", tags: ["social", "food"] },
      { thoughtProcess: "Both are city transport routines. Metro is rail-based; bus is road-based, but both mean commuting.", a: "Metro", b: "Bus", tags: ["transport", "city"] },
      { thoughtProcess: "Both are winter mood visuals. Snow feels soft and serene, frost feels sharp and crisp.", a: "Snow", b: "Frost", tags: ["weather", "nature"] },
      { thoughtProcess: "Both involve screens and gaming. Console is dedicated hardware; controller is the touchpoint in your hands.", a: "Console", b: "Controller", tags: ["gaming", "technology"] },
      { thoughtProcess: "Both are event-night excitement. Concert is music-first; festival is mixed vibe with music, food, and crowd energy.", a: "Concert", b: "Festival", tags: ["entertainment", "social"] },
      { thoughtProcess: "Both are table favorites. Sushi feels precise and fresh; ramen feels warm and comforting.", a: "Sushi", b: "Ramen", tags: ["food", "dining"] },
      { thoughtProcess: "Both are photo moments in travel. Monument is human-made landmark; waterfall is natural spectacle.", a: "Monument", b: "Waterfall", tags: ["travel", "places"] },
      { thoughtProcess: "Both are movement hobbies. Yoga emphasizes control and breath; pilates emphasizes core and form.", a: "Yoga", b: "Pilates", tags: ["fitness", "wellness"] },
      { thoughtProcess: "Both are celebration gestures. Toast is spoken and symbolic; cheer is loud and immediate.", a: "Toast", b: "Cheer", tags: ["social", "communication"] },
      { thoughtProcess: "Both are digital shopping cues. Coupon lowers checkout cost; wishlist delays purchase intent.", a: "Coupon", b: "Wishlist", tags: ["shopping", "lifestyle"] },
      { thoughtProcess: "Both are weekend-reset vibes. Staycation means resting close to home; road trip means escaping with movement.", a: "Staycation", b: "Road Trip", tags: ["travel", "lifestyle"] },
      { thoughtProcess: "Both are workspace habits. Brainstorming is idea expansion; planning is idea structuring.", a: "Brainstorm", b: "Planning", tags: ["work", "concepts"] },
      { thoughtProcess: "Both are pet personalities. Puppy implies playful energy; kitten implies curious softness.", a: "Puppy", b: "Kitten", tags: ["animals", "pets"] },
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


  wordBanks: {
    general: {
      label: '🌍 General Purpose',
      description: 'Everyday words with playful overlap. Best all-rounder for mixed groups.',
      audience: 'all'
    },
    tech: {
      label: '💻 Tech & Product',
      description: 'Modern digital-life pairs that are easy to explain without heavy jargon.',
      audience: 'all'
    },
    accounting: {
      label: '📊 Accounting & Finance',
      description: 'Finance-flavored words designed to be intuitive, not exam-level technical.',
      audience: 'all'
    },
    nsfw_general: {
      label: '🌶️ NSFW - General',
      description: 'Flirty nightlife themes with suggestive but party-friendly prompts.',
      audience: 'mature'
    },
    nsfw_after_dark: {
      label: '🔥 NSFW - After Dark',
      description: 'Bolder adult themes for trusted groups. Keep this to consenting adults.',
      audience: 'mature'
    }
  },

  wordBankPairs: {
    tech: [
      { thoughtProcess: 'Both are message channels. Similar socially, but one is short-form chat and the other is long-form mail.', a: 'Slack', b: 'Email', tags: ['tech', 'communication'] },
      { thoughtProcess: 'Both live in code workflows. A branch is temporary direction; main is the stable shared line.', a: 'Branch', b: 'Main', tags: ['tech', 'git'] },
      { thoughtProcess: 'Both store code changes. Pull request implies review; commit is atomic and personal.', a: 'Pull Request', b: 'Commit', tags: ['tech', 'engineering'] },
      { thoughtProcess: 'Both ship value. Feature adds capability; bugfix restores expected behavior.', a: 'Feature', b: 'Bugfix', tags: ['tech', 'product'] },
      { thoughtProcess: 'Both measure software health. Error is broad; exception is runtime-specific.', a: 'Error', b: 'Exception', tags: ['tech', 'debugging'] },
      { thoughtProcess: 'Both influence speed. Cache is stored shortcut; memory is active workspace.', a: 'Cache', b: 'Memory', tags: ['tech', 'systems'] },
      { thoughtProcess: 'Both are build-time quality guards. Test checks behavior; lint checks style and patterns.', a: 'Test', b: 'Lint', tags: ['tech', 'quality'] },
      { thoughtProcess: 'Both manage app setup. Config is values; environment is runtime context.', a: 'Config', b: 'Environment', tags: ['tech', 'devops'] },
      { thoughtProcess: 'Both are user interactions. Click is discrete input; scroll is continuous movement.', a: 'Click', b: 'Scroll', tags: ['tech', 'ui'] },
      { thoughtProcess: 'Both affect request speed. Query asks for data; index pre-structures access.', a: 'Query', b: 'Index', tags: ['tech', 'database'] },
      { thoughtProcess: 'Both protect access. Password is secret phrase; passkey is cryptographic replacement.', a: 'Password', b: 'Passkey', tags: ['tech', 'security'] },
      { thoughtProcess: 'Both handle deployment. Staging mirrors pre-release; production serves real users.', a: 'Staging', b: 'Production', tags: ['tech', 'release'] },
      { thoughtProcess: 'Both define app structures. Component is UI unit; template is reusable blueprint.', a: 'Component', b: 'Template', tags: ['tech', 'frontend'] },
      { thoughtProcess: 'Both are modern AI helpers. Prompt is instruction; response is generated output.', a: 'Prompt', b: 'Response', tags: ['tech', 'ai'] }
    ],
    accounting: [
      { thoughtProcess: 'Both are spending categories. Expense is broader; cost often links to producing value.', a: 'Expense', b: 'Cost', tags: ['finance', 'accounting'] },
      { thoughtProcess: 'Both increase balance sheet value. Asset is what you own; inventory is goods to sell.', a: 'Asset', b: 'Inventory', tags: ['finance', 'accounting'] },
      { thoughtProcess: 'Both are obligations. Debt is borrowed amount; liability is broader responsibility.', a: 'Debt', b: 'Liability', tags: ['finance', 'accounting'] },
      { thoughtProcess: 'Both measure performance. Revenue is top line; profit is what remains.', a: 'Revenue', b: 'Profit', tags: ['finance', 'business'] },
      { thoughtProcess: 'Both reduce taxable amount. Deduction is category-based; write-off is recognized loss/expense.', a: 'Deduction', b: 'Write-off', tags: ['finance', 'tax'] },
      { thoughtProcess: 'Both are payment instruments. Invoice requests money; receipt confirms payment.', a: 'Invoice', b: 'Receipt', tags: ['finance', 'ops'] },
      { thoughtProcess: 'Both predict finances. Budget is planned target; forecast adapts to trend.', a: 'Budget', b: 'Forecast', tags: ['finance', 'planning'] },
      { thoughtProcess: 'Both happen monthly. Salary is fixed pay; bonus is variable reward.', a: 'Salary', b: 'Bonus', tags: ['finance', 'payroll'] },
      { thoughtProcess: 'Both move cash. Deposit adds funds; withdrawal removes funds.', a: 'Deposit', b: 'Withdrawal', tags: ['finance', 'banking'] },
      { thoughtProcess: 'Both live in ledgers. Credit and debit are opposite-side entries.', a: 'Credit', b: 'Debit', tags: ['finance', 'bookkeeping'] },
      { thoughtProcess: 'Both represent ownership value. Equity is residual interest; shares are units of ownership.', a: 'Equity', b: 'Shares', tags: ['finance', 'investing'] },
      { thoughtProcess: 'Both define money timing. Accrual records when earned/incurred; cash records when paid.', a: 'Accrual', b: 'Cash', tags: ['finance', 'accounting'] }
    ],
    nsfw_general: [
      { thoughtProcess: 'Both describe chemistry in social settings. Flirting is subtle; teasing is more playful.', a: 'Flirting', b: 'Teasing', tags: ['nsfw', 'social'] },
      { thoughtProcess: 'Both happen at nightlife venues. Club is dance-first; lounge is chill-first.', a: 'Club', b: 'Lounge', tags: ['nsfw', 'nightlife'] },
      { thoughtProcess: 'Both are bold looks. Lingerie is intimate apparel; swimsuit is public beachwear.', a: 'Lingerie', b: 'Swimsuit', tags: ['nsfw', 'style'] },
      { thoughtProcess: 'Both set mood. Candlelight is cozy visual; perfume is sensory aura.', a: 'Candlelight', b: 'Perfume', tags: ['nsfw', 'atmosphere'] },
      { thoughtProcess: 'Both are low-light social moments. Date night is planned; afterparty is spontaneous.', a: 'Date Night', b: 'Afterparty', tags: ['nsfw', 'social'] },
      { thoughtProcess: 'Both involve physical affection. Cuddle is gentle comfort; spooning is specific closeness.', a: 'Cuddle', b: 'Spooning', tags: ['nsfw', 'affection'] },
      { thoughtProcess: 'Both are confidence cues. Wink is quick signal; stare is sustained signal.', a: 'Wink', b: 'Stare', tags: ['nsfw', 'body-language'] },
      { thoughtProcess: 'Both are bold communication styles. Dirty joke is comic; pickup line is intentional approach.', a: 'Dirty Joke', b: 'Pickup Line', tags: ['nsfw', 'conversation'] },
      { thoughtProcess: 'Both include nightlife energy. DJ sets tempo; bartender sets liquid mood.', a: 'DJ', b: 'Bartender', tags: ['nsfw', 'nightlife'] },
      { thoughtProcess: 'Both happen before plans. Sexting is explicit texting; voice note is suggestive tone-driven.', a: 'Sexting', b: 'Voice Note', tags: ['nsfw', 'digital'] }
    ],
    nsfw_after_dark: [
      { thoughtProcess: 'Both imply intimate setup. Foreplay builds tension; aftercare restores comfort.', a: 'Foreplay', b: 'Aftercare', tags: ['nsfw', 'adult'] },
      { thoughtProcess: 'Both are bedroom roles. Dominant sets pace; submissive yields control.', a: 'Dominant', b: 'Submissive', tags: ['nsfw', 'adult'] },
      { thoughtProcess: 'Both are close-contact moments. Makeout is prolonged kiss; hookup is broader encounter.', a: 'Makeout', b: 'Hookup', tags: ['nsfw', 'adult'] },
      { thoughtProcess: 'Both involve outfit intent. Roleplay is character-driven; costume is visual shell.', a: 'Roleplay', b: 'Costume', tags: ['nsfw', 'adult'] },
      { thoughtProcess: 'Both use restraint language. Safe word protects boundaries; consent confirms permission.', a: 'Safe Word', b: 'Consent', tags: ['nsfw', 'boundaries'] },
      { thoughtProcess: 'Both describe mood. Seduction is intentional build; temptation is felt pull.', a: 'Seduction', b: 'Temptation', tags: ['nsfw', 'adult'] },
      { thoughtProcess: 'Both involve private dancing. Lap dance is performative; grind is mutual movement.', a: 'Lap Dance', b: 'Grind', tags: ['nsfw', 'dance'] },
      { thoughtProcess: 'Both are confidence expressions. Strip tease is staged reveal; fantasy is internal script.', a: 'Strip Tease', b: 'Fantasy', tags: ['nsfw', 'adult'] },
      { thoughtProcess: 'Both happen in private spaces. Hotel key suggests escape; house key suggests familiarity.', a: 'Hotel Key', b: 'House Key', tags: ['nsfw', 'context'] },
      { thoughtProcess: 'Both are post-midnight vibes. Midnight text is direct ping; late call is voice intimacy.', a: 'Midnight Text', b: 'Late Call', tags: ['nsfw', 'communication'] }
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
    },

    getWordPairsForSettings(settings) {
      const difficulty = settings?.difficulty || 'mixed';
      const wordBank = settings?.wordBank || 'general';

      if (wordBank === 'general') {
        return App.wordPairs[difficulty] || App.wordPairs.mixed;
      }

      return App.wordBankPairs[wordBank] || App.wordPairs.mixed;
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
function getWordPairsForSettings(settings) { return App.utils.getWordPairsForSettings(settings); }

// Initialize app - load from localStorage
document.addEventListener('DOMContentLoaded', function () {
  App.storage.load();

  // Initialize selectedTeamId if not exists
  if (!App.state.selectedTeamId) {
    App.state.selectedTeamId = null;
  }

  const difficultySelect = document.getElementById('difficultySelect');
  const timerInput = document.getElementById('timerInput');
  const tieBreakerSelect = document.getElementById('tieBreakerSelect');
  const mrWhiteFirstTurnSelect = document.getElementById('mrWhiteFirstTurnSelect');

  if (difficultySelect) difficultySelect.value = App.state.settings.difficulty;
  if (timerInput) timerInput.value = App.state.settings.timerSeconds;
  if (tieBreakerSelect) tieBreakerSelect.value = App.state.settings.tieBreaker;
  if (mrWhiteFirstTurnSelect) {
    mrWhiteFirstTurnSelect.value = App.state.settings.mrWhiteFirstDiscussion ? 'include' : 'exclude';
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
