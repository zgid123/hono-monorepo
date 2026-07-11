import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
  title: 'Design System/Button',
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select',
      },
    },
    variant: {
      options: ['default', 'gradient'],
      control: {
        type: 'select',
      },
    },
    disabled: {
      control: 'boolean',
    },
  },
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: {
    size: 'md',
    variant: 'default',
    children: 'Button',
  },
};

export const Small: TStory = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: TStory = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Disabled: TStory = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};
