<template>
  <router-view/>
</template>
<style lang="scss">
html {
  height: 100%;
}

body{
  height: 100%;
  margin: 0;
  padding: 10px;
  background-color: #beeffd;
}

.clearfix::after {
   content: "";
   display: block;
   clear: both;
}

</style>