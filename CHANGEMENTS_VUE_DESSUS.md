# 🎮 Changements - Vue de dessus et Navigation

## ✅ Ce qui a été fait

### 1. **Vue de dessus (Top-Down)**
- ✅ Salle d'hôpital redessinée en vue de dessus
- ✅ Joueur représenté par un carré rouge
- ✅ Déplacement avec les flèches du clavier
- ✅ Physique Arcade activée (pas de gravité)

### 2. **Système de portes**
- ✅ **Porte Nord** → Couloir (en construction)
- ✅ **Porte Est** → Salle Informatique (en construction)
- ✅ Portes interactives avec survol et clic
- ✅ Navigation entre les scènes

### 3. **Intégration avec le menu**
- ✅ Le jeu se lance quand on clique sur "Commencer"
- ✅ Le canvas Phaser s'affiche après le lobby
- ✅ Le chat reste visible pendant le jeu
- ✅ Les objets `net` et `story` sont passés aux scènes

### 4. **Dialogue du talkie-walkie**
- ✅ Utilise le fichier `story.json` existant
- ✅ Affiche le dialogue "intro" de l'histoire Ink
- ✅ Overlay avec fond semi-transparent
- ✅ Bouton "Fermer" pour revenir au jeu

### 5. **Nouvelles scènes créées**
- ✅ `HospitalRoomScene.ts` - Salle principale
- ✅ `CorridorScene.ts` - Couloir (squelette)
- ✅ `ComputerRoomScene.ts` - Salle info (squelette)

---

## 📁 Fichiers modifiés

### Nouveaux fichiers
```
client/src/scenes/
├── HospitalRoomScene.ts      (nouvelle scène principale)
├── CorridorScene.ts           (nouvelle scène couloir)
└── ComputerRoomScene.ts       (nouvelle scène salle info)
```

### Fichiers modifiés
```
client/main.ts
├── Import des 3 nouvelles scènes
├── Ajout de la physique Arcade
└── Fonction begin() mise à jour pour lancer HospitalRoomScene
```

---

## 🎮 Comment jouer

### 1. Lancer le jeu
```bash
cd client
npm run dev
```

### 2. Dans le navigateur
1. Entrez un pseudo
2. Entrez un nom de salle
3. Cliquez sur "Rejoindre"
4. Cliquez sur "Commencer"
5. Le jeu se lance ! 🎉

### 3. Contrôles
- **Flèches** : Déplacer le joueur
- **Clic sur talkie-walkie** : Afficher le dialogue
- **Clic sur boîte** : Ouvrir l'inventaire
- **Clic sur objets** : Collecter dans l'inventaire
- **Clic sur portes** : Changer de salle

---

## 🏥 Structure de la salle (vue de dessus)

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│                   🚪 Couloir                         │
│                                                       │
│  ┌────┐                                              │
│  │    │                                              │
│  │ 🛏️ │                                              │
│  │    │                                              │
│  └────┘                                              │
│   Lit                                                │
│                                                       │
│                                                       │
│                        🟥                             │
│                      Joueur                          │
│                                                       │
│                                    ┌────┐            │
│                                    │    │            │
│  📻                                │ 🖥️ │            │
│ Talkie                             └────┘            │
│                                    Table             │
│                                                       │
│                                                       │
│                                           📦         │
│                                          Boîte       │
│                                                       │
│                                                  🚪   │
│                                            Salle Info │
│                                                       │
│              ┌───┬───┬───┬───┬───┐                  │
│              │   │   │   │   │   │  Inventaire      │
│              └───┴───┴───┴───┴───┘                  │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Flux du jeu

```
Menu (index.html)
    │
    ├─> Entrer pseudo et salle
    │
    ├─> Rejoindre la salle
    │
    ├─> Lobby avec liste des joueurs
    │
    └─> Clic sur "Commencer"
         │
         └─> HospitalRoomScene (Phaser)
              │
              ├─> Clic sur talkie → Dialogue (story.json)
              │
              ├─> Clic sur boîte → Inventaire (3 objets)
              │
              ├─> Clic sur porte Nord → CorridorScene
              │
              └─> Clic sur porte Est → ComputerRoomScene
```

---

## 📝 Dialogue du talkie-walkie

Le dialogue utilise le fichier `story.json` existant :

```
"Tu ouvres les yeux dans une pièce blanche, saturée de néons.
Des alarmes retentissent dans le couloir.
Sur ton oreillette, la voix de ton coéquipier grésille."
```

Ensuite, l'histoire Ink continue avec les choix :
- Observer la salle
- Appeler ton coéquipier

---

## 🎨 Améliorations possibles

### Court terme
- [ ] Ajouter des sprites pour le joueur (au lieu du carré)
- [ ] Ajouter des animations de marche
- [ ] Améliorer le design des portes
- [ ] Ajouter des sons (pas, portes, etc.)

### Moyen terme
- [ ] Compléter le CorridorScene avec des objets
- [ ] Compléter le ComputerRoomScene avec un terminal interactif
- [ ] Ajouter plus de salles (bureau médecin, salle de stockage, etc.)
- [ ] Synchroniser la position des joueurs en multijoueur

### Long terme
- [ ] Système de quêtes
- [ ] Énigmes à résoudre
- [ ] Utilisation des objets de l'inventaire
- [ ] Fin de l'histoire avec plusieurs endings

---

## 🐛 Problèmes connus

### Aucun pour l'instant ! 🎉

Si vous rencontrez un problème :
1. Ouvrez la console (F12)
2. Vérifiez les erreurs
3. Rechargez la page (Ctrl+R)

---

## 🚀 Prochaines étapes

### 1. Tester le jeu
```bash
cd client
npm run dev
```

### 2. Personnaliser
- Modifiez `HospitalRoomScene.ts` pour changer la salle
- Modifiez `story.json` pour changer les dialogues
- Ajoutez de nouveaux objets interactifs

### 3. Développer les autres salles
- Complétez `CorridorScene.ts`
- Complétez `ComputerRoomScene.ts`
- Créez de nouvelles scènes

### 4. Ajouter des assets
- Remplacez les formes géométriques par des sprites
- Ajoutez des sons
- Ajoutez des animations

---

## 📚 Ressources

### Documentation Phaser
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Examples](https://phaser.io/examples)

### Documentation Ink
- [Ink Documentation](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md)
- [Inkjs](https://github.com/y-lohse/inkjs)

### Tutoriels
- [Top-Down Game Tutorial](https://phaser.io/tutorials/making-your-first-phaser-3-game)
- [Point and Click Adventure](https://phaser.io/news/2018/11/point-and-click-adventure-tutorial)

---

## ✨ Résumé

Vous avez maintenant :
- ✅ Un jeu en vue de dessus
- ✅ Un système de navigation entre salles
- ✅ Une intégration complète avec le menu
- ✅ Un dialogue utilisant story.json
- ✅ Un inventaire fonctionnel
- ✅ Un système de portes
- ✅ 3 scènes (1 complète + 2 squelettes)

**Le jeu est prêt à être testé et développé ! 🎮**

---

*Créé avec ❤️ pour votre escape game multijoueur*