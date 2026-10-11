import type { Meta, StoryObj } from '@storybook/react-vite';

import { LocaleSwitch } from './LocaleSwitch';

const locales = ['en', 'vi'] as const;

const meta: Meta<typeof LocaleSwitch> = {
  title: 'Design System/LocaleSwitch',
  args: {
    locales,
  },
  component: LocaleSwitch,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Vietnamese: TStory = {
  args: {
    defaultValue: 'vi',
  },
};

export const Disabled: TStory = {
  args: {
    disabled: true,
  },
};
