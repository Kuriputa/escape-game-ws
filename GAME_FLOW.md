# 🗺️ FLUX DU JEU - SCHÉMA COMPLET

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         🏥 HOSPITAL ROOM SCENE                          │
│                         (Salle de départ commune)                       │
│                                                                         │
│                    👥 Joueur A et Joueur B ensemble                     │
│                                                                         │
│                    🚪 Deux portes pour se séparer                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │   🔴 PARCOURS A       │       │   🔵 PARCOURS B       │
        │   (Joueur A)          │       │   (Joueur B)          │
        └───────────────────────┘       └───────────────────────┘
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │  1A. CORRIDOR SCENE   │       │ 1B. COMPUTER ROOM     │
        │  ═══════════════════  │       │  ═══════════════════  │
        │  🚪 Porte verrouillée │       │  💻 Terminal Linux    │
        │  ⚡ Câble coupé       │       │  📝 Post-it password  │
        │  💡 Lumières éteintes │       │  🔌 Power grid        │
        │                       │       │                       │
        │  ❌ BLOQUÉ            │◄──────┤  ✅ ACTIVE POWER      │
        │  Attend le courant    │       │  Envoie événement     │
        │                       │       │  "POWER_RESTORED"     │
        └───────────────────────┘       └───────────────────────┘
                    │                               │
                    │ Courant rétabli               │
                    ▼                               ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │ 2A. PATIENT ROOM      │       │ 2B. MEDICINE STORAGE  │
        │  ═══════════════════  │       │  ═══════════════════  │
        │  🛏️ Patient malade    │       │  💊 Étagères          │
        │  📊 Moniteur vitaux   │       │  📦 Caisse verrouillée│
        │  💉 Seringue          │       │  📄 Formule dosage    │
        │  🔢 Calcul dose       │       │  🔑 Clé chiffrement   │
        │                       │       │                       │
        │  ❌ BLOQUÉ            │◄──────┤  ✅ TRANSMET FORMULE  │
        │  Attend la formule    │       │  "Dose = (P/10)-(A/100)"│
        │                       │       │                       │
        │  Calcul: 70/10-50/100 │       │  ✅ TRANSMET CLÉ      │
        │  = 6.5 mL             │◄──────┤  "V1T4L"              │
        │                       │       │                       │
        │  ✅ Patient guéri     │       │  ✅ Mission accomplie │
        └───────────────────────┘       └───────────────────────┘
                    │                               │
                    ▼                               │
        ┌───────────────────────┐                   │
        │ 3A. SERVER ROOM       │                   │
        │  ═══════════════════  │                   │
        │  🖥️ Racks serveurs    │                   │
        │  📺 Écran chiffré     │                   │
        │  🔐 Fichier door.enc  │                   │
        │  ⌨️ Clavier virtuel   │                   │
        │                       │                   │
        │  ❌ BLOQUÉ            │◄──────────────────┘
        │  Attend la clé        │       Transmet "V1T4L"
        │                       │
        │  ✅ Déchiffre         │
        │  Code: 8417           │
        │                       │
        │  ✅ Porte déverrouillée│
        └───────────────────────┘
                    │
                    │
                    ▼
        ┌───────────────────────────────────────────────────────┐
        │                                                       │
        │         🤝 LES DEUX JOUEURS SE REJOIGNENT            │
        │                                                       │
        └───────────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────────────────────────┐
        │           4. WAITING ROOM SCENE                       │
        │           ═══════════════════════                     │
        │                                                       │
        │   🪑🪑🪑  Chaises d'attente  🪑🪑🪑                    │
        │                                                       │
        │   🔴 Rouge    🔵 Bleu    🟢 Vert                      │
        │                                                       │
        │   Joueur A voit: Rouge → Bleu → Vert                 │
        │   Joueur B voit: Bleu → Vert → Rouge                 │
        │                                                       │
        │   ✅ Séquence correcte: Rouge → Bleu → Vert → Rouge  │
        │                                                       │
        │   ⚠️ Erreur = Alarme + Reset                          │
        │   ✅ Succès = Porte déverrouillée                     │
        │                                                       │
        └───────────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────────────────────────┐
        │           5. EXIT ROOM SCENE (FINALE)                 │
        │           ═══════════════════════                     │
        │                                                       │
        │   🚪 Grande porte de sortie                           │
        │   💊 Caisse de médicaments                            │
        │   📻 Message radio                                    │
        │   ⏱️ Timer: 30 secondes                               │
        │                                                       │
        │   "Mission accomplie. Prenez les médicaments          │
        │    et sortez. Ou… rendez-les. Faites le bon choix."  │
        │                                                       │
        │   🟥 VOLER les médicaments                            │
        │   🟩 RESTITUER les médicaments                        │
        │                                                       │
        └───────────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────────────────────────┐
        │                    ÉPILOGUES                          │
        └───────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬───────────┬───────────┐
        │           │           │           │           │
        ▼           ▼           ▼           ▼           ▼
    ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐
    │ VOL │   │RESTI│   │DIVER│   │TIME │   │     │
    │TOUS │   │TOUS │   │GENCE│   │ OUT │   │     │
    │DEUX │   │DEUX │   │     │   │     │   │     │
    └─────┘   └─────┘   └─────┘   └─────┘   └─────┘
       │         │         │         │
       ▼         ▼         ▼         ▼
    ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐
    │ 💔  │   │ 💚  │   │ 💔  │   │ ❌  │
    │Cons-│   │Cons-│   │Trahi│   │Échec│
    │cience│  │cience│  │son  │   │     │
    │troublée│ │claire│  │mutuelle│ │     │
    └─────┘   └─────┘   └─────┘   └─────┘
```

---

## 📊 TABLEAU DES DÉPENDANCES

| Joueur A | Attend | Joueur B | Événement réseau |
|----------|--------|----------|------------------|
| **CorridorSceneA** | ⏳ Courant | **ComputerRoomSceneB** | `POWER_RESTORED` |
| **PatientRoomScene** | ⏳ Formule | **MedicineStorageScene** | `formula_sent` |
| **ServerRoomScene** | ⏳ Clé V1T4L | **MedicineStorageScene** | `ENCRYPTION_KEY` |
| **WaitingRoomScene** | 🤝 Synchronisation | **WaitingRoomScene** | `BUTTON_PRESS` |
| **ExitRoomScene** | 🤝 Choix moral | **ExitRoomScene** | `FINAL_CHOICE` |

---

## 🔄 FLUX DES ÉVÉNEMENTS RÉSEAU

```
JOUEUR B                                    JOUEUR A
   │                                           │
   │  1. Active power-grid                    │
   ├──────────────────────────────────────────►│
   │  EVENT: POWER_RESTORED                   │
   │                                           │ Porte déverrouillée
   │                                           │
   │  2. Transmet formule                     │
   ├──────────────────────────────────────────►│
   │  EVENT: formula_sent                     │
   │  DATA: "Dose = (P/10)-(A/100)"           │
   │                                           │ Peut calculer dose
   │                                           │
   │  3. Transmet clé chiffrement             │
   ├──────────────────────────────────────────►│
   │  EVENT: ENCRYPTION_KEY                   │
   │  DATA: "V1T4L"                            │
   │                                           │ Peut déchiffrer
   │                                           │
   │  4. Appuie sur bouton Bleu               │
   ├──────────────────────────────────────────►│
   │  EVENT: BUTTON_PRESS                     │
   │  DATA: { color: 'blue', step: 2 }        │
   │                                           │
   │                                           │ 5. Appuie sur Rouge
   │◄──────────────────────────────────────────┤
   │  EVENT: BUTTON_PRESS                     │
   │  DATA: { color: 'red', step: 1 }         │
   │                                           │
   │  6. Choisit RESTITUER                    │
   ├──────────────────────────────────────────►│
   │  EVENT: FINAL_CHOICE                     │
   │  DATA: { choice: 'return' }              │
   │                                           │
   │                                           │ 7. Choisit RESTITUER
   │◄──────────────────────────────────────────┤
   │  EVENT: FINAL_CHOICE                     │
   │  DATA: { choice: 'return' }              │
   │                                           │
   │  ✅ Épilogue: Conscience claire           │
   │                                           │ ✅ Épilogue: Conscience claire
```

---

## 🎯 POINTS DE BLOCAGE ET DÉBLOCAGE

### Joueur A - Points de blocage

1. **CorridorSceneA** 🔒
   - **Bloqué par:** Porte verrouillée (pas de courant)
   - **Débloqué par:** Joueur B active le power-grid
   - **Événement:** `POWER_RESTORED`

2. **PatientRoomScene** 🔒
   - **Bloqué par:** Pas de formule de dosage
   - **Débloqué par:** Joueur B transmet la formule
   - **Événement:** `formula_sent`

3. **ServerRoomScene** 🔒
   - **Bloqué par:** Fichier chiffré (pas de clé)
   - **Débloqué par:** Joueur B transmet la clé V1T4L
   - **Événement:** `ENCRYPTION_KEY`

### Joueur B - Points de blocage

1. **ComputerRoomSceneB** 🔓
   - **Autonome:** Peut résoudre seul (post-it visible)
   - **Action:** Active le power-grid pour Joueur A

2. **MedicineStorageScene** 🔓
   - **Autonome:** Peut trouver formule et clé seul
   - **Action:** Transmet les données au Joueur A

### Points de synchronisation obligatoire

1. **WaitingRoomScene** 🤝
   - **Les deux joueurs** doivent appuyer sur les boutons dans l'ordre
   - **Synchronisation temps réel**

2. **ExitRoomScene** 🤝
   - **Les deux joueurs** doivent faire un choix moral
   - **Synchronisation des décisions**

---

## ⏱️ TIMELINE TYPIQUE D'UNE PARTIE

```
00:00 ─ Départ dans HospitalRoomScene
        │
        ├─ Joueur A → CorridorSceneA
        └─ Joueur B → ComputerRoomSceneB
        
02:00 ─ Joueur B découvre le post-it
        Joueur B se connecte au terminal
        
03:30 ─ Joueur B active le power-grid
        ✅ Événement: POWER_RESTORED
        
04:00 ─ Joueur A peut avancer → PatientRoomScene
        Joueur B → MedicineStorageScene
        
06:00 ─ Joueur B trouve la formule
        ✅ Événement: formula_sent
        
07:00 ─ Joueur A calcule la dose (6.5 mL)
        Joueur A soigne le patient
        
08:30 ─ Joueur B trouve la clé V1T4L
        ✅ Événement: ENCRYPTION_KEY
        
09:00 ─ Joueur A → ServerRoomScene
        Joueur A déchiffre le fichier
        
11:00 ─ Joueur A obtient le code 8417
        Joueur A déverrouille la porte
        
12:00 ─ Les deux joueurs → WaitingRoomScene
        
14:00 ─ Puzzle de synchronisation des boutons
        Communication intense entre les joueurs
        
16:00 ─ ✅ Puzzle résolu
        Les deux joueurs → ExitRoomScene
        
17:00 ─ Message radio + Timer démarre (30s)
        
17:15 ─ Joueur A choisit: RESTITUER
        
17:25 ─ Joueur B choisit: RESTITUER
        
17:30 ─ ✅ Épilogue: Conscience claire
        🎉 FIN DU JEU
```

---

## 🎮 STRATÉGIES DE COMMUNICATION

### Communication essentielle

1. **Phase 1 (0-5 min)**
   - Joueur B: "Je cherche le mot de passe"
   - Joueur B: "Trouvé ! root1234"
   - Joueur B: "J'active le courant maintenant"
   - Joueur A: "Merci ! Ma porte s'ouvre"

2. **Phase 2 (5-10 min)**
   - Joueur B: "Je vois une formule de dosage"
   - Joueur B: "Dose = (Poids / 10) - (Âge / 100)"
   - Joueur A: "Reçu ! Le patient pèse 70kg, 50 ans"
   - Joueur A: "Calcul: 6.5 mL"
   - Joueur A: "Patient sauvé !"

3. **Phase 3 (10-15 min)**
   - Joueur B: "J'ai trouvé une clé de chiffrement"
   - Joueur B: "C'est V1T4L"
   - Joueur A: "Parfait ! Je déchiffre le serveur"
   - Joueur A: "Code obtenu: 8417"

4. **Phase 4 (15-20 min)**
   - Joueur A: "Je suis dans la salle d'attente"
   - Joueur B: "Moi aussi ! On fait quoi ?"
   - Joueur A: "J'ai: Rouge → Bleu → Vert"
   - Joueur B: "Moi: Bleu → Vert → Rouge"
   - Joueur A: "Donc: Rouge, Bleu, Vert, Rouge ?"
   - Joueur B: "Oui ! Toi Rouge d'abord"
   - Joueur A: "OK, j'appuie sur Rouge"
   - Joueur B: "Maintenant Bleu"
   - ...

5. **Phase 5 (20-25 min)**
   - Joueur A: "Dilemme moral... qu'est-ce qu'on fait ?"
   - Joueur B: "Les médicaments peuvent sauver des vies"
   - Joueur A: "Mais on a fait tout ça..."
   - Joueur B: "Je pense qu'on devrait les restituer"
   - Joueur A: "D'accord, je choisis RESTITUER"
   - Joueur B: "Moi aussi"
   - 🎉 "Conscience claire"

---

## 🏆 ACHIEVEMENTS POSSIBLES (Idées futures)

- 🏃 **Speedrun** : Finir en moins de 15 minutes
- 💬 **Communicateur** : Envoyer 50 messages dans le chat
- 🤝 **Parfaite synchronisation** : Résoudre le puzzle de boutons sans erreur
- 💚 **Conscience claire** : Choisir de restituer les médicaments
- 💔 **Conscience troublée** : Choisir de voler les médicaments
- ⚡ **Électricien** : Rétablir le courant en moins de 2 minutes
- 💉 **Médecin** : Soigner le patient du premier coup
- 🔐 **Hacker** : Déchiffrer le serveur du premier coup
- 🎯 **Perfectionniste** : Finir le jeu sans aucune erreur

---

## 📈 MÉTRIQUES DE GAMEPLAY (À implémenter)

```typescript
interface GameMetrics {
  startTime: number;
  endTime: number;
  totalDuration: number;
  
  playerA: {
    errorsCount: number;
    messagesCount: number;
    scenesCompleted: string[];
  };
  
  playerB: {
    errorsCount: number;
    messagesCount: number;
    scenesCompleted: string[];
  };
  
  finalChoice: {
    playerA: 'steal' | 'return';
    playerB: 'steal' | 'return';
    outcome: 'steal_both' | 'return_both' | 'divergence' | 'timeout';
  };
}
```

---

## 🎨 PALETTE DE COULEURS

```
Couleurs principales:
- Bleu clair:    #00d9ff (UI, titres)
- Vert:          #00ff00 (succès, validation)
- Rouge:         #ff0000 (erreur, danger)
- Jaune:         #ffff00 (avertissement, info)
- Orange:        #ffaa00 (attention)

Couleurs de fond:
- Noir:          #000000 (overlay, fond)
- Gris foncé:    #1a1a1a (murs)
- Gris moyen:    #2c2c2c (sol)
- Gris clair:    #444444 (boutons)

Couleurs spéciales:
- Or:            #ffd700 (poignées de porte)
- Marron:        #8b4513 (portes en bois)
- Turquoise:     #4ecdc4 (boutons d'action)
```

---

## 🎵 SONS SUGGÉRÉS (À implémenter)

- 🔊 **Ambiance** : Bruit de fond d'hôpital
- 🚪 **Porte** : Clic de déverrouillage
- ⚡ **Étincelles** : Grésillement électrique
- 💻 **Terminal** : Bip de commande
- 💉 **Seringue** : Injection
- 🔔 **Alarme** : Sirène d'erreur
- ✅ **Succès** : Son de validation
- ❌ **Erreur** : Buzzer
- ⏱️ **Timer** : Tic-tac
- 🎉 **Victoire** : Fanfare

---

Voilà le flux complet du jeu ! 🎮✨