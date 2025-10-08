=== mission_start ===
~ temp hasWalkieTalkie = false

# Salle d'hôpital - Début de mission

Vous ouvrez les yeux dans une salle d'hôpital abandonnée.
La lumière blafarde des néons vacillants éclaire faiblement la pièce.
Des traces de précipitation sont visibles partout.

+ [Examiner la pièce]
    -> examine_room

=== examine_room ===
La salle semble avoir été évacuée en urgence.
Un lit médical renversé, des papiers éparpillés au sol.
Dans un coin, vous apercevez une boîte en carton.
Sur une table près de vous, un talkie-walkie grésille légèrement.

+ [Prendre le talkie-walkie]
    -> take_walkie_talkie
+ [Examiner la boîte]
    -> examine_box

=== take_walkie_talkie ===
~ hasWalkieTalkie = true

Vous saisissez le talkie-walkie. Immédiatement, une voix grésillante se fait entendre.

**Collaborateur PNJ :** "Agent ! Vous m'entendez ? Parfait."

"Écoutez-moi bien. Votre mission est cruciale pour notre organisation."

"Vous êtes dans l'aile abandonnée de l'hôpital Saint-Michel. Nous avons des raisons de croire que des documents classifiés y sont cachés."

"Ces documents contiennent des informations sur des expérimentations médicales illégales. Nous devons les récupérer avant qu'ils ne tombent entre de mauvaises mains."

**Vous :** "Compris. Que dois-je faire ?"

**Collaborateur PNJ :** "J'ai repéré une boîte dans le coin de la pièce où vous êtes. Elle devrait contenir des éléments essentiels :"

"- Une carte de l'hôpital pour vous orienter"
"- Un badge d'accès à la salle informatique"
"- Un post-it avec un mot de passe"

"Récupérez ces objets. Vous en aurez besoin pour accéder aux zones sécurisées."

**Collaborateur PNJ :** "Soyez prudent, agent. La sécurité patrouille encore dans certaines zones."

"Je reste en contact. Bonne chance."

*Le talkie-walkie émet un bip, puis se tait.*

+ [Examiner la boîte maintenant]
    -> examine_box
+ [Explorer davantage la pièce]
    -> explore_more

=== examine_box ===
Vous vous approchez de la boîte en carton.
Elle est fermée par un simple rabat, pas de cadenas.

{hasWalkieTalkie:
    Comme l'a mentionné votre contact, cette boîte devrait contenir des éléments importants.
- else:
    Vous vous demandez ce qu'elle peut contenir.
}

+ [Ouvrir la boîte]
    -> open_box

=== open_box ===
Vous ouvrez la boîte. À l'intérieur, vous trouvez exactement ce qui a été décrit :

📍 **Une carte de l'hôpital** - Annotée avec des zones marquées en rouge
🔖 **Un badge "Salle Info"** - Badge d'accès magnétique
📝 **Un post-it "Mot de passe"** - Avec une série de chiffres : 4782

*Vous pouvez maintenant cliquer sur ces objets pour les ajouter à votre inventaire.*

{hasWalkieTalkie:
    Le talkie-walkie grésille à nouveau.
    
    **Collaborateur PNJ :** "Excellent travail, agent. Vous avez tout ce qu'il faut."
    
    "Votre prochaine étape : rejoindre la salle informatique. Utilisez la carte pour vous orienter."
    
    "Restez vigilant. Bonne chance."
}

-> END

=== explore_more ===
Vous examinez plus attentivement la pièce.

Des dossiers médicaux sont éparpillés au sol. Certains portent la mention "CONFIDENTIEL".
Une fenêtre donne sur une cour intérieure sombre.
La porte de la salle est entrouverte, laissant entrevoir un couloir faiblement éclairé.

+ [Examiner les dossiers médicaux]
    -> examine_files
+ [Regarder par la fenêtre]
    -> look_window
+ [Retourner à la boîte]
    -> examine_box

=== examine_files ===
Vous ramassez quelques dossiers.

Ils concernent des patients ayant participé à des "essais cliniques expérimentaux".
Les dates remontent à plusieurs mois. Certains dossiers sont incomplets.

Une note manuscrite attire votre attention :
*"Protocole 7 - Résultats inquiétants - Voir Dr. Morrison - URGENT"*

Vous rangez les dossiers. Ces informations pourraient être utiles.

+ [Continuer l'exploration]
    -> explore_more

=== look_window ===
Vous vous approchez de la fenêtre.

La cour intérieure est plongée dans l'obscurité.
Vous distinguez vaguement des silhouettes : des véhicules abandonnés, du matériel médical.

Un mouvement attire votre attention. Une lumière de lampe torche balaie la cour.
*La sécurité patrouille.*

Vous vous écartez rapidement de la fenêtre.

+ [Retourner dans la pièce]
    -> explore_more

=== END ===
-> END