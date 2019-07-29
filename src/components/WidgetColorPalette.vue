<template>
    <section class="color-palette">
        <div v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
          }">
          <div>
            <div class="color-wrapper">
              <div 
                class="color" 
                :style="{'background-color': color.name}" 
                v-for="(color, i) in colors" 
                :key="i"
                @click="changeColor(color, i)"
              >
              <div v-if="i === selected" class="check-circle">
                <i class="material-icons">check</i>  
              </div>
              </div> 
            </div>
          </div>
        </div>
    </section>
</template>
<script>
import { setColor } from '../calls/hyperion'

 const COLORS = [
  {
    "name": "aliceblue",
    "hex": "#F0F8FF",
    "dec": {
      "r": 240,
      "g": 248,
      "b": 255
    }
  },
  {
    "name": "antiquewhite",
    "hex": "#FAEBD7",
    "dec": {
      "r": 250,
      "g": 235,
      "b": 215
    }
  },
  {
    "name": "aqua",
    "hex": "#00FFFF",
    "dec": {
      "r": 0,
      "g": 255,
      "b": 255
    }
  },
  {
    "name": "aquamarine",
    "hex": "#7FFFD4",
    "dec": {
      "r": 127,
      "g": 255,
      "b": 212
    }
  },
  {
    "name": "azure",
    "hex": "#F0FFFF",
    "dec": {
      "r": 240,
      "g": 255,
      "b": 255
    }
  },
  {
    "name": "beige",
    "hex": "#F5F5DC",
    "dec": {
      "r": 245,
      "g": 245,
      "b": 220
    }
  },
  {
    "name": "bisque",
    "hex": "#FFE4C4",
    "dec": {
      "r": 255,
      "g": 228,
      "b": 196
    }
  },
  {
    "name": "black",
    "hex": "#000000",
    "dec": {
      "r": 0,
      "g": 0,
      "b": 0
    }
  },
  {
    "name": "blanchedalmond",
    "hex": "#FFEBCD",
    "dec": {
      "r": 255,
      "g": 235,
      "b": 205
    }
  },
  {
    "name": "blue",
    "hex": "#0000FF",
    "dec": {
      "r": 0,
      "g": 0,
      "b": 255
    }
  },
  {
    "name": "blueviolet",
    "hex": "#8A2BE2",
    "dec": {
      "r": 138,
      "g": 43,
      "b": 226
    }
  },
  {
    "name": "brown",
    "hex": "#A52A2A",
    "dec": {
      "r": 165,
      "g": 42,
      "b": 42
    }
  },
  {
    "name": "burlywood",
    "hex": "#DEB887",
    "dec": {
      "r": 222,
      "g": 184,
      "b": 135
    }
  },
  {
    "name": "cadetblue",
    "hex": "#5F9EA0",
    "dec": {
      "r": 95,
      "g": 158,
      "b": 160
    }
  },
  {
    "name": "chartreuse",
    "hex": "#7FFF00",
    "dec": {
      "r": 127,
      "g": 255,
      "b": 0
    }
  },
  {
    "name": "chocolate",
    "hex": "#D2691E",
    "dec": {
      "r": 210,
      "g": 105,
      "b": 30
    }
  },
  {
    "name": "coral",
    "hex": "#FF7F50",
    "dec": {
      "r": 255,
      "g": 127,
      "b": 80
    }
  },
  {
    "name": "cornflowerblue",
    "hex": "#6495ED",
    "dec": {
      "r": 100,
      "g": 149,
      "b": 237
    }
  },
  {
    "name": "cornsilk",
    "hex": "#FFF8DC",
    "dec": {
      "r": 255,
      "g": 248,
      "b": 220
    }
  },
  {
    "name": "crimson",
    "hex": "#DC143C",
    "dec": {
      "r": 220,
      "g": 20,
      "b": 60
    }
  },
  {
    "name": "cyan",
    "hex": "#00FFFF",
    "dec": {
      "r": 0,
      "g": 255,
      "b": 255
    }
  },
  {
    "name": "darkblue",
    "hex": "#00008B",
    "dec": {
      "r": 0,
      "g": 0,
      "b": 139
    }
  },
  {
    "name": "darkcyan",
    "hex": "#008B8B",
    "dec": {
      "r": 0,
      "g": 139,
      "b": 139
    }
  },
  {
    "name": "darkgoldenrod",
    "hex": "#B8860B",
    "dec": {
      "r": 184,
      "g": 134,
      "b": 11
    }
  },
  {
    "name": "darkgray",
    "hex": "#A9A9A9",
    "dec": {
      "r": 169,
      "g": 169,
      "b": 169
    }
  },
  {
    "name": "darkgreen",
    "hex": "#006400",
    "dec": {
      "r": 0,
      "g": 100,
      "b": 0
    }
  },
  {
    "name": "darkgrey",
    "hex": "#A9A9A9",
    "dec": {
      "r": 169,
      "g": 169,
      "b": 169
    }
  },
  {
    "name": "darkkhaki",
    "hex": "#BDB76B",
    "dec": {
      "r": 189,
      "g": 183,
      "b": 107
    }
  },
  {
    "name": "darkmagenta",
    "hex": "#8B008B",
    "dec": {
      "r": 139,
      "g": 0,
      "b": 139
    }
  },
  {
    "name": "darkolivegreen",
    "hex": "#556B2F",
    "dec": {
      "r": 85,
      "g": 107,
      "b": 47
    }
  },
  {
    "name": "darkorange",
    "hex": "#FF8C00",
    "dec": {
      "r": 255,
      "g": 140,
      "b": 0
    }
  },
  {
    "name": "darkorchid",
    "hex": "#9932CC",
    "dec": {
      "r": 153,
      "g": 50,
      "b": 204
    }
  },
  {
    "name": "darkred",
    "hex": "#8B0000",
    "dec": {
      "r": 139,
      "g": 0,
      "b": 0
    }
  },
  {
    "name": "darksalmon",
    "hex": "#E9967A",
    "dec": {
      "r": 233,
      "g": 150,
      "b": 122
    }
  },
  {
    "name": "darkseagreen",
    "hex": "#8FBC8F",
    "dec": {
      "r": 143,
      "g": 188,
      "b": 143
    }
  },
  {
    "name": "darkslateblue",
    "hex": "#483D8B",
    "dec": {
      "r": 72,
      "g": 61,
      "b": 139
    }
  },
  {
    "name": "darkslategray",
    "hex": "#2F4F4F",
    "dec": {
      "r": 47,
      "g": 79,
      "b": 79
    }
  },
  {
    "name": "darkslategrey",
    "hex": "#2F4F4F",
    "dec": {
      "r": 47,
      "g": 79,
      "b": 79
    }
  },
  {
    "name": "darkturquoise",
    "hex": "#00CED1",
    "dec": {
      "r": 0,
      "g": 206,
      "b": 209
    }
  },
  {
    "name": "darkviolet",
    "hex": "#9400D3",
    "dec": {
      "r": 148,
      "g": 0,
      "b": 211
    }
  },
  {
    "name": "deeppink",
    "hex": "#FF1493",
    "dec": {
      "r": 255,
      "g": 20,
      "b": 147
    }
  },
  {
    "name": "deepskyblue",
    "hex": "#00BFFF",
    "dec": {
      "r": 0,
      "g": 191,
      "b": 255
    }
  },
  {
    "name": "dimgray",
    "hex": "#696969",
    "dec": {
      "r": 105,
      "g": 105,
      "b": 105
    }
  },
  {
    "name": "dimgrey",
    "hex": "#696969",
    "dec": {
      "r": 105,
      "g": 105,
      "b": 105
    }
  },
  {
    "name": "dodgerblue",
    "hex": "#1E90FF",
    "dec": {
      "r": 30,
      "g": 144,
      "b": 255
    }
  },
  {
    "name": "firebrick",
    "hex": "#B22222",
    "dec": {
      "r": 178,
      "g": 34,
      "b": 34
    }
  },
  {
    "name": "floralwhite",
    "hex": "#FFFAF0",
    "dec": {
      "r": 255,
      "g": 250,
      "b": 240
    }
  },
  {
    "name": "forestgreen",
    "hex": "#228B22",
    "dec": {
      "r": 34,
      "g": 139,
      "b": 34
    }
  },
  {
    "name": "fuchsia",
    "hex": "#FF00FF",
    "dec": {
      "r": 255,
      "g": 0,
      "b": 255
    }
  },
  {
    "name": "gainsboro",
    "hex": "#DCDCDC",
    "dec": {
      "r": 220,
      "g": 220,
      "b": 220
    }
  },
  {
    "name": "ghostwhite",
    "hex": "#F8F8FF",
    "dec": {
      "r": 248,
      "g": 248,
      "b": 255
    }
  },
  {
    "name": "gold",
    "hex": "#FFD700",
    "dec": {
      "r": 255,
      "g": 215,
      "b": 0
    }
  },
  {
    "name": "goldenrod",
    "hex": "#DAA520",
    "dec": {
      "r": 218,
      "g": 165,
      "b": 32
    }
  },
  {
    "name": "gray",
    "hex": "#808080",
    "dec": {
      "r": 128,
      "g": 128,
      "b": 128
    }
  },
  {
    "name": "green",
    "hex": "#008000",
    "dec": {
      "r": 0,
      "g": 128,
      "b": 0
    }
  },
  {
    "name": "greenyellow",
    "hex": "#ADFF2F",
    "dec": {
      "r": 173,
      "g": 255,
      "b": 47
    }
  },
  {
    "name": "grey",
    "hex": "#808080",
    "dec": {
      "r": 128,
      "g": 128,
      "b": 128
    }
  },
  {
    "name": "honeydew",
    "hex": "#F0FFF0",
    "dec": {
      "r": 240,
      "g": 255,
      "b": 240
    }
  },
  {
    "name": "hotpink",
    "hex": "#FF69B4",
    "dec": {
      "r": 255,
      "g": 105,
      "b": 180
    }
  },
  {
    "name": "indianred",
    "hex": "#CD5C5C",
    "dec": {
      "r": 205,
      "g": 92,
      "b": 92
    }
  },
  {
    "name": "indigo",
    "hex": "#4B0082",
    "dec": {
      "r": 75,
      "g": 0,
      "b": 130
    }
  },
  {
    "name": "ivory",
    "hex": "#FFFFF0",
    "dec": {
      "r": 255,
      "g": 255,
      "b": 240
    }
  },
  {
    "name": "khaki",
    "hex": "#F0E68C",
    "dec": {
      "r": 240,
      "g": 230,
      "b": 140
    }
  },
  {
    "name": "lavender",
    "hex": "#E6E6FA",
    "dec": {
      "r": 230,
      "g": 230,
      "b": 250
    }
  },
  {
    "name": "lavenderblush",
    "hex": "#FFF0F5",
    "dec": {
      "r": 255,
      "g": 240,
      "b": 245
    }
  },
  {
    "name": "lawngreen",
    "hex": "#7CFC00",
    "dec": {
      "r": 124,
      "g": 252,
      "b": 0
    }
  },
  {
    "name": "lemonchiffon",
    "hex": "#FFFACD",
    "dec": {
      "r": 255,
      "g": 250,
      "b": 205
    }
  },
  {
    "name": "lightblue",
    "hex": "#ADD8E6",
    "dec": {
      "r": 173,
      "g": 216,
      "b": 230
    }
  },
  {
    "name": "lightcoral",
    "hex": "#F08080",
    "dec": {
      "r": 240,
      "g": 128,
      "b": 128
    }
  },
  {
    "name": "lightcyan",
    "hex": "#E0FFFF",
    "dec": {
      "r": 224,
      "g": 255,
      "b": 255
    }
  },
  {
    "name": "lightgoldenrodyellow",
    "hex": "#FAFAD2",
    "dec": {
      "r": 250,
      "g": 250,
      "b": 210
    }
  },
  {
    "name": "lightgray",
    "hex": "#D3D3D3",
    "dec": {
      "r": 211,
      "g": 211,
      "b": 211
    }
  },
  {
    "name": "lightgreen",
    "hex": "#90EE90",
    "dec": {
      "r": 144,
      "g": 238,
      "b": 144
    }
  },
  {
    "name": "lightgrey",
    "hex": "#D3D3D3",
    "dec": {
      "r": 211,
      "g": 211,
      "b": 211
    }
  },
  {
    "name": "lightpink",
    "hex": "#FFB6C1",
    "dec": {
      "r": 255,
      "g": 182,
      "b": 193
    }
  },
  {
    "name": "lightsalmon",
    "hex": "#FFA07A",
    "dec": {
      "r": 255,
      "g": 160,
      "b": 122
    }
  },
  {
    "name": "lightseagreen",
    "hex": "#20B2AA",
    "dec": {
      "r": 32,
      "g": 178,
      "b": 170
    }
  },
  {
    "name": "lightskyblue",
    "hex": "#87CEFA",
    "dec": {
      "r": 135,
      "g": 206,
      "b": 250
    }
  },
  {
    "name": "lightslategray",
    "hex": "#778899",
    "dec": {
      "r": 119,
      "g": 136,
      "b": 153
    }
  },
  {
    "name": "lightslategrey",
    "hex": "#778899",
    "dec": {
      "r": 119,
      "g": 136,
      "b": 153
    }
  },
  {
    "name": "lightsteelblue",
    "hex": "#B0C4DE",
    "dec": {
      "r": 176,
      "g": 196,
      "b": 222
    }
  },
  {
    "name": "lightyellow",
    "hex": "#FFFFE0",
    "dec": {
      "r": 255,
      "g": 255,
      "b": 224
    }
  },
  {
    "name": "lime",
    "hex": "#00FF00",
    "dec": {
      "r": 0,
      "g": 255,
      "b": 0
    }
  },
  {
    "name": "limegreen",
    "hex": "#32CD32",
    "dec": {
      "r": 50,
      "g": 205,
      "b": 50
    }
  },
  {
    "name": "linen",
    "hex": "#FAF0E6",
    "dec": {
      "r": 250,
      "g": 240,
      "b": 230
    }
  },
  {
    "name": "magenta",
    "hex": "#FF00FF",
    "dec": {
      "r": 255,
      "g": 0,
      "b": 255
    }
  },
  {
    "name": "maroon",
    "hex": "#800000",
    "dec": {
      "r": 128,
      "g": 0,
      "b": 0
    }
  },
  {
    "name": "mediumaquamarine",
    "hex": "#66CDAA",
    "dec": {
      "r": 102,
      "g": 205,
      "b": 170
    }
  },
  {
    "name": "mediumblue",
    "hex": "#0000CD",
    "dec": {
      "r": 0,
      "g": 0,
      "b": 205
    }
  },
  {
    "name": "mediumorchid",
    "hex": "#BA55D3",
    "dec": {
      "r": 186,
      "g": 85,
      "b": 211
    }
  },
  {
    "name": "mediumpurple",
    "hex": "#9370DB",
    "dec": {
      "r": 147,
      "g": 112,
      "b": 219
    }
  },
  {
    "name": "mediumseagreen",
    "hex": "#3CB371",
    "dec": {
      "r": 60,
      "g": 179,
      "b": 113
    }
  },
  {
    "name": "mediumslateblue",
    "hex": "#7B68EE",
    "dec": {
      "r": 123,
      "g": 104,
      "b": 238
    }
  },
  {
    "name": "mediumspringgreen",
    "hex": "#00FA9A",
    "dec": {
      "r": 0,
      "g": 250,
      "b": 154
    }
  },
  {
    "name": "mediumturquoise",
    "hex": "#48D1CC",
    "dec": {
      "r": 72,
      "g": 209,
      "b": 204
    }
  },
  {
    "name": "mediumvioletred",
    "hex": "#C71585",
    "dec": {
      "r": 199,
      "g": 21,
      "b": 133
    }
  },
  {
    "name": "midnightblue",
    "hex": "#191970",
    "dec": {
      "r": 25,
      "g": 25,
      "b": 112
    }
  },
  {
    "name": "mintcream",
    "hex": "#F5FFFA",
    "dec": {
      "r": 245,
      "g": 255,
      "b": 250
    }
  },
  {
    "name": "mistyrose",
    "hex": "#FFE4E1",
    "dec": {
      "r": 255,
      "g": 228,
      "b": 225
    }
  },
  {
    "name": "moccasin",
    "hex": "#FFE4B5",
    "dec": {
      "r": 255,
      "g": 228,
      "b": 181
    }
  },
  {
    "name": "navajowhite",
    "hex": "#FFDEAD",
    "dec": {
      "r": 255,
      "g": 222,
      "b": 173
    }
  },
  {
    "name": "navy",
    "hex": "#000080",
    "dec": {
      "r": 0,
      "g": 0,
      "b": 128
    }
  },
  {
    "name": "oldlace",
    "hex": "#FDF5E6",
    "dec": {
      "r": 253,
      "g": 245,
      "b": 230
    }
  },
  {
    "name": "olive",
    "hex": "#808000",
    "dec": {
      "r": 128,
      "g": 128,
      "b": 0
    }
  },
  {
    "name": "olivedrab",
    "hex": "#6B8E23",
    "dec": {
      "r": 107,
      "g": 142,
      "b": 35
    }
  },
  {
    "name": "orange",
    "hex": "#FFA500",
    "dec": {
      "r": 255,
      "g": 165,
      "b": 0
    }
  },
  {
    "name": "orangered",
    "hex": "#FF4500",
    "dec": {
      "r": 255,
      "g": 69,
      "b": 0
    }
  },
  {
    "name": "orchid",
    "hex": "#DA70D6",
    "dec": {
      "r": 218,
      "g": 112,
      "b": 214
    }
  },
  {
    "name": "palegoldenrod",
    "hex": "#EEE8AA",
    "dec": {
      "r": 238,
      "g": 232,
      "b": 170
    }
  },
  {
    "name": "palegreen",
    "hex": "#98FB98",
    "dec": {
      "r": 152,
      "g": 251,
      "b": 152
    }
  },
  {
    "name": "paleturquoise",
    "hex": "#AFEEEE",
    "dec": {
      "r": 175,
      "g": 238,
      "b": 238
    }
  },
  {
    "name": "palevioletred",
    "hex": "#DB7093",
    "dec": {
      "r": 219,
      "g": 112,
      "b": 147
    }
  },
  {
    "name": "papayawhip",
    "hex": "#FFEFD5",
    "dec": {
      "r": 255,
      "g": 239,
      "b": 213
    }
  },
  {
    "name": "peachpuff",
    "hex": "#FFDAB9",
    "dec": {
      "r": 255,
      "g": 218,
      "b": 185
    }
  },
  {
    "name": "peru",
    "hex": "#CD853F",
    "dec": {
      "r": 205,
      "g": 133,
      "b": 63
    }
  },
  {
    "name": "pink",
    "hex": "#FFC0CB",
    "dec": {
      "r": 255,
      "g": 192,
      "b": 203
    }
  },
  {
    "name": "plum",
    "hex": "#DDA0DD",
    "dec": {
      "r": 221,
      "g": 160,
      "b": 221
    }
  },
  {
    "name": "powderblue",
    "hex": "#B0E0E6",
    "dec": {
      "r": 176,
      "g": 224,
      "b": 230
    }
  },
  {
    "name": "purple",
    "hex": "#800080",
    "dec": {
      "r": 128,
      "g": 0,
      "b": 128
    }
  },
  {
    "name": "red",
    "hex": "#FF0000",
    "dec": {
      "r": 255,
      "g": 0,
      "b": 0
    }
  },
  {
    "name": "rosybrown",
    "hex": "#BC8F8F",
    "dec": {
      "r": 188,
      "g": 143,
      "b": 143
    }
  },
  {
    "name": "royalblue",
    "hex": "#4169E1",
    "dec": {
      "r": 65,
      "g": 105,
      "b": 225
    }
  },
  {
    "name": "saddlebrown",
    "hex": "#8B4513",
    "dec": {
      "r": 139,
      "g": 69,
      "b": 19
    }
  },
  {
    "name": "salmon",
    "hex": "#FA8072",
    "dec": {
      "r": 250,
      "g": 128,
      "b": 114
    }
  },
  {
    "name": "sandybrown",
    "hex": "#F4A460",
    "dec": {
      "r": 244,
      "g": 164,
      "b": 96
    }
  },
  {
    "name": "seagreen",
    "hex": "#2E8B57",
    "dec": {
      "r": 46,
      "g": 139,
      "b": 87
    }
  },
  {
    "name": "seashell",
    "hex": "#FFF5EE",
    "dec": {
      "r": 255,
      "g": 245,
      "b": 238
    }
  },
  {
    "name": "sienna",
    "hex": "#A0522D",
    "dec": {
      "r": 160,
      "g": 82,
      "b": 45
    }
  },
  {
    "name": "silver",
    "hex": "#C0C0C0",
    "dec": {
      "r": 192,
      "g": 192,
      "b": 192
    }
  },
  {
    "name": "skyblue",
    "hex": "#87CEEB",
    "dec": {
      "r": 135,
      "g": 206,
      "b": 235
    }
  },
  {
    "name": "slateblue",
    "hex": "#6A5ACD",
    "dec": {
      "r": 106,
      "g": 90,
      "b": 205
    }
  },
  {
    "name": "slategray",
    "hex": "#708090",
    "dec": {
      "r": 112,
      "g": 128,
      "b": 144
    }
  },
  {
    "name": "slategrey",
    "hex": "#708090",
    "dec": {
      "r": 112,
      "g": 128,
      "b": 144
    }
  },
  {
    "name": "snow",
    "hex": "#FFFAFA",
    "dec": {
      "r": 255,
      "g": 250,
      "b": 250
    }
  },
  {
    "name": "springgreen",
    "hex": "#00FF7F",
    "dec": {
      "r": 0,
      "g": 255,
      "b": 127
    }
  },
  {
    "name": "steelblue",
    "hex": "#4682B4",
    "dec": {
      "r": 70,
      "g": 130,
      "b": 180
    }
  },
  {
    "name": "tan",
    "hex": "#D2B48C",
    "dec": {
      "r": 210,
      "g": 180,
      "b": 140
    }
  },
  {
    "name": "teal",
    "hex": "#008080",
    "dec": {
      "r": 0,
      "g": 128,
      "b": 128
    }
  },
  {
    "name": "thistle",
    "hex": "#D8BFD8",
    "dec": {
      "r": 216,
      "g": 191,
      "b": 216
    }
  },
  {
    "name": "tomato",
    "hex": "#FF6347",
    "dec": {
      "r": 255,
      "g": 99,
      "b": 71
    }
  },
  {
    "name": "turquoise",
    "hex": "#40E0D0",
    "dec": {
      "r": 64,
      "g": 224,
      "b": 208
    }
  },
  {
    "name": "violet",
    "hex": "#EE82EE",
    "dec": {
      "r": 238,
      "g": 130,
      "b": 238
    }
  },
  {
    "name": "wheat",
    "hex": "#F5DEB3",
    "dec": {
      "r": 245,
      "g": 222,
      "b": 179
    }
  },
  {
    "name": "white",
    "hex": "#FFFFFF",
    "dec": {
      "r": 255,
      "g": 255,
      "b": 255
    }
  },
  {
    "name": "whitesmoke",
    "hex": "#F5F5F5",
    "dec": {
      "r": 245,
      "g": 245,
      "b": 245
    }
  },
  {
    "name": "yellow",
    "hex": "#FFFF00",
    "dec": {
      "r": 255,
      "g": 255,
      "b": 0
    }
  },
  {
    "name": "yellowgreen",
    "hex": "#9ACD32",
    "dec": {
      "r": 154,
      "g": 205,
      "b": 50
    }
  }
];

export default {
    name: "widget-color-palette",
    data() {
        return {
            colors: COLORS,
            //index of selected color
            selected: undefined, 
        }
    },
    methods: {
      async changeColor(color, index) {
        let success = await setColor(color.dec.r, color.dec.g, color.dec.b)
        if (success) this.selected = index
      }
    }
}
</script>
<style lang="scss" scoped>
.color-palette {
  align-items: unset !important;
}

.check-circle {
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: rgba(0,0,0,.15);
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 15px !important;
    }
}

.color {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  flex-shrink: 0;
  margin: 5px;
  cursor: pointer;
      display: flex;
    align-items: center;
    justify-content: center;
}

.color:hover {
  opacity: .9;
  box-shadow: inset 0 0 2px rgba(0,0,0,.75);
  outline: none;
}
.color-wrapper {
  display: flex;
  flex-flow: row wrap;
  margin: 5px;
  display: flex;
  align-items: flex-start !important;
}
</style>