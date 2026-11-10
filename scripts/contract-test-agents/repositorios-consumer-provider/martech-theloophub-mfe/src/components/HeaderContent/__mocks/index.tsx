import { HeaderContentItem } from '../HeaderContent';

export const dataMock: HeaderContentItem[] = [
  {
    title: 'Title one',
    subtitle: 'Subtitle one',
    content: [<p key="p1">Content 1</p>, <p key="p2">Content 2</p>],
  },
  {
    iconType: 'block',
    title: 'Title two',
    subtitle: 'Subtitle two',
    content: [<p key="p3">Content 3</p>, <p key="p4">Content 4</p>],
  },
  {
    iconType: 'none',
    title: 'Title three',
    subtitle: 'Subtitle three',
  },
  {
    content: [<p key="p5">Content 4</p>],
  },
];
