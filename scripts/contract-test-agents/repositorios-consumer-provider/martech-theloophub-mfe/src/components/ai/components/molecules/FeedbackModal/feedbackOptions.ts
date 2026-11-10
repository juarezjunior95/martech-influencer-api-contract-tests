interface FeedbackOption {
  value: string;
  label: string;
  description?: string;
}

interface FeedbackOptionConfig {
  title: string;
  subtitle: string;
  commentsLabel: string;
  commentsPlaceholder: string;
  options: FeedbackOption[];
}

export const FEEDBACK_OPTIONS: Record<
  'positive' | 'negative',
  FeedbackOptionConfig
> = {
  positive: {
    title: 'Glad you like the response!',
    subtitle: 'How could it be better?',
    commentsLabel: 'We would like to hear more',
    commentsPlaceholder: 'Tell us what we could improve',
    options: [
      {
        value: 'Accuracy',
        label: 'Improve accuracy',
        description: 'Some facts are approximate or incorrect',
      },
      {
        value: 'Relevance',
        label: 'Little out of context',
        description: 'Could stick more closely to the query',
      },
      {
        value: 'Visuals',
        label: 'Enhance Visuals',
        description: 'Different Tables needed to explain better',
      },
      {
        value: 'Completion',
        label: 'Lacking response',
        description: 'Not all parts of the query addressed',
      },
      {
        value: 'Language',
        label: 'Clarify language',
        description: 'Need clearer phrasing and correct grammar',
      },
      { value: 'other', label: 'Other' },
    ],
  },
  negative: {
    title: 'Help us improve this response',
    subtitle: 'What went wrong?',
    commentsLabel: 'We would like to hear more',
    commentsPlaceholder: 'Tell us what we could improve',
    options: [
      {
        value: 'Accuracy',
        label: 'Inaccurate',
        description: 'Incorrect facts or numbers',
      },
      {
        value: 'Relevance',
        label: 'Not what I asked',
        description: 'Response is not relevant to the query',
      },
      {
        value: 'Visuals',
        label: 'Issues with tables',
        description: 'Incorrect or unclear formatting in visuals',
      },
      {
        value: 'Completion',
        label: 'Incomplete',
        description: 'Few suggestions are out of context',
      },
      {
        value: 'Language',
        label: 'Hard to read',
        description: 'Improper phrasing or poor grammar',
      },
      { value: 'other', label: 'Other' },
    ],
  },
};

export const OTHER_MAX_LENGTH = 25;
export const COMMENTS_MAX_LENGTH = 500;
