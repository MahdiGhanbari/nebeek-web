<template>
<div class="doc-cover" :class="{'has-error': hasErrors}">
	<div v-if="allowUpload" class="upload-button">
		<input type="file" @change="onImageChange" accept="image/*"/>
		<i class="material-icons">add_circle</i>
	</div>
	<div class="doc-img">
		<div class="doc-img-outer">
			<div class="doc-img-inner">
				<img :width="width" :height="height" :alt="title" :title="title" :src="src" @error="loadingFailed()">
			</div>
		</div>
	</div>
	<nuxt-link v-if="link" class="doc-cover-click-target" :to="link"></nuxt-link>
</div>
</template>
<script>
import vue from 'vue';
export default {
	props: ['file', 'link', 'title', 'width', 'height', 'allowUpload'],
	inject: {
		lazyLoad: {default: undefined}
	},
	data() {
		return {
			hasErrors: false,
			hasErrors2: false,
			isLoad: false
		};
	},
	methods: {
		loadingFailed() {
			if(this.hasErrors || !this.file.url)
				this.hasErrors2 = true;
			this.hasErrors = true;
		},
		onImageChange(e) {
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length)
				return;
			this.$store.dispatch('file/upload',{id: 0, file: files[0], path: this.file.path, token: this.file.token});
		}
	},
	computed: {
		src() {
			if(!this.isLoad)
				return;
			if(this.file.sizes) {
				// TODO: decide better on which image to use (based on their dimensions and required size)
				return process.env.apiBaseUrl + this.file.sizes[0].url;
			}			
			return '/img/image-not-found-small.gif';
		},
		hasLazyLoadParent() {
			return this.lazyLoad ? this.lazyLoad.isSupport : false;
		}
	},
	mounted() {
		if(this.hasLazyLoadParent)
			this.lazyLoad.register(this);
		else
			this.isLoad = true;
	},
	destroyed() {
		if(this.hasLazyLoadParent)
			this.lazyLoad.unregister(this);
	},
	watch: {
		file() {
			// TODO: figure out why the computed property does not work as expected.
			this.hasErrors = false;
		}
	}
}
// TODO: lazy load image
</script>
<style scoped>
.has-error.doc-cover {background-color: #f4f4f4;}
.doc-cover {width: 100%; height: 100%; position: relative; overflow: hidden; z-index: 1; }
.doc-img {height: 110%; right: -5%; position: relative; top: -5%; width: 110%;}
.doc-img-outer {display: table; height: 100%; width: 100%; table-layout: fixed;}
.doc-img-inner {display: table-cell; text-align: center; vertical-align: middle;}
.doc-img  img {max-width: 100%; max-height: 100%;}
.doc-cover-click-target {bottom: 0; left: 0; position: absolute; right: 0; top: 0; opacity: 0; background-color: black; transition: opacity 300ms;}
.doc-cover:hover .doc-cover-click-target {opacity: 0.2;}
.doc-cover:hover .upload-button {
	display: inline-block;
	width: inherit;
	height: inherit;
	text-align: center;
	& i {font-size: 70px;}	
}
.upload-button {
	display: none;
	position: absolute;
	z-index: 1;
	color: gray;
	cursor: pointer;
	padding-top: 50%;
}
input {display: none}
</style>