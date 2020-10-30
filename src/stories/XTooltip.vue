<template>
  <div v-show="show" class="x-tooltip x-tooltip_backup" :style="tooltipStyle" @click="handleClick">
    <slot></slot>
    <div :class="tooltipClass" ref="triangle"></div>
  </div>
</template>

<script>
import './XTooltip.less';
export default {
  name: 'XTooltip',
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    position: {
      type: String,
      required: false,
      default: 'top'
    },
    color: {
      type: String,
      required: false,
      default: 'rgba(54, 96, 221, 0.9)'
    },
    textColor: {
      type: String,
      required: false,
      default: 'rgba(255, 255, 255, 0.6)'
    }
  },
  computed: {
    tooltipClass() {
      return [`x-tooltip_${this.position}_backup`];
    },
    tooltipStyle() {
      return {
        background: this.color,
        borderColor: this.color,
        color: this.textColor
      };
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
    calcPosition() {
      const { left, top, width, height } = this.$el.getBoundingClientRect();
      if (!width || !height) return;
      const parentDOM = this.$el.parentElement;
      const {
        left: parentLeft,
        top: parentTop,
        width: parentWidth,
        height: parentHeight
      } = parentDOM.getBoundingClientRect();
      this.$refs.triangle.style.transform = null;
      const {
        left: triangleLeft,
        width: triangleWidth,
        height: triangleHeight
      } = this.$refs.triangle.getBoundingClientRect();
      let shiftX, shiftY;
      if (this.position === 'top') {
        shiftX = parentLeft + parentWidth / 2 - (left + width / 2);
        shiftY = parentTop - top - height - 5;
        if (Math.abs(shiftX) > left) shiftX = -left;
        this.$refs.triangle.style.transform = `translate(${-shiftX +
          parentLeft -
          triangleLeft +
          parentWidth / 2 -
          triangleWidth / 2}px, 0)`;
      }
      if (this.position === 'right') {
        shiftX = parentLeft + parentWidth - (left - 5);
        shiftY = parentTop + parentHeight / 2 - (top + height / 2);
        this.$refs.triangle.style.transform = `translate(${-triangleWidth +
          left -
          triangleLeft +
          1}px, ${-height / 2 - triangleHeight / 2}px)`;
      }
      shiftX = parseFloat(shiftX.toFixed(1));
      shiftY = parseFloat(shiftY.toFixed(1));
      if (!shiftX && !shiftY) return;
      this.$el.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    }
  },
  watch: {
    show(val) {
      if (!val) {
        this.$el.style.transform = null;
        this.$refs.triangle.style.transform = null;
      }
    }
  },
  mounted() {
    this.calcPosition();
  },
  updated() {
    if (this.show) {
      this.$el.style.transform = null;
      this.$refs.triangle.style.transform = null;
      this.calcPosition();
    }
  }
};
</script>
