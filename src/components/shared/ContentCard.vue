<script setup>
defineProps({
   item: Object,
   imageUrl: String,
});

const blobToImageUrl = (event) => {
   return URL.createObjectURL(event);
};
</script>

<template>
   <div class="card-container">
      <div v-if="imageUrl !== null">
         <img :src="blobToImageUrl(imageUrl)" style="width: 100px; height: auto" />
      </div>
      <span class="title-case-style">{{ item.id }}</span>
      <span class="title-case-style">{{ item.title }}</span>
      <p class="title-case-style" v-html="item.description"></p>
   </div>
</template>

<style scoped>
.card-container {
   display: flex;
   align-items: center;
}
.title-case-style {
   font-size: 18px;
   color: black;
   margin-left: 10px;
}
/* .card-container:hover{
  background-color: wheat;
    display: flex;
    align-items: center;
    padding: 10px 20px;
}  */
</style>
