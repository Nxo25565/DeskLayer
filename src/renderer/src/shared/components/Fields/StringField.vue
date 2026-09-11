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
        type: String,
        default: ''
    },
})

const emits = defineEmits<{
    (e: 'update:value', value: any): void
}>()

var state_value = ref<string>(props.value);

watch(() => state_value.value, () => {
    emits('update:value', {"tag": props.tag, "value": state_value.value})
})
</script>
<template>
    <div class="general-settings-field">
        <div class="string-field">
            <label>{{ label }}</label>
            <input type="text" v-model="state_value" class="string-input"/>
        </div>
    </div>
</template>