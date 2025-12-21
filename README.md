# RecipeMate – Group 25

## Anëtarët e Grupit
- Enis Shabani  
- Lis Spahija  
- Lyra Bullaku  
- Rinesa Selmonaj  
- Shqiperi Mjeku  

## Përshkrimi i Aplikacionit
RecipeMate është një aplikacion mobil i zhvilluar me React Native (Expo) që u mundëson përdoruesve të krijojnë, menaxhojnë dhe shfletojnë receta gatimi. Aplikacioni kombinon autentifikim, ruajtje të të dhënave në cloud, integrim me API të jashtme dhe përdorim të device features, duke ofruar një përvojë moderne dhe të optimizuar për përdoruesin.

## Funksionalitetet Kryesore
RecipeMate u mundëson përdoruesve të krijojnë, shikojnë, përditësojnë dhe menaxhojnë receta personale përmes një ndërfaqeje të thjeshtë dhe intuitive. Aplikacioni përfshin autentifikim të sigurt përmes Firebase me Email/Password dhe Google, ndërsa të dhënat e recetave ruhen dhe menaxhohen në Firebase Firestore përmes operacioneve CRUD. Përmbajtja plotësohet edhe me receta nga burime të jashtme përmes integrimit me TheMealDB API.

Aplikacioni mbështet shtimin e imazheve për receta përmes kamerës ose image picker dhe dërgon njoftime lokale për veprime të caktuara. Navigimi realizohet me Expo Router dhe ndërfaqja është e ndërtuar me fokus në UI/UX të pastër, duke përdorur animacione të lehta për button press, modale dhe përfundim të detyrave. Performanca është e optimizuar përmes përdorimit të FlatList dhe teknikave të memoization në React (useCallback, useMemo, React.memo), ndërsa stabiliteti i aplikacionit është verifikuar përmes testimit bazik, duke përfshirë snapshot tests, interaction tests dhe mocking tests.



## Struktura e Projektit

/app – përmban screens dhe routing-un e aplikacionit duke përdorur Expo Router. Përfshin autentifikimin (login/signup), navigimin kryesor me tabs, si dhe ekranet për shtimin, editimin, shikimin dhe menaxhimin e recetave.

/components – përmban komponentë të ripërdorshëm UI dhe funksionalë si recipe cards, modalet për konfirmim dhe elemente të personalizuara të navigimit.

/contexts – përmban Context API për menaxhimin e gjendjes globale, përfshirë autentifikimin dhe recetat.

/firebase – përmban konfigurimin e Firebase dhe logjikën për autentifikim dhe operacione CRUD me Firestore.

/assets – përmban imazhe, tinguj dhe asete të tjera statike të aplikacionit.

/__tests__ – përmban testet bazike (snapshot dhe interaction tests).


## Udhëzime për Instalimin dhe Ekzekutimin

Instalimi i varësive:
```bash
npm install
```

Start aplikacionin:
```bash
expo start
```

Aplikacioni mund të ekzekutohet në emulator ose në pajisje reale përmes Expo Go.
