# Welcome to the FinessHabits project / Bienvenue au projet FitnessHabits

#### 1- Cloner la branche `7-icône-splash-screen` du projet fitnesshabits:  
```
   git clone --single-branch --branch 7-icône-splash-screen https://gitlab.info.uqam.ca/trudel_syl/fitnesshabits.git fithab
```

#### 2- Entrer dans le répertoire `fithab`

#### 3- Entrer les commandes:
```
   $ npm install
   $ npm run build  
```

#### 4- Créer les dossiers `ios` et `android` avec:
```
   $ npx cap add android 
   $ npx cap add ios      
```

#### 5.1- Pour Android:
```
   1- Supprimer le fichier 'fithab/android/app/src/main'. 
   2- Ajouter le fichier 'fithab/main', dans 'fithab/android/app/src'.  
   3- Entrer 'npx cap open android' pour ouvrir Android Studio
   4- Compiler le code et tester dans un simulateur.  
```

#### 5.2- Pour iOS:
```
   1- Supprimer le fichier 'fithab/ios/App/App'.  
   2- Ajouter le fichier 'fithab/App', dans 'fithab/ios/App'.  
   3- Ouvrire xcode avec 'npx cap open ios'.  

   4. Dans Xcode:
      1- Supprimer le fichier 'App/App/LaunchScreen.storyboard'.
      2- Faire un drag and drop du fichier 'fithab/ios/App/App/LaunchScreen.storyboard' dans le dossier 'App/App' dans Xcode.
      3- Un pop-up apparaît, cliquer sur 'finish' pour accepter le changement.  
      4- Compiler le code et tester dans un simulateur.  
```





