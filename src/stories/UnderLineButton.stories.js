import UnderLineButton from './UnderLineButton';
// import * as HeaderStories from './Header.stories';

export default {
  title: 'Components/UnderLineButton',
  component: UnderLineButton
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { UnderLineButton },
  template:
    '<UnderLineButton class="button_left" :underline="true"><span>应用名称</span></UnderLineButton>'
});

export const base = Template.bind({});

base.args = {
  underline: true,
  disabled: true,
  toolTip: '3333'
};

// export const LoggedOut = Template.bind({});
// LoggedOut.args = {
//   ...HeaderStories.LoggedOut.args
// };

// export const ButtonTsStory = () => ({
//   components: { UnderLineButton },
//   template:
//     '<UnderLineButton class="button_left" :underline="true"><span>应用名称</span></UnderLineButton>'
// });
