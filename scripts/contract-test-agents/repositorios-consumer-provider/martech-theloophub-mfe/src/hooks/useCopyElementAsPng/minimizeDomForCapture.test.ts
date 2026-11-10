import { minimizeDomForCapture } from './minimizeDomForCapture';

describe('minimizeDomForCapture', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('keeps current, above and below sections and restores others', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const sections = ['first', 'second', 'third', 'fourth', 'fifth'].map(
      (name) => {
        const section = document.createElement('section');
        section.setAttribute('data-page-name', name);
        section.textContent = name;
        return section;
      },
    );
    sections[2].innerHTML = '<div id="target">target</div>';
    container.append(...sections);

    const target = sections[2].querySelector('#target') as HTMLElement;
    const { detachedCount, remainingPageSections, cleanup } =
      minimizeDomForCapture(target);

    expect(detachedCount).toBe(2);
    expect(remainingPageSections).toBe(3);
    expect(document.querySelector('[data-page-name="second"]')).not.toBeNull();
    expect(document.querySelector('[data-page-name="third"]')).not.toBeNull();
    expect(document.querySelector('[data-page-name="fourth"]')).not.toBeNull();
    expect(document.querySelector('[data-page-name="first"]')).toBeNull();
    expect(document.querySelector('[data-page-name="fifth"]')).toBeNull();
    expect(
      document.querySelectorAll('[data-export-detached-placeholder="true"]')
        .length,
    ).toBe(2);

    cleanup();

    expect(document.querySelector('[data-page-name="first"]')).not.toBeNull();
    expect(document.querySelector('[data-page-name="fifth"]')).not.toBeNull();
    expect(
      document.querySelectorAll('[data-export-detached-placeholder="true"]')
        .length,
    ).toBe(0);
    expect(container.children).toHaveLength(5);
  });

  it('locks and restores body scroll', () => {
    const section = document.createElement('section');
    section.setAttribute('data-page-name', 'keep');
    const target = document.createElement('div');
    section.appendChild(target);
    document.body.appendChild(section);

    const originalOverflow = document.body.style.overflow;
    const { cleanup } = minimizeDomForCapture(target);

    expect(document.body.style.overflow).toBe('hidden');

    cleanup();

    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  it('detaches sibling nodes when active section is not found', () => {
    const wrapper = document.createElement('div');
    const targetParent = document.createElement('div');
    const target = document.createElement('div');
    targetParent.appendChild(target);

    const siblingA = document.createElement('div');
    siblingA.innerHTML = '<section data-page-name="a"></section>';
    const siblingB = document.createElement('div');
    siblingB.innerHTML = '<section data-page-name="b"></section>';

    wrapper.append(targetParent, siblingA, siblingB);
    document.body.appendChild(wrapper);

    const { detachedCount, cleanup } = minimizeDomForCapture(target);

    expect(detachedCount).toBe(2);
    expect(wrapper.children).toHaveLength(3);
    expect(
      wrapper.querySelectorAll('[data-export-detached-placeholder="true"]')
        .length,
    ).toBe(2);

    cleanup();

    expect(wrapper.querySelectorAll('[data-page-name]').length).toBe(2);
  });

  it('does not detach when there is no sibling slide container', () => {
    const wrapper = document.createElement('div');
    const onlyContainer = document.createElement('div');
    const target = document.createElement('div');
    onlyContainer.appendChild(target);
    wrapper.appendChild(onlyContainer);
    document.body.appendChild(wrapper);

    const { detachedCount, cleanup } = minimizeDomForCapture(target);

    expect(detachedCount).toBe(0);
    expect(
      wrapper.querySelectorAll('[data-export-detached-placeholder="true"]')
        .length,
    ).toBe(0);

    cleanup();
    expect(wrapper.contains(target)).toBe(true);
  });

  it('keeps active and direct neighbors when active section is first', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const first = document.createElement('section');
    first.setAttribute('data-page-name', 'first');
    first.innerHTML = '<div id="target-first">target</div>';
    const second = document.createElement('section');
    second.setAttribute('data-page-name', 'second');
    const third = document.createElement('section');
    third.setAttribute('data-page-name', 'third');

    container.append(first, second, third);

    const target = first.querySelector('#target-first') as HTMLElement;
    const { detachedCount, cleanup } = minimizeDomForCapture(target);

    expect(detachedCount).toBe(1);
    expect(document.querySelector('[data-page-name="first"]')).not.toBeNull();
    expect(document.querySelector('[data-page-name="second"]')).not.toBeNull();
    expect(document.querySelector('[data-page-name="third"]')).toBeNull();

    cleanup();
    expect(document.querySelector('[data-page-name="third"]')).not.toBeNull();
  });
});
