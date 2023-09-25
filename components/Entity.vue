<template>
<div class="entity">
    <div v-if="getDetailLevel >= 2 && image.path" class="thumb" :style="{width: image.width + 'px'}">
        <thumb :file="image.path" :width="image.width" :link="image.link" :allowUpload="allowUploadThumbnail"></thumb>
    </div>
    <div class="overview">
        <div>
            <string v-if="name" v-model="name" :editable="isEditable" maxLength="400" :link="getDetailLevel < 3 ? {name: 'view-id', params: {id: value.id}} : ''"
                    :class="{'title': getDetailLevel >= 2, 'single-line-overflow': getDetailLevel >= 2}"></string>
            <div class="meta" v-if="getDetailLevel >= 2">
                <!-- <div v-if="hasField('owner') || value.owner" class="single-line-overflow">
                    <ref v-model="value.owner" :editable="isEditable" :type="value.type" label="توسط: " maxLength="150"></ref>
                </div> -->
                <div v-if="hasField('actualOwner') || value.actualOwner">
                    <ref v-model="value.actualOwner" type="Agent" :editable="isEditable" label="نویسنده: " maxLength="150"></ref>
                </div>
                <star v-if="hasField('value') || value.value" v-model="value.value" :editable="isEditable"></star>
                <div v-if="hasField('actualDate') || value.actualDate" class="single-line-overflow">
                    <date-time v-model="value.actualDate" :editable="isEditable && !isReview"></date-time>
                </div>
                <div v-if="hasField('channel') || value.channel" class="single-line-overflow">
                    <ref v-model="value.channel" label="منبع: "></ref>
                </div>
                <div v-if="hasField('creation') || value.creation">
                    <list v-model="value.creation" :editable="isEditable" type="Action" :limited="getDetailLevel < 3"></list>
                </div>
                <div v-if="hasField('text') || value.text">
                    <string v-model="value.text" :multiline="true" :editable="isEditable" maxLength="50"></string>
                </div>
                <div v-if="hasField('fullText') || value.fullText">
                    <string v-model="value.fullText" :multiline="true" :editable="isEditable"></string>
                </div>
                <div v-if="value.balance" class="single-line-overflow">
                    مانده حساب:
                    <span class="meta-value"><string :value="value.balance"></string> تومان</span>
                </div>
                <div v-if="value.keywords" class="single-line-overflow">
                    کلمات کلیدی: 
                    <span class="meta-value" v-for="keyword in value.keywords">
                        <string :value="keyword"></string>
                    </span>
                </div>
            </div>
            <div v-if="getDetailLevel >= 2 && showButtons" class="actions" :class="{'fixed-actions': absoluteButtons, expand: expand, 'close-menu': close}">
                <div class="buttons" >
                    <span v-if = "!limit">
                        <nuxt-link v-if="value.account && value.account.length" class="button" :to="{name: 'view-id', params: {id: value.account[0].id}}">مشاهده حساب</nuxt-link>
                        <a v-if="typeName == 'pdf2word'" class="button primary" :href="value.data.path + '?format=docx'" download>دانلود فایل docx</a>
                        <nuxt-link v-if="typeName == 'account'" class="button primary" to="/user/add-credit">افزایش اعتبار</nuxt-link>
                        <nuxt-link v-if="value.pdf" class="button primary" :to="{name: 'read-id', params: {id: value.id}}">مطالعه</nuxt-link>
                        <nuxt-link v-if="!isHome && isContent && getDetailLevel < 3" class="button" :to="{name: 'view-id', params: {id: value.id}}"><i class="material-icons">info</i></nuxt-link>
                        <button class="button" @click="like()" ><i class="material-icons">thumb_up</i></button>
                    </span>
                    <share :link="link" @expand="changInMenu()"></share>
                    <span v-if = "!limit">
                        <span v-if="isOwner && editable" @click="edit=!edit" >
                            <transition name="fade" mode="out-in">
                                <div v-if="edit" class="button" @click="save()"><i class="material-icons">check</i></div>
                                <button v-else class="button"><i class="material-icons">edit</i></button>
                            </transition>
                        </span>
                        <button v-if="isOwner" class="button" @click="remove()"> <i class="material-icons"> delete </i> </button>
                    </span>
                    <span class="cover"><div></div></span>
                    <button @click="expand = true" class="button more-button"><i class="material-icons">more_vert</i></button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="getDetailLevel >= 3">
        <div class="clear-fix full-view"></div>
        <div v-if="value.abstract" class="detail-row">
            <div class="section-header">توضیح</div>
            <string v-model="value.abstract" :multiline="true" :editable="isEditable"></string>
        </div>
        <div v-if="value.tableOfContent" class="detail-row">
            <div class="section-header">فهرست عناوین</div>
            <table-of-content :items="value.tableOfContent" :id="value.id" :editable="isEditable" ></table-of-content>
        </div>
        <div v-if="value.commonWords" class="detail-row" id="common-words">
            <div class="section-header">عبارات پر کاربرد</div>
            <span v-for="(key,value) in value.commonWords" :style="{fontSize: key+'px'}">
                <nuxt-link :to="{name: 'read-id', params: {id: value.id}, query: {'q': value}}"><string :value="value"></string></nuxt-link>
            </span>
        </div>
        <div>
            <list v-if="value.reviews" v-model="value.reviews" title="نظرات" type="review" :always-open="true" :create-params="{'on': value.id}" view="cards"></list>
            <list v-if="value.organization" v-model="value.organization" title="سازمان ها" type="organization" view="cards"></list>
            <list v-if="value.collection" v-model="value.collection" title="مجموعه ها" type="collection" view="cards"></list>
            <list v-if="value.books" v-model="value.books" title="کتاب ها" type="book"  :create-params="{'owner': value.id}" view="cards"></list>
            <list v-if="value.series" v-model="value.series" title="دنباله دار ها" type="series" :create-params="{'owner': value.id}" view="cards"></list>
            <list v-if="value.article" v-model="value.article" title="مقاله ها" type="article" view="cards"></list>
            <list v-if="value.issue && Array.isArray(value.issue)" v-model="value.issue" title="نسخه ها" type="issue" view="cards"></list>
        </div>
        <div v-if="value.transaction">
            <table class="material">
                <thead>
                    <tr>
                        <td>درگاه</td>
                        <td>مقدار (تومان)</td>
                        <td>کد تأیید</td>
                        <td>وضعیت</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transaction in value.transaction">
                        <td>زرین پال</td>
                        <td>{{ transaction.amount }}</td>
                        <td>{{ transaction.authority }}</td>
                        <td>{{ transaction.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="detail-row" id="stats">
            <div class="section-header">آمار ها</div>
            <div class="chart-container">
                <div class="chart box">
                    <chart type="line" :data="getLikeData" name="محبوبیت" color="#c70039" :labels="chartLabels"></chart>
                </div>
                <div class="chart box">
                    <chart type="line" :data="getVisitData" name="بازدید" color="#900c3f" :labels="chartLabels"></chart>
                </div>
                <div class="chart box">
                    <chart type="line" :data="getBuyData" name="خرید" color="#581845" :labels="chartLabels"></chart>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TableOfContent from '~/components/reader/TableOfContent.vue';
import DateTime from '~/components/DateTime.vue';
import String from '~/components/String.vue';
import Thumb from '~/components/Thumb.vue';
import Share from '~/components/Share.vue';
import metaTags from '~/plugins/metaTags';
import Star from '~/components/Star.vue';
import Chart from '~/components/Chart.vue';
import {mapState, mapActions, mapGetters} from 'vuex';
import db from '~/plugins/db';
import throttle from 'lodash/throttle';

const FIELDS = {
    actor : ['actualOwner', 'affiliation']
}

export default {
    props: ['value', 'isHome', 'imageWidth', 'absoluteButtons', 'editable', 'viewMode'],
    name: 'entity',
    data() {
        return {
            edit: false,
            toggleMenu: false,
            limit: false,
            close: false,
            expandTime: null,
            funcName: null,
            chartLabels : ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
        }
    },
    methods: {
        async sendLike() {
            try {
                let resopnse = await db.save({
                    type: 'Like',
                    argument: this.value.id
                });
            } catch(err) {}  
        },
        like() {
            if(!this.isLoggedIn) {
                this.openDialog({name: 'Login'})
                this.runAfterLogin = 'like';
            }
        },
        getName(value) {
            return value ? value.name : '';
        },
        remove() {
            this.value.removed = true;
            this.$emit('input', this.value);
        },
        save() {
            //implement sending edited data.
        },
        changInMenu() {
            this.close = !this.close;                
            setTimeout(() => {
                    this.close = !this.close;
                    this.limit = !this.limit;
                }, 1200);
            clearTimeout(this.expandTime);
            this.expand = false;

        },
        addEntityFields() {
            for(let field of FIELDS[this.value.type]) 
                this.value[field] = undefined;
        },
        hasField(field) {
            return this.value.hasOwnProperty(field) && this.isEditable;
        },
        ...mapActions(['openDialog'])
    },
    computed: {
        isOwner() {
            if (!this.value || !this.isLoggedIn)   return false;
            return (this.value.id == this.user.id || (this.value.owner && this.value.owner.id == this.user.id));
        },
        ...mapState({
            local: state => state.lingual,
            user: state => state.user,
            isLoggedIn:  state => state.isLoggedIn,
            currentDateTime: state => state.calendar.currentDateTime
        }),
        ...mapGetters(['currentDialog']),
        typeName() {
          if (this.value && this.value.type)
            return this.value.type;
          return '';
        },
        name() {
            return this.value.names ? this.value.names[0] : undefined;
        },
        isContent() {
            let type = this.typeName;
            return type == 'Book' || type == 'Issue' || type == 'Paper';
        },
        isPerson() {
            return this.typeName == 'Person';
        }, 
        link() {
            const { href } = this.$router.resolve({name: 'view-id', params: {id: this.value.id}});
            return 'http://nebeek.com' + href;
        },
        isReview() {
            return this.typeName == 'Review';
        },
        allowUploadThumbnail() {
             return this.isEditable && this.viewMode === "full";
        },
        isEditable() {
           return this.getDetailLevel >= 2 ? this.edit : true && this.isOwner && this.editable;
        },
        getDetailLevel() {
            switch(this.viewMode) {
                case 'small':
                    return 1;
                break;
                case 'medium':
                    return 2;
                break;
                case 'full':
                    return 3;
                break;
                default:
                    return 2;
            }
        },
        expand: {
            set(value) {
                this.toggleMenu = value;
                if(this.toggleMenu)
                  this.expandTime = setTimeout(()=>{this.expand = false;}, 5000);
            },
            get() {
                return this.toggleMenu;
            }
        },
        getImage() {
            try {
                return this.value.images ? this.value.images[0] : this.value.owner.images[0] 
            }catch(err) {
                return undefined;
            }
        },
        image() {
            return {
                path: this.getImage,
                link: this.getDetailLevel < 3 ? {name: 'view-id', params: {id: this.value.id}} : undefined,
                width: this.isPerson ? 50 : this.imageWidth,
            }
        },
        getLink() {
            return this.editable ? undefined : {name: 'view-id', params: {id: this.value.id}};
        },
        isNew() {
            try {
                for(let type in FIELDS)
                   if(this.value.type == type) {
                        if(Object.keys(this.value).length <= 1)
                            return true;
                   }
            }catch(err){
                return false;
            }
        },
        showButtons() {
            // TODO: replace with a better logic
            return this.value && this.value.type != 'Write' && this.value.type != 'Publish'
        },
        runAfterLogin: {
            set(value) {
                this.funcName = value;
            },
            get() {
                if(this.isLoggedIn && this.funcName && this.currentDialog.name == 'Login') {
                    switch(this.funcName) {
                        case 'like' :
                            this.sendLike();
                        break;
                    }
                    this.runAfterLogin = null;
                }
            }
        },
        getLikeData() {
            let data= []
            if(this.currentDateTime) {
                while(data.length < 20) {
                    data.push( Math.floor(Math.random() * 5))
                }     
            }
            return data    
        },
        getVisitData() {
            let data= []
            if(this.currentDateTime) {
                while(data.length < 20) {
                    data.push( Math.floor(Math.random() * 20))
                }     
            }
            return data    
        },
        getBuyData() {
            let data= []
            if(this.currentDateTime) {
                while(data.length < 20) {
                    data.push( Math.floor(Math.random() * 10))
                }     
            }
            return data    
        }
    },
    components: {
        TableOfContent,
        DateTime,
        String,
        Thumb,
        Share,
        Star,
        Chart
    },
    beforeCreate() {
        this.$options.components.Ref = require('~/components/Ref.vue').default;
        this.$options.components.List = require('~/components/List.vue').default;
    },
    created() {
        if(this.isNew)
            this.addEntityFields();  
    }
}
</script>

<style scoped>
.entity {
    height: 100%;
}
.overview {
    height: 100%;
    position: relative;
}
.full-view {border-bottom: 1px solid #E4E4E4;}
.detail-row {
    margin: 20px 0;
}
.meta-container {
    position: relative;
}
li {
    display: list-item;
}
#common-words a {
    margin: 0 5px 0 5px ;
}
#common-words a:hover{
    text-decoration: underline;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to {
    opacity: 0
}
.thumb {
    float: right;
    margin-left: 16px;
    height: 100%;
    border-left: 1px solid #DDD;
}
.single-line-overflow {text-overflow: ellipsis; overflow: hidden; position: relative; white-space: nowrap;}
.single-line-overflow::after {content: ''; display: block; position: absolute; top: 0; left: 0; width: 70px; height: 100%; pointer-events:none;
    background: -moz-linear-gradient(left,  rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,0) 100%);
    background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,1)), color-stop(15%,rgba(255,255,255,1)), color-stop(100%,rgba(255,255,255,0)));
    background: -webkit-linear-gradient(left,  rgba(255,255,255,1) 0%,rgba(255,255,255,1) 15%,rgba(255,255,255,0) 100%);
    background: -o-linear-gradient(left,  rgba(255,255,255,1) 0%,rgba(255,255,255,1) 15%,rgba(255,255,255,0) 100%);
    background: -ms-linear-gradient(left,  rgba(255,255,255,1) 0%,rgba(255,255,255,1) 15%,rgba(255,255,255,0) 100%);
    background: linear-gradient(to right,  rgba(255,255,255,1) 0%,rgba(255,255,255,1) 15%,rgba(255,255,255,0) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#00ffffff',GradientType=1 );
}
.title {font-size: 18px; line-height: 28px; display: block; padding: 10px 0; margin: 0}
.meta {font-size: 13px;  color: #AAA}
.meta a {color: #777;}
.meta a:hover, .list .meta a:active {text-decoration: underline;}
.txt {font-size: 13px; white-space: normal; margin-top: 10px; line-height: 17px; max-height: 51px; overflow: hidden;}
.tags {margin-top: 15px;}
.actions {
    margin-top: 15px;
    opacity: 1; 
    transition: opacity 300ms; 
    font-size: 13px; 
    overflow: hidden; 
    max-width: 26%; 
    height: 34px; 
    display:inline-flex;
    transition: max-width 1s;
}
.close-menu { max-width: 0}
.fixed-actions {
    position: absolute; bottom: 15px; left: 15px;
}
.meta-value {color: #111; margin-top:10px;}
.meta-value + .meta-value:before {
    content: ", ";
}
.common-buttons .share-container { position: relative }
.share-box {
    position: absolute;
    top: -45px;
    left: 0;
}
.avatar {
    border-radius: 25px;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    max-width: 50px;
    max-height: 50px;
    margin: 14px;
    overflow: hidden;
    float: right;
    position: relative;
    line-height: normal;
}
.buttons {
    display: inline;
    transition: max-width 0.6s;
    position: relative;
    white-space: normal;
}
.more-button {
    position: absolute;
    padding: 0;
    top: 0;
    left: -3px;
}
.cover {
    position: relative;
    cursor: context-menu;
    background: white;
    display: inline;
    z-index: 1;
    & * {
        position: absolute;
        top: 0;
        left: -4px;
        width: 18px;
        height: 33px;
        background: white;
    }
}
.expand {max-width: 100%;}
.small {display: block;}
.chart-container {
    border-top: 1px solid #E4E4E4;
    display: inline-block;
    width:100%;
    text-align: center;
}
.chart{
    display: inline-block;
    margin: 15px;
    width: 25%;
    position: static;
}
@media (max-width:700px ) {
    .chart {
        width: 75%;
    }
}
</style>


