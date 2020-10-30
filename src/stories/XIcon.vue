<template>
  <!-- 图标外框 显示激活阴影 -->
  <div
    class="icon icon_backup"
    :data-cursor="cursor"
    :class="{ icon_active: animate ? iconActive : isActive, icon_expand: hasSubIcon && expand }"
    @mousedown.stop="trigger"
    @touchstart="trigger"
    @mouseup.stop="action"
    @touchend="action"
    @contextmenu="handleLongpress"
    data-type="icon"
  >
    <!-- 激活图标 -->
    <i
      v-if="iconfontMode"
      :style="{ opacity: disabled ? 0.25 : 1 }"
      :class="activeIcon.label"
      alt="icon"
      draggable="false"
      class="icon--inner icon--inner_iconfont"
      @mouseover="showTooltip = true"
      @mouseout="showTooltip = false"
    />
    <img
      v-else
      :style="{ opacity: disabled ? 0.25 : 1 }"
      :src="activeIcon.label"
      alt="icon"
      draggable="false"
      class="icon--inner icon--inner_backup"
      @mouseover="showTooltip = true"
      @mouseout="showTooltip = false"
    />
    <!-- select 小三角 -->
    <div v-if="hasSubIcon" class="expand-icon_backup"></div>
    <!-- tooltip -->
    <XTooltip :show="showTooltip && !expand" class="icon--tooltip">{{
      activeIcon.tooltip
    }}</XTooltip>
    <!-- 隐藏 input 用于触发 focus 和 blur 事件 -->
    <input
      ref="icon_input"
      type="text"
      readonly="readonly"
      autocomplete="off"
      class="input_hidden"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <!-- 下拉菜单 -->
    <transition name="slide-fade" mode="out-in">
      <XOptionGroup
        v-show="expand && source.length > 1"
        ref="menu"
        :current="activeIcon.value"
        :options="source"
        type="icon"
        :scroll="false"
        :top="localTop"
        :left="localLeft"
        :optionStyle="optionStyle"
        :iconfontMode="iconfontMode"
        @change="handleChange"
        style="position: fixed;"
      />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'XIcon',
  props: {
    source: {
      type: Array,
      required: true
    },
    current: {
      type: String,
      required: false,
      default: ''
    },
    timeDelta: {
      type: Number,
      required: false,
      default: 300
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    cursor: {
      type: String,
      required: false
    },
    animate: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    iconfontMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      expand: false,
      timer: 0,
      active: 0,
      value: this.current,
      localTop: false,
      localLeft: false,
      iconActive: false,
      showTooltip: false,
      optionStyle: {},
      changed: false,
      currentDOMTarget: null
    };
  },
  computed: {
    // 是否显示下拉菜单小三角
    hasSubIcon() {
      return this.source.length > 1;
    },
    // 当前激活图标
    activeIcon() {
      return this.source[this.active];
    },
    isActive() {
      return this.activeIcon.value === this.current;
    }
  },
  watch: {},
  mounted() {
    this.$bus.on('iconBlur', this.handleBlur);
  },
  beforeDestory() {
    this.$bus.off('iconBlur', this.handleBlur);
  },
  methods: {
    // mousedown 记录时间戳
    trigger(e) {
      this.$bus.emit('iconBlur');
      this.$refs.icon_input.blur();
      e.preventDefault();
      if (this.disabled) return;
      if (this.animate) {
        let that = this;
        document.addEventListener('mouseup', function deactivate() {
          that.iconActive = false;
          document.removeEventListener('mouseup', deactivate);
        });
        document.addEventListener('touchend', function deactivate() {
          that.iconActive = false;
          document.removeEventListener('touchend', deactivate);
        });
        this.iconActive = true;
      }
      this.currentDOMTarget = e.currentTarget;
      this.timer = setTimeout(() => {
        if (this.hasSubIcon) this.handleLongpress();
      }, this.timeDelta);
    },
    // mouseup 对比时间差，分发不同任务
    action(e) {
      e.preventDefault();
      clearTimeout(this.timer);
      if (this.disabled) return;
      if (this.animate) this.iconActive = false;
      if (!this.expand && !this.changed)
        if (e.button === 0 || e.type === 'touchend') this.handleSelect(this.active);
        else if (this.hasSubIcon && !this.isActive) this.handleSelect(this.active);
      if (this.hasSubIcon) this.changed = false;
    },
    // 设置列表中 active，即本组icon的激活图标
    // 同时向外推送激活图标名称
    handleSelect(index) {
      if (this.activeIcon.cursor !== 'not-allowed') {
        this.active = index;
        // activeIcon 为计算属性，active改变后 activeIcon已更新
        this.$emit('select', this.activeIcon.value);
      }
    },
    handleChange(val) {
      this.changed = true;
      if (val === this.activeIcon.value && this.isActive) return;
      this.value = val;
      const idx = this.source.findIndex(({ value }) => value === val);
      this.handleSelect(idx);
      this.$bus.emit('iconBlur');
    },
    // 长按 focus 一个隐藏 input
    // 此处是为了利用input的 blur事件
    handleLongpress() {
      this.handlePosition();
      this.$refs.icon_input.focus();
    },
    // focus 时展开列表
    handleFocus() {
      this.expand = true;
      this.showTooltip = false;
    },
    // blur 时关闭列表
    handleBlur() {
      this.expand = false;
    },
    handlePosition() {
      const { bottom, right } = this.currentDOMTarget.getBoundingClientRect();
      this.$nextTick().then(() => {
        const { clientHeight, clientWidth } = document.body;
        const { offsetHeight = 0, offsetWidth = 0 } = this.$refs.menu.$el || {};
        this.localTop = clientHeight - bottom <= (offsetHeight || 250);
        this.localLeft = clientWidth - right <= (offsetWidth || 150);
        // if (window.innerWidth < window.innerHeight)
        //   this.optionStyle = { transform: 'translateY(calc(-100% - 35px))' };
      });
    }
  }
};
</script>

<style lang="less" scoped>
.input_hidden {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
}
.icon {
  position: relative;

  display: inline-block;
  // width: 35px;
  // height: 35px;

  box-sizing: border-box;

  cursor: pointer;
  text-align: center;
  &_backup {
    width: 28px;
    height: 28px;

    line-height: 28px;
    margin-right: 5px;
  }
  &_active {
    border-radius: 10%;
    background: rgba(7, 17, 27, 0.5);
  }
  &--inner {
    //   width: 30px;
    // height: 30px;
    vertical-align: middle;
    &_backup {
      height: 28px;
      margin-top: -3px;
    }
    &_iconfont {
      color: white;
      font-size: 20px;
    }
  }

  &--tooltip {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  &--inner:hover ~ &--tooltip {
    opacity: 1;
  }
}

.expand-icon_backup {
  position: absolute;
  right: 1px;
  bottom: 1px;

  width: 0;
  height: 0;

  transition: all 0.3s ease-in-out;

  border-width: 3.5px 2px 0 2px;
  border-style: solid;
  border-color: #fafafa transparent transparent transparent;
}

.icon_expand .expand-icon_backup {
  transition: all 0.3s ease-in-out;
  transform: rotate(180deg);
}

.icon--expand {
  position: absolute;
  z-index: 1024;
  top: 108%;

  box-sizing: border-box;
  padding: 0 8px;

  color: rgb(255, 255, 255, 0.6);
  border-radius: 2px;
  background: rgb(54, 96, 221, 0.8);
  box-shadow: 0 1px 6px 0 rgba(17, 26, 45, 0.5), inset 0 0 1px 0 rgba(255, 255, 255, 0.5);
  &-item {
    position: relative;

    box-sizing: border-box;

    &_backup {
      height: 25px;
      padding: 0 12px;

      border-bottom: 1px solid rgb(182, 189, 207, 0.4);

      font-size: 12px;
      line-height: 31px;
      &:last-child {
        border-bottom: 0;
      }
    }
    &_active {
      &::before {
        position: absolute;
        top: 50%;
        left: 0;

        width: 5px;
        height: 5px;

        content: '';
        transform: translate(0, -50%);

        border-radius: 1px;
        background: #fff;
      }
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
div[data-cursor='not-allowed'] {
  cursor: not-allowed !important;
  img {
    opacity: 0.25;
  }
}
</style>
