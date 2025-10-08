# 🎨 Guide Visuel - Hospital Escape Game

## 🗺️ Plan de la Salle d'Hôpital

```
╔═══════════════════════════════════════════════════════════════╗
║                    🚪 PORTE NORD (Couloir)                    ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║   📋 Panneau        Salle d'hôpital - Cliquez pour interagir  ║
║   Salle 12                                                    ║
║                                                               ║
║                                                               ║
║                    🛏️ Lit d'hôpital                          ║
║                                                               ║
║                                                               ║
║                                                               ║
║   📻 Talkie                                        📦 Boîte   ║
║   (Consignes)                                   (Code: 120455)║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                    [Inventaire - 5 slots]                     ║
╚═══════════════════════════════════════════════════════════════╝
                                                               🚪
                                                            PORTE EST
                                                          (Salle Info)
```

---

## 🎯 Objets Interactifs

### 1. 📻 Talkie-Walkie (Bas Gauche)
```
┌─────────────┐
│   📻        │
│  ┌─────┐   │
│  │█████│   │  ← Corps noir
│  │▓▓▓▓▓│   │  ← Écran vert
│  │  ●  │   │  ← Bouton rouge
│  │  ●  │   │  ← Bouton bleu
│  └─────┘   │
│   Talkie   │
└─────────────┘
```
**Action** : Cliquez pour lire les consignes

---

### 2. 📋 Panneau Salle 12 (Haut Gauche)
```
┌──────────┐
│  Salle   │
│          │
│    12    │  ← Indice 1
│          │
└──────────┘
```
**Action** : Cliquez pour voir "Cette salle porte le numéro 12."

---

### 3. 🕐 Horloge (Haut Droite)
```
    ┌─────┐
   ╱       ╲
  │    │    │  ← Aiguille des heures (4h)
  │  ──┼──  │  ← Aiguille des minutes (55min)
  │    │    │
   ╲       ╱
    └─────┘
   Horloge
```
**Action** : Cliquez pour voir "L'horloge indique 04:55."

---

### 4. 📦 Boîte Verrouillée (Bas Droite)

#### État Verrouillé :
```
┌─────────────┐
│  ┌───────┐  │
│  │       │  │
│  │   🔴  │  │  ← Serrure rouge
│  │       │  │
│  └───────┘  │
│ 🔒 Boîte    │
│ verrouillée │
└─────────────┘
```

#### État Déverrouillé :
```
┌─────────────┐
│  ┌───────┐  │
│  │       │  │
│  │   🟢  │  │  ← Serrure verte
│  │       │  │
│  └───────┘  │
│ 🔓 Boîte    │
│déverrouillée│
└─────────────┘
```

---

## 🔢 Pavé Numérique

```
╔═══════════════════════════════════╗
║     🔒 Boîte verrouillée          ║
║                                   ║
║  Entrez le code à 6 chiffres :   ║
║                                   ║
║         1  2  0  4  5  5          ║  ← Affichage du code
║         ─  ─  ─  ─  ─  ─          ║
║                                   ║
║      ┌───┐ ┌───┐ ┌───┐           ║
║      │ 1 │ │ 2 │ │ 3 │           ║
║      └───┘ └───┘ └───┘           ║
║      ┌───┐ ┌───┐ ┌───┐           ║
║      │ 4 │ │ 5 │ │ 6 │           ║
║      └───┘ └───┘ └───┘           ║
║      ┌───┐ ┌───┐ ┌───┐           ║
║      │ 7 │ │ 8 │ │ 9 │           ║
║      └───┘ └───┘ └───┘           ║
║      ┌───┐ ┌───┐ ┌───┐           ║
║      │ C │ │ 0 │ │ ✓ │           ║
║      └───┘ └───┘ └───┘           ║
║                                   ║
║        [    Annuler    ]          ║
╚═══════════════════════════════════╝
```

**Boutons** :
- `0-9` : Entrer un chiffre
- `C` : Effacer le code
- `✓` : Valider le code

---

## 📦 Contenu de la Boîte

```
╔═══════════════════════════════════════════════════════╗
║           📦 Contenu de la boîte                      ║
║   Cliquez pour prendre ou reposer un objet           ║
║                                                       ║
║   ┌─────────┐  ┌─────────┐  ┌─────────┐            ║
║   │         │  │         │  │         │            ║
║   │   🗺️   │  │   🔖    │  │   📝    │            ║
║   │         │  │         │  │         │            ║
║   │  Carte  │  │  Badge  │  │ Post-it │            ║
║   │Plan de  │  │ Accès   │  │Mot de   │            ║
║   │l'hôpital│  │Salle Info│ │passe    │            ║
║   └─────────┘  └─────────┘  └─────────┘            ║
║                                                       ║
║   ┌─────────┐  ┌─────────┐  ┌─────────┐            ║
║   │         │  │         │  │         │            ║
║   │  Vide   │  │  Vide   │  │  Vide   │            ║
║   │         │  │         │  │         │            ║
║   └─────────┘  └─────────┘  └─────────┘            ║
║                                                       ║
║              [    Fermer    ]                        ║
╚═══════════════════════════════════════════════════════╝
```

---

## 🎒 Inventaire

```
╔═══════════════════════════════════════════════════════════╗
║  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐               ║
║  │    │  │    │  │    │  │    │  │    │               ║
║  │🗺️ │  │🔖 │  │📝 │  │    │  │    │               ║
║  │    │  │    │  │    │  │    │  │    │               ║
║  │Carte│ │Badge│ │Post│  │Vide│  │Vide│               ║
║  └────┘  └────┘  └────┘  └────┘  └────┘               ║
╚═══════════════════════════════════════════════════════════╝
```

**Actions** :
- Cliquez sur un objet pour le reposer dans la boîte
- Maximum 5 objets

---

## 🎬 Séquence de Démarrage

### 1. Écran Noir (0-2 secondes)
```
████████████████████████████████████████
████████████████████████████████████████
████████████████████████████████████████
████████████████████████████████████████
████████████████████████████████████████
████████████████████████████████████████
```

### 2. Fondu Progressif (2 secondes)
```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

### 3. Salle Visible (après 2 secondes)
```
╔═══════════════════════════════════════╗
║         🚪 PORTE NORD                 ║
╠═══════════════════════════════════════╣
║  📋 Salle 12    [Instructions]   🕐   ║
║                                       ║
║              🛏️ Lit                  ║
║                                       ║
║  📻 Talkie                  📦 Boîte  ║
╠═══════════════════════════════════════╣
║        [Inventaire - 5 slots]         ║
╚═══════════════════════════════════════╝
```

---

## 🧩 Résolution de l'Énigme

### Étape 1 : Trouver les Indices
```
📋 Panneau Salle    →    12
🕐 Horloge          →    04:55
```

### Étape 2 : Combiner les Indices
```
12  +  04  +  55  =  120455
```

### Étape 3 : Entrer le Code
```
Cliquez : 1 → 2 → 0 → 4 → 5 → 5 → ✓
```

### Étape 4 : Boîte Déverrouillée
```
🔒 → 🔓
```

---

## 👥 Synchronisation Multiplayer

### Scénario : 2 Joueurs

#### Joueur 1 (Navigateur 1)
```
┌─────────────────────────────────┐
│  Joueur1 entre le code 120455   │
│  ✓ Code correct !                │
│  🔓 Boîte déverrouillée          │
└─────────────────────────────────┘
           │
           │ (Événement réseau)
           ↓
```

#### Joueur 2 (Navigateur 2)
```
┌─────────────────────────────────┐
│  Notification reçue              │
│  🔓 Boîte déverrouillée          │
│  (automatiquement)               │
└─────────────────────────────────┘
```

---

### Scénario : Prise d'Objet

#### Joueur 1
```
┌─────────────────────────────────┐
│  Clic sur 🗺️ Carte              │
│  → Carte dans l'inventaire       │
└─────────────────────────────────┘
           │
           │ (Événement réseau)
           ↓
```

#### Joueur 2
```
┌─────────────────────────────────┐
│  🗺️ Carte disparaît de la boîte │
│  → Slot marqué "Vide"            │
└─────────────────────────────────┘
```

---

## 🎮 Contrôles

### Souris 🖱️
- **Clic gauche** : Interagir avec les objets
- **Survol** : Effet de surbrillance
- **Curseur** : Change en main (👆) sur les objets cliquables

### Clavier ⌨️
- **Aucune touche** : Le jeu est entièrement point-and-click
- **F12** : Ouvrir la console de débogage

---

## 🎨 Palette de Couleurs

### Éléments de Jeu
```
Sol de la salle     : #e8f4f8 (Bleu très clair)
Murs                : #cccccc (Gris clair)
Lit                 : #ffffff (Blanc)
Table               : #aaaaaa (Gris)
Boîte               : #8b4513 (Marron)
```

### Interface
```
Fond overlay        : #000000 (Noir, alpha 0.7)
Boîtes de dialogue  : #1a1a2e (Bleu très foncé)
Bordures            : #16213e (Bleu foncé)
Texte principal     : #ffffff (Blanc)
Texte secondaire    : #bdc3c7 (Gris clair)
Accent vert         : #00ff00 (Vert vif)
Accent rouge        : #ff0000 (Rouge vif)
```

### États
```
Serrure verrouillée : #ff0000 (Rouge)
Serrure déverrouillée: #00ff00 (Vert)
Bouton normal       : #0f3460 (Bleu)
Bouton survol       : #16213e (Bleu plus clair)
Slot vide           : #34495e (Gris bleu)
Slot rempli         : #3d566e (Gris bleu clair)
```

---

## 📱 Responsive Design

### Desktop (1920x1080)
```
╔═══════════════════════════════════════════════════════════╗
║                    Plein écran                            ║
║  Tous les éléments visibles                              ║
║  Inventaire centré en bas                                ║
╚═══════════════════════════════════════════════════════════╝
```

### Tablet (1024x768)
```
╔═══════════════════════════════════╗
║        Adapté à l'écran           ║
║  Éléments proportionnels          ║
║  Inventaire centré                ║
╚═══════════════════════════════════╝
```

### Mobile (375x667)
```
╔═══════════════════╗
║   Vue réduite     ║
║  Éléments plus    ║
║  petits           ║
║  Inventaire       ║
║  en bas           ║
╚═══════════════════╝
```

---

## 🎯 Points d'Intérêt

### Zone Cliquable
```
┌─────────────┐
│             │
│   Objet     │  ← Zone interactive
│             │
│  [Curseur]  │  ← Change en main
└─────────────┘
```

### Effet de Survol
```
Normal          Survol
┌─────┐        ┌─────┐
│     │   →    │ ✨  │  ← Légèrement agrandi
│  📦 │        │ 📦  │  ← Couleur plus claire
└─────┘        └─────┘
```

---

**Bon jeu ! 🎮**