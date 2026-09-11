<script setup lang="ts">


import { ref, watch } from 'vue'

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    tag: {
        type: String,
        default: ''
    },
    value: {
        type: Number,
        default: 0
    },
})

const emits = defineEmits<{
    (e: 'update:value', value: any): void
}>()

var state_value = ref<number>(props.value);

watch(() => state_value.value, () => {
    emits('update:value', {"tag": props.tag, "value": state_value.value})
})
</script>
<template>
    <div class="general-settings-field">
        <div class="number-field">
            <label>{{ label }}</label>
            <input type="number" v-model="state_value" class="number-input"/>
        </div>
    </div>
</template>