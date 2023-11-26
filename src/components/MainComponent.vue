<template>
  <div style="padding: 15px 20px;">
   
     <div class="header-class">
        <span class="header-title">Employee of the Month</span>
        <v-dialog width="80%">
          <template v-slot:activator="{ props }">
            <v-btn variant="tonal" v-bind="props" text="Add"> </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card title="Add Employee" >
              <v-container>
                <v-row no-gutters>
                  <v-col sm="12" md="3" lg="4">
                    <v-sheet class="pa-2 ma-2">
                      <span class="header-title">Employee Name</span>
                    </v-sheet>
                  </v-col>
                  <v-col sm="12" md="9" lg="8">
                    <v-sheet class="pa-2 ma-2">
                      <input  class="input-style" v-model="nameInput" placeholder="Username" /><br>
                    </v-sheet>
                  </v-col>
                  <v-col sm="12" md="3" lg="4">
                    <v-sheet class="pa-2 ma-2">
                      <span class="header-title">Profile Image</span>
                    </v-sheet>
                  </v-col>
                  <v-col sm="12" md="9" lg="8">
                    <v-sheet class="pa-2 ma-2">
                      <video ref="video" muted autoplay controls class="h-100 w-auto" />
                      <div v-if="capturedImage">
                        <img :src="capturedImage" alt="Captured" />
                      </div>
                      <button @click="enabled = !enabled">
                        {{ enabled ? "Stop" : "Start" }}
                      </button>
                      <button @click="takePicture" :disabled="!enabled">
                        Take Picture
                      </button>


                      <v-file-input
                        label="File input"
                        outlined
                        dense
                        capture="user"
                        type="file" v-on:change="onFileUploaded"
                        accept="image/*"
                      ></v-file-input>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-container>
              <div v-if="previewImage" class="preview-container">
                <img :src="previewImage" style="width: 200px; height: auto;"/>
              </div>
              <v-card-actions>
                <v-btn
                  variant="tonal" 
                  text="Submit Data"
                  v-bind:disabled="!previewImage"
                  @click="addData"
                ></v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  text="Close Dialog"
                  @click="isActive.value = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <!-- <template v-slot:activator="{ props }">
          <v-btn v-bind="props" text="Add user"> </v-btn>
        </template> -->
     </div>

    <ListDataComponent/>
    <div v-if="!customers.length && isShowData" class="view-data-container">Tidak Ada Data (T_T)</div>
  </div>
</template>
<style scoped>
.input-container{
  display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    background-color: white;
}
.input-style{
  width: -webkit-fill-available;
    border-radius: 10px;
    border: 1px black solid;
    padding: 15px 20px;
}
.input-style-file{
    width: -webkit-fill-available;
    border-radius: 10px;
    /* border: 1px black solid; */
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 15px 20px;
    justify-content: space-between;
}
.input-style:focus{
  border: 3px black solid;
    padding: 15px 20px;
    border-radius: 10px;
}
.preview-container{
  padding: 15px 10px;
  border: 1px black solid;
  border-radius: 20px;
}
.header-class{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
  background-color: rgb(235, 235, 235);
  margin-top: 10px;
}
.sub-header-class{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(235, 235, 235);
  margin-top: 10px;
}
.header-title{
  color: black;
  font-size: 18px;
  font-weight: 600;
}
.view-data-container{
  background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
}
.view-data-container:hover{
  background-color: #9AD0C2;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    
}
.edit-form-container{
  background-color: rgb(181, 250, 253);
  padding: 20px 10px;
  border-bottom: 5px solid gray;
}
</style>

<script setup>
import { ref, onMounted, watchEffect  } from 'vue';
import ListDataComponent from './shared/ComponentList.vue'
// camer
import { useDevicesList, useUserMedia } from '@vueuse/core'
const currentCamera = ref('')
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

const video = ref()
const { stream, enabled } = useUserMedia({
  constraints: { video: { deviceId: currentCamera } },
})

const capturedImage = ref('')

const takePicture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.value.videoWidth;
  canvas.height = video.value.videoHeight;

  const context = canvas.getContext('2d');
  context.drawImage(video.value, 0, 0, canvas.width, canvas.height);

  capturedImage.value = canvas.toDataURL('image/png');
}

watchEffect(() => {
  if (video.value)
    video.value.srcObject = stream.value
})


// Create Broadcast Channel and listen to messages sent to it
const broadcast = new BroadcastChannel('sw-update-channel');

broadcast.onmessage = (event) => {
  if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
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
const title = ref('Employee of the month');

// input Data
var isEdit= false;
var isShowData= false;
var nameInput = ref('');
var nameKey = ref('');
var blob;
var previewImage = ref(null);

const dbName = "IndexDBAxe";
const tableName = "user_company";
const addedData = ref(null);
const updatedData = ref(null);
const deletedData = ref(null);

const blobToImageUrl=(event)=>{
    return URL.createObjectURL(event);
}

const onFileUploaded= (event)=> {
    blob = new Blob([event.target.files[0]]); 
    previewImage.value =  URL.createObjectURL(blob);
}

// SUBMIT DATA
async function addData() {

  const request = indexedDB.open(dbName, 2);
  var customerToAdd = { ssn: 1, name: nameInput.value,image:blob};
  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore(tableName, { keyPath: "ssn" });
    objectStore.createIndex("name", "name", { unique: false });
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const addTransaction = db.transaction(tableName, "readwrite");
    const customerObjectStore = addTransaction.objectStore(tableName);
    const customerCount = customerObjectStore.count();
    customerCount.onsuccess = function (e) {
        var recordCount = e.target.result;
        customerToAdd = { ssn:( recordCount+1), name: nameInput.value,image:blob};
        const addRequest = customerObjectStore.add(customerToAdd);
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
          readData()
          // writeUserData(customerToAdd)
          // harusnya fungsi masukin ke server (AXE)
        };
    };
  };
}

// VIEW DATA
var customers = ref([]);
async function readData(){
isShowData = true
customers.value=[]
const request = indexedDB.open(dbName, 2);

request.onerror = (event) => {
  console.error("Error opening database:", event.target.error);
};

request.onsuccess = (event) => {
  const db = event.target.result;

  const readTransaction = db.transaction(tableName, "readonly");
  const customerObjectStore = readTransaction.objectStore(tableName);

  const customersCursor = customerObjectStore.openCursor();

  customersCursor.onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      customers.value.push(cursor.value);
      cursor.continue();
    } else {
      console.log("Data read successfully");
      db.close();
    }
  };

  customersCursor.onerror = (event) => {
    console.error("Error reading data", event.target.error);
    db.close();
  };
};
}

// Update DATA
function changeToAddUser(){
  isEdit = false;
  nameInput.value = '';
  nameKey.value = '';
  blob = null;
  previewImage.value =  '';
}
async function updateDataChanges(event) {
  isEdit = true;
  nameInput.value = event.name;
  nameKey.value = event.ssn;
  blob = event.image;
  previewImage.value =  URL.createObjectURL(blob);
}

async function updateDataSubmit() {
  const request = indexedDB.open(dbName, 2);
  const updatedCustomerData = { ssn: nameKey.value, name: nameInput.value,image:blob};

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const updateTransaction = db.transaction(tableName, "readwrite");
    const customerObjectStore = updateTransaction.objectStore(tableName);

    const updateRequest = customerObjectStore.put(updatedCustomerData);

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
      readData();
    };
  };
};

// DELETE DATA
async function deleteData(eventData) {
  console.log('event Deltet',eventData)
  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const deleteTransaction = db.transaction(tableName, "readwrite");
    const deleteObjectStore = deleteTransaction.objectStore(tableName);
    const deleteRequest = deleteObjectStore.delete(eventData);

    deleteRequest.onsuccess = (event) => {
      console.log("Data deleted successfully");
      deletedData.value = "Yes";
    };

    deleteRequest.onerror = (event) => {
      console.error("Error deleting data", event.target.error);
      deletedData.value = "No";
    };

    deleteTransaction.oncomplete = () => {
      console.log("Delete transaction completed");
      db.close();
      readData();
    };
  };
};
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
// async function postData(customerToAdd){
//   // previewImage.value =  URL.createObjectURL(blob);
//   console.log('postData',customerToAdd)
//   try {
//     var fd = new FormData();
//     fd.append(name,customerToAdd.name)
//     fd.append(ssn,customerToAdd.ssn)
//     fd.append(image,customerToAdd.image)
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
onMounted();
</script>