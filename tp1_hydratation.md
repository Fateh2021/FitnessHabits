## Sprint 1

<u>**Ce qui va être implémenté**</u>

1. **Modification de l’esthétique du bouton *Hydratation* (voir *image 1*)** 

	Nous allons modifier l’esthétique du bouton *hydratation* pour qu’il 	corresponde à celui de la maquette.

2. **Fenêtre modale pour *hydratation* (voir *image 2*)** 

	Nous allons modifier le comportement du bouton d’hydratation pour qu’il fasse apparaître une fenêtre modale lorsque l’utilisateur clique dessus. Cette fenêtre ressemblera le plus possible à celle de la maquette.

<br>

<u>**Ce qui ne va pas être implémenté**</u>

1. **Modification de l’esthétique des boutons des autres modules**

	L'esthétique des boutons de chaque module doit être refait mais nous ferons seulement celui d’hydratation.

2. **Fenêtre modale des autres modules**

	Chaque module doit avoir sa propre fenêtre modale avec ses propres fonctionnalités, mais nous allons seulement faire celle d’hydratation.

## Sprint 2 

<u>**Ce qui va être implémenté**</u>

1. **Ajout du bouton *settings* (voir *image 2 et 3*)** 

	Nous allons ajouter un bouton ***settings*** dans la fenêtre modale réalisée lors du premier sprint et lorsque l’utilisateur clique dessus, il va être redirigé vers la page ***settings*** pour *hydratation*.

2. **Page *settings* (voir *image 3*)** 

	Nous allons reproduire une partie de la page ***settings*** pour *hydratation* présentée dans la maquette. Lors de ce sprint, nous allons inclure la liste de breuvage.

<br>

<u>**Ce qui ne va pas être implémenté**</u>

1. **Le bouton d’alertes de la page *settings* (voir *image 3*)**

	La page ***settings*** contient un bouton d’alerte

2. **Le graphique de la page *settings* (voir *image 3*)**

	La page ***settings*** contient un graphique qui illustre des informations liées à l’hydratation de l’utilisateur.

## Sprint 3 

<u>**Ce qui va être implémenté**</u>

1. **Le bouton d’alertes de la page settings (voir *image 3*)**

	La page ***settings*** contient un bouton d’alerte

2. **Le graphique de la page settings (voir *image 3*)**

	La page ***settings*** contient un graphique qui illustre des informations liées à l’hydratation de l’utilisateur.

3. **Ajout de breuvage**  

	En essayant d’ajouter un breuvage à un utilisateur, on s’est rendu compte que le bouton pour les protéines ne semble pas bien fonctionner et des fois les breuvages ne sont pas ajoutés. Nous voulons régler ce problème.

<br>

<u>**Ce qui ne va pas être implémenté (voir *image 3*)**</u>

1. **Bouton d’alerte opérationnel**

	Le bouton implémenté ne sera pas opérationnel. On fait seulement la partie visuelle.

2. **Graphique opérationnel**

	Le graphique implémenté ne sera pas opérationnel, on fait seulement la partie visuelle.
	

## **Partie A**

L’exigence de départ de notre projet est la refonte de l'interface utilisateur du module *hydratation* en utilisant comme guide et norme de conception les maquettes présentées en classe.



## **Partie B**

Voici les maquettes que nous voulons reproduire lors de notre sprint :

**Sprint 1** :  ![sprint_1_hydratation](/img/sprint_1_hydratation.png)







**Sprint 2 et 3 :**

![sprint_2_hydratation](/img/sprint_2_hydratation.png)
![sprint_3_hydratation](/img/sprint_3_hydratation.png)











## **Partie C**
<center><h3>Dictionnaire de données </h3> </center>

|Nom|Type|Longueur|Exigé|Format|Description|
| :-: | :-: | :-: | :-: | :-: | :-: |
|Nom du breuvage|Texte|20|Oui| |Le nom du breuvage|
|Diminutif du breuvage|Texte|5|Non| |Une abréviation du nom du breuvage|
|Quantité du breuvage bu|Double|6|Oui| |La quantité de breuvage lorsqu’on le rentre dans l’application|
|Mesures| | |Oui| |Menu déroulant|
|Verre|Texte| | | |Généralement environ 250 ml|
|Tasse|Texte| | | |Généralement environ 240 ml|
|Bouteille|Texte| | | |Généralement environ 500 ml|
|Millilitre|Double|6|Oui| |Unité de mesure de volume valant 10−3 litre (mL)|
|Litre|Double|6|Non| |Unité de capacité pour les liquides valant 1 décimètre cube (L)|
|Gramme|Double|6|Oui| |Unité de masse équivalant à un millième de kilogramme|
|Protéines|Double|6|Oui| |Macromolécule constituée par l'association d'acides aminés unis entre eux par une liaison peptidique.|
|Glucides|Double|6|Oui| |Composant fondamental de la matière vivante,constitué de carbone, d'hydrogène et d'oxygène, jouant dans l'organisme un rôle énergétique.|
|Fibres|Double|6|Oui| |Substance résiduelle d'origine végétale non digérée par les enzymes du tube digestif.|
|Gras|Double|6|Oui| |Qui est formé de graisse ou qui en contient.|
|Cible|Double| |Non| |But ou objectif qu’on cherche à atteindre ou à identifier.|
|Limite|Double| |Non| |Borne, point au-delà duquel on ne devrait pas dépasser.|
|Quantités totales| | | | |Menu|
|Bu par jour|Double| |Non| |Somme des quantités de breuvage bues durant une journée|
|Bu par semaine|Double| |Non| |Somme des quantités bues par jour durant une semaine|
|Bu par mois|Double| |Non| |Somme des quantités bues par jour durant un mois|
|Bu par trimestre|Double| |Non| |Somme des quantités bues par mois durant un trimestre|
|Bu par semestre|Double| |Non| |Somme des quantités bues par mois durant un semestre|
|Bu par année|Double| |Non| |Somme des quantités bues par mois durant une année|
|Date|Date|6|Oui|DD/MM/YY|Indication précise du jour, du mois et de l'année|
|Heure|Time|6|Oui|HH:MM|Unité de temps valant 3 600 secondes, soit soixante minutes, contenues 24 fois dans un jour|
<br>
Référence: Dictionnaire Larousse

