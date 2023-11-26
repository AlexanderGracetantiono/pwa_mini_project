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
## Vuetify Container
```vue
<template>
  <v-container class="bg-surface-variant">
    <v-row no-gutters>
      <v-col sm="12" md="6" lg="3">
        <v-sheet class="pa-2 ma-2">
          .v-col-auto
        </v-sheet>
      </v-col>
      <v-col sm="12" md="6" lg="3">
        <v-sheet class="pa-2 ma-2">
          .v-col-auto
        </v-sheet>
      </v-col>
      <v-col sm="12" md="6" lg="3">
        <v-sheet class="pa-2 ma-2">
          .v-col-auto
        </v-sheet>
      </v-col>
      <v-col sm="12" md="6" lg="3">
        <v-sheet class="pa-2 ma-2">
          .v-col-auto
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
```