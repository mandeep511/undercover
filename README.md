# 🎭 Undercover - Social Deduction Word Game

A web-based social deduction word game similar to Undercover/Mafia, where players must figure out who has different words.

## 🚀 Hosting on GitHub Pages

### Method 1: Using GitHub Actions (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/undercover-game.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Scroll down to **Pages** in the left sidebar
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and `/ (root)` folder
   - Click **Save**

3. **Your site will be live at:**
   ```
   https://YOUR_USERNAME.github.io/undercover-game/
   ```

### Method 2: Using GitHub Actions (Alternative)

If you want more control, you can set up GitHub Actions:

1. Create a `.github/workflows/pages.yml` file with:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Pages
           uses: actions/configure-pages@v2
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v1
           with:
             path: '.'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v1
   ```

2. Enable GitHub Pages in Settings → Pages → Source: **GitHub Actions**

## 📝 Notes

- GitHub Pages serves static files directly, which is perfect for this HTML/CSS/JS game
- Your site will be available at `https://YOUR_USERNAME.github.io/undercover-game/` (replace `YOUR_USERNAME` with your GitHub username)
- Changes pushed to the `main` branch will automatically update your site
- It may take a few minutes for changes to go live after pushing

## 🎮 How to Play

1. Gather 3-20 players
2. Set up roles (Civilians, Undercover, Mr. White)
3. Players receive secret words and must figure out who has different words
4. Vote to eliminate players each round
5. Civilians win by eliminating Undercover players, Undercover wins by outnumbering Civilians

## 📄 License

Feel free to use and modify this project!

