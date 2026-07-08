# Deploy this site to GitHub Pages

This repository is a static site. The included GitHub Actions workflow will publish the repository root to the `gh-pages` branch on push to the `main` branch.

Quick steps to deploy:

1. Create a new repository on GitHub (for example `your-username/your-repo`).
2. In your local repo directory run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

3. After the push the GitHub Actions workflow will run and create/update the `gh-pages` branch. GitHub Pages will serve the site from that branch.

If you want the site to appear at `https://<your-username>.github.io/<your-repo>/`, ensure Pages is set to use the `gh-pages` branch in the repository settings (this is usually automatic).

If you prefer a custom domain, add a `CNAME` file to the repository root containing your domain.
