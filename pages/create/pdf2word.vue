<template>
<div class="container">
    <h1>سرویس تبدیل PDF به Word</h1>
    <div>
        <h2>شرایط استفاده از سرویس</h2>
        <p>با استفاده از این سرویس، شما شرایط استفاده از آن را که به شرح زیر آمده، قبول می کنید:</p>
        <ul>
            <li>شما متعهد می شوید که مالکیت قانونی فایلی که بارگذاری می کنید را در اختیار دارید.</li>
            <li>وب سایت نبیک هیچ مسئولیتی در قبال محتوای فایل و نحوه استفاده شما از فایل تبدیل شده به عهده نمی گیرد.</li>
            <li>شما این مجوز را به وب سایت نبیک می دهید که برای بهبود سرویس های خود از فایل های بارگذاری شده توسط شما استفاده کند.</li>
            <li>وب سایت نبیک بدون اجازه شما، حق انتشار فایل های بارگذاری شده را ندارد.</li>
            <li>وب سایت نبیک تمام تلاش فنی لازم را برای بهبود هر چه بیشتر کیفیت سرویس های خود به عمل می آورد، اما با این حال هیچ تضمینی بابیت کیفیت و خروجی این سرویس به کاربران خود نمی دهد.</li>
            <li>سرویس حاضر توانایی استخراج متن از فایل pdf که به شکل تصویری ذخیره شده اند ندارد.</li>
        </ul>
    </div>
    <div>
        <input type="file" @change="onFileChange" id="file-input" accept="application/pdf">
        <label for="file-input" class="button primary">بارگذاری فایل</label>
    </div>
</div>
</template>
<script>
import db from '~/plugins/db';

export default {
  middleware: 'authenticated',
  data() {
    return {
    };
  },
  methods: {
    onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        db.save({
            type: 'Pdf2Word'
        }).then(response => {
            let data = response.data;
            this.$store.dispatch('file/upload', {id: data.id, file: files[0], path: data.data.path, token: data.data.token});
        }).catch(err => {

        });
    }
  }
}
</script>
<style scoped>
#file-input {
    display: none;
}
</style>