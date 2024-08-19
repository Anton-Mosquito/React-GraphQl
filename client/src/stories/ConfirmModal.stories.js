import { ConfirmModal } from '../components'

export default {
  title: 'ConfirmModal component',
  component: ConfirmModal,
};

export const Primary = {
  args: {
    open: true,
    title: 'My favourite movies',
    url: 'http://localhost:3000/recommend?title="my movies"&ids=232,434',
    onClose: () => {}
  },
};
