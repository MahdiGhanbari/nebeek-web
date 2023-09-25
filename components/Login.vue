<template>
    <div :class="{'modal-container': !pageMode}">
        <div class="content">
            <div class="header">
                <button v-if="!pageMode" class="close" @click="close()"> <i class="material-icons"> cancel </i> </button>
                <h4 class="title">{{newAccount ? 'ثبت نام' : 'ورود'}}</h4>
            </div>
            <div class="body">
                <span>
                    <div v-if="newAccount" class="segment">
                        <form @submit.prevent="create()">
                            <div class="form-group">
                                <label for="user-name">نام کاربری</label>
                                <input class="form-control" id="user-name" v-model="userName" type="text"  autocomplete="off">
                                <div v-if="checkUserName" class="error">{{checkUserName}}</div>
                            </div>
                            <div class="form-group pass-inputs">
                                <div class="form-group">
                                    <label for="user-password">رمزعبور</label>
                                    <input class="form-control"  v-model="password" id="user-password" type="password" maxlength="10" autocomplete="off">
                                    <div v-if="checkPassword" :class="{error: password.length == 0}">{{checkPassword}}</div>
                                </div>
                                <div class="form-group">
                                    <label for="user-verify-password">رمزعبور(مجدد)</label>
                                    <input class="form-control" v-model="repeatPass" id="user-verify-password" type="password" maxlength="10" autocomplete="off">
                                    <div v-if="checkRepeatPass" class="error">{{checkRepeatPass}}</div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="user-email">پست الکترونیکی</label>
                                <input class="form-control" id="user-email" type="text" v-model="email"  autocomplete="off">
                                <div v-if="checkEmail" class="error">{{checkEmail}}</div>
                            </div>
                            <!-- <div class="form-group">
                                <img src="/">
                                <button class="button">کدجدید</button>
                                <button class="button">(فارسی)</button>
                                <input class="form-control" type="text">
                            </div> -->
                            <div class="form-group">
                                <button class="button primary primary-btn">عضویت</button>
                            </div>
                        </form>
                    </div>
                    <div v-else class="segment">
                        <form @submit.prevent="login()">
                            <div class="form-group">
                                <label for="user-name">نام کاربری یا پست الکترونیکی</label>
                                <input class="form-control" v-model="userName" id="user-name" @focus="hasError = false" type="text" autocomplete="off">
                                <div v-if="checkUserName" class="error">{{checkUserName}}</div>
                            </div>
                            <div class="form-group">
                                <label for="user-password">رمزعبور</label>
                                <input class="form-control" v-model="password" id="user-password"  @focus="hasError = false" maxlength="10" type="password">
                                <div v-if="checkPassword" class="error">{{checkPassword}}</div>
                            </div>
                            <div class="form-group">
                                <input type="checkbox" id="user-name-remember">
                                <label for="user-name-remember">به خاطر بسپار. </label>
                                <nuxt-link to="/">کلمه عبورفراموش کردم.</nuxt-link> 
                            </div>
                            <div class="from-group">
                                <button type="submit" class="button primary primary-btn">ورود</button>
                            </div>
                        </form>
                    </div>
                </span>
                <div class="segment social-networks">
                    <ul>
                        <li class="button" id="yahoo">
                            <nuxt-link to="/">yahoo</nuxt-link> 
                        </li>
                        <li class="button" id="linkedin">
                                <nuxt-link to="/">linkedin</nuxt-link>  
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footer">
                <button class="button" @click="clear() , newAccount = !newAccount">{{newAccount ? 'ورود' : 'عضویت'}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex'
export default {
    props: ['join', 'pageMode'],
    data() {
        return {
            newAccount: false,
            userName: null,
            password: null,
            repeatPass: null,
            email: null,
            hasError: false
        }
    },
    methods: {
        close() {
            this.$emit('close');
            this.closeDialog();
        },
        ...mapActions(['closeDialog']),
        async login() {
            this.password = !this.password ? '' : this.password; 
            this.userName = !this.userName ? '' : this.userName;

            if(!this.checkPassword && !this.checkUserName) {
                let success = await this.$store.dispatch('login', {
                    username: this.userName,
                    password: this.password
                })
                if (success) {
                    this.$emit('login'); 
                }else {
                    this.hasError = true;
                }
            }
        },
        async create() {
            if(this.canCreate) {
                try {
                    let data = await db.save({
                        type: 'Person',
                        username: this.userName,
                        email: this.email,
                        password: this.password
                    });
                    await db.save({
                        type: 'Account'
                    });
                    this.$router.push({name: 'view-id', params: {id: data.id}});
                } catch(err) {};
            }
        },
        clear() {
            this.userName = this.password = this.repeatPass = this.email = null;
            this.hasError = false;
        }
    },
    computed: {
        ...mapState({
                local: state => state.lingual
            }),
        ...mapGetters(['currentDialog']),
        checkUserName() {
            if(this.userName != null && this.userName.length == 0)  
                return this.newAccount ? 'نام کاربری نمیتواند خالی باشد' : 'لطفا نام کاربری خود را وارد کنید';
            return this.hasError ? 'نام کاربری یا کلمه عبور اشتباه می باشد' : null;
        },
        checkRepeatPass() {
            if(this.repeatPass && this.repeatPass != this.password)
                return 'تکرار رمز صحیح نمی باشد.'
            return;
        },
        checkEmail() {
            if(this.email) {
                let arr1 = this.email.split("@");
                if(arr1.length > 1) {
                    let arr2 = arr1[1].split(".");
                    if(arr2.length == 2)
                        return;
                }
                return "ایمیل وارد شده صحیح نمیباشد"
            }
            return;
        },
        checkPassword() {
            if(this.password == null)
                return;
            if(this.newAccount) 
                if(this.password.length == 0)
                    return "رمزعبور نمیتواند خالی باشد";
                else if(this.password.length < 3)
                    return 'ضعیف';
                else if(this.password.length >= 3 && this.password.length < 6)
                    return 'متوسط' ; 
                else
                    return 'قوی';
            else if(this.password.length == 0)
                return  "لطفا رمزعبور خود را وارد کنید";
            return;
        },
        canCreate() {
            return (!this.checkUserName && this.userName) && ( this.password && (this.checkPassword != 'ضعیف'))
             && (!this.checkRepeatPass && this.repeatPass) && (!this.checkEmail && this.email)
        }
    },
    watch: {
        join: function() {
            this.newAccount = this.join;
            this.clear();
        }
    }
}
</script>

<style scoped>
.content .header {
    min-height: 16.428571429px;
    padding: 15px;
    border-bottom: 1px solid #cacaca;
}
.modal-container {min-width: 100%;}
@media screen and (min-width: 626px){
    .modal-container {min-width: 600px !important}
    .segment {
        width: 50%;
        display: inline-block;
        padding: 0 10px;
        vertical-align: top;
        & form { 
            border:0;
            padding:0;
            border-left:1px solid #cacaca;
            padding-left: 15px;
        }
    }
    form .primary-btn {width: auto;}
    .pass-inputs > div {
        width: 45%;
        margin-left: 10px;
        display: inline-block;
        vertical-align: top;
    }
}
.form-control.pass-inputs > div {display: inline;}
form {
    border:0;
    padding:0;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 15px;
}

.content .header .close {
    margin-top: -2px;
}
button.close {
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
}
.close {
    float: left;
    font-size: 21px;
    font-weight: bold;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: .2;
}
.header .title {
    margin: 0;
    line-height: 1.428571429;
}

label {
    display: inline-block;
    margin-bottom: 5px;
    font-weight: bold;
}
.form-group {
    margin-bottom: 15px;
}
.form-control {
    margin: 0;
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
}
ul {
    list-style: none;
    margin-top: 10px;
    padding: 0;
}
ul > li {
    display: list-item;
    margin-top: 10px;
    & a {
        text-decoration: none;
        color: white;
        width: 100%;
        display: inline-block;
    }
}
#yahoo {background-color: #5e2b88;}
#linkedin {background-color: #00689f}
.content .body {
    padding: 10px
}

.primary-btn { width: 100%;}
.content .footer {
    text-align: left;
    min-height: 16.428571429px;
    border-top: 1px solid #cacaca;
}
.error {
    color: red;
    border-bottom: 1px solid red;
}
</style>


