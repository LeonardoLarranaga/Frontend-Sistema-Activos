<template>
    <v-data-table :headers="headers" :items="ubicaciones" :items-per-page="-1" :sort-by="[{ key: 'id', order: 'desc' }]" fixed-header height="90vh">
  
      <template v-slot:top>
        <v-toolbar color="indigo-darken-2">
          <v-toolbar-title color="indigo-darken-2">Ubicación</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
  
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn prepend-icon="mdi-plus-circle-multiple" variant="tonal" elevation="10" color="white" v-bind="props">
                Nueva Ubicación
              </v-btn>
            </template>
            
            <v-card width="120%" style="transform: translateX(-20px);">
              <v-card-title>
                <v-icon class="text-h5 margin" style="margin-top: -5px; margin-right: 8px;">{{ this.editedIndex === -1 ? "mdi-plus-circle-multiple" : "mdi-pencil-circle"}} </v-icon>
                <span class="text-h5 font-weight-bold"> {{this.editedIndex === -1 ? "Nueva Ubicación" : "Editar Ubicación"}} </span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.descripcion" label="Descripción"/>
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
                <p class="text-h5 font-weight-bold" style="white-space: pre-wrap; text-align: center;">¿Quieres eliminar esta ubicación?</p>
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

  </template>
  
  <script>
  import axios from "axios"
  
  export default {
      data: () => ({
        dialog: false,
        dialogDelete: false,
        imageDialog: false,
        activosDialog: false,
        imagePreview: null,
        imageEdited: false,
        imageModel: null,
        activosSelected: [],
        activos: [],
        ubicaciones: [],
        headers: [
          {
            title: "Id",
            key: "id",
            sortable: true
          },
          { title: 'Descripción', 
            key: 'descripcion'
          },
          {
            title: 'Acciones',
            key: 'actions'
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
            title: 'Responsable',
            key: 'responsableId',
            sortable: true
          }, {
            title: 'Imagen',
            key: 'actions'
          }
        ],
        activos: [],
        editedIndex: -1,
        editedItem: {
          id: null,
          descripcion: null,
          imagen: null
        },
        defaultItem: {
          id: null,
          descripcion: null,
          imagen: null
        },
      }),
  
      watch: {
        async dialog(val) {
            if (!val) {
                this.close()
                this.imagePreview = null
                if (this.imageEdited) {
                    await this.fetchUbicaciones()
                    this.imageEdited = false
                }
                this.activosSelected = []
            }
        },

        dialogDelete(val) {
          val || this.closeDelete()
        },
      },

      beforeMount() {
        this.fetchUbicaciones()
        this.fetchActivos()
      },
  
      methods: {
        async fetchUbicaciones() {
            try {
                const response = await axios.get("https://localhost:4000/ubicacion/")
                this.ubicaciones = response.data
            } catch (error) {
                console.log(error)
            }
        },

        async fetchActivos() {
            try {
                const response = await axios.get("https://localhost:4000/activo/")
                this.activos = response.data
            } catch (error) {
                console.log(error)
            }
        },

        async createUbicacion() {
            try {
                const response = await axios.post("https://localhost:4000/ubicacion/", this.editedItem)
                this.ubicaciones.push(response.data.ubicacion)
            } catch (error) {
                console.log(error)
            }
        },

        async editUbicacion() {
            try {
                const response = await axios.put(`https://localhost:4000/ubicacion/${this.editedItem.id}`, this.editedItem)
                await Object.assign(this.ubicaciones[this.editedIndex], await response.data.ubicacion)

                await axios.delete(`https://localhost:4000/ubicacion/${response.data.ubicacion.id}/activos`)
                
                this.activosSelected.forEach(async (activo) => await axios.put(`https://localhost:4000/ubicacion/${response.data.ubicacion.id}/activo/${activo.id}`))
            } catch (error) {
                console.log(error)
            }
        },

       async editItem(item) {
          this.editedIndex = this.ubicaciones.indexOf(item)
          this.editedItem = Object.assign({}, item)
          
          if (item.imagen) this.imagePreview = URL.createObjectURL(new Blob([new Uint8Array(item.imagen.data)], { type: "image/png"}))

          this.activosSelected = []
          const activos = (await axios.get(`https://localhost:4000/ubicacion/${item.id}/activos`)).data
          activos.forEach((a) => this.activosSelected.push(this.activos.find((a2) => a.id == a2.id)))
         
          this.dialog = true
        },
  
        deleteItem(item) {
          this.editedIndex = this.ubicaciones.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
        },
  
        async deleteItemConfirm() {
          try {
            const response = await axios.delete(`https://localhost:4000/ubicacion/${this.editedItem.id}`)
            if (response.status == 200) this.ubicaciones.splice(this.editedIndex, 1)
          } catch (error) {
            console.log(error)
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
            await this.editUbicacion()
          } else {
           await this.createUbicacion()
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
            this.activosSelected = (await axios.get(`https://localhost:4000/ubicacion/${item.id}/activos`)).data
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