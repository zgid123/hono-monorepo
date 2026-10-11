import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { Toaster, toast } from './Toaster';

const meta = {
  title: 'Design System/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toaster>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: {},
  render: (args) => {
    return (
      <>
        <Button
          onClick={() => {
            toast.success('Changes saved successfully.');
          }}
        >
          Show toast
        </Button>
        <Toaster {...args} />
      </>
    );
  },
};

export const ErrorToast: TStory = {
  args: {},
  render: (args) => {
    return (
      <>
        <Button
          onClick={() => {
            toast.error('Unable to save changes.');
          }}
        >
          Show error
        </Button>
        <Toaster {...args} />
      </>
    );
  },
};
