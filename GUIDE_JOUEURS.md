# 🎮 GUIDE DES JOUEURS - ESCAPE GAME COOPÉRATIF

Bienvenue dans l'Escape Game Coopératif ! Ce guide vous aidera à comprendre comment jouer et réussir votre mission.

---

## 📖 HISTOIRE

Vous êtes deux agents infiltrés dans un hôpital pour récupérer des médicaments vitaux. Malheureusement, vous vous êtes fait repérer et l'alarme va bientôt se déclencher. Vous devez vous échapper avant l'arrivée des gardes !

**⏰ Temps estimé de jeu : 20-30 minutes**

---

## 🎯 OBJECTIF

**Échapper de l'hôpital en résolvant des énigmes coopératives avant que les gardes n'arrivent.**

⚠️ **IMPORTANT** : Ce jeu nécessite **EXACTEMENT 2 JOUEURS** qui doivent **communiquer constamment** via le chat intégré.

---

## 🚀 COMMENT DÉMARRER

### Étape 1 : Connexion
1. Ouvrez le jeu dans votre navigateur
2. Entrez votre **pseudo** (ex: Alex, Jordan, etc.)
3. Entrez un **code de salle** (ex: ROOM-TEST)
4. Cliquez sur **"Rejoindre la partie"**

### Étape 2 : Attente du partenaire
- Attendez que votre partenaire rejoigne la même salle
- Vous verrez apparaître les deux joueurs dans la liste
- Le **Joueur A** (rouge) et le **Joueur B** (bleu) ont des rôles différents

### Étape 3 : Démarrage
- L'un des deux joueurs clique sur **"Démarrer la partie"**
- Le jeu commence pour les deux joueurs simultanément

---

## 🗺️ PARCOURS DU JEU

### 🏥 Salle 1 : Chambre d'Hôpital (Commune)
**Joueurs : A + B ensemble**

- Vous commencez tous les deux dans la même chambre
- Lisez les instructions à l'écran
- Choisissez votre porte :
  - **Joueur A** → Porte de gauche (rouge)
  - **Joueur B** → Porte de droite (bleue)

💡 **Astuce** : Communiquez pour confirmer qui prend quelle porte !

---

### 🚪 Parcours Joueur A (Rouge)

#### Salle 2A : Couloir Sombre
**🔒 Énigme : Porte verrouillée**

- Vous trouvez une porte verrouillée
- Le panneau électrique est hors service
- **❌ Vous ne pouvez PAS progresser seul !**

**💬 Communication requise :**
- Dites au Joueur B : *"Je suis bloqué, il n'y a pas de courant !"*
- Attendez que le Joueur B rétablisse le courant
- ✅ La porte s'ouvrira automatiquement

---

#### Salle 3A : Chambre du Patient
**🤒 Énigme : Soigner le patient**

Vous trouvez un patient malade qui bloque la sortie. Vous devez lui administrer le bon dosage de médicament.

**📋 Informations disponibles :**
- Poids du patient : **70 kg**
- Âge du patient : **50 ans**
- Seringue graduée (0-10 mL)

**❌ Problème :** Vous n'avez PAS la formule de calcul !

**💬 Communication requise :**
- Dites au Joueur B : *"J'ai besoin de la formule pour calculer le dosage"*
- Le Joueur B doit trouver la formule dans le stockage
- Attendez qu'il vous transmette : `Dose = (Poids / 10) - (Âge / 100)`

**🧮 Calcul :**
```
Dose = (70 / 10) - (50 / 100)
Dose = 7 - 0.5
Dose = 6.5 mL
```

**✅ Solution :** Entrez **6.5** sur le clavier numérique

---

#### Salle 4A : Salle Serveur
**💻 Énigme : Déchiffrer les fichiers**

Vous trouvez une salle avec 8 serveurs. Un fichier chiffré contient le code de la porte.

**📁 Fichier affiché :**
```
/data/keys/door.enc
Xj9#mK2@pL5$nQ8&rT3...
```

**❌ Problème :** Le fichier est chiffré, vous n'avez PAS la clé !

**💬 Communication requise :**
- Dites au Joueur B : *"J'ai besoin de la clé de déchiffrement"*
- Le Joueur B doit trouver la clé dans le stockage
- Attendez qu'il vous transmette : **V1T4L**

**⌨️ Action :**
1. Entrez **V1T4L** sur le clavier virtuel
2. Le fichier se déchiffre et révèle : **8417**
3. Entrez **8417** sur le pavé numérique
4. ✅ La porte s'ouvre !

---

### 🚪 Parcours Joueur B (Bleu)

#### Salle 2B : Salle Informatique
**💻 Énigme : Terminal Linux + Power Grid**

Vous trouvez un terminal Linux et un panneau de contrôle électrique.

**🔍 Exploration :**
- Regardez autour de vous
- Trouvez le **post-it jaune** collé sur le mur
- Il contient le mot de passe : **admin123**

**⚠️ Leçon de cybersécurité :** Ne JAMAIS noter les mots de passe sur des post-its !

**⌨️ Commandes Terminal :**
```bash
$ login
Username: admin
Password: admin123

$ ls
power_grid.exe  logs.txt  config.ini

$ ./power_grid.exe
[POWER GRID] Activating main generator...
[SUCCESS] Power restored to all sectors!
```

**✅ Résultat :** Le courant est rétabli → Le Joueur A peut progresser !

**💬 Communication requise :**
- Dites au Joueur A : *"J'ai rétabli le courant, tu peux avancer !"*

---

#### Salle 3B : Stockage de Médicaments
**📦 Énigme : Trouver les informations**

Vous trouvez le stockage avec des étagères de médicaments et des documents.

**🔍 Objets interactifs :**

1. **📄 Document "Formule de dosage"**
   - Contient : `Dose = (Poids / 10) - (Âge / 100)`
   - **💬 Transmettez au Joueur A !**

2. **🔑 Post-it "Clé de chiffrement"**
   - Contient : **V1T4L**
   - **💬 Transmettez au Joueur A !**

3. **📦 Caisse de médicaments**
   - Vous la prenez avec vous (important pour la fin !)

**💬 Communication requise :**
- Dites au Joueur A : *"La formule est : Dose = (Poids / 10) - (Âge / 100)"*
- Dites au Joueur A : *"La clé de déchiffrement est : V1T4L"*

---

### 🤝 Salles Communes (A + B)

#### Salle 5 : Salle d'Attente
**🎮 Énigme : Synchronisation des boutons**

Vous vous retrouvez tous les deux dans une salle d'attente avec un panneau de contrôle.

**🎨 Panneau de contrôle :**
- 3 boutons colorés : **Rouge**, **Bleu**, **Vert**
- Chaque joueur voit une séquence différente !

**👁️ Ce que vous voyez :**
- **Joueur A** voit : Rouge → Bleu → Vert
- **Joueur B** voit : Bleu → Vert → Rouge

**🧩 La vraie séquence :**
```
Rouge → Bleu → Vert → Rouge
```

**💬 Communication requise :**
- Partagez ce que vous voyez
- Déduisez ensemble la séquence complète
- Appuyez sur les boutons dans le bon ordre

**⚠️ Attention :**
- Si vous vous trompez → Alarme + Reset
- Les deux joueurs voient les actions de l'autre en temps réel

**✅ Solution :**
1. Joueur A appuie sur **Rouge**
2. Joueur A appuie sur **Bleu**
3. Joueur A appuie sur **Vert**
4. Joueur B appuie sur **Rouge**
5. 🎉 La porte s'ouvre !

---

#### Salle 6 : Sortie (Finale)
**⚖️ Énigme : Dilemme moral**

Vous arrivez à la sortie avec la caisse de médicaments volée.

**⏰ Compte à rebours : 30 secondes**

**🤔 Choix à faire :**
- 🔴 **VOLER** les médicaments (bouton rouge)
- 🟢 **RESTITUER** les médicaments (bouton vert)

**⚠️ Important :**
- Chaque joueur fait son propre choix
- Les choix sont révélés simultanément
- Il y a **4 fins possibles** selon vos décisions

---

## 🎬 LES 4 FINS POSSIBLES

### 🌑 Fin 1 : "Conscience Troublée"
**Condition :** Les deux joueurs choisissent de **VOLER**

```
Vous avez réussi à vous échapper avec les médicaments.
Mais à quel prix ? Ces médicaments étaient destinés à sauver des vies.
Vous entendez l'alarme retentir derrière vous...
Votre conscience vous hantera longtemps.

🏃 Vous fuyez dans la nuit, riches mais coupables.
```

---

### ✨ Fin 2 : "Conscience Claire"
**Condition :** Les deux joueurs choisissent de **RESTITUER**

```
Vous avez choisi de restituer les médicaments.
La mission a échoué, mais vous avez fait le bon choix.
Ces médicaments sauveront des vies innocentes.

🌟 Vous partez la tête haute, pauvres mais honorables.
```

---

### 💔 Fin 3 : "Trahison"
**Condition :** Un joueur **VOLE**, l'autre **RESTITUE**

```
Vous n'êtes pas d'accord sur la décision finale !
L'alarme se déclenche à cause de votre hésitation.
Vous devez fuir séparément, chacun de votre côté.

😔 La confiance entre vous est brisée à jamais.
```

---

### 🚨 Fin 4 : "Échec"
**Condition :** Le temps s'écoule (30 secondes)

```
Vous avez trop hésité !
Les gardes arrivent et vous encerclent.
Vous êtes capturés avec les médicaments volés.

🚔 Mission échouée. Vous êtes arrêtés.
```

---

## 💡 CONSEILS STRATÉGIQUES

### Communication
- 🗣️ **Parlez constamment** via le chat
- 📝 **Partagez toutes les informations** que vous trouvez
- ⏰ **Coordonnez vos actions** pour gagner du temps

### Exploration
- 🔍 **Cliquez sur tout** ce qui semble interactif
- 📄 **Lisez tous les documents** attentivement
- 🎨 **Observez les couleurs** et les symboles

### Résolution d'énigmes
- 🧮 **Notez les chiffres** importants (poids, âge, codes)
- 🔑 **Cherchez les mots de passe** sur les post-its
- 🤝 **Travaillez ensemble** - aucune énigme n'est solo !

### Gestion du temps
- ⚡ **Ne perdez pas de temps** à chercher seul
- 💬 **Demandez de l'aide** si vous êtes bloqué
- 🎯 **Restez concentrés** sur l'objectif

---

## 🎓 LEÇONS ÉDUCATIVES

Ce jeu enseigne plusieurs concepts importants :

### 🔐 Cybersécurité
- **Ne jamais** noter les mots de passe sur des post-its
- Importance du **chiffrement** des données sensibles
- Protection des **données de santé** (RGPD)

### 💉 Éthique Médicale
- Importance du **dosage précis** des médicaments
- Le patient comme **être humain**, pas un obstacle
- **Coordination d'équipe** dans le milieu médical

### ⚖️ Morale et Éthique
- Dilemme entre **intérêt personnel** et **bien commun**
- **Conséquences** de nos choix
- Importance de la **confiance** dans une équipe

---

## ❓ FAQ

### Q : Peut-on jouer à plus de 2 joueurs ?
**R :** Non, le jeu est conçu pour exactement 2 joueurs. Les énigmes sont basées sur cette contrainte.

### Q : Peut-on jouer seul ?
**R :** Non, les énigmes nécessitent la coopération de deux joueurs. Certaines informations ne sont accessibles que par un seul joueur.

### Q : Combien de temps dure une partie ?
**R :** Entre 20 et 30 minutes pour une première partie. Les parties suivantes peuvent être plus rapides.

### Q : Peut-on rejouer pour voir les autres fins ?
**R :** Oui ! Il y a 4 fins différentes. Cliquez sur "Recommencer" à la fin pour rejouer.

### Q : Le jeu se sauvegarde-t-il ?
**R :** Non, il n'y a pas de système de sauvegarde. Une partie doit être terminée en une seule session.

### Q : Que faire si on est bloqué ?
**R :** Communiquez avec votre partenaire ! Toutes les énigmes nécessitent des informations des deux joueurs.

---

## 🐛 PROBLÈMES TECHNIQUES

### Le jeu ne se charge pas
- Vérifiez votre connexion Internet
- Actualisez la page (F5)
- Essayez un autre navigateur (Chrome, Firefox, Edge)

### Le chat ne fonctionne pas
- Vérifiez que vous êtes bien connecté à Photon
- Regardez la console (F12) pour les erreurs
- Reconnectez-vous à la salle

### Mon partenaire ne me voit pas
- Assurez-vous d'utiliser le **même code de salle**
- Vérifiez que vous êtes tous les deux connectés
- Actualisez la page si nécessaire

### Les boutons ne répondent pas
- Attendez que la scène soit complètement chargée
- Vérifiez que vous cliquez bien sur les zones interactives
- Essayez de cliquer à nouveau

---

## 🎮 COMMANDES

### Souris
- **Clic gauche** : Interagir avec les objets
- **Survol** : Voir les objets interactifs (changement de couleur)

### Clavier
- **Entrée** : Envoyer un message dans le chat
- **Échap** : Retour (bouton visible dans chaque scène)

### Chat
- Toujours visible en bas à droite pendant la partie
- Tapez votre message et appuyez sur Entrée ou cliquez sur 📤

---

## 🏆 OBJECTIFS DE COMPLÉTION

### 🥉 Bronze : Première Évasion
- Terminez le jeu (n'importe quelle fin)

### 🥈 Argent : Conscience Claire
- Obtenez la fin "Conscience Claire" (les deux restituent)

### 🥇 Or : Speedrun
- Terminez le jeu en moins de 15 minutes

### 💎 Platine : Toutes les Fins
- Débloquez les 4 fins différentes

---

## 📞 SUPPORT

Si vous rencontrez des problèmes ou avez des questions :

- **GitHub Issues** : [Lien vers le repo]
- **Email** : support@escapegame.com
- **Discord** : [Lien vers le serveur]

---

## 🙏 REMERCIEMENTS

Merci d'avoir joué à notre Escape Game Coopératif !

N'hésitez pas à :
- ⭐ **Donner une étoile** sur GitHub
- 💬 **Partager vos retours** dans les issues
- 🎮 **Recommander** le jeu à vos amis

---

<div align="center">

**Bonne chance, agents ! 🕵️‍♂️🕵️‍♀️**

*La communication est la clé de votre succès.*

[🏠 Retour au menu principal](README.md) | [📚 Documentation technique](GAME_IMPLEMENTATION.md) | [🧪 Guide de test](TESTING_GUIDE.md)

</div>