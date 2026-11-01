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
  user-select: none;
  font-family: "メイリオ", "MS Pゴシック", sans-serif;
}

.clearfix::after {
   content: "";
   display: block;
   clear: both;
}

</style>