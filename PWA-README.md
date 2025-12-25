# Configuration PWA - Devis Ongles

## Fichiers créés pour la PWA

1. **manifest.json** - Manifeste de l'application PWA
2. **service-worker.js** - Service Worker pour le mode hors ligne
3. **create-simple-icons.html** - Générateur d'icônes simple

## Étapes pour finaliser la PWA

### 1. Générer les icônes

**Option A - Icônes simples (rapide)**
1. Ouvrez le fichier `create-simple-icons.html` dans votre navigateur
2. Cliquez sur "Télécharger icon-192.png"
3. Cliquez sur "Télécharger icon-512.png"
4. Placez les deux fichiers téléchargés à la racine du projet

**Option B - Icônes avec votre logo (recommandé)**
1. Allez sur https://realfavicongenerator.net/
2. Uploadez une image de votre logo (format carré recommandé)
3. Configurez les options selon vos préférences
4. Téléchargez le package
5. Extrayez `icon-192.png` et `icon-512.png` à la racine du projet

### 2. Tester la PWA

1. **Serveur HTTPS requis** - Les PWA nécessitent HTTPS (sauf sur localhost)
   
   Pour tester en local :
   ```bash
   # Avec Python
   python -m http.server 8000
   ```
   
   Puis ouvrez : http://localhost:8000

2. **Vérifier l'installation**
   - Ouvrez Chrome DevTools (F12)
   - Allez dans l'onglet "Application"
   - Vérifiez "Manifest" et "Service Workers"

3. **Installer l'application**
   - Sur mobile : Le navigateur proposera "Ajouter à l'écran d'accueil"
   - Sur desktop : Icône d'installation dans la barre d'adresse

### 3. Déploiement

Pour que la PWA fonctionne en production, vous devez :
- Héberger sur un serveur HTTPS (GitHub Pages, Netlify, Vercel, etc.)
- Les icônes doivent être accessibles à la racine du site

## Fonctionnalités PWA activées

✅ Installation sur l'écran d'accueil
✅ Mode hors ligne (cache des fichiers)
✅ Icônes personnalisées
✅ Thème couleur (rose #ff1493)
✅ Mode standalone (sans barre d'adresse)

## Mise à jour du cache

Si vous modifiez les fichiers, pensez à :
1. Changer le nom du cache dans `service-worker.js` (ligne 1)
   ```javascript
   const CACHE_NAME = 'devis-ongles-v2'; // Incrémenter le numéro
   ```
2. Les utilisateurs recevront automatiquement la mise à jour

## Support navigateurs

- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox
- ✅ Samsung Internet

