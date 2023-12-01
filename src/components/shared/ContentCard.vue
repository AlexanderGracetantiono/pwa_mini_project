<script setup>
defineProps({
   item: Object,
   imageUrl: String,
   idx: String,
});

const blobToImageUrl = (event) => {
   return URL.createObjectURL(event);
};
</script>

<template>
   <v-container>
      <v-row>
         <v-col cols="12">
            <p class="title">{{idx}}. {{ item.title }}</p>
         </v-col>
      </v-row>
      <v-row>
         <v-col cols="12">
            <p v-html="item.description"></p>
         </v-col>
      </v-row>
      <v-row>
         <v-col cols="12">
            <img :src="imageUrl" style="width: 100px; height: auto" />
         </v-col>
      </v-row>
   </v-container>
</template>

<style scoped>
.v-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    text-align: justify;
    word-break: break-word;
}

.title {
   font-weight: bold;
}

</style>
