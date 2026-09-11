<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { GeneralSettingOption } from 'src/shared/Types/Settings';
import BoolField from '../shared/components/Fields/BoolField.vue';
import StringField from '../shared/components/Fields/StringField.vue';
import NumberField from '../shared/components/Fields/NumberField.vue';

const generalSettings = ref<GeneralSettingOption[]>([])

onMounted(async () => {
  generalSettings.value = await window.settings.getGeneral()
  for (const s of generalSettings.value) {
    console.log(s)
  }
})

function setGeneralSetting(s: any) {
  window.settings.setGeneralOption(s.tag, s.value)
  window.settings.save()
  console.log('saved', s.tag, s.value)
}

</script>
<template>
    <div class="general-settings-viewer">
        <div v-for="s in generalSettings" :key="s.name">
            <BoolField v-if="s.type === 'bool'" 
            :tag="s.name"
            :label="s.name"
            :value="s.value"
            @update:value="setGeneralSetting"/>
            <StringField 
            :tag="s.name"
            v-else-if="s.type === 'text'" 
            :label="s.name"
            :value="s.value"
            @update:value="setGeneralSetting"/>
            <NumberField 
            :tag="s.name"
            v-else-if="s.type === 'number'" 
            :label="s.name"
            :value="s.value"
            @update:value="setGeneralSetting"/>
        </div>
    </div>

</template>