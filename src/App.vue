<template>
  <div id='app'>
    <div id='nav'>
      <router-link to='/'>Home</router-link>
      <router-link to='/topic'>Topic</router-link>
      <router-link to='/about'>About</router-link>
    </div>
    <div id='content'>
      <router-view/>
    </div>
  </div>
</template>

<style lang='postcss' scoped>
@import url('./assets/styles/index.pcss');

#app {
  min-height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#content {
  display: flex;
  min-height: 100vh;
  margin-left: 200px;
  width: 600px;
  margin: auto;
}

#nav {
  display: flex;
  position: fixed;
  flex-direction: column;
  min-height: 100%;
  width: 200px;
  text-align: center;
  background-color: #42b983;

  & > a {
    display: block;
    padding: 10px 20px;
    font-weight: bold;
    color: #2c3e50;
  }

  & > a.router-link-exact-active {
    color: white;
  }
}
</style>
