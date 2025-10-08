# 🎮 Test Rapide - Escape Game Vue de Dessus

## ✅ Le serveur est lancé !

Le serveur de développement tourne sur : **http://localhost:5173/**

---

## 🚀 Comment tester

### 1. Ouvrir le jeu
```
Ouvrez votre navigateur et allez sur :
http://localhost:5173/
```

### 2. Se connecter
1. **Pseudo** : Entrez votre nom (ex: "Joueur1")
2. **Salle** : Entrez un nom de salle (ex: "test")
3. Cliquez sur **"Rejoindre"**

### 3. Lancer la partie
1. Vous verrez la liste des joueurs connectés
2. Cliquez sur **"Commencer"**
3. Le jeu se lance ! 🎉

---

## 🎮 Contrôles du jeu

### Déplacement
- **↑** : Haut
- **↓** : Bas
- **←** : Gauche
- **→** : Droite

### Interactions
- **Clic sur 📻 (talkie-walkie)** : Affiche le dialogue
- **Clic sur 📦 (boîte)** : Ouvre l'inventaire
- **Clic sur objets dans la boîte** : Collecte dans l'inventaire
- **Clic sur 🚪 (portes)** : Change de salle

---

## 🧪 Scénario de test

### Test 1 : Dialogue du talkie-walkie
1. Déplacez-vous vers le talkie-walkie (en bas à gauche)
2. Cliquez dessus
3. ✅ Un dialogue devrait s'afficher avec le texte de story.json
4. Cliquez sur "Fermer"

### Test 2 : Collecte d'objets
1. Déplacez-vous vers la boîte (en bas à droite)
2. Cliquez dessus
3. ✅ L'inventaire de la boîte s'ouvre (6 cases)
4. Cliquez sur la carte 🗺️
5. ✅ La carte apparaît dans l'inventaire en bas
6. Cliquez sur le badge 🔖
7. ✅ Le badge apparaît dans l'inventaire
8. Cliquez sur le post-it 📝
9. ✅ Le post-it apparaît dans l'inventaire
10. Cliquez sur "Fermer"

### Test 3 : Navigation entre salles
1. Déplacez-vous vers la porte Nord (en haut)
2. Cliquez dessus
3. ✅ Vous arrivez dans le couloir
4. Cliquez sur la porte "Retour Salle"
5. ✅ Vous revenez dans la salle d'hôpital

6. Déplacez-vous vers la porte Est (à droite)
7. Cliquez dessus
8. ✅ Vous arrivez dans la salle informatique
9. Cliquez sur la porte "Retour"
10. ✅ Vous revenez dans la salle d'hôpital

### Test 4 : Multijoueur
1. Ouvrez un deuxième onglet : http://localhost:5173/
2. Connectez-vous avec un autre pseudo (ex: "Joueur2")
3. Rejoignez la même salle
4. ✅ Vous devriez voir les 2 joueurs dans la liste
5. L'un des joueurs clique sur "Commencer"
6. ✅ Les deux joueurs devraient voir le jeu se lancer

---

## 🎨 Ce que vous devriez voir

### Salle d'hôpital (vue de dessus)
```
┌─────────────────────────────────────┐
│          🚪 Couloir                 │
│                                     │
│  🛏️ Lit                             │
│                                     │
│           🟥 Vous                   │
│                                     │
│  📻                    🖥️           │
│ Talkie                Table         │
│                                     │
│                        📦      🚪   │
│                       Boîte   Info  │
│                                     │
│  ┌───┬───┬───┬───┬───┐             │
│  │   │   │   │   │   │ Inventaire  │
│  └───┴───┴───┴───┴───┘             │
└─────────────────────────────────────┘
```

### Dialogue du talkie-walkie
```
┌─────────────────────────────────────┐
│      📻 Talkie-walkie               │
│                                     │
│  Tu ouvres les yeux dans une        │
│  pièce blanche, saturée de néons.   │
│                                     │
│  Des alarmes retentissent dans      │
│  le couloir.                        │
│                                     │
│  Sur ton oreillette, la voix de     │
│  ton coéquipier grésille.           │
│                                     │
│           [ Fermer ]                │
└─────────────────────────────────────┘
```

### Inventaire de la boîte
```
┌─────────────────────────────────────┐
│     📦 Contenu de la boîte          │
│                                     │
│  ┌────┐  ┌────┐  ┌────┐            │
│  │ 🗺️ │  │ 🔖 │  │ 📝 │            │
│  │Carte│  │Badge│  │Post│            │
│  └────┘  └────┘  └────┘            │
│                                     │
│  ┌────┐  ┌────┐  ┌────┐            │
│  │    │  │    │  │    │            │
│  │Vide│  │Vide│  │Vide│            │
│  └────┘  └────┘  └────┘            │
│                                     │
│           [ Fermer ]                │
└─────────────────────────────────────┘
```

---

## 🐛 Dépannage

### Le jeu ne se lance pas
1. Vérifiez que le serveur tourne : http://localhost:5173/
2. Ouvrez la console (F12) et regardez les erreurs
3. Rechargez la page (Ctrl+R)

### Le dialogue ne s'affiche pas
1. Vérifiez que `story.json` existe dans `client/src/ink/`
2. Ouvrez la console pour voir les erreurs
3. Le dialogue devrait afficher le texte de l'intro

### Les objets ne se collectent pas
1. Cliquez bien sur les objets (🗺️ 🔖 📝)
2. Vérifiez l'inventaire en bas de l'écran
3. Les objets devraient devenir transparents après collecte

### Les portes ne fonctionnent pas
1. Cliquez directement sur les rectangles marron (portes)
2. Le curseur devrait changer en main
3. Vous devriez changer de scène

---

## 📊 Checklist de test

- [ ] Le menu s'affiche correctement
- [ ] Je peux rejoindre une salle
- [ ] Je vois la liste des joueurs
- [ ] Le bouton "Commencer" lance le jeu
- [ ] Le canvas Phaser s'affiche
- [ ] Je peux déplacer le joueur avec les flèches
- [ ] Le talkie-walkie affiche un dialogue
- [ ] La boîte ouvre un inventaire
- [ ] Je peux collecter les 3 objets
- [ ] Les objets apparaissent dans l'inventaire en bas
- [ ] La porte Nord mène au couloir
- [ ] La porte Est mène à la salle info
- [ ] Je peux revenir à la salle d'hôpital
- [ ] Le chat fonctionne pendant le jeu

---

## 🎉 Résultat attendu

Si tout fonctionne :
- ✅ Vous pouvez vous déplacer dans la salle
- ✅ Vous pouvez lire le dialogue du talkie-walkie
- ✅ Vous pouvez collecter les 3 objets
- ✅ Vous pouvez naviguer entre les salles
- ✅ Le multijoueur fonctionne

**Félicitations ! Le jeu fonctionne ! 🎮**

---

## 📝 Notes

### Différences avec la version précédente
- ✅ **Vue de dessus** au lieu de vue en perspective
- ✅ **Déplacement libre** avec les flèches
- ✅ **Portes fonctionnelles** vers d'autres salles
- ✅ **Intégration complète** avec le menu
- ✅ **Utilisation de story.json** pour le dialogue

### Salles disponibles
1. **HospitalRoomScene** - Salle principale (complète)
2. **CorridorScene** - Couloir (squelette)
3. **ComputerRoomScene** - Salle info (squelette)

---

## 🚀 Prochaines étapes

Après avoir testé :
1. Lisez `CHANGEMENTS_VUE_DESSUS.md` pour comprendre les changements
2. Personnalisez les salles dans `client/src/scenes/`
3. Ajoutez de nouveaux objets et énigmes
4. Développez les salles Couloir et Salle Info

---

**Bon test ! 🎮**

*Si vous avez des questions ou des problèmes, consultez la console (F12)*