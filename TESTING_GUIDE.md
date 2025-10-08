# 🧪 GUIDE DE TEST - ESCAPE GAME COOPÉRATIF

## 📋 PRÉREQUIS

### Environnement de test
- ✅ 2 navigateurs (ou 2 onglets en navigation privée)
- ✅ Serveur Photon configuré
- ✅ Client compilé (`npm run build`)
- ✅ Serveur de développement lancé (`npm run dev`)

### Commandes de démarrage

```powershell
# Terminal 1 - Compiler le client
cd "c:\Users\lebro\Documents\Escape Game\escape-game-ws\client"
npm run build

# Terminal 2 - Lancer le serveur de développement
cd "c:\Users\lebro\Documents\Escape Game\escape-game-ws\client"
npm run dev
```

---

## 🎮 SCÉNARIO DE TEST COMPLET

### TEST 1 : Connexion et Lobby

#### Étapes
1. Ouvrir le navigateur 1 → `http://localhost:5173`
2. Entrer un nom : "Joueur A"
3. Cliquer sur "Rejoindre"
4. Vérifier que le joueur apparaît dans la liste

5. Ouvrir le navigateur 2 → `http://localhost:5173`
6. Entrer un nom : "Joueur B"
7. Cliquer sur "Rejoindre"
8. Vérifier que les deux joueurs apparaissent dans les deux listes

#### Résultats attendus
- ✅ Les deux joueurs voient la liste mise à jour
- ✅ Le bouton "Démarrer" est visible
- ✅ Le chat est visible

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 2 : Chat dans le Lobby

#### Étapes
1. Joueur A envoie : "Bonjour !"
2. Joueur B envoie : "Salut !"
3. Vérifier que les messages apparaissent dans les deux chats

#### Résultats attendus
- ✅ Les messages apparaissent dans les deux fenêtres
- ✅ Le nom du joueur est affiché avant le message
- ✅ Le scroll automatique fonctionne

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 3 : Démarrage du Jeu

#### Étapes
1. Joueur A clique sur "Démarrer"
2. Vérifier que les deux joueurs arrivent dans `HospitalRoomScene`

#### Résultats attendus
- ✅ Fade in de 500ms
- ✅ Titre "SALLE D'HÔPITAL" visible
- ✅ Deux portes visibles (Couloir / Salle informatique)
- ✅ Chat toujours visible
- ✅ Message "Départ de la partie !" dans le chat

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 4 : Chat pendant le Gameplay

#### Étapes
1. Joueur A envoie : "Je vais au couloir"
2. Joueur B envoie : "Moi à la salle informatique"
3. Vérifier que les messages apparaissent

#### Résultats attendus
- ✅ Les messages apparaissent pendant le jeu
- ✅ Le chat ne bloque pas l'interaction avec le jeu

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 5 : Séparation des Joueurs

#### Étapes
1. Joueur A clique sur la porte "COULOIR"
2. Joueur B clique sur la porte "SALLE INFORMATIQUE"
3. Vérifier que chaque joueur arrive dans sa scène

#### Résultats attendus
- ✅ Joueur A → `CorridorSceneA`
- ✅ Joueur B → `ComputerRoomSceneB`
- ✅ Fade out/in fluide

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 6 : CorridorSceneA (Joueur A)

#### Étapes
1. Vérifier que la porte est verrouillée (rouge)
2. Vérifier que le câble est coupé
3. Vérifier que les étincelles apparaissent
4. Essayer de cliquer sur la porte
5. Vérifier le message "Porte verrouillée"

#### Résultats attendus
- ✅ Porte rouge avec texte "VERROUILLÉE"
- ✅ Étincelles animées (cercles jaunes/blancs)
- ✅ Message d'erreur au clic
- ✅ Lumières éteintes

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 7 : ComputerRoomSceneB (Joueur B)

#### Étapes
1. Cliquer sur le post-it jaune
2. Vérifier que le mot de passe `root1234` s'affiche
3. Cliquer sur le terminal
4. Vérifier que le menu de commandes apparaît
5. Cliquer sur "ls"
6. Vérifier que `power.cfg` apparaît
7. Cliquer sur "cat power.cfg"
8. Vérifier les instructions
9. Cliquer sur "sudo systemctl start power-grid"
10. Vérifier le message de succès

#### Résultats attendus
- ✅ Post-it cliquable avec mot de passe
- ✅ Menu de commandes fonctionnel
- ✅ Commandes exécutées dans l'ordre
- ✅ Message "✓ COURANT RÉTABLI !"
- ✅ Événement réseau envoyé

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 8 : Synchronisation Power Grid

#### Étapes
1. Joueur B active le power-grid (test précédent)
2. Joueur A vérifie sa scène `CorridorSceneA`
3. Vérifier que la porte devient verte
4. Vérifier que les étincelles s'arrêtent
5. Vérifier que les lumières s'allument
6. Cliquer sur la porte
7. Vérifier la transition vers `PatientRoomScene`

#### Résultats attendus
- ✅ Porte passe de rouge à verte
- ✅ Texte "DÉVERROUILLÉE"
- ✅ Étincelles disparaissent
- ✅ Lumières s'allument (rectangles jaunes)
- ✅ Transition fluide vers la scène suivante

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 9 : PatientRoomScene (Joueur A)

#### Étapes
1. Vérifier que le patient est visible
2. Vérifier l'animation de respiration
3. Cliquer sur le moniteur
4. Vérifier les signes vitaux :
   - Tension : 7.5 / 4.0
   - Poids : 70 kg
   - Âge : 50 ans
5. Essayer d'injecter sans formule
6. Vérifier le message d'erreur

#### Résultats attendus
- ✅ Patient animé (respiration)
- ✅ Moniteur affiche les données
- ✅ Message "Vous n'avez pas encore reçu la formule"

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 10 : MedicineStorageScene (Joueur B)

#### Étapes
1. Joueur B clique sur la porte suivante
2. Arrivée dans `MedicineStorageScene`
3. Cliquer sur les étagères
4. Vérifier que la formule apparaît
5. Cliquer sur "Transmettre la formule"
6. Vérifier le message de confirmation
7. Cliquer sur la caisse verrouillée
8. Vérifier que la clé `V1T4L` apparaît
9. Cliquer sur "Transmettre la clé"

#### Résultats attendus
- ✅ Formule visible : `Dose = (Poids / 10) - (Âge / 100)`
- ✅ Bouton "Transmettre" fonctionnel
- ✅ Message "✓ FORMULE TRANSMISE !"
- ✅ Clé visible : `V1T4L`
- ✅ Message "✓ CLÉ TRANSMISE !"
- ✅ Événements réseau envoyés

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 11 : Synchronisation Formule

#### Étapes
1. Joueur B transmet la formule (test précédent)
2. Joueur A vérifie sa scène `PatientRoomScene`
3. Vérifier que la formule apparaît
4. Calculer la dose : `(70 / 10) - (50 / 100) = 6.5`
5. Entrer `6.5` avec le clavier numérique
6. Cliquer sur "Injecter"
7. Vérifier que le patient est guéri
8. Vérifier que la porte est déverrouillée

#### Résultats attendus
- ✅ Formule reçue et affichée
- ✅ Calcul correct : 6.5 mL
- ✅ Message "✓ PATIENT STABILISÉ !"
- ✅ Tension se normalise sur le moniteur
- ✅ Porte déverrouillée

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 12 : ServerRoomScene (Joueur A)

#### Étapes
1. Joueur A clique sur la porte suivante
2. Arrivée dans `ServerRoomScene`
3. Vérifier les racks de serveurs avec LEDs
4. Vérifier le texte chiffré : `8gF#2@kL9$4vT!xZ`
5. Essayer d'entrer une clé incorrecte
6. Vérifier le message d'erreur
7. Attendre que Joueur B transmette `V1T4L`
8. Entrer `V1T4L`
9. Vérifier le déchiffrement
10. Vérifier que le code `8417` apparaît
11. Entrer `8417`
12. Vérifier que la porte est déverrouillée

#### Résultats attendus
- ✅ Serveurs avec LEDs clignotantes
- ✅ Texte chiffré visible
- ✅ Message d'erreur si clé incorrecte
- ✅ Clé `V1T4L` reçue du Joueur B
- ✅ Déchiffrement réussi
- ✅ Code `8417` affiché en vert
- ✅ Porte déverrouillée

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 13 : WaitingRoomScene (Les deux joueurs)

#### Étapes
1. Joueur A clique sur la porte suivante
2. Joueur B clique sur la porte suivante
3. Les deux arrivent dans `WaitingRoomScene`
4. Vérifier les chaises et la table
5. Vérifier les 3 boutons (Rouge, Bleu, Vert)
6. Joueur A voit : `Rouge → Bleu → Vert`
7. Joueur B voit : `Bleu → Vert → Rouge`
8. Communiquer via chat pour déterminer l'ordre
9. Joueur A appuie sur Rouge
10. Joueur B appuie sur Bleu
11. Joueur A appuie sur Vert
12. Joueur B appuie sur Rouge
13. Vérifier que le puzzle est résolu

#### Résultats attendus
- ✅ Les deux joueurs dans la même scène
- ✅ Séquences différentes affichées
- ✅ Boutons cliquables
- ✅ Séquence en cours mise à jour
- ✅ Message "✓ SÉQUENCE COMPLÈTE !"
- ✅ Porte déverrouillée

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 14 : WaitingRoomScene - Test d'Erreur

#### Étapes
1. Réinitialiser le puzzle
2. Joueur A appuie sur Bleu (erreur !)
3. Vérifier l'alarme
4. Vérifier le reset automatique

#### Résultats attendus
- ✅ Message "❌ ERREUR !"
- ✅ Animation d'alarme (flash rouge)
- ✅ Reset après 2 secondes
- ✅ Séquence réinitialisée

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 15 : ExitRoomScene - Choix Identiques (Restituer)

#### Étapes
1. Les deux joueurs cliquent sur la porte suivante
2. Arrivée dans `ExitRoomScene`
3. Vérifier la grande porte de sortie
4. Vérifier la caisse de médicaments
5. Vérifier le message radio
6. Vérifier le timer (30 secondes)
7. Joueur A clique sur "RESTITUER"
8. Joueur B clique sur "RESTITUER"
9. Vérifier l'épilogue "Conscience claire"

#### Résultats attendus
- ✅ Porte de sortie visible
- ✅ Caisse avec croix rouge
- ✅ Message radio affiché
- ✅ Timer décompte de 30 à 0
- ✅ Choix enregistrés
- ✅ Épilogue "💚 Conscience claire"
- ✅ Bouton "Recommencer" fonctionnel

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 16 : ExitRoomScene - Choix Identiques (Voler)

#### Étapes
1. Recommencer le jeu
2. Arriver à `ExitRoomScene`
3. Joueur A clique sur "VOLER"
4. Joueur B clique sur "VOLER"
5. Vérifier l'épilogue "Conscience troublée"

#### Résultats attendus
- ✅ Épilogue "💔 Conscience troublée"
- ✅ Message de fuite dans la nuit
- ✅ Bouton "Recommencer" fonctionnel

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 17 : ExitRoomScene - Choix Divergents

#### Étapes
1. Recommencer le jeu
2. Arriver à `ExitRoomScene`
3. Joueur A clique sur "VOLER"
4. Joueur B clique sur "RESTITUER"
5. Vérifier l'épilogue "Divergence"

#### Résultats attendus
- ✅ Épilogue "⚠️ Trahison mutuelle"
- ✅ Message de divergence
- ✅ Alarme déclenchée
- ✅ Bouton "Recommencer" fonctionnel

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 18 : ExitRoomScene - Timeout

#### Étapes
1. Recommencer le jeu
2. Arriver à `ExitRoomScene`
3. Ne rien faire pendant 30 secondes
4. Vérifier l'épilogue "Timeout"

#### Résultats attendus
- ✅ Timer arrive à 0
- ✅ Épilogue "❌ Échec"
- ✅ Message d'indécision
- ✅ Bouton "Recommencer" fonctionnel

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 19 : Bouton Retour

#### Étapes
1. Dans chaque scène, cliquer sur le bouton "← RETOUR"
2. Vérifier que la transition vers la scène précédente fonctionne

#### Scènes à tester
- [ ] CorridorSceneA → HospitalRoomScene
- [ ] ComputerRoomSceneB → HospitalRoomScene
- [ ] PatientRoomScene → CorridorSceneA
- [ ] MedicineStorageScene → ComputerRoomSceneB
- [ ] ServerRoomScene → PatientRoomScene
- [ ] WaitingRoomScene → ServerRoomScene (Joueur A)
- [ ] WaitingRoomScene → MedicineStorageScene (Joueur B)
- [ ] ExitRoomScene → WaitingRoomScene

#### Résultats attendus
- ✅ Fade out/in fluide
- ✅ Retour à la scène précédente
- ✅ État de la scène préservé

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

### TEST 20 : Persistance du Chat

#### Étapes
1. Envoyer des messages dans chaque scène
2. Vérifier que le chat reste visible
3. Vérifier que les messages sont reçus par l'autre joueur

#### Scènes à tester
- [ ] HospitalRoomScene
- [ ] CorridorSceneA
- [ ] ComputerRoomSceneB
- [ ] PatientRoomScene
- [ ] MedicineStorageScene
- [ ] ServerRoomScene
- [ ] WaitingRoomScene
- [ ] ExitRoomScene

#### Résultats attendus
- ✅ Chat visible dans toutes les scènes
- ✅ Messages reçus en temps réel
- ✅ Scroll automatique fonctionne

#### Résultats obtenus
- [ ] Succès
- [ ] Échec (détails: _________________)

---

## 🐛 BUGS CONNUS

### Liste des bugs à surveiller

| Bug | Priorité | Statut | Description |
|-----|----------|--------|-------------|
| - | - | - | - |

---

## 📊 RÉSUMÉ DES TESTS

### Tests réussis : __ / 20

### Tests échoués : __ / 20

### Bugs critiques : __

### Bugs mineurs : __

---

## 🔧 CHECKLIST DE DÉPLOIEMENT

Avant de déployer en production :

- [ ] Tous les tests passent
- [ ] Aucun bug critique
- [ ] Chat fonctionnel dans toutes les scènes
- [ ] Synchronisation réseau stable
- [ ] Transitions fluides
- [ ] Tous les épilogues testés
- [ ] Performance acceptable (pas de lag)
- [ ] Compatible avec plusieurs navigateurs
- [ ] Responsive (si applicable)
- [ ] Documentation à jour

---

## 📝 NOTES DE TEST

### Session 1 (Date: __________)
**Testeurs:** ________________

**Observations:**
- 
- 
- 

**Bugs trouvés:**
- 
- 

---

### Session 2 (Date: __________)
**Testeurs:** ________________

**Observations:**
- 
- 
- 

**Bugs trouvés:**
- 
- 

---

## 🎯 TESTS DE PERFORMANCE

### Métriques à mesurer

| Métrique | Valeur cible | Valeur mesurée | Statut |
|----------|--------------|----------------|--------|
| Temps de chargement initial | < 3s | ___s | ⏳ |
| FPS moyen | > 30 | ___ | ⏳ |
| Latence réseau | < 200ms | ___ms | ⏳ |
| Temps de transition | < 1s | ___s | ⏳ |
| Mémoire utilisée | < 500MB | ___MB | ⏳ |

---

## 🌐 TESTS DE COMPATIBILITÉ

### Navigateurs à tester

- [ ] Chrome (version: _____)
- [ ] Firefox (version: _____)
- [ ] Edge (version: _____)
- [ ] Safari (version: _____)
- [ ] Opera (version: _____)

### Résolutions à tester

- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (HD)
- [ ] 1280x720 (HD Ready)
- [ ] 800x600 (Minimum)

---

## 🎮 TESTS D'EXPÉRIENCE UTILISATEUR

### Questions à poser aux testeurs

1. **Clarté des objectifs** (1-5) : ___
   - Les objectifs de chaque salle sont-ils clairs ?

2. **Difficulté des puzzles** (1-5) : ___
   - Les puzzles sont-ils trop faciles / trop difficiles ?

3. **Communication** (1-5) : ___
   - La communication entre joueurs est-elle fluide ?

4. **Immersion** (1-5) : ___
   - Vous sentez-vous immergé dans le jeu ?

5. **Satisfaction finale** (1-5) : ___
   - Êtes-vous satisfait de l'expérience globale ?

### Commentaires libres
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

Bon courage pour les tests ! 🧪✨