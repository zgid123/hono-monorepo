import { cn } from '@react/shadcn-ui/lib/utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <div className={cn('w-80')}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: {
    placeholder: 'Enter a value',
  },
};

export const WithLeftAddon: TStory = {
  args: {
    leftAddon: '$',
    placeholder: '0.00',
    type: 'number',
  },
};

export const WithRightAddon: TStory = {
  args: {
    rightAddon: '.com',
    placeholder: 'your-domain',
  },
};

export const WithBothAddons: TStory = {
  args: {
    leftAddon: 'https://',
    rightAddon: '.com',
    placeholder: 'your-domain',
  },
};

export const Disabled: TStory = {
  args: {
    disabled: true,
    leftAddon: '$',
    placeholder: '0.00',
  },
};

export const Invalid: TStory = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Invalid value',
  },
};
