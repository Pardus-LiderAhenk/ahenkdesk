<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <Card title="Hata Bildir">
      <Textinput
        label="İsim Soyisim"
        type="text"
        placeholder=""
        name="userName"
        v-model="username"
        :error="usernameError"
        classInput="mb-6"
      />

      <Select
        label="Biriminiz"
        name="unit"
        :options="[
          { value: 'Ahtapot', label: 'Ahtapot' },
          { value: 'Engerek', label: 'Engerek' },
          { value: 'Etap', label: 'Etap' },
          { value: 'Liderahenk', label: 'Liderahenk' }
        ]"
        placeholder="Seçiniz"
        classInput="mb-6"
        v-model="unit"
        :error="unitError"
      />

      <Textinput
        label="Konu"
        type="text"
        placeholder=""
        name="subject"
        v-model="subject"
        :error="subjectError"
        classInput="mb-6"
      />

      <Textarea
        label="Hata"
        type="text"
        placeholder=""
        name="error"
        v-model="error"
        :error="errorError"
        classInput="mb-6"
      />

      <div class="text-right">
        <Button 
          text="Gönder" 
          btnClass="btn-primary"
          icon="heroicons-outline:check"
          iconPosition="left"
          type="submit"
        />
      </div>
    </Card>
  </form>
</template>

<script>
import Button from "@/components/Button";
import Textinput from "@/components/Textinput";
import Textarea from "@/components/Textarea";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import Card from "@/components/Card";
import Select from "@/components/Select";
import { useToast } from "vue-toastification";
import { ipcRenderer } from 'electron';

export default {
  components: {
    Textinput,
    Textarea,
    Button,
    Card,
    Select,
  },

  setup() {
    // Define a validation schema using yup
    const schema = yup.object({
      username: yup.string().required(),
      unit: yup.string().required(),
      subject: yup.string().required(),
      error: yup.string().required(),
    });

    // Function to handle form submission
    const submitForm = () => {
      const toast = useToast();
      toast.success("Form gönderildi", {
        timeout: 3000,
      });

      // Get the current date and time for submission timestamp
      const date = new Date().toLocaleString();

      // Prepare the data for submission
      const value = {
        username: username.value,
        unit: unit.value,
        subject: subject.value,
        error: error.value,
        date: date,
      };

      // Send the data to Dbus
      ipcRenderer.send("dbus:send", JSON.stringify(value));

      // Send the data to the database
      ipcRenderer.send("db:send", value);
    };

    // Create a form instance and handle form submission
    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    // Define reactive form fields using useField
    const { value: username, errorMessage: usernameError } = useField("username");
    const { value: unit, errorMessage: unitError } = useField("unit");
    const { value: subject, errorMessage: subjectError } = useField("subject");
    const { value: error, errorMessage: errorError } = useField("error");

    // Function to be called when the form is submitted
    const onSubmit = handleSubmit(() => {
      submitForm();
    });

    return {
      username,
      usernameError,
      unit,
      unitError,
      subject,
      subjectError,
      error,
      errorError,
      onSubmit,
    };
  },
};
</script>

<style lang="scss">
/* No custom styles defined in the component */
</style>
