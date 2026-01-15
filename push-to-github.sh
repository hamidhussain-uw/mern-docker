#!/bin/bash

# Script to help push the MERN Docker project to GitHub

echo "🚀 MERN Docker - GitHub Push Helper"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
    echo ""
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Staging all changes..."
    git add .
    echo "✅ Changes staged"
    echo ""
    
    echo "💾 Committing changes..."
    git commit -m "Add MERN stack with MySQL, Docker, and CI/CD"
    echo "✅ Changes committed"
    echo ""
else
    echo "ℹ️  No changes to commit"
    echo ""
fi

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    REMOTE_URL=$(git remote get-url origin)
    echo "🔗 Remote repository: $REMOTE_URL"
    echo ""
    read -p "Do you want to use this remote? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter new GitHub repository URL: " NEW_REMOTE
        git remote set-url origin "$NEW_REMOTE"
        echo "✅ Remote updated"
    fi
else
    echo "❌ No remote repository configured"
    echo ""
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REMOTE_URL
    git remote add origin "$REMOTE_URL"
    echo "✅ Remote added"
    echo ""
fi

# Set main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "🌿 Setting branch to 'main'..."
    git branch -M main
    echo "✅ Branch set to main"
    echo ""
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
echo ""
read -p "Ready to push? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -u origin main
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "🎉 Your CI/CD pipeline will now run automatically!"
        echo "   Check the 'Actions' tab in your GitHub repository to see the workflow."
    else
        echo ""
        echo "❌ Push failed. Please check your credentials and try again."
        echo "   You may need to set up authentication:"
        echo "   - Personal Access Token: https://github.com/settings/tokens"
        echo "   - Or use SSH: git remote set-url origin git@github.com:username/repo.git"
    fi
else
    echo "⏭️  Push cancelled"
fi
