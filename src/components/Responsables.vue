<template>
    <v-data-table :headers="headers" :items="responsables" :items-per-page="-1" :sort-by="[{ key: 'id', order: 'desc' }]" fixed-header height="90vh">
  
      <template v-slot:top>
        <v-toolbar color="indigo-darken-2">
          <v-toolbar-title color="indigo-darken-2">Responsables</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
  
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn prepend-icon="mdi-plus-circle-multiple" variant="tonal" elevation="10" color="white" v-bind="props">
                Nuevo Responsable
              </v-btn>
            </template>
            
            <v-card width="120%" style="transform: translateX(-20px);">
              <v-card-title>
                <v-icon class="text-h5 margin" style="margin-top: -5px; margin-right: 8px;">{{ this.editedIndex === -1 ? "mdi-plus-circle-multiple" : "mdi-pencil-circle"}} </v-icon>
                <span class="text-h5 font-weight-bold"> {{this.editedIndex === -1 ? "Nuevo Responsable" : "Editar Responsable"}} </span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.numeroEmpleado" label="Número de Empleado"/>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.nombre" label="Nombre"/>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-select :item-props="this.activoProps" v-model="this.activosSelected" clearable label="Activos" :items="this.activos" chips multiple prepend-inner-icon="mdi-package-variant-closed-plus"/>
                    </v-col>
                    
                    <v-col cols = "12">
                        <v-file-input accept="image/*" label="Imagen" prepend-icon="mdi-image"  @change="selectImage" v-model="this.imageModel"/>
                    </v-col>

                    <v-col v-if="this.imagePreview != null" cols="12">
                        <v-card-text class="text-center">
                            <v-img :src="imagePreview" alt="Imagen"/>
                            <v-btn  prepend-icon="mdi-image-remove" variant="tonal" color="deep-orange-accent-4" class="mt-4" @click="this.imagePreview = null; this.editedItem.imagen = null; this.imageModel = null; this.imageEdited = true">Eliminar Imagen</v-btn>
                        </v-card-text>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer/>
                <v-btn color="indigo-darken-2" variant="text" @click="close">Cancelar</v-btn>
                <v-btn color="indigo-darken-2" variant="tonal" @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="350px">
            <v-card>
              <v-card-title>
                <p class="text-h5 font-weight-bold" style="white-space: pre-wrap; text-align: center;">¿Quieres eliminar este responsable?</p>
              </v-card-title>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="deep-orange-accent-4" variant="tonal" @click="deleteItemConfirm">ELIMINAR</v-btn>
                <v-spacer/>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
  
    <template v-slot:item.actions="{ item }">
            <div>
                <v-icon class="mr-3" size="small" @click="showImageDialog(item)"> mdi-image </v-icon>
                <v-icon class="mr-3" size="small" @click="editItem(item)"> mdi-pencil </v-icon>
            </div>
            <div>
                <v-icon class="mr-3" size="small" @click="showActivosDialog(item)"> mdi-package </v-icon>
                <v-icon class="mr-3" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
            </div>
    </template>

    </v-data-table>

    <template>
        <v-dialog v-model="imageDialog" style="width: 75%">
            <v-card>
                <v-card-title>Imagen</v-card-title>
                <v-col cols = "12">
                    <v-card-text>
                        <v-img :src="imagePreview"/>
                    </v-card-text>
                </v-col>
                <v-btn text="Ok" @click="this.imageDialog = false; this.imagePreview = null"/>
            </v-card>
        </v-dialog>
    </template>

    <template>
        <v-dialog v-model="activosDialog" width="100%">
            <v-card>
                <v-card-title>Activos</v-card-title>
                <v-data-table :items="this.activosSelected" :headers="activosHeaders" :sort-by="[{ key: 'id', order: 'desc' }]">
                    <template v-slot:item.actions="{ item }">
                        <v-icon size="small" @click="showImageDialog(item)"> mdi-image </v-icon>
                    </template>
                </v-data-table>
                <v-btn text="Ok" @click="this.activosDialog = false"/>
            </v-card>
        </v-dialog>
    </template>

    <v-dialog v-model="this.errorDialog" max-width="300px">
      <v-card color="red">
        <v-card-title style="color: white;" class="text-wrap text-center">{{ errorMessage }}</v-card-title>
        <v-btn variant="tonal" @click="errorDialog = false; error = ''" style="color: white;">OK</v-btn>
      </v-card>
  </v-dialog>
  </template>
  
  <script>
  import axios from "axios"
  import { store } from "../store"
  
  export default {
      data: () => ({
        store: store(),
        dialog: false,
        dialogDelete: false,
        imageDialog: false,
        activosDialog: false,
        imagePreview: null,
        imageEdited: false,
        imageModel: null,
        errorDialog: false,
        errorMessage: "",
        activosSelected: [],
        activos: [],
        responsables: [],
        headers: [
          {
            title: "Id",
            key: "id",
            sortable: true
          },
          { title: 'Número de Empleado', 
            key: 'numeroEmpleado', 
            sortable: true 
          },
          { 
            title: 'Nombre', 
            key: 'nombre', 
            sortable: true 
          },
          {
            title: 'Acciones',
            key: 'actions',
            sortable: false
          }
        ],
        activosHeaders: [
            {
             title: 'Id',
             key: 'id',
             sortable: true
            },
            {
             title: 'Serie', 
             key: 'numSerie', 
             sortable: false 
          },
          {
            title: 'Inventario', 
            key: 'numInventario', 
            sortable: false 
          },
          { 
            title: 'Descripción', 
            key: 'descripcion', 
            sortable: false 
          },
          {
            title: 'Ubicación',
            key: 'ubicacionId',
            sortable: true
          }, {
            title: 'Imagen',
            key: 'actions'
          }
        ],
        activos: [],
        editedIndex: -1,
        editedItem: {
          id: 0,
          numeroEmpleado: 0,
          nombre: "",
          imagen: null
        },
        defaultItem: {
          id: 0,
          numeroEmpleado: 0,
          nombre: "",
          imagen: null
        },
      }),
  
      watch: {
        async dialog(val) {
            if (!val) {
                this.close()
                this.imagePreview = null
                if (this.imageEdited) {
                    await this.fetchResponsables()
                    this.imageEdited = false
                }
            }
        },
        dialogDelete(val) {
          val || this.closeDelete()
        },
      },

      beforeMount() {
        this.fetchResponsables()
        this.fetchActivos()
      },
  
      methods: {
        async fetchResponsables() {
            try {
                const response = await axios.get("https://localhost:4000/responsable/", this.store.headers)
                this.responsables = response.data
            } catch (error) {
              this.errorMessage = error.response.data || "Error de conexión."
              this.errorDialog = true            
            }
        },

        async fetchActivos() {
            try {
                const response = await axios.get("https://localhost:4000/activo/", this.store.headers)
                this.activos = response.data
            } catch (error) {
              this.errorMessage = error.response.data || "Error de conexión."
              this.errorDialog = true
            }
        },

        async createResponsable() {
            try {
                const response = await axios.post("https://localhost:4000/responsable/", this.editedItem, this.store.headers)
                this.activosSelected.forEach(async (activo) => await axios.put(`https://localhost:4000/responsable/${response.data.responsable.id}/activo/${activo.id}`, this.store.headers))
                this.responsables.push(response.data.responsable)
            } catch (error) {
              this.errorMessage = error.response.data || "Error de conexión."
              this.errorDialog = true
            }
        },

        async editResponsable() {
            try {
                const response = await axios.put(`https://localhost:4000/responsable/${this.editedItem.id}`, this.editedItem, this.store.headers)
                await Object.assign(this.responsables[this.editedIndex], await response.data.responsable)

                await axios.delete(`https://localhost:4000/responsable/${response.data.responsable.id}/activos`, this.store.headers)
                
                this.activosSelected.forEach(async (activo) => await axios.put(`https://localhost:4000/responsable/${response.data.responsable.id}/activo/${activo.id}`, {}, this.store.headers))
            } catch (error) {
              this.errorMessage = error.response.data || "Error de conexión."
              this.errorDialog = true
            }
        },

       async editItem(item) {
          this.editedIndex = this.responsables.indexOf(item)
          this.editedItem = Object.assign({}, item)
          
          if (item.imagen) this.imagePreview = URL.createObjectURL(new Blob([new Uint8Array(item.imagen.data)], { type: "image/png"}))

          this.activosSelected = []
          const activos = (await axios.get(`https://localhost:4000/responsable/${item.id}/activos`, this.store.headers)).data
          activos.forEach((a) => this.activosSelected.push(this.activos.find((a2) => a.id == a2.id)))
         
          this.dialog = true
        },
  
        deleteItem(item) {
          this.editedIndex = this.responsables.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
        },
  
        async deleteItemConfirm() {
          try {
            const response = await axios.delete(`https://localhost:4000/responsable/${this.editedItem.id}`, this.store.headers)
            if (response.status == 200) this.responsables.splice(this.editedIndex, 1)
          } catch (error) {
            this.errorMessage = error.response.data || "Error de conexión."
            this.errorDialog = true
          }
  
          this.closeDelete()
        },
  
        close() {
          this.dialog = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
          })
          this.imagePreview = null
        },
  
        closeDelete() {
          this.dialogDelete = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
          })
        },
  
        async save() {
          if (this.editedIndex > -1) {
            await this.editResponsable()
          } else {
           await this.createResponsable()
          }

          this.close()
        },

        async showImageDialog(item) {
            if (item.imagen) {
                console.log(new Blob([new Uint8Array(await item.imagen.data)], { type: "image/png"}))
                this.imagePreview = URL.createObjectURL(new Blob([new Uint8Array(await item.imagen.data)], { type: "image/png"}))
            }

            this.imageDialog = true
        },

        selectImage(event) {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = (event) => {
                this.editedItem.imagen = Array.from(new Uint8Array(event.target.result))
                this.imageEdited = true
                this.imagePreview = URL.createObjectURL(new Blob([new Uint8Array(event.target.result)], { type: "image/png"}))
            }
            reader.readAsArrayBuffer(file) 
        },

        async showActivosDialog(item) {
            this.activosSelected = (await axios.get(`https://localhost:4000/responsable/${item.id}/activos`, this.store.headers)).data
            this.activosDialog = true
        },

        activoProps(item) {
            return {
                title: item.id,
                subtitle: `${item.numSerie} - ${item.descripcion}`
            }
        }
      },
    }
  </script>