# 🧪 Guide de Test - Nouvelles Fonctionnalités

## 🚀 Démarrage Rapide

### 1. Lancer le Serveur
Le serveur est déjà lancé sur : **http://localhost:5174/**

### 2. Ouvrir le Jeu
Ouvrez votre navigateur et allez sur : http://localhost:5174/

---

## ✅ Checklist de Test

### 🌑 Test 1 : Fondu Noir au Démarrage
- [ ] Entrez un pseudo (ex: "Joueur1")
- [ ] Entrez un nom de salle (ex: "Test")
- [ ] Cliquez sur "Rejoindre"
- [ ] Dans le lobby, cliquez sur "Commencer"
- [ ] **Vérifiez** : Un écran noir apparaît et disparaît progressivement (2 secondes)

### 🚫 Test 2 : Pas de Déplacement
- [ ] Une fois dans la salle, essayez d'appuyer sur les flèches du clavier
- [ ] **Vérifiez** : Rien ne se passe, pas de personnage visible qui se déplace

### 🏷️ Test 3 : Panneaux Interactifs
- [ ] Cliquez sur le panneau "Salle" (en haut à gauche)
- [ ] **Vérifiez** : Une popup affiche "Cette salle porte le numéro 12."
- [ ] Fermez la popup
- [ ] Cliquez sur l'horloge (en haut à droite)
- [ ] **Vérifiez** : Une popup affiche "L'horloge indique 04:55."

### 📻 Test 4 : Talkie-Walkie
- [ ] Cliquez sur le talkie-walkie (en bas à gauche)
- [ ] **Vérifiez** : Un dialogue apparaît avec les consignes
- [ ] **Vérifiez** : Le message mentionne "code à 6 chiffres" et "cherche des indices"
- [ ] Fermez le dialogue

### 🔒 Test 5 : Boîte Verrouillée
- [ ] Cliquez sur la boîte (en bas à droite)
- [ ] **Vérifiez** : Un pavé numérique apparaît
- [ ] Entrez un mauvais code (ex: 123456)
- [ ] Cliquez sur ✓
- [ ] **Vérifiez** : Message d'erreur "✗ Code incorrect !"
- [ ] Cliquez sur "C" pour effacer
- [ ] Entrez le bon code : **120455**
- [ ] Cliquez sur ✓
- [ ] **Vérifiez** : Message "✓ Code correct !"
- [ ] **Vérifiez** : La serrure devient verte 🟢
- [ ] **Vérifiez** : Le label change en "🔓 Boîte déverrouillée"

### 📦 Test 6 : Ramasser des Objets
- [ ] Cliquez sur la boîte déverrouillée
- [ ] **Vérifiez** : 3 objets sont visibles : Carte 🗺️, Badge 🔖, Post-it 📝
- [ ] Cliquez sur la Carte
- [ ] **Vérifiez** : La carte apparaît dans l'inventaire en bas
- [ ] **Vérifiez** : La carte disparaît de la boîte (remplacée par "Vide")
- [ ] Cliquez sur le Badge
- [ ] **Vérifiez** : Le badge apparaît dans l'inventaire
- [ ] Cliquez sur le Post-it
- [ ] **Vérifiez** : Le post-it apparaît dans l'inventaire

### 🔄 Test 7 : Reposer des Objets
- [ ] Cliquez sur la Carte dans l'inventaire
- [ ] **Vérifiez** : La carte disparaît de l'inventaire
- [ ] Ouvrez la boîte à nouveau
- [ ] **Vérifiez** : La carte est de retour dans la boîte
- [ ] Fermez la boîte

### 👥 Test 8 : Multiplayer (2 Navigateurs)
- [ ] Ouvrez un deuxième onglet/navigateur sur http://localhost:5174/
- [ ] Connectez-vous avec un autre pseudo (ex: "Joueur2")
- [ ] Rejoignez la **même salle** (ex: "Test")
- [ ] Dans le premier navigateur, déverrouillez la boîte avec le code 120455
- [ ] **Vérifiez** : Dans le deuxième navigateur, la boîte est aussi déverrouillée
- [ ] Dans le premier navigateur, prenez la Carte
- [ ] **Vérifiez** : Dans le deuxième navigateur, la Carte a disparu de la boîte
- [ ] Dans le premier navigateur, reposez la Carte
- [ ] **Vérifiez** : Dans le deuxième navigateur, la Carte réapparaît dans la boîte

### 🚪 Test 9 : Navigation entre Salles
- [ ] Cliquez sur la porte Nord (en haut)
- [ ] **Vérifiez** : Vous arrivez dans le couloir
- [ ] Cliquez sur la porte de retour
- [ ] **Vérifiez** : Vous revenez dans la salle d'hôpital
- [ ] Cliquez sur la porte Est (à droite)
- [ ] **Vérifiez** : Vous arrivez dans la salle informatique
- [ ] Cliquez sur la porte de retour
- [ ] **Vérifiez** : Vous revenez dans la salle d'hôpital

---

## 🐛 Problèmes Connus

### Si le fondu noir ne fonctionne pas :
- Vérifiez la console du navigateur (F12)
- Rechargez la page (Ctrl+R)

### Si les objets ne se synchronisent pas :
- Vérifiez que les deux joueurs sont dans la même salle
- Vérifiez la console pour les messages Photon
- Rechargez les deux navigateurs

### Si le pavé numérique ne répond pas :
- Cliquez bien sur les boutons (pas le clavier)
- Vérifiez que vous êtes dans la bonne scène

---

## 📊 Résultats Attendus

### ✅ Tous les tests passent :
- Le jeu est prêt pour la production !
- Vous pouvez commencer à ajouter plus de contenu

### ⚠️ Certains tests échouent :
- Notez les tests qui échouent
- Vérifiez la console du navigateur (F12)
- Consultez les logs dans le terminal

---

## 🎮 Scénario de Jeu Complet

### Étape par Étape :
1. **Démarrage** : Fondu noir → Salle d'hôpital
2. **Exploration** : Cliquez sur le talkie pour lire les consignes
3. **Indices** : Cliquez sur le panneau "Salle 12" et l'horloge "04:55"
4. **Déduction** : Combinez les indices → Code = 120455
5. **Déverrouillage** : Entrez le code dans la boîte
6. **Collection** : Ramassez les 3 objets
7. **Gestion** : Reposez un objet si besoin
8. **Navigation** : Explorez les autres salles

---

## 🔧 Commandes de Débogage

### Console du Navigateur (F12) :
```javascript
// Voir l'état de la boîte
console.log("Boîte déverrouillée :", this.boxUnlocked);

// Voir les objets disponibles
console.log("Objets dans la boîte :", this.boxItems);

// Forcer le déverrouillage (pour tester)
this.boxUnlocked = true;
this.updateBoxAppearance();
```

---

## 📝 Notes de Test

### Performance :
- Le jeu devrait tourner à 60 FPS
- Pas de lag lors des transitions
- Les animations sont fluides

### Compatibilité :
- Testé sur Chrome, Firefox, Edge
- Fonctionne sur desktop et mobile
- Nécessite une connexion internet (Photon)

---

**Bon test ! 🧪**