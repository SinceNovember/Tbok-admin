<template>
        <div class="child">
        <h3>这里是子组件</h3>
        <slot name="up"></slot>
                <slot name="down"></slot>
                    <slot></slot>

    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
