<template>
  <div class="wrapper">
    <div v-if="dialog" class="dialog-container">
      <div class="backdrop" @click="closeDialog()"></div>
      <div class="dialog">
        <keep-alive>
          <component :is="currentDialog.name " v-bind="currentDialog.data"></component>
        </keep-alive>
      </div>
    </div>
    <div class="wrapper" :class="{'no-scroll': dialog}">
      <div id="viewport" :class="{home: isHomePage}">
        <header id="header">
          <div id="top-bar">
            <div id="row">
              <div class="navbar-logo">
                <div class="logo-container">
                  <nuxt-link v-if="!isHomePage" to="/">
                    <img src="~assets/img/logo.png">
                  </nuxt-link>
                </div>
              </div>
              <div class="search" :class="{absoluteSearch: !isHomePage, showSearch :toggleSearchBox}"> 
                <button id="searchButton" @click="toggle(1)" class="material-icons">search</button>
                <img v-if="isHomePage" src="~assets/img/logo-big.png">
                <form id="mainSearchBox" @submit.prevent="search">
                    <button id="closeBtn"  class="material-icons" type="button" @click="toggleSearchBox = !toggleSearchBox">close</button>
                    <input v-model="query" autocomplete="off" placeholder="جستجو در مستندات فارسی" id="mainSearchBoxInput" dir="rtl">
                    <span>
                      <button class="btn" id="searchBtn" type="submit">
                        <i class="material-icons">search</i>
                      </button>
                    </span>
                    <!--<span class="advanced-button">
                      <i class="material-icons">settings</i>
                      <span>پیشرفته</span>
                    </span>
                    <span>
                      <button type="button">
                        <i class="material-icons">close</i>
                      </button>
                    </span>-->
                </form>
              </div>
              <div id="userButton" @click="toggle(2)" :class="{toggleMode: !isHomePage}">
                  <thumb v-if= "isLoggedIn" class="avatar" :height="45" file: :width="45"  :link="{name: 'view-id', params: {id: user.id}}"></thumb>
                  <button v-else class="material-icons">account_circle</button>
              </div>
              <div id="userbar" :class="{toggleMode: !isHomePage}">
                <span>
                  <button class="button" @click="changeLingual(lingual == 'fa'? 'en' : 'fa')">{{lingual}}</button>
                  <span v-if="!isLoggedIn" class="login">
                    <button class="button" @click="openLogin()"> ورود </button>
                    <button class="button" @click="openLogin(true)"> عضویت </button>
                  </span>
                  <span v-else>
                    <!--<a class="user-charge btn btn-default btn-sm" href=""><i class="glyphicon glyphicon-usd"></i></a>-->
                    <thumb class="avatar" :height="45"  :width="45"  :link="{name: 'view-id', params: {id: user.id}}">
                        <!--<i class="material-icons">chevron-down</i>-->
                    </thumb>
                    <!--<ul class="dropdown-menu" role="menu" aria-labelledby="user-menu">
                        <li role="presentation"><nuxt-link to="/bookz">تنظیمات کاربری</nuxt-link></li>
                        <li role="presentation"><nuxt-link to="/bookz">کتابخانه</nuxt-link></li>
                        <li role="presentation"><nuxt-link to="/bookz">سازمان جدید</nuxt-link></li>
                        <li role="presentation" class="divider"></li>
                        <li role="presentation"><nuxt-link to="/bookz">خروج</nuxt-link></li>
                    </ul>-->
                    <button class="button" @click="logout()">خروج</button>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div id="hidden-menu" :class="{toggleMode: toggleUserbar && !isHomePage}">
            <div id="arrow">
              <div></div>
              <div></div>
            </div>
            <div id="menu-items" @click="toggleUserbar=false">
              <div><button class="button" @click="changeLingual(lingual == 'fa'? 'en' : 'fa')">{{lingual}}</button></div>
              <div v-if="isLoggedIn"><button class="button" @click="logout()">خروج</button></div>
              <span v-else>
                <div> <button class="button" @click="openLogin()"> ورود </button> </div>
                <div> <button class="button" @click="openLogin(true)"> عضویت </button> </div>
              </span>
            </div>
          </div>
          <div id="main-menu">
            <!--<div id="quick-navigator">
              <a id="go2top">
                <span class="message">ابتدای صفحه</span>
                <i class="material-icons">keyboard_arrow_up</i>
              </a>
              <a id="nebeek-more-info">
                <span class="message">با نبیک بیشتر آشنا شوید</span>
                <i class="material-icons">keyboard_arrow_down</i>
              </a>
            </div>-->
            <div class="menu-items">
              <nuxt-link :to="{ name: 'list-id', params: { id: 'book' }}" id="bookz-menu-item">کتاب</nuxt-link>
              <nuxt-link :to="{ name: 'list-id', params: { id: 'newsstand' }}" id="magz-menu-item">نشریه</nuxt-link>
              <nuxt-link :to="{ name: 'list-id', params: { id: 'academic' }}" id="academicz-menu-item">علمی</nuxt-link>
              <nuxt-link :to="{ name: 'list-id', params: { id: 'student' }}" id="textbookz-menu-item">درسی</nuxt-link>
            </div>
          </div>
        </header>

        <div id="content">
            <nuxt/>
        </div>
        <div id="footer-clear" class="clear"></div>
        <footer id="footer">
          <div class="links">
            <div class="container-full">
              <div class="center-align">
                <nuxt-link to="/about">درباره ما</nuxt-link>
                <nuxt-link to="/rules">قوانین</nuxt-link>
                <nuxt-link to="/policy">حریم خصوصی</nuxt-link>
                <nuxt-link to="/help">راهنما</nuxt-link>
                <nuxt-link to="/partners">برای همکاران</nuxt-link>
                <nuxt-link to="/press">نبیک در رسانه ها</nuxt-link>
                <!--<nuxt-link to="/blog">بلاگ</nuxt-link>-->
              </div>
              <div id="copyright" class="center-align">کلیه حقوق برای وب سایت نبیک محفوظ می باشد.  © 1395</div>
            </div>
          </div>
        </footer>
        <div class="file-uploads">
          <div v-for="file in uploadingFiles" class="uploaded-file">
            <nuxt-link @click="removeFile(file)" :to="{name: 'view-id', params: {id: file.id}}">{{ file.name }} (حجم: {{ file.size }})</nuxt-link>
            <span v-if="!file.isCompleted" class="upload-status">
              <div class="upload-progressbar">
                <div class="upload-progress-indicator" :style="{width: file.progress + '%'}"></div>
              </div>
              <button @click="removeFile(file)">
                <i class="material-icons">close</i>
              </button>
            </span>
            <span v-else class="upload-status">
              <span class="file-error">{{ file.errorMessage }}</span>
              <button @click="removeFile(file)">
                <i class="material-icons">close</i>
              </button>
              <!-- TODO: error dismiss or retry button -->
            </span>
          </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Thumb from '~/components/Thumb.vue'; 
import Login from '~/components/Login.vue'; 

export default {
  data() {
    return {
      query: '',
      toggleSearchBox: false,
      toggleUserbar: false,
    }
  },
  computed: {
    isHomePage() {
      return this.$route.name == 'index';
    },
    uploadingFiles() {
      return this.$store.state.file.files;
    },
    ...mapState([
      'isLoggedIn',
      'user',
      'lingual',
      'dialog'
    ]),
    ...mapGetters(['currentDialog']),
    resetToggles() {
      if(this.isHomePage)
        this.toggleSearchBox = this.toggleUserbar = false;
    }
  },
  components: {
    Thumb,
    Login
  },
  methods: {
    search() {
      this.$router.push({ name: 'search-q', params: { q: this.query }});
    },
    logout() {
      this.$store.dispatch('logout');
    },
    removeFile(file) {
      this.$store.dispatch('file/remove', file);
    },
    ...mapActions(['changeLingual', 'closeDialog', 'openDialog']),
    toggle(num) {
      if(num == 1){
        this.toggleSearchBox = !this.toggleSearchBox;
        this.toggleUserbar = false;
      }else{
        this.toggleUserbar = !this.toggleUserbar;
        this.toggleSearchBox = false;
      }
    },
    openLogin(join) {
      if(this.$route.name != 'user-login')
        this.openDialog({name: 'Login', data: {join: join}});
    }
  },
  mounted() {
    this.$store.dispatch('calendar/initializedDateTime');
    this.resetToggles;
  }
}
</script>

<style>
#__nuxt {height: 100% !important;}
#__nuxt, #viewport{min-height: 100%;position: relative;width: 100%;}
#header{margin: 0;padding: 0; background-color: white; min-height:110px ;height: auto; position:relative;}

#main-menu {position: absolute; bottom: 0; background-color:#666; color: white; margin: 0; line-height: 45px; border-radius: 0; font-size: 16px; width: 100%; overflow: hidden; white-space: nowrap; -webkit-transition: 200ms; transition: 200ms; padding: 0 15px;}
#main-menu.affix {position: fixed; bottom: inherit; top: 0; z-index: 2000; opacity: 0.95;}
#main-menu a {display: inline-block; color: white; text-decoration: none; cursor: pointer; padding: 0 15px; -webkit-transition: background-color 200ms; transition: background-color 200ms;}
#main-menu .menu-items > div {display: inline-block;}
#main-menu .menu-items > ul {list-style: none; margin: 0; padding: 0; display: inline-block;}
#main-menu .menu-items > ul > li {display: inline-block;}
#main-menu li.active {color: white;}
#main-menu #go2top {display: none;}
#main-menu.affix #go2top{display: inline-block;}
#bookz-menu-item.nuxt-link-active, #bookz-menu-item:hover {background-color: #A7BB41;}
#magz-menu-item.nuxt-link-active, #magz-menu-item:hover {background-color: #4DB3F2;}
#academicz-menu-item.nuxt-link-active, #academicz-menu-item:hover {background-color: #41BBB2;}
#textbookz-menu-item.nuxt-link-active, #textbookz-menu-item:hover {background-color: #C7C03E;}
#blog-menu-item.nuxt-link-active, #blog-menu-item:hover {background-color: #E8AE2F;}
#submenu{background: black;direction: ltr;text-align: left;}

h1, h2, h3, h4 {font-family: BYekan, tahoma, "Helvetica Neue",Helvetica,Arial,sans-serif; font-weight: normal;}
h1 {font-size:26px;}
h2 {font-size:24px;}
h3 {font-size:20px;}

/*#7C91F2 */
#in-search-form {margin: 15px 0;}
#in-search-form .btn:last-child {-webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px;}
#in-search-form button{background: white;border: 2px solid #DDD ;-webkit-transition: all ease-in-out .15s;transition: all ease-in-out .15s;color: #337DCC;font-size: 23px;}
#in-search-form button.search-field {padding: 5px 10px 1px 10px; margin-top: -1px;}
#in-search-form button:active {color: black; border-color:#a6a6a6;}
#in-search-form input {height: 38px; outline: none; padding: 7px; border: 2px solid #DDD;}
#in-search-form:hover input {border-color: #BBB;}
#in-search-form:hover button {border-color: #BBB; }
#in-search-form button:hover {border-color: #BBB; background-color: #337DCC; color: white}


.logo-container{padding: 0 20px;}
#details-section{padding:20px;}

#bookz-menu-item.active a, #bookz-menu-item a:hover {background-color: #A7BB41;}
#magz-menu-item.active a, #magz-menu-item a:hover {background-color: #4DB3F2;}
#academicz-menu-item.active a, #academicz-menu-item a:hover {background-color: #41BBB2;}
#textbookz-menu-item.active a, #textbookz-menu-item a:hover {background-color: #C7C03E;}
#blog-menu-item.active a, #blog-menu-item a:hover {background-color: #E8AE2F;}
#in-page-navigation a.active {background-color: #F1F1F1; color: #000;}
#in-page-navigation .separator {padding: 0 10px; color: white; font-size: 13px; display: inline-block;}
#quick-navigator {text-align: left; float: left}
@media (max-width: 767px) {
	#quick-navigator .message {display:none;}	
}
#top-bar .navbar {position: static;}
#top-bar  {width: 100%; height: 70px; display: table}
#top-bar .subsite{font-family:BYekan; font-size:22px; display: inline-block; position: relative;top: -25px; right: 5px;}
#userbar{font-family: BYekan, tahoma;  font-size: 14px; width: 10%; white-space: nowrap; display: table-cell; text-align: center}
#userbar a{color:gray;}
#userbar .user-charge {margin-left: 5px;}
#userbar .dropdown-menu{right:inherit; left:0;}
#userbar .avatar, #userButton .avatar { 
  display: inline-block;
  vertical-align: middle; 
  width: 43px; 
  height: 43px;
  border-radius: 25px;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
}
#userButton .avatar {margin: 0 15px; pointer-events: none;}
#search-navbar-collapse {padding: 0; z-index: 100; overflow: initial;}
#mainSearchBox input{width: 100%; height: 38px; outline: none; padding: 7px; border: 2px solid #DDD; border-left: none; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; -webkit-box-shadow: none !important;-moz-box-shadow: none !important;box-shadow: none !important;}
#mainSearchBox:hover input, #mainSearchBox input:focus {border-color:gray;}
#mainSearchBox {max-width: 768px; display: inline-table; width: 100%}
#mainSearchBox > * {display: table-cell; height: 38px; box-sizing: border-box; vertical-align: middle}
#fixSearchBox #mainSearchBox > :nth-child(n+2) {width: 1px; white-space: nowrap;}

#searchBtn {-webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; height: 99%; padding: 0 8px; background: #337DCC;-webkit-transition: all ease-in-out .15s;transition: all ease-in-out .15s;color: white;font-size: 23px;}
#searchBtn:hover{background-color: #2C6BAE;}

#footer {position: absolute; bottom: 0; width: 100%; right:0; background-color: #333; color: #999; border-top: 5px solid #333; z-index: 1;}
#footer, #footer-clear {height: 100px;}
#footer .links {vertical-align: middle; padding: 10px 20px;}
#footer #copyright {margin-top: 8px;}
#footer a {margin-left: 20px;display:inline-block; vertical-align:middle; color:#BBB; transition: color 200ms;}
#footer a:hover, #footer a:active {color: white;}
#footer #learn-more{font-family: BYekan, tahoma; text-align: left; font-size: 18px; padding-left: 120px;}
#footer #learn-more a{color: black; text-decoration: none;}


#loadMoreSearch { text-align: center; /*position: absolute; bottom: 50px; right: auto; left: auto; z-index: 1; */}
#resultsNoInfo { float:left; }
#resultNo { color: #608ed2; font-weight: bold; font-size: 11pt; margin-top:20px; }
#loadmore { text-align: center;}
.pager{display:none;}

.file-uploads {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.uploaded-file {
  lost-utility: clearfix;
  padding: 5px;
  background: #EEE;
  border: 1px solid #CCC;
  max-width: 500px;
  margin-right: auto;
  margin-left: 10px;
  margin-bottom: 10px;
}

.upload-status {
  float: left;
}

.upload-progressbar {
  display: inline-block;
  width: 80px;
  height: 18px;
  padding: 2px;
  border: 1px solid #CCC;
}

.upload-progress-indicator {
  background-color: #337dcc;
  height: 100%;
}

.file-error {
  color: red;
}
.home {
  &#viewport, & #header, & #top-bar {height: 100% !important}
  & #main-menu {line-height: 55px !important;}
  & #footer {position: static !important; }
  & #footer-clear {display: none !important;}
  /*.homepage #top-bar {background-image: url('../img/desk.png'); background-repeat: no-repeat; background-position: 5% 85%;}*/
  & #mainSearchBox {padding: 0 5%;}
  @media (min-height: 600px){
    #mainSearchBox {top: 200px;}
  }
  & #top-bar {background-image: url('~assets/img/desk.png'); background-repeat: no-repeat; background-position: 5% 85%;}
  & .search {
      position: absolute;
      top: 19%;
      right: 0%;
      width: 100%;
      & img {
        display: block;
        margin: 0 20px 10px 0px;
      }
    }
}
.nebeek-img {margin-bottom: 25px;}
.search {
  display: table-cell;
  width: 80%;
}
#row {display: table-row;
  & div {
    vertical-align: middle;
  }
  & .navbar-logo {width: 10%; display: table-cell; vertical-align: middle;}
}

@media (max-width: 532px) {
  .absoluteSearch > #searchButton {display: block;}
  .absoluteSearch > #mainSearchBox {
    position: absolute;
    top: -43px;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 2;
    border: 3px solid white;
    border-left: none;
    border-right: none;
    transition: top .7s;
    & > #closeBtn{display: inline}
  }
  .absoluteSearch.showSearch > #mainSearchBox {top: 11px;}
  .otherPage#fixSearchBox {display: none};
  .calssB>#searchButton {display: table-cell;}
}
#closeBtn {
    display: none;
    color: white;
    background-color: #aaaaaa;
    height: 38px;
    padding: 0px 3px;
    border-radius: 0;
  }
#closeBtn:hover {background-color:gray}
#searchButton {
  display: none;
  font-size: 15px;
  width: 30%;
  padding: 0px 5px;
  float: left;
  font-size: 25px;
  -webkit-transition: color .5s;
  -moz-transition: color .5s;
  transition: color .5s;
}
.absoluteSearch > #searchButton:hover {color: gray;}

#userButton {display: none;}
@media (max-width:382px) {
  #userButton.toggleMode {
    display: table-cell;
    & button {
      font-size: 47px;
      color: #337dcc;
    }
  }
  #userbar.toggleMode {display: none;}
  #hidden-menu.toggleMode {display: grid; }
}
.home #userbar {
    display: table;
    float: left;
    margin-top: 10px;
}
#hidden-menu {
  display: none;
  box-shadow:0px -1px 2px grey;
  position: relative;
  padding-bottom: 45px;
}
#arrow {
  position: absolute;
  top: -1px;
  left: 4px;
  & div {
    border-color: transparent;
    border-bottom-color: grey;
    border-style: dashed dashed solid;
    border-width: 0 8.5px 8.5px;
    height: 0;
    width: 0;
    position: absolute;
    top: -8px;
    left: 25px;
    z-index: 0;
  }
  & :first-child {
    border-bottom-color: #FFF;
     top: -7px;
     z-index: 1;
  }
}
#hidden-menu  #menu-items {
  display: block;
  float: left;
  text-align: left ;
  margin-top: 5px;
}
.dialog-container, .backdrop, .dialog {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
} 
.dialog-container {position: fixed;}
.backdrop {
  position: absolute;
  background: rgba(0,0,0,.6);
  transition: opacity 1s cubic-bezier(.25,.8,.25,1);
  opacity: 0.4;
  pointer-events: auto;
}
.dialog {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  padding: 15px
}
.no-scroll {
  overflow: hidden;
  height: 100%;
  width:100%;
  position: absolute;
}
.wrapper {
  display: inline;
}
</style>
