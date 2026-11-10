import { isImage, isNumber } from './regex';

describe('regex', () => {
  describe('isImage', () => {
    it('should match .jpg files', () => {
      expect(isImage.test('image.jpg')).toBe(true);
      expect(isImage.test('photo.JPG')).toBe(true);
    });

    it('should match .jpeg files', () => {
      expect(isImage.test('image.jpeg')).toBe(true);
      expect(isImage.test('photo.JPEG')).toBe(true);
    });

    it('should match .png files', () => {
      expect(isImage.test('image.png')).toBe(true);
      expect(isImage.test('photo.PNG')).toBe(true);
    });

    it('should match .gif files', () => {
      expect(isImage.test('animation.gif')).toBe(true);
      expect(isImage.test('anim.GIF')).toBe(true);
    });

    it('should match .webp files', () => {
      expect(isImage.test('modern.webp')).toBe(true);
      expect(isImage.test('modern.WEBP')).toBe(true);
    });

    it('should match .svg files', () => {
      expect(isImage.test('vector.svg')).toBe(true);
      expect(isImage.test('icon.SVG')).toBe(true);
    });

    it('should not match non-image files', () => {
      expect(isImage.test('document.pdf')).toBe(false);
      expect(isImage.test('script.js')).toBe(false);
      expect(isImage.test('style.css')).toBe(false);
      expect(isImage.test('data.json')).toBe(false);
    });

    it('should match image extensions in URLs', () => {
      expect(isImage.test('https://example.com/image.png')).toBe(true);
      expect(isImage.test('/path/to/photo.jpg')).toBe(true);
    });
  });

  describe('isNumber', () => {
    it('should match positive integers', () => {
      expect(isNumber.test('123')).toBe(true);
      expect(isNumber.test('0')).toBe(true);
      expect(isNumber.test('999999')).toBe(true);
    });

    it('should match negative integers', () => {
      expect(isNumber.test('-123')).toBe(true);
      expect(isNumber.test('-1')).toBe(true);
      expect(isNumber.test('-999')).toBe(true);
    });

    it('should match decimal numbers with dot', () => {
      expect(isNumber.test('123.45')).toBe(true);
      expect(isNumber.test('0.5')).toBe(true);
      expect(isNumber.test('-99.99')).toBe(true);
    });

    it('should match decimal numbers with comma', () => {
      expect(isNumber.test('123,45')).toBe(true);
      expect(isNumber.test('0,5')).toBe(true);
      expect(isNumber.test('-99,99')).toBe(true);
    });

    it('should match numbers starting with decimal separator', () => {
      expect(isNumber.test('.5')).toBe(true);
      expect(isNumber.test(',5')).toBe(true);
      expect(isNumber.test('.123')).toBe(true);
    });

    it('should not match non-numeric strings', () => {
      expect(isNumber.test('abc')).toBe(false);
      expect(isNumber.test('12a34')).toBe(false);
      expect(isNumber.test('')).toBe(false);
    });

    it('should not match numbers with multiple decimal separators', () => {
      expect(isNumber.test('1.2.3')).toBe(false);
      expect(isNumber.test('1,2,3')).toBe(false);
    });

    it('should not match strings with spaces', () => {
      expect(isNumber.test('12 34')).toBe(false);
      expect(isNumber.test(' 123')).toBe(false);
      expect(isNumber.test('123 ')).toBe(false);
    });
  });
});
