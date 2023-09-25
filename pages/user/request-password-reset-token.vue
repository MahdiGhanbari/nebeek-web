<template>
<div class="container">
    <h1>تغییر رمز عبور</h1>
    <p>لطفا رمز عبور جدید را وارد کنید:</p>
    <div>
        <form @submit.prevent="resetPassword">
            <input v-model="password" type="password" id="password" autofocus >
            <label for="password">کلمه عبور</label>
            <button class="primary" type="submit">ذخیره</button>
        </form>
    </div>
</div>
</template>
<script>

export default {
  middleware: 'anonymous',
}
</script>
