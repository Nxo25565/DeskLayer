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
        type: Boolean,
        default: false
    },
})


var model_value = ref<boolean>(props.value);
const emits = defineEmits<{
    (e: 'update:value', value: any): void
}>()

watch(() => model_value.value, () => {
    emits('update:value', {"tag": props.tag, "value": model_value.value})
})
</script>
<template>
    <div class="general-settings-field">
        <div class="bool-field">
            <label>{{ label }}</label>
            <input type="checkbox" v-model="model_value" class="bool-checkbox"/>
        </div>
    </div>
</template>