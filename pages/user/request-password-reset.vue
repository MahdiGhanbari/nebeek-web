<template>
<div class="container">
    <h1>بازیابی رمز عبور</h1>
    <p>لطفا ایمیل خود را وارد کنید. پیامی حاوی لینک تغییر رمز عبور برای این ایمیل ارسال خواهد شد.</p>
    <div>
        <form @submit.prevent="sendResetPasswordToken">
            <input v-model="email" type="text" id="email" autofocus>
            <label for="email">ایمیل</label>
            <button class="primary" type="submit">ارسال</button>
        </form>
    </div>
</div>
</template>
<script>

export default {
  middleware: 'anonymous',
}
</script>
