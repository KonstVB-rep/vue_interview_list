<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  collection,
  doc,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import { useConfirm } from 'primevue'

const { userId } = useUserStore()
const db = getFirestore()
const confirm = useConfirm()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  const q = query(collection(db, `users/${userId}/interviews`), orderBy('createdAt', 'desc'))
  const listDocs = await getDocs(q)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  // await deleteDoc(doc(db, `users/${userId}/interviews`, id))
  confirm.require({
    message: 'Вы действительно хотите удалить собеседование?',
    header: 'Удаление собеседования',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger p-button-outlined',
    rejectLabel: 'Нет',
    acceptLabel: 'Да',
    reject: () => {},
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userId}/interviews`, id))

      const listInterviews: Array<IInterview> = await getAllInterviews()
      interviews.value = listInterviews

      isLoading.value = false
    },
  })
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false
})
</script>

<template>
  <app-confirm-dialog />
  <app-progress-spinner
    v-if="isLoading"
    class="translate-center grid place-items inset-0 top-50 left-50 -translate-x-[50%]"
  />
  <app-inline-message
    v-else-if="!isLoading && interviews.length === 0"
    severity="info"
    class="mx-auto my-5"
    >Список собеседований пуст</app-inline-message
  >
  <div v-else>
    <h1>Список собеседований</h1>
    <app-data-table :value="interviews">
      <app-column field="company" header="Компания"></app-column>
      <app-column field="hrName" header="Контакт"></app-column>
      <app-column field="vacancyLink" header="Вакансия">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">{{ slotProps.data.vacancyLink }}</a>
        </template>
      </app-column>
      <app-column header="Контакты">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              target="_blank"
              class="contacts__whatsapp"
            >
              <span class="contacts__icon pi pi-whatsapp"></span>
            </a>
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button severity="info" icon="pi pi-pencil" />
            </router-link>
            <app-button
              severity="danger"
              icon="pi pi-trash"
              @click="confirmRemoveInterview(slotProps.data.id)"
            />
          </div>
        </template>
      </app-column>
    </app-data-table>
  </div>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 10px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
