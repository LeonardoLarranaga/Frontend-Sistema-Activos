<template>
    <v-data-table :headers="headers" :items="activos" :items-per-page="-1" :sort-by="[{ key: 'id', order: 'desc' }]" fixed-header height="90vh">

      <template v-slot:item.ubicacionId="{ item }">
        <span v-if="ubicaciones.length > 0">
            {{ ubicaciones.find((u) => u.id == item.ubicacionId)?.descripcion || "-----" }}
        </span>
    </template>

    <template v-slot:item.responsableId="{ item }">
        <span v-if="responsables.length > 0">
            {{ responsables.find((r) => r.id == item.responsableId)?.nombre || "-----" }}
        </span>
    </template>
  
      <template v-slot:top>
        <v-toolbar color="indigo-darken-2">
          <v-toolbar-title color="indigo-darken-2">Activos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
  
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn prepend-icon="mdi-plus-circle-multiple" variant="tonal" elevation="10" color="white" v-bind="props">
                Nuevo Activo
              </v-btn>
            </template>
            
            <v-card width="120%" style="transform: translateX(-20px);">
              <v-card-title>
                <v-icon class="text-h5 margin" style="margin-top: -5px; margin-right: 8px;">{{ this.editedIndex === -1 ? "mdi-plus-circle-multiple" : "mdi-pencil-circle"}} </v-icon>
                <span class="text-h5 font-weight-bold"> {{this.editedIndex === -1 ? "Nuevo Activo" : "Editar Activo"}} </span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.numSerie" label="Serie"/>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.numInventario" label="Inventario"/>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-textarea v-model="editedItem.descripcion" label="Descripción" clearable/>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                        <v-select :item-props="this.ubicacionProps" v-model="this.ubicacionSelected" clearable label="Ubicación" :items="this.ubicaciones" prepend-inner-icon="mdi-archive-marker"/> 
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                        <v-select :item-props="this.responsableProps" v-model="this.responsableSelected" clearable label="Responsable" :items="this.responsables" prepend-inner-icon="mdi-account-tie"/> 
                    </v-col>

                    <v-col cols ="12">
                        <v-select :item-props="this.tagProps" v-model="this.tagsSelected" clearable label="Tags" :items="this.tags" chips multiple prepend-inner-icon="mdi-tag-multiple"/>
                    </v-col>

                    <v-col cols = "12">
                        <v-file-input accept="image/*" label="Imagen" prepend-icon="mdi-image"  @change="selectImage" v-model="imageModel"/>
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
                <p class="text-h5 font-weight-bold" style="white-space: pre-wrap; text-align: center;">¿Quieres eliminar este activo?</p>
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
        <div class="d-flex justify-center">
          <div>
            <v-icon size="small" @click="showImageDialog(item)"> mdi-image </v-icon>
            <v-icon size="small" @click="editItem(item)"> mdi-pencil </v-icon>
          </div>
        </div>
        <div class="d-flex justify-center mt-2">
          <div>
            <v-icon size="small" @click="showTagsDialog(item)"> mdi-tag-multiple </v-icon>
            <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
          </div>
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
        <v-dialog v-model="tagsDialog" width="550px">
            <v-card>
                <v-card-title>Tags</v-card-title>
                <v-data-table :items="this.tagsSelected" :headers="tagsHeaders" :sort-by="[{ key: 'id', order: 'desc' }]"/>
                <v-btn text="Ok" @click="this.tagsDialog = false"/>
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
        tagsDialog: false,
        imagePreview: null,
        imageEdited: false,
        imageModel: null,
        ubicaciones: [],
        ubicacionSelected: null,
        responsables: [],
        responsableSelected: null,
        tags: [],
        tagsSelected: [],
        headers: [
          {
            title: "Id",
            key: "id",
            sortable: true
          },
          { title: 'Serie', 
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
          },
          {
            title: 'Responsable',
            key: 'responsableId',
            sortable: true
          },
          {
            title: "Acciones",
            key: "actions",
            sortable: false
          }
        ],
        tagsHeaders: [
          {
            title: "Id",
            key: "id",
            sortable: true
          },
          {
            title: "Nombre",
            key: "nombre",
            sortable: true
          }
        ],
        activos: [],
        editedIndex: -1,
        editedItem: {
          id: 0,
          numSerie: "",
          numInventario: "",
          descripcion: "",
          imagen: null,
          ubicacionId: null,
          responsableId: null,
        },
        defaultItem: {
          id: 0,
          numSerie: "",
          numInventario: "",
          descripcion: "",
          imagen: null,
          ubicacionId: null,
          responsableId: null,
        },
      }),
  
      watch: {
        async dialog(val) {
            if (!val) {
                this.close()
                this.ubicacionSelected = null
                this.responsableSelected = null
                this.imagePreview = null
                if (this.imageEdited) await this.fetchActivos()
                this.imageEdited = false
                this.tagsSelected = []
            }
        },
        dialogDelete(val) {
          val || this.closeDelete()
        },
      },

      beforeMount() {
        this.fetchActivos()
        this.fetchUbicaciones()
        this.fetchResponsables()
        this.fetchTags()
      },
  
      methods: {
        async fetchActivos() {
          try {
            const response = await axios.get("https://localhost:4000/activo/")
            this.activos = response.data
          } catch (error) {
            console.log(error)
          }
        },

        async fetchUbicaciones() {
            try {
                const response = await axios.get("https://localhost:4000/ubicacion/")
                this.ubicaciones = response.data
            } catch (error) {
                console.log(error)
            }
        },

        async fetchResponsables() {
            try {
                const response = await axios.get("https://localhost:4000/responsable/")
                this.responsables = response.data
            } catch (error) {
                console.log(error)
            }
        },

        async fetchTags() {
            try {
                const response = await axios.get("https://localhost:4000/tag")
                this.tags = response.data
            } catch (error) {
                console.log(error)
            }
        },
  
        async createActivo() {
          try {
            this.editedItem.ubicacionId = this.ubicacionSelected ? this.ubicacionSelected.id : null
            this.editedItem.responsableId = this.responsableSelected ? this.responsableSelected.id : null

            const response = await axios.post("https://localhost:4000/activo/", this.editedItem)   
            const newActivo = response.data.activo       
            this.activos.push(newActivo)
            
            this.tagsSelected.forEach((tag) => {
                axios.post(`https://localhost:4000/activo/${newActivo.id}/tag/${tag.id}`)
            })
            
          } catch (error) {
            console.log(error)
          }
        },
  
        async editActivo() {
          try {
            this.editedItem.responsableId = this.responsableSelected ? this.responsableSelected.id : null
            this.editedItem.ubicacionId = this.ubicacionSelected ? this.ubicacionSelected.id : null

            const response = await axios.put(`https://localhost:4000/activo/${this.editedItem.id}`, this.editedItem)

            await axios.delete(`https://localhost:4000/activo/${response.data.activo.id}/tag/`)
           
            this.tagsSelected.forEach((tag) => {
                axios.post(`https://localhost:4000/activo/${response.data.activo.id}/tag/${tag.id}`)
            })

            await Object.assign(this.activos[this.editedIndex], response.data.activo)
          } catch (error) {
            console.log(error)
          }
        },
  
       async editItem(item) {
          this.editedIndex = this.activos.indexOf(item)
          this.editedItem = Object.assign({}, item)
          
          if (item.imagen) this.imagePreview = URL.createObjectURL(new Blob([new Uint8Array(item.imagen.data)], { type: "image/png"}))
          if (item.responsableId) this.responsableSelected = this.responsables.find((r) => r.id == item.responsableId)
          if (item.ubicacionId) this.ubicacionSelected = this.ubicaciones.find((u) => u.id == item.ubicacionId)

          const tags = (await axios.get(`https://localhost:4000/activo/${item.id}/tags`)).data
          this.tagsSelected = []
          tags.forEach((t) => this.tagsSelected.push(this.tags.find((t2) => t2.id == t.id)))
          
          this.dialog = true
        },
  
        deleteItem(item) {
          this.editedIndex = this.activos.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
        },
  
        async deleteItemConfirm() {
          try {
            const response = await axios.delete(`https://localhost:4000/activo/${this.editedItem.id}`)
            if (response.status == 200) this.activos.splice(this.editedIndex, 1)
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
            await this.editActivo()
          } else {
           await this.createActivo()
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

        async showTagsDialog(item) {
            this.tagsSelected = (await axios.get(`https://localhost:4000/activo/${item.id}/tags`)).data
            this.tagsDialog = true
        },

        ubicacionProps(item) {
            return {
                title: item.id,
                subtitle: item.descripcion
            }
        },

        responsableProps(item) {
            return {
                title: item.nombre,
                subtitle: item.numeroEmpleado
            }
        },

        tagProps(item) {
            return {
                title: item.nombre,
                subtitle: item.id
            }
        }
      },
    }
  </script>