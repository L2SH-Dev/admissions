<template>
  <v-container class="d-flex flex-column pa-0 fill-height" max-width="800">
    <div class="flex-grow-1 position-relative w-100">
      <v-virtual-scroll
        ref="messagesContainer"
        :items="messages"
        class="px-4 pt-4 messages-container w-100"
        style="height: calc(100vh - 135px)"
      >
        <template #default="{ item }">
          <div
            ref="lastMessage"
            :class="[
              'd-flex mb-4',
              item.sent ? 'justify-end' : 'justify-start',
            ]"
          >
            <v-card
              :color="item.sent ? 'primary' : 'surface'"
              :elevation="2"
              class="px-1"
              max-width="85%"
              rounded="xl"
            >
              <v-card-text class="py-2 px-3">
                {{ item.text }}
              </v-card-text>
            </v-card>
          </div>
        </template>
      </v-virtual-scroll>
    </div>

    <v-sheet
      width="100%"
      class="pa-3"
      elevation="2"
      style="z-index: 1; border-radius: 12px 12px 0 0"
    >
      <v-form @submit.prevent="sendMessage">
        <v-text-field
          v-model="newMessage"
          placeholder="Введите сообщение..."
          variant="outlined"
          density="comfortable"
          rounded
          hide-details
          class="flex-grow-1 mx-auto"
          @keyup.enter="sendMessage"
        >
          <template #append>
            <v-btn
              color="primary"
              icon="mdi-send"
              size="small"
              @click="sendMessage"
            />
          </template>
        </v-text-field>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { VVirtualScroll } from "vuetify/components";

interface ChatMessage {
  text: string;
  sent: boolean;
}

const messages = ref<ChatMessage[]>([
  {
    text: "Здравствуйте! В этом чате вы можете задать вопросы администраторам сайта.",
    sent: false,
  },
  { text: "Где я могу посмотреть свои результаты экзаменов?", sent: true },
  {
    text: 'В разделе "Экзамены" во вкладке "Завершенные" выберите нужный экзамен и вам будут доступны результаты, если они уже опубликованы.',
    sent: false,
  },
  { text: "Спасибо!", sent: true },
]);
const newMessage = ref("");
const messagesContainer = ref<InstanceType<typeof VVirtualScroll> | null>(null);
const lastMessage = ref<HTMLElement | null>(null);

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  messages.value.push({
    text: newMessage.value,
    sent: true,
  });
  newMessage.value = "";

  setTimeout(() => {
    const container = messagesContainer.value?.$el;
    const lastMsg = lastMessage.value;
    if (container && lastMsg) {
      container.scrollTo({
        top: lastMsg.offsetTop + lastMsg.offsetHeight,
        behavior: "smooth",
      });
    }
  }, 50);
};
</script>

<style scoped>
.messages-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-y: auto;
  position: absolute;
  inset: 0;
  padding-bottom: 16px;
  overscroll-behavior-y: auto;
  -webkit-overflow-scrolling: touch;
}

.messages-wrapper {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.messages-container::-webkit-scrollbar {
  display: none;
}
</style>

<route lang="yaml">
meta:
  layout: authed
</route>
