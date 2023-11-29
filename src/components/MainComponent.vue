<template>
   <div style="padding: 15px 20px">
      <div class="header-class">
         <span class="header-title">Receipe</span>

         <v-dialog v-model="isModalAdd" width="auto">
            <v-card>
               <v-card-text>
                  <v-row no-gutters>
                     <!-- <v-col sm="12" md="3" lg="4">
                        <v-sheet class="pa-2 ma-2">
                           <span class="header-title">Title</span>
                        </v-sheet>
                     </v-col>
                     <v-col sm="12" md="9" lg="8">
                        <v-sheet class="pa-2 ma-2"> <input class="input-style" v-model="titleInput" placeholder="Title" /><br /> </v-sheet>
                     </v-col> -->

                     <span style="margin-top: 20px" class="header-title">Title</span>
                     <input style="margin-top: 10px" class="input-style" v-model="titleInput" placeholder="Title" />
                  </v-row>

                  <v-row no-gutters>
                     <!-- <v-col sm="12" md="3" lg="4">
                        <v-sheet class="pa-2 ma-2">
                           <span class="header-title">Description</span>
                        </v-sheet>
                     </v-col>
                     <v-col sm="12" md="9" lg="8">
                        <textarea name="" id="" cols="30" rows="4" class="input-style" placeholder="Description" v-model="descriptionInput"></textarea>
                        <v-textarea variant="filled" class="input-style" auto-grow label="Four rows" rows="4" row-height="30" shaped v-model="descriptionInput"></v-textarea>

                        <v-sheet class="pa-2 ma-2"> <input class="input-style" v-model="descriptionInput" placeholder="Description" /><br /> </v-sheet>
                     </v-col> -->

                     <span style="margin-top: 20px" class="header-title">Description</span>
                     <textarea style="margin-top: 10px" name="" id="" cols="30" rows="4" class="input-style" placeholder="Description" v-model="descriptionInput"></textarea>
                  </v-row>

                  <div style="margin-top: 20px" v-if="!isHaveImage">
                     <span class="header-title">Image</span>
                     <br />

                     <div v-if="isOpenCamera">
                        <div style="margin-top: 10px">
                           <video ref="video" muted autoplay controls class="h-100 w-auto" />
                           <div v-if="capturedImage">
                              <img :src="capturedImage" alt="Captured" />
                           </div>
                           <button @click="enabled = !enabled">
                              {{ enabled ? "Stop" : "Start" }}
                           </button>
                           <button @click="takePicture" :disabled="!enabled">Take Picture</button>
                           <button @click="handleCloseCamera">Cancel</button>
                        </div>
                     </div>

                     <div v-if="!isOpenCamera">
                        <div style="margin-top: 10px">
                           <v-menu transition="slide-y-transition" style="width: 100%; margin-top: 10px">
                              <template v-slot:activator="{ props }">
                                 <v-btn class="button-dialog" v-bind="props"> Input file </v-btn>
                              </template>
                              <v-list>
                                 <button style="width: 100%" @click="handleOpenCamera">Open Camera</button>
                                 <v-file-input label="File input" capture="user" type="file" v-on:change="onFileUploaded" accept="image/*"></v-file-input>
                              </v-list>
                           </v-menu>
                        </div>
                     </div>
                  </div>

                  <div v-if="isHaveImage" style="margin-top: 20px">
                     <span class="header-title">Image Preview</span>
                     <br />

                     <div style="margin-top: 10px">
                        <img :src="previewImage" style="width: 100px; height: auto" />

                        <button @click="resetImage">edit</button>
                     </div>
                  </div>

                  <div style="margin-top: 20px">
                     <v-btn class="button-dialog" style="width: 100%" v-if="isEdit" variant="tonal" text="Edit Data" v-bind:disabled="titleInput == ''" @click="updateDataSubmit"></v-btn>

                     <v-btn class="button-dialog" style="width: 100%" v-if="!isEdit" variant="tonal" text="Submit Data" v-bind:disabled="titleInput == ''" @click="addData"></v-btn>
                  </div>
               </v-card-text>
            </v-card>
         </v-dialog>

         <v-btn color="primary" @click="changeToAddUser"> Add Step </v-btn>
      </div>

      <div v-for="item in receipe" :key="item.id">
         <div class="view-data-container">
            <ComponentCard :imageUrl="item.image" :item="item" />
            <div>
               <button style="margin-right: 10px" v-on:click="deleteData(item.id)">Delete Data</button>
               <button
                  style="margin-right: 10px"
                  v-on:click="
                     () => {
                        updateDataChanges(item);
                     }
                  "
               >
                  Update Data
               </button>
            </div>
         </div>
      </div>

      <div v-if="!receipe.length" class="view-data-container">Tidak Ada Data (T_T)</div>
   </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import ComponentCard from "./shared/ContentCard.vue";

import { useDevicesList, useUserMedia } from "@vueuse/core";
const currentCamera = ref("");
const { videoInputs: cameras } = useDevicesList({
   requestPermissions: true,
   onUpdated() {
      if (!cameras.value.find((i) => i.deviceId === currentCamera.value)) currentCamera.value = cameras.value[0]?.deviceId;
   },
});

const video = ref();
const { stream, enabled } = useUserMedia({
   constraints: { video: { deviceId: currentCamera } },
});

const capturedImage = ref("");

const takePicture = () => {
   const canvas = document.createElement("canvas");
   canvas.width = video.value.videoWidth;
   canvas.height = video.value.videoHeight;

   const context = canvas.getContext("2d");
   context.drawImage(video.value, 0, 0, canvas.width, canvas.height);

   capturedImage.value = canvas.toDataURL("image/png");

   isHaveImage.value = true;
};

watchEffect(() => {
   if (video.value) video.value.srcObject = stream.value;
});

// Create Broadcast Channel and listen to messages sent to it
const broadcast = new BroadcastChannel("sw-update-channel");

broadcast.onmessage = (event) => {
   if (event.data && event.data.type === "CRITICAL_SW_UPDATE") {
      // Show "update to refresh" banner to the user.
      const payload = event.data.payload;

      // Log the payload to the console
      console.log(payload);
      //show()
   }
};
// const base_url_1 = "https://my-json-server.typicode.com/AlexanderGracetantiono/json-server-sample/user"
// const base_url_1 = "http://localhost:3000/user"
// const base_url_1 = "https://pokeapi.co/api/v2/pokemon"
// Define reactive variables
const title = ref("Employee of the month");

// input Data
var isEdit = false;
var titleInput = ref("");
var descriptionInput = ref("");
var editDataId = ref("");
var blob;
var previewImage = ref(null);

const dbName = "IndexDBAxe";
const tableName = "tableName";
const addedData = ref(null);
const updatedData = ref(null);
let isModalAdd = ref(false);
let isHaveImage = ref(false);
let isOpenCamera = ref(false);

const onFileUploaded = (event) => {
   blob = new Blob([event.target.files[0]]);
   previewImage.value = URL.createObjectURL(blob);
   isHaveImage.value = true;
};

function handleOpenCamera() {
   isOpenCamera.value = true;
}

function handleCloseCamera() {
   isOpenCamera.value = false;
}

// SUBMIT DATA
async function addData() {
   const request = indexedDB.open(dbName, 2);

   request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
   };

   request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore(tableName, { keyPath: "id" });
      // objectStore.createIndex("title", "title", { unique: false });
   };

   request.onsuccess = (event) => {
      const db = event.target.result;

      // Check if the object store exists
      if (!db.objectStoreNames.contains(tableName)) {
         console.error("Object store does not exist:", tableName);
         db.close();
         return;
      }

      const addTransaction = db.transaction(tableName, "readwrite");
      const receipeObjectStore = addTransaction.objectStore(tableName);

      const receipeCount = receipeObjectStore.count();

      receipeCount.onsuccess = function (e) {
         const recordCount = e.target.result;
         const currentTime = new Date();
         const receipeToAdd = { id: currentTime, title: titleInput.value, description: descriptionInput.value, image: blob };

         const addRequest = receipeObjectStore.add(receipeToAdd);

         addRequest.onsuccess = (event) => {
            console.log("Data added successfully");
            addedData.value = "Yes";
         };

         addRequest.onerror = (event) => {
            console.error("Error adding data", event.target.error);
            addedData.value = "No";
         };

         addTransaction.oncomplete = () => {
            console.log("Add transaction completed");
            db.close();
            isModalAdd.value = false;
            readData();
            // writeUserData(receipeToAdd)
            // harusnya fungsi masukin ke server (AXE)
         };
      };
   };
}

// VIEW DATA
var receipe = ref([]);
async function readData() {
   receipe.value = [];
   const request = indexedDB.open(dbName, 2);

   request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(tableName)) {
         db.createObjectStore(tableName, { keyPath: "id" });
      }
   };

   request.onsuccess = (event) => {
      const db = event.target.result;

      const readTransaction = db.transaction(tableName, "readonly");
      const receipeObjectStore = readTransaction.objectStore(tableName);

      const receipeCursor = receipeObjectStore.openCursor();

      receipeCursor.onsuccess = (event) => {
         const cursor = event.target.result;

         if (cursor) {
            receipe.value.push(cursor.value);
            cursor.continue();
         } else {
            console.log("Data read successfully");
            db.close();
         }
      };

      readTransaction.onerror = (event) => {
         console.error("Error opening transaction:", event.target.error);
         db.close();
      };

      receipeCursor.onerror = (event) => {
         console.error("Error opening cursor:", event.target.error);
         db.close();
      };
   };
}

// Update DATA
function changeToAddUser() {
   isEdit = false;
   titleInput.value = "";
   descriptionInput.value = "";
   blob = null;
   previewImage.value = "";
   isModalAdd.value = true;
   isHaveImage.value = false;
}

function resetImage() {
   blob = null;
   previewImage.value = "";
   isHaveImage.value = false;
   isOpenCamera.value = false;
}

async function updateDataChanges(event) {
   console.log("updateDataChanges");
   console.log(event);

   isEdit = true;
   titleInput.value = event.title;
   descriptionInput.value = event.description;
   if (event.image != null) {
      blob = event.image;
      previewImage.value = URL.createObjectURL(blob);
      isHaveImage.value = true;
   } else {
      isHaveImage.value = false;
   }
   editDataId.value = event.id;

   isModalAdd.value = true;
}

async function updateDataSubmit() {
   const request = indexedDB.open(dbName, 2);
   const updatedreceipeData = { id: editDataId.value, title: titleInput.value, description: descriptionInput.value, image: blob };

   request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
   };

   request.onsuccess = (event) => {
      const db = event.target.result;

      const updateTransaction = db.transaction(tableName, "readwrite");
      const receipeObjectStore = updateTransaction.objectStore(tableName);

      const updateRequest = receipeObjectStore.put(updatedreceipeData);

      updateRequest.onsuccess = (event) => {
         console.log("Data updated successfully");
         updatedData.value = "Yes";
      };

      updateRequest.onerror = (event) => {
         console.error("Error updating data", event.target.error);
         updatedData.value = "No";
      };

      updateTransaction.oncomplete = () => {
         console.log("Update transaction completed");
         db.close();
         editDataId.value = "";
         isModalAdd.value = false;
         readData();
      };
   };
}

async function deleteData(itemId) {
   const request = indexedDB.open(dbName, 2);

   request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
   };

   request.onsuccess = (event) => {
      const db = event.target.result;

      const deleteTransaction = db.transaction(tableName, "readwrite");
      const deleteObjectStore = deleteTransaction.objectStore(tableName);

      const deleteRequest = deleteObjectStore.delete(itemId);

      deleteRequest.onsuccess = (event) => {
         console.log("Data deleted successfully");
      };

      deleteRequest.onerror = (event) => {
         console.error("Error deleting data", event.target.error);
      };

      deleteTransaction.oncomplete = () => {
         console.log("Delete transaction completed");
         readData();
         db.close();
      };
   };
}

// TRASH
// Define a function to fetch data
// const fetchData = async () => {
//     try {
//       const response = await fetch('https://pokeapi.co/api/v2/pokemon');
//       if (response.ok) {
//         const data = await response.json();
//         items.value = data['results'];
//         console.log(data);
//       } else {
//         console.error('Failed to fetch data');
//       }
//     } catch (error) {
//       console.error('An error occurred:', error);
//     }
//   };

//   // Call fetchData when the component is mounted
//   onMounted(fetchData);

// async function fetchData(){
//   try {
//     const response = await fetch(base_url_1);
//     if (response.ok) {
//       const data = await response.json();
//       // items.value = data.results;
//     } else {
//       console.error('Failed to fetch data');
//     }
//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }
// async function postData(receipeToAdd){
//   // previewImage.value =  URL.createObjectURL(blob);
//   console.log('postData',receipeToAdd)
//   try {
//     var fd = new FormData();
//     fd.append(name,receipeToAdd.name)
//     fd.append(id,receipeToAdd.id)
//     fd.append(image,receipeToAdd.image)
//     console.log('FD',fd)
//       const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'multipart/form-data' },
//         body: fd
//       };
//     fetch(base_url_1, requestOptions)
//         .then(response => response.json())
//         .then(data => product.value = data);
//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }
// Call fetchData when the component is mounted
// onMounted(readData);
</script>

<style scoped>
@import url("../assets/css/dialog-component.css");
.input-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 10px 20px;
   background-color: white;
}
.input-style {
   width: -webkit-fill-available;
   border-radius: 10px;
   border: 1px black solid;
   padding: 15px 20px;
}
.button-menus {
   width: 100% !important;
}
.input-style-file {
   width: -webkit-fill-available;
   border-radius: 10px;
   /* border: 1px black solid; */
   display: flex;
   align-items: center;
   gap: 20px;
   padding: 15px 20px;
   justify-content: space-between;
}
.input-style:focus {
   border: 3px black solid;
   padding: 15px 20px;
   border-radius: 10px;
}
.preview-container {
   padding: 15px 10px;
   border: 1px black solid;
   border-radius: 20px;
}
.header-class {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 20px 20px;
   background-color: rgb(235, 235, 235);
   margin-top: 10px;
}
.sub-header-class {
   display: flex;
   align-items: center;
   justify-content: space-between;
   background-color: rgb(235, 235, 235);
   margin-top: 10px;
}
.header-title {
   color: black;
   font-size: 18px;
   font-weight: 600;
}
.view-data-container {
   background-color: white;
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 10px 20px;
}
.view-data-container:hover {
   background-color: #9ad0c2;
   display: flex;
   align-items: center;
   padding: 10px 20px;
}
.edit-form-container {
   background-color: rgb(181, 250, 253);
   padding: 20px 10px;
   border-bottom: 5px solid gray;
}
</style>
