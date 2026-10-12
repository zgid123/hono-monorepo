import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from './Avatar';

const meta = {
  title: 'Design System/Avatar',
  component: Avatar,
  args: {
    name: 'Alex Morgan',
  },
  argTypes: {
    size: {
      options: ['sm', 'default', 'lg'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const WithImage: TStory = {
  args: {
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Crect width="96" height="96" fill="%23d5ece8"/%3E%3Ccircle cx="48" cy="34" r="18" fill="%23295752"/%3E%3Cpath d="M12 96a36 36 0 0 1 72 0" fill="%23295752"/%3E%3C/svg%3E',
  },
};

export const BrokenImage: TStory = {
  args: {
    src: '/missing-avatar.png',
  },
};
