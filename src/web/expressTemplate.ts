const html = (strings: TemplateStringsArray) => strings.join(' ')

export const getWrapper = () => html`
  <html lang="en">
    <head>
      <title>Interaction control</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
      <script>
        function toggle() {
          const el = document.getElementById('wrapper')
          el.className = el.className === 'wrapper-visible' ? 'wrapper-hidden' : 'wrapper-visible'
          console.log('toggle')
        }
      </script>
      <style>
        body {
          margin: 0;
          overflow: hidden;
        }

        .root {
          display: flex;
          align-items: stretch;
          width: 100vw;
          height: 100vh;
        }

        .wrapper-visible {
          width: 20vw;
          height: 100%;
        }

        .wrapper-hidden {
          visibility: hidden;
          width: 0;
          height: 100%;
        }

        .main {
          width: 100%;
          height: 100%;
        }

        .toggle-button {
          position: fixed;
          top: 0;
          left: 0;
          border: 1px solid darkgrey;
          border-radius: 4px;
          background-color: white;
          color: black;
          font-size: 16px;
          cursor: pointer;
          height: 10px;
          width: 10px;
        }
      </style>
    </head>
    <body>
      <button class="toggle-button" onclick="toggle()"></button>
      <div class="root">
        <iframe id="wrapper" class="wrapper-visible" src="/__" frameborder="0"></iframe>
        <iframe class="main" src="/" frameborder="0"></iframe>
      </div>
    </body>
  </html>
`

export const getTemplate = () => html` <html lang="en">
  <head>
    <title>Interaction control</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
    <style>
      .btn {
        border: 2px solid black;
        background-color: white;
        color: black;
        padding: 14px 28px;
        font-size: 16px;
        cursor: pointer;
      }

      .selected {
        border-color: #04aa6d;
        color: green;
      }

      .selected:hover {
        background-color: #04aa6d;
        color: white;
      }

      .default {
        border-color: #e7e7e7;
        color: black;
      }

      .default:hover {
        background: #e7e7e7;
      }

      .play-icon {
        width: 25px;
        height: 25px;
      }

      .play-button {
        padding: 0;
        border: none;
        background-color: white;
        cursor: pointer;
        padding-left: 5px;
      }
    </style>
  </head>
  <body>
    <div x-data="data()" x-init="loadConfig()">
      <template x-for="key in Object.keys(config)" :key="key">
        <div>
          <div x-text="key"></div>
          <template x-for="(value, index) in config[key].values" :key="value">
            <button
              x-text="value"
              @click="select(key, index)"
              :class="{'btn': true, 'selected': config[key].selected === index,'default': config[key].selected !== index}"
            ></button>
          </template>
          <button class="play-button" @click="test(key)">
            <img
              alt="test"
              class="play-icon"
              src="https://cdn1.iconfinder.com/data/icons/feather-2/24/play-circle-512.png"
            />
          </button>
        </div>
      </template>
      <hr />
      <div x-text="testStatus"></div>
      <div x-text="JSON.stringify(testData, null, 2)"></div>
    </div>

    <script>
      function data() {
        return {
          config: {},
          testData: undefined,
          testStatus: undefined,
          async loadConfig() {
            this.config = await fetch('/__interactions').then((r) => r.json())
          },
          async select(interaction, index) {
            if (this.config[interaction].selected !== index) {
              await fetch('/__interactions', {
                method: 'POST',
                body: JSON.stringify({ interaction, index }),
                headers: { 'Content-Type': 'application/json' },
              })
              this.config[interaction].selected = index
            }
          },
          async test(interaction) {
            await fetch(this.config[interaction].path, {
              method: this.config[interaction].method,
            })
              .then(async (d) => {
                this.testStatus = d.status
                this.testData = await d.json()
              })
              .catch((d) => {
                this.testData = undefined
              })
          },
        }
      }
    </script>
  </body>
</html>`
