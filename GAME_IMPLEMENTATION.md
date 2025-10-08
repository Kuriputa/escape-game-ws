# 🎮 ESCAPE GAME COOPÉRATIF - IMPLÉMENTATION COMPLÈTE

## 📋 RÉSUMÉ DU JEU

Un jeu d'évasion coopératif multijoueur où deux joueurs (A et B) doivent s'échapper d'un hôpital en suivant des chemins divergents qui nécessitent une communication et une coordination constantes.

---

## 🗺️ ARCHITECTURE DES SCÈNES

### 🏥 SALLE COMMUNE (Départ)
**Fichier:** `HospitalRoomScene.ts`

**Description:** Salle de départ où les deux joueurs commencent ensemble avant de se séparer.

**Éléments:**
- Deux portes : une pour le Joueur A (Couloir), une pour le Joueur B (Salle informatique)
- Système de chat fonctionnel
- Event handler préservé pour maintenir la communication globale

**Navigation:**
- Joueur A → `CorridorSceneA`
- Joueur B → `ComputerRoomSceneB`

---

## 🔹 PARCOURS JOUEUR A

### 1️⃣ SALLE 1A - Couloir (CorridorSceneA)
**Fichier:** `CorridorSceneA.ts` (358 lignes)

**Objectif:** Attendre que le Joueur B rétablisse le courant pour déverrouiller la porte.

**Éléments visuels:**
- Porte verrouillée électroniquement (rouge → verte quand déverrouillée)
- Câble d'alimentation coupé avec système d'étincelles (animation custom)
- Panneau électrique
- Lumières éteintes

**Puzzle:**
- La porte est verrouillée tant que le Joueur B n'a pas activé le générateur
- Réception de l'événement réseau `POWER_RESTORED` depuis le Joueur B
- Quand le courant est rétabli : étincelles s'arrêtent, porte déverrouillée, lumières allumées

**Coopération:**
- ❌ Joueur A bloqué sans l'aide du Joueur B
- ✅ Communication nécessaire pour coordonner les actions

**Navigation:**
- Retour → `HospitalRoomScene`
- Suivant → `PatientRoomScene`

---

### 2️⃣ SALLE 2A - Salle du Patient (PatientRoomScene)
**Fichier:** `PatientRoomScene.ts` (565 lignes)

**Objectif:** Soigner un patient inconscient en calculant la bonne dose de médicament.

**Éléments visuels:**
- Patient allongé sur un lit (animation de respiration)
- Moniteur de signes vitaux affichant :
  - Tension : 7.5 / 4.0 (anormale)
  - Poids : 70 kg
  - Âge : 50 ans
- Seringue interactive
- Clavier numérique pour entrer la dose
- Porte verrouillée

**Puzzle:**
- Le Joueur B trouve la formule : `Dose = (Poids / 10) - (Âge / 100)`
- Le Joueur A reçoit la formule via événement réseau
- Calcul : `(70 / 10) - (50 / 100) = 7 - 0.5 = 6.5 mL`
- Entrer `6.5` → patient stabilisé → porte déverrouillée

**Coopération:**
- ❌ Joueur A ne peut pas calculer sans la formule du Joueur B
- ✅ Joueur B doit transmettre la formule depuis `MedicineStorageScene`

**Sensibilisation:**
- 💡 Mauvaise dose = danger vital
- 💡 Le patient est un être humain, pas un obstacle

**Navigation:**
- Retour → `CorridorSceneA`
- Suivant → `ServerRoomScene`

---

### 3️⃣ SALLE 3A - Salle Serveur (ServerRoomScene)
**Fichier:** `ServerRoomScene.ts` (NOUVEAU - 665 lignes)

**Objectif:** Déchiffrer un fichier pour obtenir le code d'accès à la salle d'attente.

**Éléments visuels:**
- 8 racks de serveurs avec LEDs clignotantes
- Écran principal affichant `/data/keys/door.enc`
- Texte chiffré : `8gF#2@kL9$4vT!xZ`
- Clavier virtuel (A-Z, 0-9)
- Pavé numérique pour le code final

**Puzzle:**
1. Le fichier `door.enc` est chiffré (texte illisible)
2. Le Joueur B trouve la clé de chiffrement `V1T4L` dans `MedicineStorageScene`
3. Le Joueur A reçoit la clé via événement réseau
4. Entrer `V1T4L` → déchiffrement → affiche le code `8417`
5. Entrer `8417` → porte déverrouillée

**Coopération:**
- ❌ Joueur A bloqué sans la clé du Joueur B
- ✅ Joueur B doit transmettre `V1T4L`

**Sensibilisation:**
- 💡 Cybersécurité et protection des données de santé
- 💡 Importance du chiffrement dans un hôpital

**Navigation:**
- Retour → `PatientRoomScene`
- Suivant → `WaitingRoomScene`

---

## 🔹 PARCOURS JOUEUR B

### 1️⃣ SALLE 1B - Salle Informatique (ComputerRoomSceneB)
**Fichier:** `ComputerRoomSceneB.ts` (665 lignes)

**Objectif:** Rétablir le courant pour déverrouiller la porte du Joueur A.

**Éléments visuels:**
- Terminal Linux simulé avec écran noir
- Post-it jaune avec mot de passe `root1234`
- Menu de commandes (ls, cat, sudo systemctl)
- Serveurs avec LEDs
- Panneau de contrôle électrique

**Puzzle:**
1. Découvrir le post-it avec le mot de passe `root1234`
2. Se connecter au terminal (login: root)
3. Exécuter les commandes :
   - `ls` → affiche `power.cfg`
   - `cat power.cfg` → affiche les instructions
   - `sudo systemctl start power-grid` → rétablit le courant
4. Envoie l'événement `POWER_RESTORED` au Joueur A

**Coopération:**
- ✅ Le Joueur A peut avancer une fois le courant rétabli
- ✅ Communication pour confirmer l'action

**Sensibilisation:**
- 💡 Ne jamais noter de mot de passe sur un post-it !
- 💡 Introduction aux commandes Linux

**Navigation:**
- Retour → `HospitalRoomScene`
- Suivant → `MedicineStorageScene`

---

### 2️⃣ SALLE 2B - Stockage des Médicaments (MedicineStorageScene)
**Fichier:** `MedicineStorageScene.ts` (465 lignes)

**Objectif:** Trouver et transmettre la formule de dosage et la clé de chiffrement au Joueur A.

**Éléments visuels:**
- Étagères de médicaments (6 étagères avec flacons)
- Caisse verrouillée avec cadenas
- Panneau d'information
- Boutons pour transmettre les données

**Puzzle:**
1. Examiner les étagères → trouver la formule : `Dose = (Poids / 10) - (Âge / 100)`
2. Examiner la caisse → trouver la clé de chiffrement : `V1T4L`
3. Transmettre la formule au Joueur A (événement réseau)
4. Transmettre la clé au Joueur A (événement réseau)
5. Porte déverrouillée après transmission

**Coopération:**
- ✅ Le Joueur A a besoin de la formule pour soigner le patient
- ✅ Le Joueur A a besoin de la clé pour déchiffrer le serveur

**Sensibilisation:**
- 💡 Sécurité des données médicales
- 💡 Équilibre entre confidentialité et urgence médicale

**Navigation:**
- Retour → `ComputerRoomSceneB`
- Suivant → `WaitingRoomScene`

---

## 🤝 SALLES COMMUNES (Fin du jeu)

### 4️⃣ SALLE D'ATTENTE (WaitingRoomScene)
**Fichier:** `WaitingRoomScene.ts` (NOUVEAU - 485 lignes)

**Objectif:** Les deux joueurs se retrouvent et doivent synchroniser l'appui de boutons.

**Éléments visuels:**
- 12 chaises disposées en rangées
- Table basse au centre
- Panneau de contrôle avec 3 boutons : 🔴 Rouge, 🔵 Bleu, 🟢 Vert
- Affichage de la séquence du joueur
- Affichage de la séquence en cours

**Puzzle:**
- **Joueur A** voit : `Rouge → Bleu → Vert`
- **Joueur B** voit : `Bleu → Vert → Rouge`
- **Séquence correcte globale** : `Rouge → Bleu → Vert → Rouge`

**Mécanisme:**
1. Les joueurs doivent appuyer dans l'ordre correct (pas simultanément, mais séquentiellement)
2. Chaque clic est synchronisé via événement réseau
3. Si erreur → alarme + reset
4. Si succès → porte déverrouillée

**Coopération:**
- ✅ Nécessite coordination exacte
- ✅ Communication pour déterminer l'ordre global

**Sensibilisation:**
- 💡 Métaphore des gestes synchronisés d'une équipe médicale
- 💡 Importance de la coordination humaine

**Navigation:**
- Retour → `ServerRoomScene` (Joueur A) ou `MedicineStorageScene` (Joueur B)
- Suivant → `ExitRoomScene`

---

### 5️⃣ SALLE DE SORTIE - FINALE (ExitRoomScene)
**Fichier:** `ExitRoomScene.ts` (NOUVEAU - 485 lignes)

**Objectif:** Dilemme moral final - voler ou restituer les médicaments.

**Éléments visuels:**
- Grande porte de sortie avec panneau lumineux
- Caisse de médicaments au centre (avec croix rouge)
- Radio avec message
- Timer de 30 secondes
- Deux boutons de choix : 🟥 Voler / 🟩 Restituer

**Puzzle:**
1. Message radio : *"Mission accomplie. Prenez les médicaments et sortez. Ou… rendez-les. Faites le bon choix."*
2. Timer de 30 secondes démarre
3. Chaque joueur choisit : Voler ou Restituer
4. Les choix sont synchronisés via événement réseau
5. Épilogue selon les choix

**Épilogues possibles:**

#### 🌙 **Vol (les deux)** - Conscience troublée
```
Vous fuyez tous les deux dans la nuit.
L'alarme retentit derrière vous.
Les médicaments sont en votre possession,
mais votre conscience est lourde.
Avez-vous fait le bon choix ?
💔 FIN - Conscience troublée
```

#### 🌟 **Restitution (les deux)** - Conscience claire
```
Vous restituez les médicaments ensemble.
La mission est avortée, mais vous partez la tête haute.
Ces médicaments sauveront des vies.
L'humanité avant tout.
Vous avez fait le bon choix.
💚 FIN - Conscience claire
```

#### ⚠️ **Divergence** - Trahison mutuelle
```
Vos choix divergent !
L'un veut voler, l'autre restituer.
L'alarme se déclenche immédiatement.
Vous fuyez précipitamment, séparés.
La confiance est brisée.
💔 FIN - Trahison mutuelle
```

#### ⏱️ **Timeout** - Échec
```
Vous n'avez pas su prendre de décision.
L'alarme se déclenche automatiquement.
Les gardes arrivent.
Vous êtes capturés.
L'indécision a un prix.
❌ FIN - Échec
```

**Coopération:**
- ✅ Choix moral partagé
- ✅ Conséquences selon l'alignement des décisions

**Sensibilisation:**
- 💡 Dilemme éthique : santé publique vs. conscience individuelle
- 💡 Réflexion sur la portée de nos actions
- 💡 Importance de la confiance dans une équipe

**Navigation:**
- Retour → `WaitingRoomScene`
- Bouton "Recommencer" → `HospitalRoomScene`

---

## 🌐 SYSTÈME RÉSEAU

### Événements réseau utilisés

| Type d'événement | Émetteur | Récepteur | Données | Scène |
|-----------------|----------|-----------|---------|-------|
| `POWER_RESTORED` | Joueur B | Joueur A | `{ type: 'power_restored' }` | ComputerRoomSceneB → CorridorSceneA |
| `formula_sent` | Joueur B | Joueur A | `{ type: 'formula_sent', formula: '...' }` | MedicineStorageScene → PatientRoomScene |
| `ENCRYPTION_KEY` | Joueur B | Joueur A | `{ type: 'ENCRYPTION_KEY', key: 'V1T4L' }` | MedicineStorageScene → ServerRoomScene |
| `BUTTON_PRESS` | A ou B | A et B | `{ type: 'BUTTON_PRESS', color: '...', step: N }` | WaitingRoomScene (synchronisation) |
| `FINAL_CHOICE` | A ou B | A et B | `{ type: 'FINAL_CHOICE', choice: 'steal'/'return' }` | ExitRoomScene (dilemme final) |

### Pattern d'event handler

Toutes les scènes utilisent le pattern de préservation de l'event handler :

```typescript
this.originalOnEvent = this.net.onEvent;
this.net.onEvent = (code, data) => {
  // Logique spécifique à la scène
  if (code === EVENT_CODES.PUZZLE_UPDATE) {
    // Traiter les événements de puzzle
  }
  // Appeler l'handler original pour CHAT, START, etc.
  if (this.originalOnEvent) {
    this.originalOnEvent(code, data);
  }
};
```

---

## 🎨 DESIGN PATTERN COMMUN

Toutes les scènes suivent cette structure cohérente :

### Structure de base
```typescript
export class NomScene extends Phaser.Scene {
  private net!: Net;
  private story!: Story;
  private originalOnEvent?: (code: number, data: any) => void;

  create(data: { net: Net; story: Story }) {
    // 1. Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
    
    // 2. Sauvegarder l'event handler original
    this.originalOnEvent = this.net.onEvent;
    this.net.onEvent = (code, data) => { /* ... */ };
    
    // 3. Créer la salle
    this.createRoom();
    
    // 4. Créer les éléments interactifs
    // 5. Créer les portes
    // 6. Créer le bouton retour
    // 7. Message d'info
  }
}
```

### Éléments visuels récurrents
- **Rectangles** pour les murs, sols, plafonds
- **Couleurs cohérentes** : bleu (#00d9ff), vert (#00ff00), rouge (#ff0000)
- **Animations** : tweens pour les LEDs, étincelles, brillances
- **Interactivité** : `setInteractive({ useHandCursor: true })`
- **Feedback visuel** : changement de couleur au survol
- **Messages temporaires** : fade out après quelques secondes

---

## 📊 STATISTIQUES DU PROJET

### Fichiers créés/modifiés

| Fichier | Lignes | Statut | Description |
|---------|--------|--------|-------------|
| `CorridorSceneA.ts` | 358 | ✅ Créé | Couloir avec porte verrouillée |
| `ComputerRoomSceneB.ts` | 665 | ✅ Créé | Terminal Linux + power grid |
| `PatientRoomScene.ts` | 565 | ✅ Créé | Patient + calcul dosage |
| `MedicineStorageScene.ts` | 465 | ✅ Créé | Formule + clé de chiffrement |
| `ServerRoomScene.ts` | 665 | ✅ Créé | Déchiffrement + code porte |
| `WaitingRoomScene.ts` | 485 | ✅ Créé | Puzzle de synchronisation |
| `ExitRoomScene.ts` | 485 | ✅ Créé | Dilemme moral + épilogues |
| `HospitalRoomScene.ts` | - | ✅ Modifié | Event handler préservé |
| `main.ts` | - | ✅ Modifié | Enregistrement des scènes |

**Total : 3 688 lignes de code TypeScript**

---

## 🚀 COMPILATION ET DÉPLOIEMENT

### Commandes

```powershell
# Compiler le client
cd "c:\Users\lebro\Documents\Escape Game\escape-game-ws\client"
npm run build

# Lancer le serveur de développement
npm run dev
```

### Statut de compilation
✅ **Compilation réussie** (dernière vérification)
- Aucune erreur TypeScript
- Tous les imports résolus
- Toutes les scènes enregistrées

---

## 🎯 OBJECTIFS PÉDAGOGIQUES ATTEINTS

### Sensibilisation à la cybersécurité
- ✅ Mots de passe sur post-it (mauvaise pratique)
- ✅ Chiffrement des données sensibles
- ✅ Protection des données de santé

### Sensibilisation médicale
- ✅ Importance du dosage précis
- ✅ Le patient comme être humain
- ✅ Coordination d'équipe médicale

### Sensibilisation éthique
- ✅ Dilemme moral final
- ✅ Conséquences des choix
- ✅ Confiance et trahison

---

## 🎮 EXPÉRIENCE DE JEU

### Durée estimée
- **Parcours complet** : 20-30 minutes
- **Par salle** : 3-5 minutes

### Difficulté
- **Puzzles** : Moyenne (nécessite communication)
- **Coordination** : Élevée (synchronisation requise)
- **Rejouabilité** : Élevée (4 fins différentes)

### Points forts
- ✅ Coopération obligatoire
- ✅ Communication constante
- ✅ Puzzles asymétriques
- ✅ Dilemme moral impactant
- ✅ Design cohérent

---

## 📝 NOTES TECHNIQUES

### Système de particules custom
Les étincelles dans `CorridorSceneA` utilisent un système custom (pas le ParticleEmitter de Phaser) car celui-ci nécessite des textures. Le système custom utilise des cercles animés avec tweens.

### Synchronisation réseau
Tous les événements de puzzle passent par `EVENT_CODES.PUZZLE_UPDATE` avec un champ `type` pour différencier les actions. Cela permet une extensibilité facile.

### Gestion d'état
`GameState.getInstance()` est utilisé pour stocker le rôle du joueur (A ou B) et d'autres données persistantes entre les scènes.

---

## 🐛 TESTS RECOMMANDÉS

### Tests à effectuer
1. ✅ Compilation TypeScript
2. ⏳ Test multijoueur (2 clients simultanés)
3. ⏳ Synchronisation des événements réseau
4. ⏳ Tous les chemins de navigation
5. ⏳ Les 4 fins différentes
6. ⏳ Timer de 30 secondes
7. ⏳ Reset du puzzle de boutons
8. ⏳ Chat pendant le gameplay

---

## 🎉 CONCLUSION

Le jeu d'évasion coopératif est **entièrement implémenté** avec :
- ✅ 7 scènes complètes
- ✅ 2 parcours divergents
- ✅ 5 puzzles coopératifs
- ✅ 4 fins différentes
- ✅ Système de communication réseau
- ✅ Design cohérent et immersif
- ✅ Sensibilisation à la cybersécurité, l'éthique médicale et la protection des données

**Le jeu est prêt à être testé en multijoueur ! 🚀**