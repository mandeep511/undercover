/* Game Logic - Organized by Screen/Feature */

const Game = {
  // ===== SETUP SCREEN =====
  setup: {
    updatePlayerCount() {
      const count = parseInt(document.getElementById('playerCount').value);
      document.getElementById('playerCountDisplay').textContent = count;

      // Update default roles
      if (count >= 3 && count <= 4) {
        document.getElementById('civilianCount').textContent = count - 1;
        document.getElementById('undercoverCount').textContent = 1;
        document.getElementById('mrWhiteCount').textContent = 0;
      } else {
        document.getElementById('civilianCount').textContent = count - 2;
        document.getElementById('undercoverCount').textContent = 1;
        document.getElementById('mrWhiteCount').textContent = 1;
      }
    },

    adjustRole(role, delta) {
      const elementId = role === 'civilian' ? 'civilianCount' :
        role === 'undercover' ? 'undercoverCount' : 'mrWhiteCount';
      const element = document.getElementById(elementId);
      const current = parseInt(element.textContent);
      const newValue = Math.max(0, current + delta);
      element.textContent = newValue;
    },

    validateRoles() {
      const playerCount = parseInt(document.getElementById('playerCount').value);
      const civilian = parseInt(document.getElementById('civilianCount').textContent);
      const undercover = parseInt(document.getElementById('undercoverCount').textContent);
      const mrWhite = parseInt(document.getElementById('mrWhiteCount').textContent);

      const total = civilian + undercover + mrWhite;

      if (total !== playerCount) {
        return `Total roles (${total}) must equal player count (${playerCount})`;
      }

      if (civilian < 1) {
        return 'Must have at least 1 Civilian';
      }

      if (mrWhite > 0 && civilian < 1) {
        return 'Must have at least 1 Civilian when Mr. White is present';
      }

      return null;
    },

    startGame() {
      const error = this.validateRoles();
      if (error) {
        const errorEl = document.getElementById('setupError');
        errorEl.innerHTML = `<div class="alert alert-error">${error}</div>`;
        errorEl.style.display = 'block';
        return;
      }

      const playerCount = parseInt(document.getElementById('playerCount').value);
      const civilian = parseInt(document.getElementById('civilianCount').textContent);
      const undercover = parseInt(document.getElementById('undercoverCount').textContent);
      const mrWhite = parseInt(document.getElementById('mrWhiteCount').textContent);

      // Initialize session
      App.state.currentSession = {
        id: generateId(),
        playerCount: playerCount,
        roles: { civilian, undercover, mrWhite },
        players: [],
        currentPlayerIndex: 0,
        gameStarted: false,
        eliminated: [],
        startingPlayerIndex: null,
        cardsRevealed: [],
        cardsAssigned: [],
        namesAssigned: [],
        currentRevealedCard: null
      };

      // If team was selected, use those player IDs
      if (App.state.selectedTeamId) {
        const selectedTeam = App.state.teams.find(t => t.id === App.state.selectedTeamId);
        if (selectedTeam && selectedTeam.members.length === playerCount) {
          App.state.currentSession.previousTeamMembers = [...selectedTeam.members];
        }
        // Clear selection after use
        App.state.selectedTeamId = null;
      }

      // Assign roles and words immediately
      Game.core.assignRolesAndWords();

      document.getElementById('currentPlayerNumber').textContent = '1';
      document.getElementById('totalPlayers').textContent = playerCount;
      document.getElementById('hidePassBtn').style.display = 'none';

      // Show card reveal screen and render cards first
      showScreen('cardRevealScreen');
      Game.cardReveal.renderRevealCards();

      // Show name entry popup
      Game.cardReveal.showNameEntryPopup();
    },

    quickStart() {
      if (App.state.teams.length === 0) {
        showScreen('setupScreen');
        return;
      }

      // Use most recent team
      const team = App.state.teams.sort((a, b) => b.lastPlayed - a.lastPlayed)[0];
      const playerCount = team.members.length;

      document.getElementById('playerCount').value = playerCount;
      this.updatePlayerCount();

      App.state.currentSession = {
        id: generateId(),
        playerCount: playerCount,
        roles: {
          civilian: playerCount >= 5 ? playerCount - 2 : playerCount - 1,
          undercover: 1,
          mrWhite: playerCount >= 5 ? 1 : 0
        },
        players: [],
        currentPlayerIndex: 0,
        gameStarted: false,
        eliminated: [],
        startingPlayerIndex: null,
        cardsRevealed: [],
        cardsAssigned: [],
        namesAssigned: [],
        currentRevealedCard: null,
        previousTeamMembers: team.members
      };

      Game.core.assignRolesAndWords();

      // Start card assignment phase
      document.getElementById('currentPlayerNumber').textContent = '1';
      document.getElementById('totalPlayers').textContent = playerCount;
      document.getElementById('hidePassBtn').style.display = 'none';

      // Show card reveal screen and render cards first
      showScreen('cardRevealScreen');
      Game.cardReveal.renderRevealCards();

      // Show name entry popup for first player
      Game.cardReveal.showNameEntryPopup();
    },

    updateSettings() {
      App.state.settings.difficulty = document.getElementById('difficultySelect').value;
      App.state.settings.timerSeconds = parseInt(document.getElementById('timerInput').value);
      App.state.settings.tieBreaker = document.getElementById('tieBreakerSelect').value;
      App.storage.save();
    },

    showTeamSelection() {
      const listContainer = document.getElementById('teamSelectionList');
      const emptyState = document.getElementById('teamSelectionEmpty');
      
      if (App.state.teams.length === 0) {
        listContainer.innerHTML = '';
        emptyState.style.display = 'block';
        showModal('teamSelectionModal');
        return;
      }

      emptyState.style.display = 'none';
      listContainer.innerHTML = '';

      // Sort teams by most recently played
      const sortedTeams = [...App.state.teams].sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));

      sortedTeams.forEach((team, index) => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-selection-card';
        teamCard.dataset.teamId = team.id;

        const memberNames = team.members
          .map(id => App.state.players.find(p => p.id === id)?.name)
          .filter(Boolean);

        teamCard.innerHTML = `
          <div class="team-card-header">
            <h3 class="team-card-title">${team.name}</h3>
            <div class="team-card-badge">${team.members.length} players</div>
          </div>
          <div class="team-card-body">
            <div class="team-member-badges">
              ${memberNames.map(name => `<span class="member-badge">${name}</span>`).join('')}
            </div>
          </div>
          <button class="btn btn-primary team-select-btn" onclick="Game.setup.selectTeam('${team.id}')">Select Team</button>
        `;

        listContainer.appendChild(teamCard);
      });

      showModal('teamSelectionModal');
    },

    selectTeam(teamId) {
      const team = App.state.teams.find(t => t.id === teamId);
      if (!team) return;

      const playerCount = team.members.length;
      document.getElementById('playerCount').value = playerCount;
      this.updatePlayerCount();

      // Update selected state visually
      document.querySelectorAll('.team-selection-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.teamId === teamId) {
          card.classList.add('selected');
        }
      });

      // Store selected team ID for later use
      App.state.selectedTeamId = teamId;

      // Close modal after a brief delay to show selection
      setTimeout(() => {
        closeModal();
      }, 300);
    }
  },

  // ===== CARD REVEAL SCREEN =====
  cardReveal: {
    showNameEntryPopup() {
      document.getElementById('modalPlayerNumber').textContent = App.state.currentSession.currentPlayerIndex + 1;
      document.getElementById('modalTotalPlayers').textContent = App.state.currentSession.playerCount;
      document.getElementById('modalPlayerNameInput').value = '';
      document.getElementById('modalConfirmBtn').disabled = true;
      document.getElementById('nameModalSuggestion').style.display = 'none';
      showModal('nameEntryModal');
    },

    checkModalNameSuggestion() {
      const input = document.getElementById('modalPlayerNameInput').value;
      const normalized = normalizeName(input);

      if (input.length < 2) {
        document.getElementById('nameModalSuggestion').style.display = 'none';
        document.getElementById('modalConfirmBtn').disabled = true;
        return;
      }

      // Check for duplicates in current session
      const duplicate = App.state.currentSession.players.find(p =>
        normalizeName(p.name) === normalized
      );

      if (duplicate) {
        document.getElementById('nameModalSuggestion').innerHTML =
          `<div class="alert alert-error">This name is already taken!</div>`;
        document.getElementById('nameModalSuggestion').style.display = 'block';
        document.getElementById('modalConfirmBtn').disabled = true;
        return;
      }

      // Check for existing players
      const existingPlayer = App.state.players.find(p =>
        normalizeName(p.name) === normalized
      );

      if (existingPlayer && input.length > 2) {
        document.getElementById('nameModalSuggestion').innerHTML = `
          <div class="suggestion-box">
            <p>Found existing player: <strong>${existingPlayer.name}</strong></p>
            <div class="suggestion-buttons">
              <button class="btn btn-primary" onclick="Game.cardReveal.importModalPlayer('${existingPlayer.id}')">Import</button>
              <button class="btn btn-secondary" onclick="Game.cardReveal.dismissModalSuggestion()">Use New Name</button>
            </div>
          </div>
        `;
        document.getElementById('nameModalSuggestion').style.display = 'block';
      } else {
        document.getElementById('nameModalSuggestion').style.display = 'none';
      }

      document.getElementById('modalConfirmBtn').disabled = false;
    },

    importModalPlayer(playerId) {
      const player = App.state.players.find(p => p.id === playerId);
      if (player) {
        document.getElementById('modalPlayerNameInput').value = player.name;
        document.getElementById('nameModalSuggestion').style.display = 'none';
        document.getElementById('modalConfirmBtn').disabled = false;
      }
    },

    dismissModalSuggestion() {
      document.getElementById('nameModalSuggestion').style.display = 'none';
    },

    confirmNameAndShowCards() {
      const input = document.getElementById('modalPlayerNameInput').value.trim();
      if (!input) return;

      const session = App.state.currentSession;
      const currentIndex = session.currentPlayerIndex;

      // Find or create player
      let player = App.state.players.find(p => normalizeName(p.name) === normalizeName(input));

      if (!player) {
        player = {
          id: generateId(),
          name: input,
          seenWords: [],
          // New statistics tracking
          roleHistory: [], // Last 10 roles played
          teamsPlayed: [], // Team IDs this player has played with
          gamesPlayed: 0, // Total game count
          wins: { civilian: 0, undercover: 0, mrWhite: 0 } // Win counts per role
        };
        App.state.players.push(player);
      }
      
      // Ensure existing players have new fields (backward compatibility)
      if (!player.roleHistory) player.roleHistory = [];
      if (!player.teamsPlayed) player.teamsPlayed = [];
      if (!player.gamesPlayed) player.gamesPlayed = 0;
      if (!player.wins) player.wins = { civilian: 0, undercover: 0, mrWhite: 0 };

      // Store player info at the CURRENT index immediately
      const sessionPlayer = session.assignments[currentIndex];
      sessionPlayer.playerId = player.id;
      sessionPlayer.name = player.name;

      // Mark this specific card as having a name assigned (but not revealed yet)
      if (!session.namesAssigned) {
        session.namesAssigned = [];
      }
      session.namesAssigned.push(currentIndex);

      // Update display
      document.getElementById('currentPlayerNameDisplay').textContent = player.name;

      // Close modal and show cards
      closeModal();
      this.renderRevealCards();
    },

    renderRevealCards() {
      const grid = document.getElementById('revealCardGrid');
      const session = App.state.currentSession;
      
      const currentIndex = session.currentPlayerIndex;
      const isContinuingTeam = session.continuingTeam === true;

      // Ensure we have the right number of cards
      const existingCards = grid.children;
      const cardCount = session.playerCount;

      // Remove extra cards if player count decreased (shouldn't happen, but safety check)
      while (existingCards.length > cardCount) {
        grid.removeChild(existingCards[existingCards.length - 1]);
      }

      // Create or update cards in order (0 to playerCount-1) to maintain grid positions
      for (let i = 0; i < cardCount; i++) {
        let cardContainer = document.getElementById(`card-${i}`);
        
        // Create new card if it doesn't exist
        if (!cardContainer) {
          cardContainer = document.createElement('div');
          cardContainer.className = 'card-flip-container';
          cardContainer.id = `card-${i}`;
          
          const cardInner = document.createElement('div');
          cardInner.className = 'card-flip-inner';
          
          const cardBack = document.createElement('div');
          cardBack.className = 'card-face card-back';
          cardBack.innerHTML = `
            <div class="player-number">${i + 1}</div>
            🎭
          `;
          
          const cardFront = document.createElement('div');
          cardFront.className = 'card-face card-front';
          
          cardInner.appendChild(cardBack);
          cardInner.appendChild(cardFront);
          cardContainer.appendChild(cardInner);
          
          // Insert at correct position to maintain order
          const previousCard = i > 0 ? document.getElementById(`card-${i - 1}`) : null;
          if (previousCard && previousCard.nextSibling) {
            grid.insertBefore(cardContainer, previousCard.nextSibling);
          } else {
            grid.appendChild(cardContainer);
          }
        }

        // Update existing card state
        const cardInner = cardContainer.querySelector('.card-flip-inner');
        const cardBack = cardInner.querySelector('.card-back');
        const cardFront = cardInner.querySelector('.card-front');

        const isAssigned = session.cardsAssigned.includes(i);
        const isCurrentlyRevealed = session.currentRevealedCard === i;
        const hasNameAssigned = session.namesAssigned && session.namesAssigned.includes(i);
        const isCurrentPlayerCard = i === currentIndex;

        // Update flip state
        if (isAssigned || isCurrentlyRevealed || hasNameAssigned) {
          cardContainer.classList.add('flipped');
        } else {
          cardContainer.classList.remove('flipped');
        }

        // Reset front card styles
        cardFront.style.opacity = '';
        cardFront.style.background = '';

        // Update card front content based on state
        if (isAssigned) {
          // Fully assigned and completed cards (from previous players)
          const assignment = session.assignments[i];
          cardFront.style.opacity = '0.6';
          cardFront.style.background = 'var(--color-secondary)';
          cardFront.innerHTML = `
            <div class="player-number">${i + 1}</div>
            <div class="player-name" style="font-weight: 600; font-size: 18px; color: var(--color-text-secondary);">${assignment.name}</div>
            <p style="font-size: 12px; margin-top: 8px; color: var(--color-text-secondary);">Assigned</p>
          `;
        } else if (isCurrentlyRevealed && session.assignments[i]) {
          // Currently revealed card showing word/role
          const assignment = session.assignments[i];
          if (assignment.role === 'mrWhite') {
            cardFront.innerHTML = `
              <div class="player-number">${i + 1}</div>
              <div style="font-size: 20px; font-weight: 700; color: var(--color-error); margin-bottom: 8px; line-height: 1.2;">YOU ARE<br>MR. WHITE</div>
              <p style="font-size: 11px; color: var(--color-text-secondary); line-height: 1.3;">You don't know the word. Listen carefully and try to blend in!</p>
            `;
          } else {
            cardFront.innerHTML = `
              <div class="player-number">${i + 1}</div>
              <div style="font-size: 32px; font-weight: 700; color: var(--color-primary); margin: 24px 0;">${assignment.word}</div>
              <p style="font-size: 13px; color: var(--color-text-secondary);">Remember this word for the discussion</p>
            `;
          }
        } else if (hasNameAssigned && session.assignments[i]) {
          // Card with name assigned but not yet revealed
          const assignment = session.assignments[i];
          cardFront.style.background = 'var(--color-surface)';

          // For continuing team, show different message
          const tapMessage = isContinuingTeam ? 'Tap to see your new word' : 'Tap to reveal your role';

          cardFront.innerHTML = `
            <div class="player-number">${i + 1}</div>
            <div class="player-name" style="font-weight: 600; font-size: 18px; color: var(--color-primary);">${assignment.name}</div>
            <p style="font-size: 12px; margin-top: 8px; color: var(--color-text-secondary);">${tapMessage}</p>
          `;
        } else {
          // Blank card - clear content but keep structure
          cardFront.innerHTML = '';
        }

        // Update click handlers and cursor
        cardContainer.onclick = null;
        if (isCurrentPlayerCard && hasNameAssigned && !isCurrentlyRevealed && !isAssigned) {
          cardContainer.style.cursor = 'pointer';
          cardContainer.onclick = () => Game.cardReveal.revealCard(i);
        } else if (!isAssigned && !hasNameAssigned) {
          // Blank cards for future players - not clickable
          cardContainer.style.cursor = 'default';
        } else {
          cardContainer.style.cursor = 'not-allowed';
        }
      }
    },

    revealCard(cardIndex) {
      const session = App.state.currentSession;

      // Track which card is currently revealed
      session.currentRevealedCard = cardIndex;

      // Re-render to show the revealed card
      this.renderRevealCards();

      // Show hide and pass button
      document.getElementById('hidePassBtn').style.display = 'block';
    },

    hideAndPass() {
      const session = App.state.currentSession;
      const currentIndex = session.currentPlayerIndex;
      const isContinuingTeam = session.continuingTeam === true;

      // Mark the current player's card as fully assigned
      if (!session.cardsAssigned.includes(currentIndex)) {
        session.cardsAssigned.push(currentIndex);
      }

      // Save current player at their correct index
      session.players.push(session.assignments[currentIndex]);
      session.currentPlayerIndex++;

      if (session.currentPlayerIndex >= session.playerCount) {
        // All players have picked cards - show turn order screen
        Game.gameScreen.showTurnOrderScreen();
        return;
      }

      // Reset current revealed card for next player
      session.currentRevealedCard = null;
      document.getElementById('currentPlayerNumber').textContent = session.currentPlayerIndex + 1;
      document.getElementById('hidePassBtn').style.display = 'none';

      // Update header with next player's name
      const nextPlayerName = session.assignments[session.currentPlayerIndex].name;
      document.getElementById('currentPlayerNameDisplay').textContent = nextPlayerName;

      // For continuing teams, skip name entry - names are already assigned
      if (isContinuingTeam) {
        // Just re-render cards for next player to tap
        Game.cardReveal.renderRevealCards();
      } else {
        // Show name entry popup for next player (first time playing)
        Game.cardReveal.showNameEntryPopup();
        // Re-render cards to show assigned cards with names and blank cards
        Game.cardReveal.renderRevealCards();
      }
    }
  },

  // ===== GAME SCREEN =====
  gameScreen: {
    showTurnOrderScreen() {
      const session = App.state.currentSession;

      // Randomly select starting player (0 to playerCount-1)
      session.startingPlayerIndex = Math.floor(Math.random() * session.playerCount);
      session.currentTurnIndex = 0;

      console.log(`Random starting player: Position ${session.startingPlayerIndex + 1} (${session.players[session.startingPlayerIndex].name})`);

      // Update announcement with specific starting player
      const startingPlayer = session.players[session.startingPlayerIndex];
      document.getElementById('randomStarterAnnouncement').innerHTML = `
        <strong style="color: var(--color-primary);">Starting Player: Position ${session.startingPlayerIndex + 1} - ${startingPlayer.name}</strong>
      `;

      // Render turn order list
      const turnOrderList = document.getElementById('turnOrderList');
      turnOrderList.innerHTML = '';

      // Create turn order rotation starting from random player
      for (let i = 0; i < session.playerCount; i++) {
        const playerIndex = (session.startingPlayerIndex + i) % session.playerCount;
        const player = session.players[playerIndex];
        const isFirst = i === 0;

        const item = document.createElement('div');
        item.className = 'turn-order-item' + (isFirst ? ' first-speaker' : '');
        item.innerHTML = `
          <div class="turn-position">${i + 1}</div>
          <div class="turn-player-info">
            <div class="turn-player-name">${player.name}</div>
            <div class="turn-player-position">Position ${playerIndex + 1} (${i === 0 ? 'Starts' : 'Then'} speaks)</div>
          </div>
          ${isFirst ? '<div class="first-speaker-badge">Starts First</div>' : ''}
        `;
        turnOrderList.appendChild(item);
      }

      showScreen('turnOrderScreen');
    },

    startGamePhase() {
      const session = App.state.currentSession;
      session.gameStarted = true;

      this.updateGameDisplay();
      showScreen('gameScreen');
    },

    updateGameDisplay() {
      const session = App.state.currentSession;
      const turnOrder = Game.core.getTurnOrder();
      const currentTurnPlayer = turnOrder[session.currentTurnIndex % turnOrder.length];
      const nextTurnPlayer = turnOrder[(session.currentTurnIndex + 1) % turnOrder.length];

      // Find their position numbers in turn order (1, 2, 3...)
      const currentPlayerOriginalIndex = session.players.findIndex(p => p.playerId === currentTurnPlayer.playerId);
      const nextPlayerOriginalIndex = session.players.findIndex(p => p.playerId === nextTurnPlayer.playerId);
      
      // Calculate turn order number: how many positions from starting player in the rotation
      const currentTurnOrderNumber = ((currentPlayerOriginalIndex - session.startingPlayerIndex + session.playerCount) % session.playerCount) + 1;
      const nextTurnOrderNumber = ((nextPlayerOriginalIndex - session.startingPlayerIndex + session.playerCount) % session.playerCount) + 1;

      document.getElementById('currentSpeaker').textContent = `${currentTurnOrderNumber} - ${currentTurnPlayer.name}`;
      document.getElementById('nextSpeaker').textContent = `${nextTurnOrderNumber} - ${nextTurnPlayer.name}`;

      // Update progress dots
      const dotsContainer = document.getElementById('progressDots');
      dotsContainer.innerHTML = '';
      for (let i = 0; i < turnOrder.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === session.currentTurnIndex % turnOrder.length) {
          dot.classList.add('active');
        }
        dotsContainer.appendChild(dot);
      }

      // Update player cards
      this.updatePlayerCards();
    },

    updatePlayerCards() {
      const container = document.getElementById('gamePlayerCards');
      const session = App.state.currentSession;

      container.innerHTML = '';

      // Determine current turn player
      const turnOrder = Game.core.getTurnOrder();
      const currentTurnPlayer = turnOrder[session.currentTurnIndex % turnOrder.length];

      // Display players in turn order (starting from random starting player)
      // Rotate: if player at position 2 goes first, then it's 2, 3, 1 (wrapping around)
      for (let i = 0; i < session.playerCount; i++) {
        const turnOrderIndex = (session.startingPlayerIndex + i) % session.playerCount;
        const player = session.players[turnOrderIndex];
        const turnOrderNumber = i + 1; // Display number in turn order (1, 2, 3...)
        
        const isEliminated = session.eliminated.includes(player.playerId);
        const isCurrentTurn = !isEliminated && player.playerId === currentTurnPlayer.playerId;

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-flip-container flipped';

        const cardInner = document.createElement('div');
        cardInner.className = 'card-flip-inner';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        cardBack.innerHTML = '🎭';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        if (isCurrentTurn) {
          cardFront.classList.add('current-turn');
        }
        cardFront.style.opacity = isEliminated ? '0.5' : '1';
        cardFront.innerHTML = `
          <div class="player-number">${turnOrderNumber}</div>
          <div class="player-name" style="font-weight: 600; font-size: 16px;">${player.name}</div>
          ${isEliminated ? `<div class="role-badge role-${player.role}" style="margin-top: 8px; font-size: 12px;">${getRoleDisplay(player.role)}</div>` : ''}
        `;

        cardInner.appendChild(cardBack);
        cardInner.appendChild(cardFront);
        cardContainer.appendChild(cardInner);
        container.appendChild(cardContainer);
      }
    },

    nextTurn() {
      const session = App.state.currentSession;
      session.currentTurnIndex++;
      this.updateGameDisplay();
    }
  },

  // ===== VOTING SCREEN =====
  voting: {
    selectedPlayerToEliminate: null,

    updateVotingCards() {
      const container = document.getElementById('votingPlayerCards');
      const session = App.state.currentSession;

      container.innerHTML = '';

      // Display players in turn order (starting from random starting player)
      // Rotate: if player at position 2 goes first, then it's 2, 3, 1 (wrapping around)
      for (let i = 0; i < session.playerCount; i++) {
        const turnOrderIndex = (session.startingPlayerIndex + i) % session.playerCount;
        const player = session.players[turnOrderIndex];
        const turnOrderNumber = i + 1; // Display number in turn order (1, 2, 3...)
        
        const isEliminated = session.eliminated.includes(player.playerId);

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-flip-container flipped';
        cardContainer.style.pointerEvents = 'all';

        const cardInner = document.createElement('div');
        cardInner.className = 'card-flip-inner';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        cardBack.innerHTML = '🎭';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        if (!isEliminated) {
          cardFront.classList.add('card-selectable');
        }
        cardFront.style.opacity = isEliminated ? '0.5' : '1';
        cardFront.style.pointerEvents = isEliminated ? 'none' : 'auto';
        cardFront.innerHTML = `
          <div class="player-number">${turnOrderNumber}</div>
          <div class="player-name" style="font-weight: 600; font-size: 16px;">${player.name}</div>
          ${isEliminated ? `<div class="role-badge role-${player.role}" style="margin-top: 8px; font-size: 12px;">${getRoleDisplay(player.role)}</div>` : ''}
        `;

        if (!isEliminated) {
          cardFront.onclick = () => this.showEliminateConfirm(player, turnOrderNumber);
        }

        cardInner.appendChild(cardBack);
        cardInner.appendChild(cardFront);
        cardContainer.appendChild(cardInner);
        container.appendChild(cardContainer);
      }
    },

    showEliminateConfirm(player, turnOrderNumber) {
      this.selectedPlayerToEliminate = player;
      document.getElementById('eliminatePlayerName').textContent = `Eliminate ${turnOrderNumber} - ${player.name}?`;
      showModal('eliminateModal');
    },

    confirmEliminate() {
      if (!this.selectedPlayerToEliminate) return;

      const session = App.state.currentSession;
      const player = this.selectedPlayerToEliminate;

      session.eliminated.push(player.playerId);
      closeModal();

      // Check if Mr. White
      if (player.role === 'mrWhite') {
        showModal('mrWhiteGuessModal');
        return;
      }

      // Check win conditions
      Game.core.checkWinConditions();
    },

    submitMrWhiteGuess() {
      const guess = document.getElementById('mrWhiteGuessInput').value;
      const session = App.state.currentSession;

      const normalizedGuess = normalizeWord(guess);
      const normalizedCivilianWord = normalizeWord(session.civilianWord);

      closeModal();

      if (normalizedGuess === normalizedCivilianWord) {
        // Mr. White wins!
        Game.teams.showWinScreen('mr_white', 'Mr. White guessed the word correctly!');
      } else {
        // Continue game
        Game.core.checkWinConditions();
      }
    }
  },

  // ===== TEAMS SCREEN =====
  teams: {
    loadTeamsScreen() {
      const teamsList = document.getElementById('teamsList');
      const emptyState = document.getElementById('teamsEmptyState');

      if (App.state.teams.length === 0) {
        teamsList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';
      teamsList.innerHTML = '';

      App.state.teams.sort((a, b) => b.lastPlayed - a.lastPlayed).forEach(team => {
        const li = document.createElement('li');
        li.className = 'team-item';

        const memberNames = team.members
          .map(id => App.state.players.find(p => p.id === id)?.name)
          .filter(Boolean)
          .join(', ');

        li.innerHTML = `
          <div class="team-info">
            <div class="team-name">${team.name}</div>
            <div class="team-members">${memberNames}</div>
          </div>
        `;

        li.onclick = () => {
          // Quick start with this team
          const playerCount = team.members.length;
          document.getElementById('playerCount').value = playerCount;
          Game.setup.updatePlayerCount();

          App.state.currentSession = {
            id: generateId(),
            playerCount: playerCount,
            roles: {
              civilian: playerCount >= 5 ? playerCount - 2 : playerCount - 1,
              undercover: 1,
              mrWhite: playerCount >= 5 ? 1 : 0
            },
            players: [],
            currentPlayerIndex: 0,
            gameStarted: false,
            eliminated: [],
            startingPlayerIndex: null,
            cardsRevealed: [],
            cardsAssigned: [],
            namesAssigned: [],
            currentRevealedCard: null,
            previousTeamMembers: team.members
          };

          Game.core.assignRolesAndWords();

          // Start card assignment phase
          document.getElementById('currentPlayerNumber').textContent = '1';
          document.getElementById('totalPlayers').textContent = playerCount;
          document.getElementById('hidePassBtn').style.display = 'none';

          // Show card reveal screen and render cards first
          showScreen('cardRevealScreen');
          Game.cardReveal.renderRevealCards();

          // Show name entry popup for first player
          Game.cardReveal.showNameEntryPopup();
        };

        teamsList.appendChild(li);
      });
    },

    playNextRound() {
      const previousSession = App.state.currentSession;

      // Quick start with same team
      const playerCount = previousSession.playerCount;
      document.getElementById('playerCount').value = playerCount;
      Game.setup.updatePlayerCount();

      // Start new session with same players
      App.state.currentSession = {
        id: generateId(),
        playerCount: playerCount,
        roles: previousSession.roles,
        players: [],
        currentPlayerIndex: 0,
        gameStarted: false,
        eliminated: [],
        startingPlayerIndex: null,
        cardsRevealed: [],
        cardsAssigned: [],
        namesAssigned: [],
        currentRevealedCard: null,
        previousPlayers: previousSession.players,
        continuingTeam: true
      };

      // Assign new roles and words for fresh game
      Game.core.assignRolesAndWords();

      // Pre-fill player names from previous session
      for (let i = 0; i < playerCount; i++) {
        const prevPlayer = previousSession.players[i];
        const assignment = App.state.currentSession.assignments[i];

        // Copy player info from previous session
        assignment.playerId = prevPlayer.playerId;
        assignment.name = prevPlayer.name;

        // Mark all cards as having names assigned (but not revealed yet)
        App.state.currentSession.namesAssigned.push(i);
      }

      // Set current player to first player for card reveal sequence
      App.state.currentSession.currentPlayerIndex = 0;
      document.getElementById('currentPlayerNumber').textContent = '1';
      document.getElementById('totalPlayers').textContent = playerCount;
      document.getElementById('hidePassBtn').style.display = 'none';

      // Update the header to show first player's name
      document.getElementById('currentPlayerNameDisplay').textContent = previousSession.players[0].name;

      // Go directly to card reveal screen with names already visible
      Game.cardReveal.renderRevealCards();
      showScreen('cardRevealScreen');
    },

    showWinScreen(winner, message) {
      const titles = {
        civilian: '👥 Civilians Win!',
        undercover: '🕵️ Undercover Wins!',
        mr_white: '❓ Mr. White Wins!'
      };

      document.getElementById('winnerTitle').textContent = titles[winner];
      document.getElementById('winnerMessage').textContent = message;

      // Show all roles
      const finalRolesContainer = document.getElementById('finalRoles');
      finalRolesContainer.innerHTML = '';

      const session = App.state.currentSession;

      App.state.currentSession.players.forEach((player, index) => {
        const roleDiv = document.createElement('div');
        roleDiv.style.cssText = 'padding: 12px; margin-bottom: 8px; background: var(--color-secondary); border-radius: var(--radius-base); display: flex; justify-content: space-between; align-items: center;';
        roleDiv.innerHTML = `
          <span style="font-weight: 600;">${index + 1} - ${player.name}</span>
          <span class="role-badge role-${player.role}">${getRoleDisplay(player.role)}</span>
        `;
        finalRolesContainer.appendChild(roleDiv);
      });

      // Track role history and statistics before storing team
      for (const playerData of session.players) {
        const player = App.state.players.find(p => p.id === playerData.playerId);
        if (player) {
          // Update role history (keep last 10)
          if (!player.roleHistory) player.roleHistory = [];
          player.roleHistory.unshift(playerData.role); // Add to front (most recent)
          player.roleHistory = player.roleHistory.slice(0, 10); // Keep last 10

          // Update games played
          if (!player.gamesPlayed) player.gamesPlayed = 0;
          player.gamesPlayed++;

          // Update wins
          if (!player.wins) player.wins = { civilian: 0, undercover: 0, mrWhite: 0 };
          
          // Determine if this player won
          let playerWon = false;
          if (winner === 'civilian' && playerData.role === 'civilian') {
            playerWon = true;
            player.wins.civilian++;
          } else if (winner === 'undercover' && playerData.role === 'undercover') {
            playerWon = true;
            player.wins.undercover++;
          } else if (winner === 'mr_white' && playerData.role === 'mrWhite') {
            playerWon = true;
            player.wins.mrWhite++;
          }
        }
      }

      // Store team (this also tracks team-level statistics) and get the team reference
      const team = Game.core.storeTeam();

      if (team) {
        if (!team.gameHistory) team.gameHistory = [];
        team.gameHistory.push({
          sessionId: session.id,
          timestamp: Date.now(),
          winner: winner,
          civilianWord: session.civilianWord,
          undercoverWord: session.undercoverWord,
          players: session.players.map(p => ({
            playerId: p.playerId,
            role: p.role,
            won: (winner === 'civilian' && p.role === 'civilian') ||
                 (winner === 'undercover' && p.role === 'undercover') ||
                 (winner === 'mr_white' && p.role === 'mrWhite')
          }))
        });
        team.gameHistory = team.gameHistory.slice(-10); // Keep last 10 games
      }

      showScreen('winScreen');
    }
  },

  // ===== CORE GAME LOGIC =====
  core: {
    // Calculate role weights for weighted assignment
    calculateRoleWeights(playerIds, targetRole) {
      // targetRole: 'undercover' or 'mrWhite' (special roles)
      const weights = [];
      const session = App.state.currentSession;
      
      for (const playerId of playerIds) {
        const player = App.state.players.find(p => p.id === playerId);
        if (!player) {
          weights.push(1.0); // Default weight for new player
          continue;
        }

        // Ensure roleHistory exists (backward compatibility)
        if (!player.roleHistory) player.roleHistory = [];

        // Calculate weight based on recent role history
        // Exponential decay: last game = 50%, 2 games ago = 25%, 3 games ago = 12.5%
        let weight = 1.0;
        for (let i = 0; i < player.roleHistory.length; i++) {
          const pastRole = player.roleHistory[i];
          if (pastRole === targetRole) {
            // Reduce weight: 50% for most recent, 25% for second most recent, etc.
            weight *= Math.pow(0.5, i + 1);
          }
        }
        
        weights.push(Math.max(0.1, weight)); // Minimum weight of 0.1 to ensure some chance
      }
      
      return weights;
    },

    // Weighted random selection from array
    weightedRandomSelect(items, weights) {
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;
      
      for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          return i;
        }
      }
      
      return items.length - 1; // Fallback
    },

    // Get seen word pairs for current team/players
    getSeenWordPairs() {
      const session = App.state.currentSession;
      const seenPairs = new Set();
      
      // Get all player IDs - check multiple sources in order of availability
      let currentPlayerIds = [];
      
      if (session.players && session.players.length > 0) {
        // Players already assigned in current session
        currentPlayerIds = session.players.map(p => p.playerId);
      } else if (session.previousPlayers && session.previousPlayers.length > 0) {
        // Continuing team: use previous player IDs
        currentPlayerIds = session.previousPlayers.map(p => p.playerId);
      } else if (session.previousTeamMembers && session.previousTeamMembers.length > 0) {
        // Quick start: use team member IDs
        currentPlayerIds = session.previousTeamMembers;
      }

      if (currentPlayerIds.length === 0) {
        return seenPairs; // No player context yet
      }

      // Find teams that share players with current session
      const relevantTeams = App.state.teams.filter(team => {
        if (!team.members || team.members.length === 0) return false;
        const sharedCount = team.members.filter(id => currentPlayerIds.includes(id)).length;
        return sharedCount > 0;
      });

      // Collect seen word pairs from relevant teams
      for (const team of relevantTeams) {
        // New format: seenWordPairs array
        if (team.seenWordPairs && Array.isArray(team.seenWordPairs)) {
          team.seenWordPairs.forEach(pair => seenPairs.add(pair));
        }
        
        // Extract pairs from game history (more reliable)
        if (team.gameHistory && Array.isArray(team.gameHistory)) {
          team.gameHistory.forEach(game => {
            if (game.civilianWord && game.undercoverWord) {
              const pair1 = `${game.civilianWord}|${game.undercoverWord}`;
              const pair2 = `${game.undercoverWord}|${game.civilianWord}`;
              seenPairs.add(pair1);
              seenPairs.add(pair2); // Add both orders
            }
          });
        }
      }

      return seenPairs;
    },

    selectWordPair() {
      const difficulty = App.state.settings.difficulty;
      const pairs = App.wordPairs[difficulty];
      const seenPairs = this.getSeenWordPairs();

      // Build weights: 90% reduction for seen words, 100% for new words
      const weights = pairs.map(pair => {
        // Normalize pair (both orders count as same)
        const pair1 = `${pair.a}|${pair.b}`;
        const pair2 = `${pair.b}|${pair.a}`;
        const isSeen = seenPairs.has(pair1) || seenPairs.has(pair2);
        return isSeen ? 0.1 : 1.0; // 10% weight for seen, 100% for new
      });

      // Check if all words are exhausted (all weights are 0.1)
      const allSeen = weights.every(w => w === 0.1);
      if (allSeen) {
        // Reset weights to allow all words if everything is seen
        weights.fill(1.0);
      }

      // Weighted random selection
      const selectedIndex = this.weightedRandomSelect(pairs, weights);
      return pairs[selectedIndex];
    },

    assignRolesAndWords() {
      const session = App.state.currentSession;
      const { civilian, undercover, mrWhite } = session.roles;

      // Get player IDs if available (for continuing teams or quick start)
      let playerIdsByPosition = [];
      if (session.previousPlayers && session.previousPlayers.length === session.playerCount) {
        // Continuing team: map previous players to positions
        playerIdsByPosition = session.previousPlayers.map(p => p.playerId);
      } else if (session.previousTeamMembers && session.previousTeamMembers.length === session.playerCount) {
        // Quick start: use team member IDs in order
        playerIdsByPosition = [...session.previousTeamMembers];
      }

      // Create role arrays
      const roles = [];
      
      // If we have player IDs, use weighted assignment
      if (playerIdsByPosition.length === session.playerCount) {
        // Calculate weights for undercover role
        const undercoverWeights = this.calculateRoleWeights(playerIdsByPosition, 'undercover');
        const mrWhiteWeights = mrWhite > 0 ? this.calculateRoleWeights(playerIdsByPosition, 'mrWhite') : null;

        // Create positions array [0, 1, 2, ..., playerCount-1]
        const positions = Array.from({ length: session.playerCount }, (_, i) => i);
        const undercoverPositions = [];
        const mrWhitePositions = [];

        // Assign undercover roles with weights
        const undercoverCandidates = [...positions];
        const undercoverCandidateWeights = [...undercoverWeights];
        
        for (let i = 0; i < undercover; i++) {
          if (undercoverCandidates.length > 0) {
            const selectedIndex = this.weightedRandomSelect(undercoverCandidates, undercoverCandidateWeights);
            undercoverPositions.push(undercoverCandidates[selectedIndex]);
            undercoverCandidates.splice(selectedIndex, 1);
            undercoverCandidateWeights.splice(selectedIndex, 1);
          }
        }

        // Assign mrWhite roles with weights (from remaining positions)
        if (mrWhite > 0 && mrWhiteWeights) {
          const mrWhiteCandidates = positions.filter(pos => !undercoverPositions.includes(pos));
          const mrWhiteCandidateWeights = positions
            .filter(pos => !undercoverPositions.includes(pos))
            .map(pos => {
              const playerId = playerIdsByPosition[pos];
              const playerIdx = playerIdsByPosition.indexOf(playerId);
              return mrWhiteWeights[playerIdx];
            });
          
          for (let i = 0; i < mrWhite; i++) {
            if (mrWhiteCandidates.length > 0) {
              const selectedIndex = this.weightedRandomSelect(mrWhiteCandidates, mrWhiteCandidateWeights);
              mrWhitePositions.push(mrWhiteCandidates[selectedIndex]);
              mrWhiteCandidates.splice(selectedIndex, 1);
              mrWhiteCandidateWeights.splice(selectedIndex, 1);
            }
          }
        }

        // Build roles array
        for (let i = 0; i < session.playerCount; i++) {
          if (undercoverPositions.includes(i)) {
            roles.push('undercover');
          } else if (mrWhitePositions.includes(i)) {
            roles.push('mrWhite');
          } else {
            roles.push('civilian');
          }
        }
      } else {
        // No player IDs available yet: use pure random (will be tracked later when players are assigned)
        const roleArray = [];
        for (let i = 0; i < civilian; i++) roleArray.push('civilian');
        for (let i = 0; i < undercover; i++) roleArray.push('undercover');
        for (let i = 0; i < mrWhite; i++) roleArray.push('mrWhite');

        // Shuffle roles
        for (let i = roleArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [roleArray[i], roleArray[j]] = [roleArray[j], roleArray[i]];
        }
        // Assign roles in order
        for (let i = 0; i < session.playerCount; i++) {
          roles.push(roleArray[i]);
        }
      }

      // Select word pair
      const wordPair = this.selectWordPair();
      const randomize = Math.random() > 0.5;
      const civilianWord = randomize ? wordPair.a : wordPair.b;
      const undercoverWord = randomize ? wordPair.b : wordPair.a;

      session.civilianWord = civilianWord;
      session.undercoverWord = undercoverWord;

      // Create assignments
      session.assignments = roles.map((role) => ({
        role,
        word: role === 'civilian' ? civilianWord : role === 'undercover' ? undercoverWord : null,
        playerId: null,
        name: null
      }));
    },

    getTurnOrder() {
      const session = App.state.currentSession;
  const order = [];
  // Turn order: start from random player, wrap around in original entry order
  for (let i = 0; i < session.playerCount; i++) {
    const index = (session.startingPlayerIndex + i) % session.playerCount;
    const player = session.players[index];
    if (!session.eliminated.includes(player.playerId)) {
      order.push(player);
    }
  }
  return order;
    },

    checkWinConditions() {
      const session = App.state.currentSession;
  const activePlayers = session.players.filter(p => !session.eliminated.includes(p.playerId));

  const activeCivilians = activePlayers.filter(p => p.role === 'civilian').length;
  const activeUndercover = activePlayers.filter(p => p.role === 'undercover').length;
  const activeMrWhite = activePlayers.filter(p => p.role === 'mrWhite').length;

  // Check civilian win
  if (activeUndercover === 0 && activeMrWhite === 0) {
        Game.teams.showWinScreen('civilian', 'All threats eliminated!');
    return;
  }

  // Check undercover win
  if (activeUndercover >= activeCivilians && activeUndercover > 0) {
        Game.teams.showWinScreen('undercover', 'Undercover agents outnumber civilians!');
    return;
  }

  // Game continues
      Game.voting.updateVotingCards();
    },

    // Find similar team (fuzzy matching: 80%+ member overlap)
    findSimilarTeam(playerIds) {
      const sortedIds = [...playerIds].sort();
      
      for (const team of App.state.teams) {
        if (!team.members || team.members.length === 0) continue;
        
        const sortedTeamMembers = [...team.members].sort();
        
        // Calculate overlap
        const intersection = sortedIds.filter(id => sortedTeamMembers.includes(id));
        const union = [...new Set([...sortedIds, ...sortedTeamMembers])];
        const overlapRatio = intersection.length / union.length;
        
        // If 80%+ overlap, consider it the same team
        if (overlapRatio >= 0.8) {
          return team;
        }
      }
      
      return null;
    },

    // Generate smart team name from player names
    generateTeamName(playerIds) {
      const players = playerIds
        .map(id => App.state.players.find(p => p.id === id))
        .filter(p => p !== undefined)
        .map(p => p.name);

      if (players.length === 0) {
        return `Team ${App.state.teams.length + 1}`;
      }

      if (players.length <= 3) {
        return players.join(', ');
      }

      // Use first 2-3 names + "& Friends" for larger teams
      const firstNames = players.slice(0, 3);
      if (players.length === 4) {
        return `${firstNames.slice(0, 2).join(', ')} & ${players[2]}, ${players[3]}`;
      }
      return `${firstNames.slice(0, 2).join(', ')} & Friends`;
    },

    storeTeam() {
      const session = App.state.currentSession;
      const playerIds = session.players.map(p => p.playerId);
      const sortedPlayerIds = [...playerIds].sort();

      // Check for exact match first
      let team = App.state.teams.find(t => {
        if (!t.members) return false;
        const sortedMembers = [...t.members].sort();
        return sortedMembers.length === sortedPlayerIds.length &&
          sortedMembers.every((id, idx) => id === sortedPlayerIds[idx]);
      });

      // If no exact match, try fuzzy matching
      if (!team) {
        team = this.findSimilarTeam(playerIds);
      }

      // Create new team or update existing
      if (!team) {
        team = {
          id: generateId(),
          name: this.generateTeamName(playerIds),
          members: playerIds,
          seenWordPairs: [], // New: store word pairs
          seenWords: [], // Keep for backward compatibility
          lastPlayed: Date.now(),
          roleHistory: [], // Track role assignments per session
          gameHistory: [], // Track game results (last 10)
          playerRoleStats: {} // Per-player role statistics
        };
        App.state.teams.push(team);
      } else {
        team.lastPlayed = Date.now();
        
        // Ensure new fields exist (backward compatibility)
        if (!team.seenWordPairs) team.seenWordPairs = [];
        if (!team.roleHistory) team.roleHistory = [];
        if (!team.gameHistory) team.gameHistory = [];
        if (!team.playerRoleStats) team.playerRoleStats = {};
      }

      // Update team members if they've changed (fuzzy match case)
      if (team.members.length !== playerIds.length || 
          !team.members.every(id => playerIds.includes(id))) {
        team.members = playerIds;
        // Regenerate name if members changed significantly
        team.name = this.generateTeamName(playerIds);
      }

      // Track word pairs
      if (session.civilianWord && session.undercoverWord) {
        const wordPair = `${session.civilianWord}|${session.undercoverWord}`;
        if (!team.seenWordPairs.includes(wordPair)) {
          team.seenWordPairs.push(wordPair);
          team.seenWordPairs = team.seenWordPairs.slice(-20); // Keep last 20 pairs
        }
      }

      // Backward compatibility: also update seenWords (individual words)
      if (session.civilianWord) {
        if (!team.seenWords.includes(session.civilianWord)) {
          team.seenWords.push(session.civilianWord);
        }
      }
      if (session.undercoverWord) {
        if (!team.seenWords.includes(session.undercoverWord)) {
          team.seenWords.push(session.undercoverWord);
        }
      }
      team.seenWords = [...new Set(team.seenWords)].slice(-40); // Keep last 40 individual words

      // Track role assignments for this session
      const sessionRoleHistory = session.players.map(p => ({
        playerId: p.playerId,
        role: p.role,
        position: session.players.indexOf(p)
      }));
      
      team.roleHistory.push({
        sessionId: session.id,
        timestamp: Date.now(),
        assignments: sessionRoleHistory
      });
      team.roleHistory = team.roleHistory.slice(-10); // Keep last 10 sessions

      // Update player role stats
      for (const player of session.players) {
        if (!team.playerRoleStats[player.playerId]) {
          team.playerRoleStats[player.playerId] = {
            civilian: 0,
            undercover: 0,
            mrWhite: 0,
            total: 0
          };
        }
        team.playerRoleStats[player.playerId][player.role]++;
        team.playerRoleStats[player.playerId].total++;
      }

      // Track team membership for players
      for (const playerId of playerIds) {
        const player = App.state.players.find(p => p.id === playerId);
        if (player) {
          if (!player.teamsPlayed) player.teamsPlayed = [];
          if (!player.teamsPlayed.includes(team.id)) {
            player.teamsPlayed.push(team.id);
          }
        }
      }

      // Save to localStorage
      App.storage.save();

      // Return the team for use by caller
      return team;
    }
  }
};

// Global helpers for HTML onclick handlers
function updatePlayerCount() { Game.setup.updatePlayerCount(); }
function adjustRole(role, delta) { Game.setup.adjustRole(role, delta); }
function startGame() { Game.setup.startGame(); }
function quickStart() { Game.setup.quickStart(); }
function updateSettings() { Game.setup.updateSettings(); }
function checkModalNameSuggestion() { Game.cardReveal.checkModalNameSuggestion(); }
function confirmNameAndShowCards() { Game.cardReveal.confirmNameAndShowCards(); }
function hideAndPass() { Game.cardReveal.hideAndPass(); }
function startGamePhase() { Game.gameScreen.startGamePhase(); }
function nextTurn() { Game.gameScreen.nextTurn(); }
function confirmEliminate() { Game.voting.confirmEliminate(); }
function submitMrWhiteGuess() { Game.voting.submitMrWhiteGuess(); }
function playNextRound() { Game.teams.playNextRound(); }

  // Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  // Update voting cards when showing voting screen
  const votingScreen = document.getElementById('votingScreen');
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.id === 'votingScreen' && mutation.target.classList.contains('active')) {
        Game.voting.updateVotingCards();
      }
    });
  });
  observer.observe(votingScreen, { attributes: true, attributeFilter: ['class'] });

  // Load teams screen
  const teamsScreen = document.getElementById('teamsScreen');
  const teamsObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.id === 'teamsScreen' && mutation.target.classList.contains('active')) {
        Game.teams.loadTeamsScreen();
      }
    });
  });
  teamsObserver.observe(teamsScreen, { attributes: true, attributeFilter: ['class'] });

  // Update team selection button visibility on setup screen
  const setupScreen = document.getElementById('setupScreen');
  const setupObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.id === 'setupScreen' && mutation.target.classList.contains('active')) {
        const selectTeamBtn = document.getElementById('selectTeamBtn');
        if (selectTeamBtn) {
          selectTeamBtn.style.display = App.state.teams.length > 0 ? 'block' : 'none';
        }
      }
    });
  });
  setupObserver.observe(setupScreen, { attributes: true, attributeFilter: ['class'] });
});