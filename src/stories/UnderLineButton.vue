<template>
  <button
    class="button"
    :class="{ underlined: underline, disbled: disabled }"
    :disabled="disabled"
    @click="handleClick"
  >
    <XTooltip :show="toolTip" class="tooltip">
      {{ toolTip }}
    </XTooltip>
    <slot></slot>
  </button>
</template>
<script>
import XTooltip from './XTooltip';
export default {
  name: 'UnderlineButton',
  props: {
    underline: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    toolTip: {
      type: String,
      required: false,
      default: ''
    }
  },
  components: {
    XTooltip
  },
  computed: {
    // buttonClass() {
    //   const classes = ['button'];
    //   if (this.underline) classes.push('underlined');
    //   if (this.disabled) classes.push('disabled');
    //   return classes;
    // }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style lang="less" scoped>
.button {
  font-size: 12px;
  height: 22px;
  line-height: 22px;
  color: #ebebeb;
  opacity: 0.8;
  background: transparent;
  border: 1px solid transparent;
  box-sizing: content-box;
  cursor: pointer;
  padding: 0 8px;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}
.button.disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
.button:hover {
  .tooltip {
    opacity: 1;
  }
}
.tooltip {
  opacity: 0;
}

.underlined {
  opacity: 1;
  border-bottom-color: white;
  background: linear-gradient(
    360deg,
    rgba(36, 61, 114, 0.3) 0%,
    rgba(105, 61, 255, 0.24) 26%,
    rgba(68, 94, 216, 0) 100%
  );
}
</style>
