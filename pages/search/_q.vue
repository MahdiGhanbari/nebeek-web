<template>
<div class="container">
    <div v-if="correct != ''">آیا منظور شما {{ correct }} است؟</div>
    <div v-if="results">
        <!-- <div id="resultNo">
            تعداد کل مستندات حاصل از جستجو شما برابر است با {{ totalResults }} مستند
        </div> -->
        <list v-model="results" :is-vertical="true" view="cards"></list>
        <!-- <div>
            <span id="resultNo">
                تعداد کل مستندات یافت شده : 
                <span>{{ totalResults }}</span>
                مستند . تعداد مستندات نمایش داده شده تاکنون : 
                <span>{{ results.length }}</span> مستند. 
            </span>
        </div> -->
        <button v-if="results.length < totalResults" class="primary" @click="loadMore">
            <i class="glyphicon glyphicon-arrow-down"></i> بارگذاری نتایج بیشتر
        </button>
    </div>
    <div v-else>
        <div id="noresult">
            <h1>جستجوی شما نتیجه در بر نداشت.</h1>
            <p>لطفا برای نتایج بهتر یکی از گزینه های زیر را امتحان کنید:</p>
            <ul>
                <li>اطمینان حاصل کنید که عبارت جستجو لغت درستی است.</li>
                <li>کلمات دیگری را برای جستجو انتخاب کنید.</li>
                <li>از کلمات عمومی تر استفاده کنید.</li>
                <li>تعداد لغات جستجو را کاهش دهید.</li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
import db from '~/plugins/db';
import list from '~/components/List.vue';
import metaTags from '~/plugins/metaTags';

export default {
  async asyncData(context) {
    let query = context.params.q;
    let res = await db.find('', {'fullText': query});
    return {
        correct: '',
        totalResults: 0,
        results: res,
        query: query
    };
  },
  head() {
    let ret = metaTags(this.$route, this.entity, this.$store.state.lingual);
    ret['title'] = this.query;
    let script = '{"@context": "http://schema.org",\n'+
                    '"@type": "WebSite",\n'+
                    '"url": "http://nebeek.com",\n'+
                        '"potentialAction": {'+
                        '"@type": "SearchAction",'+
                        '"target": "http://nebeek.com/search?q=${' + this.query + '}",\n'+
                            '"query-input": {\n'+
                                '"@type": "PropertyValueSpecification",\n'+
                                '"valueName": "' + this.query + '",\n'+
                            ' "valueRequired": true'+
                            '}}}'
                            
    ret.script.push({innerHTML: script, type: 'application/ld+json'});  
    return ret;
  },
  components: {
    list
  }
}
</script>
