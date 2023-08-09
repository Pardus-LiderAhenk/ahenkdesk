<template>
  <div>
    <Card bodyClass="p-0">
      <header class="px-4 pt-4 pb-3 mb-3">
        <h5 class="card-title mb-0">Mesaj Geçmişi</h5>
      </header>
      <vue-good-table
        :columns="columns"
        :rows="messages"
        styleClass="vgt-table table-head bordered"
        :sort-options="{
          enabled: false,
        }"
        :pagination-options="{
          enabled: true,
          perPage: perpage,
        }"
      >
        <template v-slot:table-row="props">
          <span v-if="props.column.field == 'messageDetail'">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              <button @click="openModal(props.row)" class="btn btn-primary btn-sm">
                Mesaj Detayı
              </button>
            </div>
          </span>
        </template>
      </vue-good-table>

      <template #pagination-bottom="props">
        <div class="py-4 px-3 flex justify-center">
          <Pagination
            :total="50"
            :current="current"
            :per-page="perpage"
            :pageRange="pageRange"
            @page-changed="current = $event"
            :pageChanged="props.pageChanged"
            :perPageChanged="props.perPageChanged"
          >
            >
          </Pagination>
        </div>
      </template>
    </Card>

    <Modal ref="modalRef" title="Mesaj Detayı" label="Mesaj Detayı" labelClass="btn-primary btn-sm" scrollContent>
      <h4 class="font-medium text-lg mb-3 text-slate-900">
        {{ modalRow.subject }}
      </h4>
      <div class="text-base text-slate-600 dark:text-slate-300">
        {{ modalRow.error }}
      </div>
    </Modal>
  </div>
</template>
  
<script>
  import Card from '@/components/Card';
  import { ipcRenderer } from 'electron';
  import Icon from "@/components/Icon";
  import Modal from '@/components/Modal/Modal';
  import Pagination from "@/components/Pagination";
  
  export default {
    components: {
      Card,
      Icon,
      Modal,
      Pagination,
    },
    data() {
      return {
        current: 1, // Current page number
        perpage: 5, // Number of items per page
        pageRange: 5, // Page numbers range
        columns: [
          // Table columns
          {
            label: 'TARİH - SAAT', // Column header
            field: 'date', // Column field name
          },
          {
            label: 'İSİM SOYİSİM',
            field: 'username',
          },
          {
            label: 'BİRİMİNİZ',
            field: 'unit',
          },
          {
            label: "DETAY",
            field: "messageDetail",
          },
        ],
        messages: [], // Data array for messages
        modalRow: {}, // Selected row data for the modal
      };
    },
    mounted() {
      // Send data to the main process
      ipcRenderer.send('get-data');
  
      // Receive data from the main process
      ipcRenderer.on('get-data-reply', (event, arg) => {
        if (arg.error) {
          console.error(arg.error);
        } else {
          this.messages = arg.data; // Update messages data
        }
      });
    },
    methods: {
      // Function to open the modal
      openModal(row) {
        this.modalRow = row; // Assign row parameter to modalRow variable
        this.$refs.modalRef.openModal(); // Open the Modal component
      },
    },
  };
</script>
  
<style lang="scss">
  .action-btn {
    @apply h-6 w-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded
  }
</style>
  