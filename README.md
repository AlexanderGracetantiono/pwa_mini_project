# PWA Mini Project Tim 8
## Installation  ##

```pnpm
pnpm install
```
OR

```npm
npm install
```

## Build  ##

```pnpm
pnpm build
```
to run do

```cmd
cd dist
```

```cmd
http-server
```
## Vuetify Container 
```javascript
<template>
  <v-container class="bg-surface-variant">
    <v-row no-gutters>
      <v-col sm="12" md="6" lg="3">
        <v-sheet class="pa-2 ma-2">
          Your Content Here
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
```
# What We Code?

## function watchEffect
this function is used for <b>detect changes on the application, example trigger when data added, or refresh page</b>.<br>
we use this watcheffect to get data from firebase storage.<br>
writeUserData is used for update/set/add data on firebase, by ID.<br>
removeUserData is used for remove data on firebase.
```javascript
  const firebaseDB = 'todos/';
  const db = getDatabase();
  const todosRef = dbRef(db, firebaseDB);
  const todos = useDatabaseList(todosRef);

  watchEffect(() => {
   if(todos.value.length>0){
      for (let index = 0; index ; index++) {
         writeToIndexDB(todos.value[index])
      }
   }

   function writeUserData(eventData ) {
   const receipeToAdd = { id: eventData.id, title: eventData.title, description: eventData.description, image: eventData.image  };
   const db = getDatabase();
   set(dbRef(db, firebaseDB + eventData.id),receipeToAdd);
  }

  function removeUserData(idUser) {
    const db = getDatabase();
    set(dbRef(db, firebaseDB + idUser),null);
  }
});
```

## function writeToIndexDB
this function is used for <b>write data from firebase storage to indexDB.</b>
```javascript
  function writeToIndexDB(dataUser){
    const request = indexedDB.open(dbName, 2);
    ...
  }
```

# Firebase
## Using Firebase

``` javascript
import { useDatabaseList } from 'vuefire'
import { getDatabase, set, ref as dbRef } from "firebase/database";
function writeUserData(userId, name, email) {
  console.log('writeUserData',userId);
  const db = getDatabase();
  set(dbRef(db, 'users/' + userId), {
    username: name,
    email: email
  });
}
writeUserData('1','Alex','Alexander@mail.com')
```

## Using Firebase Deploy

```firebase
firebase deploy
```