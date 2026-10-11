import { cn } from '@react/shadcn-ui/lib/utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from './Select';

const options = [
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
];

const meta: Meta<typeof Select> = {
  title: 'Design System/Select',
  args: {
    options,
    placeholder: 'Select a status',
  },
  component: Select,
  decorators: [
    (Story) => {
      return (
        <div className={cn('w-80')}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const WithDefaultValue: TStory = {
  args: {
    defaultValue: 'published',
  },
};

export const Disabled: TStory = {
  args: {
    disabled: true,
  },
};
