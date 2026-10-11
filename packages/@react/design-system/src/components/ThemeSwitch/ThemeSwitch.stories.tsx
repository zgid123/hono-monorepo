import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThemeSwitch } from './ThemeSwitch';

const meta = {
  title: 'Design System/ThemeSwitch',
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  component: ThemeSwitch,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ThemeSwitch>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: {
    defaultChecked: false,
  },
};

export const Dark: TStory = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: TStory = {
  args: {
    disabled: true,
    defaultChecked: false,
  },
};
