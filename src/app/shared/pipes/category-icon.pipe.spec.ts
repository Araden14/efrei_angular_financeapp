import { CategoryIconPipe } from './category-icon.pipe';

describe('CategoryIconPipe', () => {
  let pipe: CategoryIconPipe;

  beforeEach(() => {
    pipe = new CategoryIconPipe();
  });

  it('should transform known icon names to their corresponding emojis', () => {
    expect(pipe.transform('shopping_cart')).toBe('🛒');
    expect(pipe.transform('flash_on')).toBe('⚡');
    expect(pipe.transform('directions_car')).toBe('🚗');
    expect(pipe.transform('local_hospital')).toBe('🏥');
    expect(pipe.transform('movie')).toBe('🎬');
    expect(pipe.transform('restaurant')).toBe('🍽️');
    expect(pipe.transform('school')).toBe('🎓');
    expect(pipe.transform('spa')).toBe('💆');
    expect(pipe.transform('checkroom')).toBe('👕');
    expect(pipe.transform('home')).toBe('🏠');
    expect(pipe.transform('more_horiz')).toBe('⋯');
  });

  it('should return default folder emoji for unknown icon names', () => {
    expect(pipe.transform('unknown_icon')).toBe('📁');
    expect(pipe.transform('')).toBe('📁');
    expect(pipe.transform('random_text')).toBe('📁');
  });
});
