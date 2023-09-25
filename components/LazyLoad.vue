<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>

const isSupportingLazyLoad = typeof(window) !== 'undefined' && typeof(window.IntersectionObserver) === 'function';

export default {
    props: ['rootMargin','threshold'],
    provide() {
        return {
            lazyLoad: this
        }
    },
    data() {
        return {
            children: [],
            notObserved: [],
            observer: undefined,
            isSupport: false,
            markedChildren: {}
        }
    },
    created() {
        this.isSupport = isSupportingLazyLoad;
    },
    mounted() {
        if(!this.isSupport)
            return;
        var options = {
            root: this.$el,
            rootMargin: (this.rootMargin ? this.rootMargin : 0) + "px",
            threshold: this.threshold ? this.threshold : 0.1 
        };
        this.observer = new IntersectionObserver(this.handleIntersect, options);
        for (let child of this.notObserved) {
            this.observer.observe(child.$el);
        }
        this.notObserved = [];
    },
    methods: {
        register(child) {
            this.children.push(child);
            let key = Math.random();
            child.$el.lazyId = key;
            this.markedChildren[key] = child;
            if (this.observer) {
                this.observer.observe(child.$el);
            } else {
                this.notObserved.push(child);
            }
        },
        unregister(child) {
            let idx = this.children.indexOf(child);
            if (idx != -1) {
                this.children.splice(idx, 1);
            }
        },
        handleIntersect(entries, observer) {
            var that = this;
            entries.forEach(entry => {
                if(entry.isIntersecting)
                    this.markedChildren[entry.target.lazyId].isLoad = true;
            });
        }
    }
}
</script>
