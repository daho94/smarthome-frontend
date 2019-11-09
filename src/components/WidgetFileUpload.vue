<template>
  <section class="wrapper">
    <div v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
          }">
      <div>
        <div>
          <div class="drag">
            <div class="upload">
              <ul v-if="files.length">
                <li v-for="(file) in files" :key="file.id">
                  <span>{{file.name}}</span> -
                  <span>{{file.size | formatSize}}</span> -
                  <span v-if="file.error">{{file.error}}</span>
                  <span v-else-if="file.success">success</span>
                  <span v-else-if="file.active">active</span>
                  <span v-else></span>
                </li>
              </ul>
              <div v-else>
                <div class="text-center p-5">
                  <h4>Drop files anywhere to upload</h4>
                </div>
              </div>
            </div>
            <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
              <h3>Drop files to upload</h3>
            </div>
            <div class="example-btn">
              <b-button-group>
                <file-upload class="btn btn-primary" post-action="/api/file" :multiple="true" :drop="true"
                  :drop-directory="true" v-model="files" ref="upload" @input-file="inputFile">
                  Select files
                </file-upload>
                <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active"
                  @click.prevent="$refs.upload.active = true">
                  Start Upload
                </button>
                <button type="button" class="btn btn-danger" v-else @click.prevent="$refs.upload.active = false">
                  Stop Upload
                </button>
              </b-button-group>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>
<style lang="scss" scoped>
  .wrapper {
    align-items: unset !important;
    font-size: 1em !important;
    width: 100%;
  }

  .upload {
    li {
      list-style: none;
    }
  }

  .drag {
    margin: 10px;
    width: 100%;
  }

  .drag label.btn {
    margin-bottom: 0;
    margin-right: 1rem;
  }

  .drag .drop-active {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 9999;
    opacity: .6;
    text-align: center;
    background: #000;
  }

  .drag .drop-active h3 {
    margin: -.5em 0 0;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    padding: 0;
  }
</style>

<script>
  import FileUpload from 'vue-upload-component'
  import Vue from 'vue'

  Vue.filter('formatSize', function (size) {
    if (size > 1024 * 1024 * 1024 * 1024) {
      return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
    } else if (size > 1024 * 1024 * 1024) {
      return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
    } else if (size > 1024 * 1024) {
      return (size / 1024 / 1024).toFixed(2) + ' MB'
    } else if (size > 1024) {
      return (size / 1024).toFixed(2) + ' KB'
    }
    return size.toString() + ' B'
  })

  export default {
    components: {
      FileUpload,
    },
    data() {
      return {
        files: [],
      }
    },
    methods: {
      /** 
       * All files are uploaded to the /img folder
       * Filename has to be changed to prevent 'dir not found' errors
      */
      inputFile(newFile, oldFile) {
        if (newFile && oldFile) {
          // Update filename
          newFile.name = newFile.file.name
        }
      }   
    }
  }
</script>